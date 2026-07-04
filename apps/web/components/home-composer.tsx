"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { setHandoff, TOOLS, TOOL_IDS, type ToolId } from "@/lib/tools";
import { ArrowIcon, TOOL_ICONS, XIcon } from "@/components/icons";
import { OptionPills } from "@/components/option-pills";
import { ExampleRow } from "@/components/example-row";

const ALL_EXAMPLES = ["draft", "email", "ramble"] as const;

export function HomeComposer() {
  const router = useRouter();
  const inputRef = useRef<HTMLDivElement>(null);
  const [selected, setSelected] = useState<ToolId | null>(null);
  const [modeChoice, setModeChoice] = useState<Partial<Record<ToolId, string>>>({});
  const [hasText, setHasText] = useState(false);

  const activeTool = selected ?? "fix";
  const selectedConfig = selected ? TOOLS[selected] : null;
  const currentMode =
    selectedConfig?.modes && selected
      ? (modeChoice[selected] ?? selectedConfig.modes[0]!.value)
      : undefined;

  function setText(text: string) {
    if (!inputRef.current) return;
    inputRef.current.textContent = text;
    setHasText(Boolean(text.trim()));
    inputRef.current.focus();
  }

  function submit() {
    const text = inputRef.current?.textContent?.trim() ?? "";
    if (!text) {
      inputRef.current?.focus();
      return;
    }
    const tool = activeTool;
    const config = TOOLS[tool];
    setHandoff({
      tool,
      text,
      mode: config.modes ? (modeChoice[tool] ?? config.modes[0]!.value) : undefined,
    });
    router.push(`/${tool}`);
  }

  return (
    <div className="mx-auto mt-9 w-full max-w-3xl">
      <div className="overflow-hidden rounded-[20px] border border-line bg-canvas shadow-card">
        <div
          ref={inputRef}
          contentEditable
          suppressContentEditableWarning
          role="textbox"
          aria-multiline="true"
          aria-label="Your text"
          data-placeholder="Paste or type your text here, then press Enter…"
          className="min-h-[150px] w-full whitespace-pre-wrap break-words px-5.5 py-5 text-[17px] leading-relaxed outline-none"
          onInput={() => setHasText(Boolean(inputRef.current?.textContent?.trim()))}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              submit();
            }
          }}
        />

        <div className="flex flex-wrap items-center gap-2.5 px-3.5 pb-3.5 pt-1">
          {TOOL_IDS.map((id) => {
            const Icon = TOOL_ICONS[id];
            const isSelected = selected === id;
            if (selected !== null && !isSelected) return null;
            return (
              <button
                key={id}
                type="button"
                onClick={() => setSelected(id)}
                className={`inline-flex items-center gap-2 rounded-full border-[1.5px] px-4.5 py-2 text-sm font-semibold transition-colors ${
                  isSelected
                    ? "border-accent bg-accent-soft text-accent"
                    : "border-line bg-canvas text-ink hover:border-accent hover:text-accent"
                }`}
              >
                <Icon className="size-4" />
                {TOOLS[id].name}
                {isSelected && (
                  <span
                    role="button"
                    aria-label="Clear selection"
                    className="-mr-1 ml-0.5 grid size-[17px] place-items-center rounded-full hover:bg-tint-deep"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelected(null);
                    }}
                  >
                    <XIcon className="size-[11px]" />
                  </span>
                )}
              </button>
            );
          })}

          <button
            type="button"
            onClick={submit}
            disabled={!hasText}
            className="ml-auto inline-flex items-center gap-2 rounded-full bg-accent px-5.5 py-2.5 text-sm font-semibold text-accent-ink transition-all hover:-translate-y-px hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-45 disabled:hover:translate-y-0 disabled:hover:bg-accent"
          >
            {TOOLS[activeTool].composerAction}
            <ArrowIcon className="size-[15px]" />
          </button>
        </div>

        {selectedConfig?.modes && currentMode && (
          <div className="flex flex-wrap items-center gap-2 px-3.5 pb-3.5">
            <OptionPills
              label={selectedConfig.modesLabel ?? "Mode:"}
              modes={selectedConfig.modes}
              value={currentMode}
              onChange={(value) =>
                setModeChoice((prev) => ({ ...prev, [selected!]: value }))
              }
            />
          </div>
        )}
      </div>

      <ExampleRow examples={[...ALL_EXAMPLES]} onPick={setText} centered />
    </div>
  );
}
