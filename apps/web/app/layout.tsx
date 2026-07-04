import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/header";

const poppins = Poppins({
  variable: "--font-poppins",
  weight: ["600", "800"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "GrammerBot — Write it right",
  description:
    "Fix grammar, paraphrase, summarize, and change the tone of your writing. Free, no sign-up.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${poppins.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        <Header />
        <main className="flex flex-1 flex-col">{children}</main>
        <footer className="px-6 pb-6 pt-4 text-center text-xs text-ink-faint">
          © 2026 GrammerBot — spelled wrong on purpose, we promise. · Privacy ·
          Terms
        </footer>
      </body>
    </html>
  );
}
