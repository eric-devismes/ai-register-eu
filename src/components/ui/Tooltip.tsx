"use client";

/**
 * Tooltip — Hover tooltip with optional click-to-expand popup.
 *
 * Usage:
 *   <Tooltip text="Short explanation">
 *     <span>Hover me</span>
 *   </Tooltip>
 *
 *   <Tooltip text="Short" detail="Longer explanation shown on click" clickable>
 *     <button>Click me</button>
 *   </Tooltip>
 */

import { useState, useRef, useEffect, type ReactNode } from "react";

interface TooltipProps {
  children: ReactNode;
  text: string;
  /** Longer detail shown in a click-to-open popup */
  detail?: string;
  /** If true, clicking opens a popup instead of just hover */
  clickable?: boolean;
  /** Position preference */
  position?: "top" | "bottom";
}

export function Tooltip({
  children,
  text,
  detail,
  clickable = false,
  position = "top",
}: TooltipProps) {
  const [showHover, setShowHover] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close popup on outside click
  useEffect(() => {
    if (!showPopup) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setShowPopup(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [showPopup]);

  const positionClass =
    position === "top"
      ? "bottom-full left-1/2 -translate-x-1/2 mb-2"
      : "top-full left-1/2 -translate-x-1/2 mt-2";

  return (
    <div
      ref={ref}
      className="relative inline-flex"
      onMouseEnter={() => !showPopup && setShowHover(true)}
      onMouseLeave={() => setShowHover(false)}
      onClick={
        clickable
          ? (e) => {
              e.preventDefault();
              e.stopPropagation();
              setShowPopup(!showPopup);
              setShowHover(false);
            }
          : undefined
      }
    >
      {children}

      {/* Hover tooltip — short text */}
      {showHover && !showPopup && (
        <div
          className={`absolute ${positionClass} z-50 w-max max-w-[240px] rounded-lg bg-gray-900 px-3 py-2 text-xs text-white shadow-lg pointer-events-none`}
        >
          {text}
          {clickable && (
            <span className="block mt-1 text-[10px] text-gray-400">
              Click for details
            </span>
          )}
        </div>
      )}

      {/* Click popup — detailed explanation */}
      {showPopup && detail && (
        <div
          className={`absolute ${positionClass} z-50 w-[280px] rounded-xl border border-gray-200 bg-white p-4 shadow-xl`}
        >
          <div className="flex items-start justify-between mb-2">
            <span className="text-xs font-semibold text-gray-900">{text}</span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowPopup(false);
              }}
              className="text-gray-400 hover:text-gray-600 text-sm leading-none"
            >
              ×
            </button>
          </div>
          <p className="text-xs text-gray-600 leading-relaxed">{detail}</p>
        </div>
      )}
    </div>
  );
}
