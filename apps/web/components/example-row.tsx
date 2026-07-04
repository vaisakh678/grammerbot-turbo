"use client";

import { EXAMPLES, type ExampleId } from "@/lib/tools";

interface ExampleRowProps {
  examples: ExampleId[];
  onPick: (text: string) => void;
  centered?: boolean;
}

export function ExampleRow({ examples, onPick, centered }: ExampleRowProps) {
  return (
    <div
      className={`mt-4 flex flex-wrap items-center gap-2.5 ${centered ? "justify-center" : ""}`}
    >
      <span className="text-[13px] text-ink-faint">Try an example:</span>
      {examples.map((id) => (
        <button
          key={id}
          type="button"
          onClick={() => onPick(EXAMPLES[id].text)}
          className="rounded-full border border-line bg-canvas px-4 py-1.5 text-[13px] text-ink-soft transition-colors hover:border-accent hover:text-accent"
        >
          {EXAMPLES[id].label}
        </button>
      ))}
    </div>
  );
}
