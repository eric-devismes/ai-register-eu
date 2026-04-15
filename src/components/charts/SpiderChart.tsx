"use client";

/**
 * SpiderChart — Refined SVG radar chart for compliance dimension scoring.
 *
 * Each axis = one framework section/dimension.
 * Distance from center = score (0-10).
 * Larger filled area = better compliance.
 * Score badges are clickable, scrolling to the detailed section below.
 *
 * Pure SVG — no external dependencies.
 */

import { wrapLabel } from "@/lib/utils/chart-helpers";

interface Dimension {
  id: string;      // Section ID for anchor linking
  label: string;
  score: number;   // 0-10 numeric
  grade: string;   // "A-", "B+", etc.
}

interface SpiderChartProps {
  dimensions: Dimension[];
  size?: number;
  color?: string;
}

export default function SpiderChart({
  dimensions,
  size = 420,
  color = "#003399",
}: SpiderChartProps) {
  const cx = size / 2;
  const cy = size / 2;
  const radius = size / 2 - 70; // Room for labels
  const n = dimensions.length;

  if (n < 3) return null;

  const angleStep = (2 * Math.PI) / n;
  const startAngle = -Math.PI / 2;

  function getPoint(index: number, value: number): [number, number] {
    const angle = startAngle + index * angleStep;
    const r = (value / 10) * radius;
    return [cx + r * Math.cos(angle), cy + r * Math.sin(angle)];
  }

  const rings = [2, 4, 6, 8, 10];
  const dataPoints = dimensions.map((d, i) => getPoint(i, d.score));
  const dataPath = dataPoints.map((p, i) => `${i === 0 ? "M" : "L"} ${p[0]} ${p[1]}`).join(" ") + " Z";

  // Grade color for each dimension score badge
  function badgeColor(grade: string): string {
    if (grade.startsWith("A")) return "#059669"; // emerald-600
    if (grade.startsWith("B")) return "#2563eb"; // blue-600
    if (grade.startsWith("C")) return "#d97706"; // amber-600
    return "#dc2626"; // red-600
  }

  return (
    <div className="flex justify-center">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="overflow-visible">
        {/* Background fill for outer ring */}
        {(() => {
          const outerPoints = Array.from({ length: n }, (_, i) => getPoint(i, 10));
          const outerPath = outerPoints.map((p, i) => `${i === 0 ? "M" : "L"} ${p[0]} ${p[1]}`).join(" ") + " Z";
          return <path d={outerPath} fill="#f9fafb" stroke="none" />;
        })()}

        {/* Grid rings — thin, subtle */}
        {rings.map((ringVal) => {
          const ringPoints = Array.from({ length: n }, (_, i) => getPoint(i, ringVal));
          const ringPath = ringPoints.map((p, i) => `${i === 0 ? "M" : "L"} ${p[0]} ${p[1]}`).join(" ") + " Z";
          return (
            <path key={ringVal} d={ringPath} fill="none" stroke="#e5e7eb" strokeWidth={0.5}
              strokeDasharray={ringVal === 10 ? "none" : "2,3"} />
          );
        })}

        {/* Axis lines — very subtle */}
        {dimensions.map((_, i) => {
          const [ex, ey] = getPoint(i, 10);
          return <line key={i} x1={cx} y1={cy} x2={ex} y2={ey} stroke="#e5e7eb" strokeWidth={0.5} />;
        })}

        {/* Data polygon — refined: thinner stroke, subtle fill */}
        <path d={dataPath} fill={color} fillOpacity={0.08} stroke={color} strokeWidth={1.5} strokeLinejoin="round" />

        {/* Data points — small, clean */}
        {dataPoints.map((p, i) => (
          <circle key={i} cx={p[0]} cy={p[1]} r={3} fill={color} stroke="white" strokeWidth={1.5} />
        ))}

        {/* Clickable grade badges at each data point */}
        {dataPoints.map((p, i) => {
          const dim = dimensions[i];
          const angle = startAngle + i * angleStep;
          // Position badge slightly outside the data point
          const badgeDistance = Math.max((dim.score / 10) * radius + 18, 24);
          const bx = cx + badgeDistance * Math.cos(angle);
          const by = cy + badgeDistance * Math.sin(angle);
          const bg = badgeColor(dim.grade);

          return (
            <a
              key={`badge-${i}`}
              href={`#dim-${dim.id}`}
              className="cursor-pointer"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById(`dim-${dim.id}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
              }}
            >
              <rect x={bx - 14} y={by - 10} width={28} height={20} rx={10} fill={bg} />
              <text x={bx} y={by + 1} textAnchor="middle" dominantBaseline="middle"
                fill="white" fontSize={10} fontWeight={700} fontFamily="Arial, sans-serif">
                {dim.grade}
              </text>
            </a>
          );
        })}

        {/* Axis labels — full text, word-wrapped, outside the chart */}
        {dimensions.map((d, i) => {
          const angle = startAngle + i * angleStep;
          const labelDist = radius + 58;
          const lx = cx + labelDist * Math.cos(angle);
          const ly = cy + labelDist * Math.sin(angle);
          const lines = wrapLabel(d.label);

          // Determine text-anchor based on position
          const isLeft = Math.cos(angle) < -0.1;
          const isRight = Math.cos(angle) > 0.1;
          const anchor = isLeft ? "end" : isRight ? "start" : "middle";

          return (
            <a
              key={`label-${i}`}
              href={`#dim-${d.id}`}
              className="cursor-pointer"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById(`dim-${d.id}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
              }}
            >
              {lines.map((line, li) => (
                <text key={`label-${i}-${li}`}
                  x={lx} y={ly + (li - (lines.length - 1) / 2) * 13}
                  textAnchor={anchor} dominantBaseline="middle"
                  fill="#374151" fontSize={11} fontFamily="Arial, sans-serif"
                  fontWeight={500}
                  className="hover:fill-[#003399] transition-colors">
                  {line}
                </text>
              ))}
            </a>
          );
        })}
      </svg>
    </div>
  );
}
