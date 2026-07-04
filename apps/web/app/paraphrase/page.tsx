import type { Metadata } from "next";
import { ToolScreen } from "@/components/tool-screen";

export const metadata: Metadata = {
  title: "Paraphrase — GrammerBot",
  description: "Say the same thing a different way — clearer, smoother, yours.",
};

export default function ParaphrasePage() {
  return <ToolScreen tool="paraphrase" />;
}
