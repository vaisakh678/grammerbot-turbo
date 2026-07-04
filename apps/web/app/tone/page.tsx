import type { Metadata } from "next";
import { ToolScreen } from "@/components/tool-screen";

export const metadata: Metadata = {
  title: "Change tone — GrammerBot",
  description: "Rewrite your text as formal, friendly, or confident — same message.",
};

export default function TonePage() {
  return <ToolScreen tool="tone" />;
}
