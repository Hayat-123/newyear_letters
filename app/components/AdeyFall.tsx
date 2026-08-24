import Image from 'next/image';

/**
 * The adey abeba drifting down over the whole page. Each flower spins as it
 * falls, and halfway down it turns Zemenay blue behind a white flash.
 *
 * Each petal is three stacked animations on three nested elements, because they
 * run on different clocks: `drift` moves the wrapper down the page, `spin`
 * turns the flower inside it, and the colour swap runs at the fall duration so
 * the change always lands at mid-screen no matter how fast this particular
 * flower is dropping.
 *
 * The per-flower numbers come from a seeded generator rather than Math.random.
 * They still need to look scattered, but the server and the client have to
 * agree on them exactly or hydration fails, and a fixed seed buys that without
 * pushing the whole layer behind a mount effect. It also means the flowers are
 * in the very first HTML the browser receives.
 */

const COUNT = 14;

/** mulberry32: small, fast, and good enough for scattering decoration. */
function seeded(seed: number) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

type Petal = {
  left: number; // vw
  size: number; // px
  fall: number; // seconds for one top-to-bottom trip
  spin: number; // seconds for one rotation
  delay: number; // negative, so flowers start mid-flight instead of all at top
  sway: number; // vw of sideways drift over the fall
  turn: number; // degrees per spin cycle, sign sets direction
  fade: number; // resting opacity
};

const PETALS: Petal[] = (() => {
  const rand = seeded(20190901); // Meskerem 1, 2019 E.C.
  return Array.from({ length: COUNT }, (_, i) => {
    // Spread the columns evenly and jitter within each, so the flowers cover
    // the full width instead of clumping the way pure random x does.
    const lane = (i + 0.5) * (100 / COUNT);
    const fall = 16 + rand() * 16;
    return {
      left: lane + (rand() - 0.5) * (100 / COUNT) * 0.9,
      size: 18 + rand() * 34,
      fall,
      spin: 6 + rand() * 9,
      // Offsetting by up to a full cycle means the page opens with flowers
      // already spread down the screen rather than a wave from the top edge.
      delay: -rand() * fall,
      sway: (rand() - 0.5) * 18,
      turn: (rand() < 0.5 ? -1 : 1) * (300 + rand() * 320),
      fade: 0.4 + rand() * 0.35,
    };
  });
})();

export function AdeyFall() {
  return (
    <div
      aria-hidden
      className="petal-layer pointer-events-none fixed inset-0 z-20 overflow-hidden"
    >
      {PETALS.map((p, i) => {
        // Every layer of one petal shares this clock, so the spin, the swap and
        // the flash stay locked to the same point of the fall.
        const clock = `${p.fall}s linear ${p.delay}s infinite`;
        return (
          <div
            key={i}
            className="petal-clock absolute top-0"
            style={{
              left: `${p.left}vw`,
              width: p.size,
              height: p.size,
              opacity: p.fade,
              // Read by the drift keyframes as the horizontal target.
              ['--sway' as string]: `${p.sway}vw`,
              animation: `drift ${clock}`,
            }}
          >
            <div
              className="petal-spin relative h-full w-full"
              style={{
                ['--turn' as string]: `${p.turn}deg`,
                animation: `spin ${p.spin}s linear ${p.delay}s infinite`,
              }}
            >
              {/* Blue underneath, yellow dissolving off the top of it. */}
              <Image
                src="/art/adey-blue.png"
                alt=""
                width={256}
                height={256}
                className="petal-clock absolute inset-0 h-full w-full"
                style={{ animation: `bloom-glow ${clock}` }}
              />
              <Image
                src="/art/adey.png"
                alt=""
                width={256}
                height={256}
                className="petal-clock absolute inset-0 h-full w-full"
                style={{ animation: `bloom-fade ${clock}` }}
              />
              <span
                className="petal-clock absolute inset-0 rounded-full bg-[radial-gradient(circle,#ffffff_0%,#cfe0ff80_45%,transparent_70%)]"
                style={{ animation: `bloom-flash ${clock}` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
