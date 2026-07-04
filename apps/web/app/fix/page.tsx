import type { Metadata } from "next";
import { ToolScreen } from "@/components/tool-screen";

export const metadata: Metadata = {
  title: "Fix grammar — GrammerBot",
  description: "Correct spelling, punctuation, and grammar mistakes in one click.",
};

export default function FixPage() {
  return <ToolScreen tool="fix" />;
}
