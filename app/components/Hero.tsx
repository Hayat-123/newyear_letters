import Image from 'next/image';

/**
 * The opening. PARTNERSHIP recedes from in front of the viewer into the page,
 * then two fists rush in from opposite edges, pull back, and bump. The note
 * lands underneath, once the hands have met.
 *
 * All of it is CSS keyframes over server-rendered markup, so it plays on the
 * first painted frame instead of waiting for hydration.
 *
 * The note deliberately never names the company reading it. This page goes out
 * to every partner on the list, so the second party is always "you".
 */

// One shared clock, so the ring, the glow and the note stay in step if the
// pacing of the opening is ever retuned.
const T = {
  headline: 0.15,
  fists: 0.8,
  fistsDur: 1.5,
  // 86% is the frame the knuckles meet in the bump keyframes.
  get impact() {
    return this.fists + this.fistsDur * 0.86;
  },
  get note() {
    return this.impact + 0.2;
  },
};

export function Hero() {
  return (
    <section className="relative flex min-h-[100svh] flex-col items-center justify-center overflow-hidden px-5 py-[clamp(2.5rem,8vh,5rem)]">
      <div
        className="relative z-10 flex w-full max-w-4xl flex-col items-center text-center"
        style={{ perspective: '1000px' }}
      >
        <p
          className="overline"
          style={{ animation: `rise 0.7s ease-out ${T.headline}s both` }}
        >
          Meskerem 1 &middot; 2019 E.C.
        </p>

        <h1
          className="mt-3 font-[family-name:var(--font-hero)] text-[clamp(2.5rem,11vw,7rem)] leading-[0.95] font-normal"
          style={{
            transformStyle: 'preserve-3d',
            animation: `arrive 1.35s cubic-bezier(0.16, 1, 0.3, 1) ${T.headline}s both`,
          }}
        >
          PARTNERSHIP
        </h1>

        <p
          className="mt-4 flex items-center gap-[clamp(0.75rem,3vw,1.5rem)] dg text-[clamp(0.8rem,2.4vw,1.05rem)] tracking-[0.26em] text-ink-2 uppercase"
          style={{ animation: `rise 0.8s ease-out ${T.headline + 0.75}s both` }}
        >
          <span>Zemenay</span>
          <span aria-hidden className="text-gold">
            &#10005;
          </span>
          <span>You</span>
        </p>
      </div>

      {/* The bump. The two halves were cut from one drawing along the same
          seam, so butting them edge to edge rebuilds the original image. */}
      <div className="pointer-events-none relative mt-[clamp(1rem,3vh,2.5rem)] flex w-[var(--pair)] shrink-0 justify-center">
        <Image
          src="/art/fist-left.png"
          alt="Two fists meeting in a bump"
          width={676}
          height={578}
          loading="eager"
          fetchPriority="high"
          className="w-1/2"
          style={{ animation: `bump-left ${T.fistsDur}s cubic-bezier(0.33, 0.9, 0.4, 1) ${T.fists}s both` }}
        />
        <Image
          src="/art/fist-right.png"
          alt=""
          width={676}
          height={578}
          loading="eager"
          fetchPriority="high"
          className="w-1/2"
          style={{ animation: `bump-right ${T.fistsDur}s cubic-bezier(0.33, 0.9, 0.4, 1) ${T.fists}s both` }}
        />

        {/* Shockwave, on the contact point rather than the box centre: the
            knuckles meet high in the artwork, with the forearms filling the
            lower half. */}
        <span
          aria-hidden
          className="absolute top-[30%] left-1/2 aspect-square w-[42%] rounded-full border border-gold"
          style={{ animation: `impact 1.1s ease-out ${T.impact}s both` }}
        />
        <span
          aria-hidden
          className="absolute top-[30%] left-1/2 aspect-square w-[26%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,#ffcd6866_0%,transparent_70%)] blur-xl"
          // fade-in touches opacity only. `rise` would animate transform and
          // clobber the centring translate this element needs to keep.
          style={{ animation: `fade-in 1.2s ease-out ${T.impact}s both, glow-pulse 4.5s ease-in-out ${T.impact + 1.2}s infinite` }}
        />
      </div>

      {/* The note, landing after the hands have met. */}
      <div
        className="relative z-10 mt-[clamp(1.5rem,4vh,2.75rem)] max-w-lg text-center"
        style={{ animation: `rise 0.9s ease-out ${T.note}s both` }}
      >
        <p className="text-[clamp(1.02rem,3.4vw,1.25rem)] leading-relaxed text-ink-2">
          Whatever we built this year, we did not build it alone. Here is to the
          next one, side by side.
        </p>
        <p className="mt-5 font-[family-name:var(--font-ethiopic)] text-[clamp(1.15rem,4vw,1.55rem)] font-semibold text-gold">
          መልካም አዲስ ዓመት
        </p>
        <p className="overline mt-2.5 text-ink-3">From everyone at Zemenay</p>
      </div>
    </section>
  );
}
