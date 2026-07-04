import type { SVGProps } from "react";
import type { ToolId } from "@/lib/tools";

type IconProps = SVGProps<SVGSVGElement>;

function base(props: IconProps): IconProps {
  return {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.9,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": true,
    ...props,
  };
}

export function CheckIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M5 13l4 4L19 7" />
    </svg>
  );
}

export function ParaphraseIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M4 9a8 8 0 0 1 14-2.5" />
      <path d="M18 3v3.5h-3.5" />
      <path d="M20 15a8 8 0 0 1-14 2.5" />
      <path d="M6 21v-3.5h3.5" />
    </svg>
  );
}

export function SummarizeIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M5 7h14M5 12h14M5 17h8" />
    </svg>
  );
}

export function ToneIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M12 4c-4 4-6 7.5-6 10.5a6 6 0 0 0 12 0C18 11.5 16 8 12 4z" />
    </svg>
  );
}

export function ArrowIcon(props: IconProps) {
  return (
    <svg {...base({ strokeWidth: 2.2, ...props })}>
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

export function CopyIcon(props: IconProps) {
  return (
    <svg {...base({ strokeWidth: 1.8, ...props })}>
      <rect x="9" y="9" width="11" height="11" rx="2" />
      <path d="M5 15V5a2 2 0 0 1 2-2h10" />
    </svg>
  );
}

export function XIcon(props: IconProps) {
  return (
    <svg {...base({ strokeWidth: 2.6, ...props })}>
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  );
}

export function UserIcon(props: IconProps) {
  return (
    <svg {...base({ strokeWidth: 1.8, ...props })}>
      <circle cx="12" cy="8.5" r="3.5" />
      <path d="M4.5 20c1.6-3.2 4.3-5 7.5-5s5.9 1.8 7.5 5" />
    </svg>
  );
}

export const TOOL_ICONS: Record<ToolId, (props: IconProps) => React.JSX.Element> = {
  fix: CheckIcon,
  paraphrase: ParaphraseIcon,
  summarize: SummarizeIcon,
  tone: ToneIcon,
};
