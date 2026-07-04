"use client";

import type { ToolMode } from "@/lib/tools";

interface OptionPillsProps {
  label: string;
  modes: ToolMode[];
  value: string;
  onChange: (value: string) => void;
}

export function OptionPills({ label, modes, value, onChange }: OptionPillsProps) {
  return (
    <>
      <span className="mr-0.5 text-xs font-semibold text-ink-faint">{label}</span>
      {modes.map((mode) => (
        <button
          key={mode.value}
          type="button"
          onClick={() => onChange(mode.value)}
          className={`rounded-full border-[1.5px] px-3.5 py-1.5 text-[13px] font-semibold transition-colors ${
            value === mode.value
              ? "border-accent bg-accent-soft text-accent"
              : "border-line bg-canvas text-ink-soft hover:border-accent hover:text-accent"
          }`}
        >
          {mode.label}
        </button>
      ))}
    </>
  );
}
