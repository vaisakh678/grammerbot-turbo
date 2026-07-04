import type { Metadata } from "next";
import { ToolScreen } from "@/components/tool-screen";

export const metadata: Metadata = {
  title: "Summarize — GrammerBot",
  description: "Turn long text into the short version — paragraph or bullet points.",
};

export default function SummarizePage() {
  return <ToolScreen tool="summarize" />;
}
