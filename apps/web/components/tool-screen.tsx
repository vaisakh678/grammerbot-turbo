"use client";

import { useEffect, useRef, useState } from "react";
import {
  consumeHandoff,
  runTool,
  TOOLS,
  wordCount,
  type ToolId,
  type ToolResult,
} from "@/lib/tools";
import { ArrowIcon, CopyIcon, TOOL_ICONS } from "@/components/icons";
import { OptionPills } from "@/components/option-pills";
import { ExampleRow } from "@/components/example-row";

function words(n: number): string {
  return `${n} ${n === 1 ? "word" : "words"}`;
}

export function ToolScreen({ tool }: { tool: ToolId }) {
  const config = TOOLS[tool];
  const Icon = TOOL_ICONS[tool];
  const inputRef = useRef<HTMLDivElement>(null);
  const noteTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [mode, setMode] = useState(config.modes?.[0]?.value);
  const [inWords, setInWords] = useState(0);
  const [result, setResult] = useState<ToolResult | null>(null);
  const [note, setNote] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  function showNote(message: string) {
    setNote(message);
    if (noteTimer.current) clearTimeout(noteTimer.current);
    noteTimer.current = setTimeout(() => setNote(null), 3000);
  }

  function run(text: string, runMode = mode) {
    if (!text.trim()) {
      inputRef.current?.focus();
      return;
    }
    const output = runTool(tool, text, runMode);
    if (!output) {
      showNote("Demo — try an example text below");
      return;
    }
    setResult(output);
    showNote(output.note);
  }

  function setText(text: string) {
    if (!inputRef.current) return;
    inputRef.current.textContent = text;
    setInWords(wordCount(text));
    inputRef.current.focus();
  }

  // Hand-off from the home composer: prefill, apply mode, and run.
  useEffect(() => {
    const handoff = consumeHandoff(tool);
    if (!handoff || !inputRef.current) return;
    inputRef.current.textContent = handoff.text;
    const timer = setTimeout(() => {
      setInWords(wordCount(handoff.text));
      if (handoff.mode) setMode(handoff.mode);
      run(handoff.text, handoff.mode);
    }, 300);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tool]);

  async function copyResult() {
    if (!result) return;
    try {
      await navigator.clipboard.writeText(result.plain);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard unavailable */
    }
  }

  return (
    <section className="mx-auto w-full max-w-6xl px-5 pb-12 pt-4 sm:pt-8">
      <div className="mb-4.5 flex items-center gap-3.5">
        <span className="grid size-11 shrink-0 place-items-center rounded-[13px] bg-accent-soft text-accent">
          <Icon className="size-[22px]" />
        </span>
        <div>
          <h1 className="font-display text-2xl font-extrabold tracking-tight">
            {config.title}
          </h1>
          <p className="text-sm text-ink-soft">{config.description}</p>
        </div>
      </div>

      <div className="overflow-hidden rounded-[20px] border border-line bg-canvas shadow-card">
        {config.modes && mode && (
          <div className="flex flex-wrap items-center gap-2 border-b border-line px-4.5 py-3.5">
            <OptionPills
              label={config.modesLabel ?? "Mode:"}
              modes={config.modes}
              value={mode}
              onChange={setMode}
            />
          </div>
        )}

        <div className="grid md:grid-cols-2">
          {/* input pane */}
          <div className="flex min-h-[320px] flex-col border-b border-line md:border-b-0 md:border-r">
            <div
              ref={inputRef}
              contentEditable
              suppressContentEditableWarning
              role="textbox"
              aria-multiline="true"
              aria-label="Your text"
              data-placeholder={config.placeholder}
              className="min-h-[220px] w-full flex-1 whitespace-pre-wrap break-words px-5.5 py-5 text-[17px] leading-relaxed outline-none"
              onInput={() =>
                setInWords(wordCount(inputRef.current?.textContent ?? ""))
              }
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  run(inputRef.current?.textContent ?? "");
                }
              }}
            />
            <div className="flex min-h-[62px] flex-wrap items-center gap-3 border-t border-line px-4 py-3">
              <span className="text-xs tabular-nums text-ink-faint">
                {words(inWords)}
              </span>
              <button
                type="button"
                onClick={() => run(inputRef.current?.textContent ?? "")}
                className="ml-auto inline-flex items-center gap-2 rounded-full bg-accent px-5.5 py-2.5 text-sm font-semibold text-accent-ink transition-all hover:-translate-y-px hover:bg-accent-hover"
              >
                {config.action}
                <ArrowIcon className="size-[15px]" />
              </button>
            </div>
          </div>

          {/* output pane */}
          <div className="flex min-h-[320px] flex-col">
            <div className="relative flex-1">
              {note && (
                <span className="pointer-events-none absolute right-3.5 top-3 z-10 rounded-full bg-accent px-3 py-1 text-xs font-semibold text-accent-ink">
                  {note}
                </span>
              )}
              {result ? (
                <div
                  aria-live="polite"
                  className="min-h-[220px] whitespace-pre-wrap break-words px-5.5 py-5 text-[17px] leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: result.html }}
                />
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-2.5 text-sm text-ink-faint">
                  <Icon className="size-[26px] opacity-60" />
                  {config.emptyHint}
                </div>
              )}
            </div>

            {tool === "fix" && result && result.fixes.length > 0 && (
              <div className="flex flex-wrap gap-2 px-4 pb-3.5">
                {result.fixes.map(([from, to], i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1.5 rounded-full border border-tint-deep bg-tint px-3 py-1 text-xs"
                  >
                    <span className="text-red line-through">{from}</span>
                    <span className="text-ink-faint">→</span>
                    <span className="font-semibold text-accent">{to}</span>
                  </span>
                ))}
              </div>
            )}

            <div className="flex min-h-[62px] flex-wrap items-center gap-3 border-t border-line px-4 py-3">
              <span className="text-xs tabular-nums text-ink-faint">
                {result ? words(wordCount(result.plain)) : ""}
              </span>
              <button
                type="button"
                onClick={copyResult}
                className="ml-auto inline-flex items-center gap-1.5 rounded-full border border-line px-3.5 py-1.5 text-xs font-semibold text-ink-soft transition-colors hover:border-accent hover:text-accent"
              >
                {copied ? (
                  "Copied ✓"
                ) : (
                  <>
                    <CopyIcon className="size-3.5" />
                    Copy
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      <ExampleRow examples={config.examples} onPick={setText} />
    </section>
  );
}
