export type ToolId = "fix" | "paraphrase" | "summarize" | "tone";

export interface ToolMode {
  value: string;
  label: string;
}

export interface ToolConfig {
  id: ToolId;
  /** Short name used in nav and chips */
  name: string;
  /** Heading on the tool screen */
  title: string;
  description: string;
  placeholder: string;
  /** Label on the tool screen's action button */
  action: string;
  /** Label on the home composer's submit button when this tool is selected */
  composerAction: string;
  modesLabel?: string;
  modes?: ToolMode[];
  emptyHint: string;
  examples: ExampleId[];
}

export type ExampleId = "draft" | "email" | "ramble";

export const EXAMPLES: Record<ExampleId, { label: string; text: string }> = {
  draft: {
    label: "Messy draft",
    text: "Their are alot of writing tools out there, but most of them dont under stand you're voice.",
  },
  email: {
    label: "Casual email",
    text: "hey john, just checking in about the report — its kind of late and we sorta need it asap, thanks",
  },
  ramble: {
    label: "Rambling paragraph",
    text: "Basically, what we are kind of trying to say is that, in most cases, shorter sentences are generally usually better for the reader overall.",
  },
};

export const TOOLS: Record<ToolId, ToolConfig> = {
  fix: {
    id: "fix",
    name: "Fix grammar",
    title: "Fix grammar",
    description: "Paste your text — corrections show up highlighted on the right.",
    placeholder: "Paste or type your text here…",
    action: "Fix grammar",
    composerAction: "Fix grammar",
    emptyHint: "Corrected text will appear here",
    examples: ["draft", "email"],
  },
  paraphrase: {
    id: "paraphrase",
    name: "Paraphrase",
    title: "Paraphrase",
    description: "Pick a style, paste your sentence, and get a fresh way to say it.",
    placeholder: "Paste a sentence or paragraph to rewrite…",
    action: "Paraphrase",
    composerAction: "Paraphrase text",
    modesLabel: "Style:",
    modes: [
      { value: "standard", label: "Standard" },
      { value: "formal", label: "Formal" },
      { value: "simple", label: "Simple" },
      { value: "shorten", label: "Shorten" },
    ],
    emptyHint: "Your rewrite will appear here",
    examples: ["draft", "ramble"],
  },
  summarize: {
    id: "summarize",
    name: "Summarize",
    title: "Summarize",
    description: "Long text in, short version out — as a paragraph or bullet points.",
    placeholder: "Paste a long text to get the short version…",
    action: "Summarize",
    composerAction: "Summarize text",
    modesLabel: "Format:",
    modes: [
      { value: "paragraph", label: "Paragraph" },
      { value: "bullets", label: "Bullet points" },
    ],
    emptyHint: "Your summary will appear here",
    examples: ["ramble", "email"],
  },
  tone: {
    id: "tone",
    name: "Change tone",
    title: "Change tone",
    description: "Same message, different voice — pick the tone that fits.",
    placeholder: "Paste your text and pick a tone above…",
    action: "Rewrite tone",
    composerAction: "Rewrite tone",
    modesLabel: "Tone:",
    modes: [
      { value: "formal", label: "Formal" },
      { value: "friendly", label: "Friendly" },
      { value: "confident", label: "Confident" },
    ],
    emptyHint: "Your rewrite will appear here",
    examples: ["email", "draft"],
  },
};

export const TOOL_IDS: ToolId[] = ["fix", "paraphrase", "summarize", "tone"];

/* ------------------------------------------------------------------ */
/* Demo engine — client-side stand-in for the future AI API.           */
/* `runTool` mirrors the request shape the real endpoint will take:    */
/* { tool, text, mode } → { html, plain, fixes?, note }                */
/* ------------------------------------------------------------------ */

export interface ToolResult {
  /** Output with corrections wrapped in `<span class="corr">` */
  html: string;
  /** Plain-text output, for copy and word counts */
  plain: string;
  /** Before → after pairs (grammar fixes only) */
  fixes: [string, string][];
  note: string;
}

const FIXES: [RegExp, string][] = [
  [/\bTheir are\b/g, "There are"],
  [/\balot\b/g, "a lot"],
  [/\bdont\b/g, "don't"],
  [/\bunder stand\b/g, "understand"],
  [/\byou're voice\b/g, "your voice"],
  [/\bhey john\b/g, "Hi John,"],
  [/\bits kind of late\b/g, "it's late"],
  [/\bsorta need it asap\b/g, "need it as soon as possible"],
  [/\bgenerally usually\b/g, "usually"],
];

const CANNED: Record<string, Record<string, Partial<Record<ExampleId, string>>>> = {
  paraphrase: {
    standard: {
      draft: "Plenty of writing tools exist, but few of them actually get your voice.",
      email:
        "Hi John — following up on the report. It's overdue, and we need it as soon as you can manage.",
      ramble: "Put simply: shorter sentences are usually easier on the reader.",
    },
    formal: {
      draft:
        "Although numerous writing tools are available, few adequately capture the author's voice.",
      email:
        "Dear John, I am following up regarding the report, which is now overdue. We would appreciate receiving it promptly.",
      ramble: "In most cases, shorter sentences serve the reader more effectively.",
    },
    simple: {
      draft: "There are many writing tools, but most don't get how you write.",
      email: "Hi John — the report is late. Please send it soon. Thanks!",
      ramble: "Short sentences are easier to read.",
    },
    shorten: {
      draft: "Many tools exist; few get your voice.",
      email: "Hi John — report's overdue, please send ASAP. Thanks!",
      ramble: "Shorter sentences read better.",
    },
  },
  summarize: {
    paragraph: {
      draft: "Most writing tools miss the writer's voice.",
      email: "The report is late; please send it as soon as possible.",
      ramble: "Shorter sentences read better.",
    },
    bullets: {
      draft: "• Many writing tools exist\n• Few capture your personal voice",
      email: "• Report is overdue\n• Needed as soon as possible",
      ramble: "• Shorter sentences are easier to read\n• True in most cases",
    },
  },
  tone: {
    formal: {
      draft:
        "Numerous writing tools are available; however, few adequately preserve the author's voice.",
      email:
        "Dear John, I am writing to follow up on the report, which is now overdue. We would appreciate receiving it at your earliest convenience. Kind regards.",
      ramble: "In most cases, shorter sentences serve the reader more effectively.",
    },
    friendly: {
      draft: "There are tons of writing tools out there — but honestly, most don't get your voice.",
      email:
        "Hey John! Just a friendly nudge about the report — it's running a bit late and we'd love it soon. Thanks so much!",
      ramble: "Short sentences? Your readers will thank you.",
    },
    confident: {
      draft: "Most writing tools fail at one thing: your voice. Ours doesn't.",
      email: "John — the report is overdue. Please send it today. Thanks.",
      ramble: "Shorter sentences win. Every time.",
    },
  },
};

function escapeHtml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

export function wordCount(text: string): number {
  const t = text.trim();
  return t ? t.split(/\s+/).length : 0;
}

function matchExample(text: string): ExampleId | null {
  const t = text.trim();
  for (const id of Object.keys(EXAMPLES) as ExampleId[]) {
    if (EXAMPLES[id].text === t) return id;
  }
  return null;
}

/** Returns null when the demo has no canned output for this input. */
export function runTool(tool: ToolId, text: string, mode?: string): ToolResult | null {
  if (tool === "fix") {
    let html = escapeHtml(text);
    const fixes: [string, string][] = [];
    for (const [re, to] of FIXES) {
      html = html.replace(re, (m) => {
        fixes.push([m, to]);
        return `<span class="corr">${escapeHtml(to)}</span>`;
      });
    }
    if (fixes.length === 0) {
      return { html: escapeHtml(text), plain: text, fixes: [], note: "Looks good ✓" };
    }
    let plain = text;
    for (const [re, to] of FIXES) plain = plain.replace(re, to);
    return {
      html,
      plain,
      fixes,
      note: `${fixes.length} ${fixes.length === 1 ? "fix" : "fixes"}`,
    };
  }

  const example = matchExample(text);
  if (!example) return null;
  const output = CANNED[tool]?.[mode ?? ""]?.[example];
  if (!output) return null;
  return {
    html: escapeHtml(output).replace(/\n/g, "<br>"),
    plain: output,
    fixes: [],
    note: tool === "summarize" ? "Summarized ✓" : "Rewritten ✓",
  };
}

/* ------------------------------------------------------------------ */
/* Home → tool screen hand-off (kept out of the URL on purpose)        */
/* ------------------------------------------------------------------ */

const HANDOFF_KEY = "grammerbot-handoff";

export interface Handoff {
  tool: ToolId;
  text: string;
  mode?: string;
}

export function setHandoff(handoff: Handoff): void {
  try {
    sessionStorage.setItem(HANDOFF_KEY, JSON.stringify(handoff));
  } catch {
    /* storage unavailable — hand-off silently skipped */
  }
}

export function consumeHandoff(tool: ToolId): Handoff | null {
  try {
    const raw = sessionStorage.getItem(HANDOFF_KEY);
    if (!raw) return null;
    const handoff = JSON.parse(raw) as Handoff;
    if (handoff.tool !== tool || !handoff.text) return null;
    sessionStorage.removeItem(HANDOFF_KEY);
    return handoff;
  } catch {
    return null;
  }
}
