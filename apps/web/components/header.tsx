"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { TOOLS, TOOL_IDS } from "@/lib/tools";
import { UserIcon } from "@/components/icons";

export function Header() {
  const pathname = usePathname();

  return (
    <header className="mx-auto flex w-full max-w-6xl flex-wrap items-center gap-1.5 px-6 py-3.5">
      <Link
        href="/"
        className="mr-5 flex items-center gap-2 font-display text-xl font-extrabold tracking-tight"
      >
        <span className="grid size-8 place-items-center rounded-lg bg-accent text-base text-accent-ink">
          G
        </span>
        <span>
          gr
          <span className="squiggle cursor-help" title="Yes, we know. We fix that.">
            amme
          </span>
          rbot
        </span>
      </Link>

      <nav
        aria-label="Tools"
        className="order-3 -mx-1 flex w-full gap-0.5 overflow-x-auto sm:order-none sm:mr-auto sm:w-auto"
      >
        {TOOL_IDS.map((id) => {
          const active = pathname === `/${id}`;
          return (
            <Link
              key={id}
              href={`/${id}`}
              className={`whitespace-nowrap rounded-full px-3.5 py-2 text-sm font-semibold ${
                active
                  ? "bg-accent-soft text-accent"
                  : "text-ink-soft hover:bg-tint-deep hover:text-ink"
              }`}
            >
              {TOOLS[id].name}
            </Link>
          );
        })}
      </nav>

      <button
        type="button"
        className="ml-auto whitespace-nowrap rounded-full border-[1.5px] border-accent px-4 py-2 text-sm font-semibold text-accent transition-colors hover:bg-accent hover:text-accent-ink sm:ml-0"
      >
        Go Premium
      </button>
      <button
        type="button"
        aria-label="Account"
        className="grid size-8.5 shrink-0 place-items-center rounded-full border-[1.5px] border-line bg-canvas text-ink-soft"
      >
        <UserIcon className="size-[18px]" />
      </button>
    </header>
  );
}
