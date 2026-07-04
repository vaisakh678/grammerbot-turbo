import { HomeComposer } from "@/components/home-composer";
import { CheckIcon } from "@/components/icons";

const TRUST_POINTS = ["Free to use", "No sign-up needed", "Your text stays private"];

export default function Home() {
  return (
    <section className="mx-auto flex w-full max-w-6xl flex-1 flex-col items-center px-5 pb-12 pt-8 sm:pt-16">
      <h1 className="text-center font-display text-[clamp(1.9rem,4.6vw,2.9rem)] font-extrabold leading-tight tracking-tight text-balance">
        Write it <span className="strike-rite">rite</span>
        <span className="text-accent">right.</span>
      </h1>
      <p className="mt-3 max-w-[48ch] text-center text-[17px] text-ink-soft text-pretty">
        Paste your text, hit Enter, and get clean writing back — or pick a tool
        below. Free, no sign-up.
      </p>

      <HomeComposer />

      <div className="mt-10 flex flex-wrap justify-center gap-7 text-sm text-ink-soft sm:mt-14">
        {TRUST_POINTS.map((point) => (
          <span key={point} className="inline-flex items-center gap-2">
            <CheckIcon className="size-[15px] text-accent" strokeWidth={2.2} />
            {point}
          </span>
        ))}
      </div>
    </section>
  );
}
