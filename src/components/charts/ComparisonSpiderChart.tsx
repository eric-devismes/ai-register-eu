"use client";

/**
 * ComparisonSpiderChart — Multi-system radar chart for side-by-side comparison.
 *
 * Renders up to 5 AI systems as overlaid colored polygons on a shared radar chart.
 * Each axis represents a high-level dimension (e.g., Compliance, Security, Maturity).
 * Axis labels are clickable — clicking scrolls to the corresponding detail section.
 *
 * Pure SVG, no external charting library. Follows the same approach as SpiderChart.tsx.
 *
 * Props:
 *   dimensions  — axis labels and their anchor IDs for scroll-to-section
 *   systems     — up to 5 systems, each with a name, color, and score per dimension
 *   size        — chart diameter in pixels (default: 480)
 */

// ─── Types ───────────────────────────────────────────────

interface Dimension {
  label: string;      // Axis label shown on chart (e.g., "Regulatory Compliance")
  anchorId: string;   // HTML anchor for scroll-on-click (e.g., "dim-compliance")
}

interface SystemData {
  name: string;       // System display name (e.g., "Cognigy.AI")
  color: string;      // Hex color for this system's polygon (e.g., "#003399")
  scores: number[];   // One score per dimension, 0-10 scale
}

interface ComparisonSpiderChartProps {
  dimensions: Dimension[];
  systems: SystemData[];
  size?: number;
}

// ─── Color palette for up to 5 systems ──────────────────

export const SYSTEM_COLORS = [
  "#003399",  // EU blue (primary brand)
  "#d4a017",  // Gold
  "#059669",  // Emerald
  "#e11d48",  // Rose
  "#7c3aed",  // Purple
] as const;

// ─── Component ───────────────────────────────────────────

export default function ComparisonSpiderChart({
  dimensions,
  systems,
  size = 480,
}: ComparisonSpiderChartProps) {
  const cx = size / 2;
  const cy = size / 2;
  const radius = size / 2 - 80;   // Room for labels outside the chart
  const n = dimensions.length;

  // Need at least 3 axes and 1 system to render
  if (n < 3 || systems.length === 0) return null;

  const angleStep = (2 * Math.PI) / n;
  const startAngle = -Math.PI / 2;  // Start from top (12 o'clock)

  /** Convert an axis index + value (0-10) to SVG coordinates */
  function getPoint(index: number, value: number): [number, number] {
    const angle = startAngle + index * angleStep;
    const r = (value / 10) * radius;
    return [cx + r * Math.cos(angle), cy + r * Math.sin(angle)];
  }

  /** Build an SVG path string from a polygon's points */
  function buildPath(points: [number, number][]): string {
    return points.map((p, i) => `${i === 0 ? "M" : "L"} ${p[0]} ${p[1]}`).join(" ") + " Z";
  }

  // Grid ring values (2, 4, 6, 8, 10)
  const rings = [2, 4, 6, 8, 10];

  // Outer polygon for background fill
  const outerPoints = Array.from({ length: n }, (_, i) => getPoint(i, 10));

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Chart */}
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="overflow-visible"
        role="img"
        aria-label="Comparison radar chart"
      >
        {/* Background fill */}
        <path d={buildPath(outerPoints)} fill="#f9fafb" stroke="none" />

        {/* Grid rings */}
        {rings.map((ringVal) => {
          const ringPoints = Array.from({ length: n }, (_, i) => getPoint(i, ringVal));
          return (
            <path
              key={ringVal}
              d={buildPath(ringPoints)}
              fill="none"
              stroke="#e5e7eb"
              strokeWidth={0.5}
              strokeDasharray={ringVal === 10 ? "none" : "2,3"}
            />
          );
        })}

        {/* Axis lines from center to edge */}
        {dimensions.map((_, i) => {
          const [ex, ey] = getPoint(i, 10);
          return (
            <line key={i} x1={cx} y1={cy} x2={ex} y2={ey} stroke="#e5e7eb" strokeWidth={0.5} />
          );
        })}

        {/* Data polygons — one per system, layered with low opacity */}
        {systems.map((sys) => {
          const points = sys.scores.map((score, i) => getPoint(i, score));
          const path = buildPath(points);

          return (
            <g key={sys.name}>
              {/* Filled polygon */}
              <path
                d={path}
                fill={sys.color}
                fillOpacity={0.06}
                stroke={sys.color}
                strokeWidth={1.5}
                strokeLinejoin="round"
              />
              {/* Data point dots */}
              {points.map((p, i) => (
                <circle
                  key={i}
                  cx={p[0]}
                  cy={p[1]}
                  r={3}
                  fill={sys.color}
                  stroke="white"
                  strokeWidth={1.5}
                />
              ))}
            </g>
          );
        })}

        {/* Axis labels — clickable, scroll to detail section */}
        {dimensions.map((dim, i) => {
          const angle = startAngle + i * angleStep;
          const labelDist = radius + 55;
          const lx = cx + labelDist * Math.cos(angle);
          const ly = cy + labelDist * Math.sin(angle);

          // Text alignment based on position around the circle
          const isLeft = Math.cos(angle) < -0.1;
          const isRight = Math.cos(angle) > 0.1;
          const anchor = isLeft ? "end" : isRight ? "start" : "middle";

          // Word-wrap long labels into 2 lines
          const lines = wrapLabel(dim.label);

          return (
            <a
              key={dim.anchorId}
              href={`#${dim.anchorId}`}
              className="cursor-pointer"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById(dim.anchorId)?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              {lines.map((line, li) => (
                <text
                  key={`${dim.anchorId}-${li}`}
                  x={lx}
                  y={ly + (li - (lines.length - 1) / 2) * 13}
                  textAnchor={anchor}
                  dominantBaseline="middle"
                  fill="#374151"
                  fontSize={11}
                  fontFamily="Arial, sans-serif"
                  fontWeight={500}
                  className="hover:fill-[#003399] transition-colors"
                  textDecoration="underline"
                >
                  {line}
                </text>
              ))}
            </a>
          );
        })}
      </svg>

      {/* Legend — maps colors to system names */}
      <div className="flex flex-wrap justify-center gap-4 text-sm">
        {systems.map((sys) => (
          <div key={sys.name} className="flex items-center gap-1.5">
            <span
              className="inline-block h-3 w-3 rounded-full"
              style={{ backgroundColor: sys.color }}
            />
            <span className="text-gray-700">{sys.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Helpers ─────────────────────────────────────────────

/** Split a long label into 2 lines at a word boundary */
function wrapLabel(text: string): string[] {
  if (text.length <= 18) return [text];
  const mid = text.lastIndexOf(" ", 20);
  if (mid === -1) return [text];
  return [text.slice(0, mid), text.slice(mid + 1)];
}
