import Image from 'next/image';
import { Reveal } from './Reveal';
import { ZemenayLogo } from './ZemenayLogo';

/**
 * Where to find us. The adey abeba meadow sits behind this section as a blue
 * duotone: a straight photograph of yellow flowers would fight the page, but
 * pushed through the brand blues it reads as the field the falling petals came
 * from.
 */

const CONTACT = [
  { label: 'Email', value: 'zemenaytechsolutions@gmail.com', href: 'mailto:zemenaytechsolutions@gmail.com' },
  { label: 'Site', value: 'zemenaytech.com', href: 'https://zemenaytech.com' },
  { label: 'Where', value: 'Bole, Addis Ababa, Ethiopia' },
];

// Where each landed flower sits on the meadow band, as
// [left %, top %, size px, rotation, seconds after the band is first seen].
// The delays run out to half a minute so the field fills in while you read the
// contact details rather than arriving all at once.
const SETTLED: [number, number, number, number, number][] = [
  [8, 30, 30, -18, 0.6],
  [24, 16, 22, 24, 4],
  [41, 38, 34, -8, 9],
  [58, 20, 26, 15, 14],
  [72, 44, 20, -25, 19],
  [88, 26, 30, 10, 25],
  [33, 58, 24, -32, 31],
];

const SOCIAL = [
  { label: 'LinkedIn', href: 'https://www.linkedin.com/company/zemenaytech/' },
  { label: 'Instagram', href: 'https://www.instagram.com/zemenaytech' },
  { label: 'X', href: 'https://x.com/Zemenaytech' },
];

export function Closing() {
  return (
    <footer className="relative z-10 overflow-hidden pt-[clamp(4rem,12vh,8rem)]">
      <div className="shell pb-[clamp(2.5rem,6vh,4rem)]">
        <Reveal className="max-w-2xl">
          <p className="overline">Say hello</p>
          <h2 className="mt-3 h2">
            Whatever the next year needs, we are one message away
          </h2>
          <p className="mt-4 font-[family-name:var(--font-ethiopic)] text-[clamp(1.05rem,3.5vw,1.35rem)] font-semibold text-gold">
            መልካም አዲስ ዓመት
          </p>
        </Reveal>

        <Reveal delay={100}>
          <dl className="mt-[clamp(2rem,6vh,3rem)] grid grid-cols-1 gap-6 sm:grid-cols-3">
            {CONTACT.map((c) => (
              <div key={c.label}>
                <dt className="overline text-ink-3">{c.label}</dt>
                <dd className="mt-1.5 text-[0.98rem] break-words">
                  {c.href ? (
                    <a
                      href={c.href}
                      target={c.href.startsWith('http') ? '_blank' : undefined}
                      rel={c.href.startsWith('http') ? 'noreferrer' : undefined}
                      className="text-ink hover:text-gold"
                    >
                      {c.value}
                    </a>
                  ) : (
                    <span className="text-ink-2">{c.value}</span>
                  )}
                </dd>
              </div>
            ))}
          </dl>
        </Reveal>

        <Reveal delay={180}>
          <div className="mt-[clamp(2.5rem,7vh,4rem)] flex flex-col gap-6 border-t border-white/12 pt-8 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <ZemenayLogo className="h-6 w-auto text-ink" />
              <p className="mt-3 max-w-sm text-sm leading-relaxed text-ink-3">
                Your complete solution to recruit, hire and pay remote employees
                anywhere in the world.
              </p>
            </div>

            <nav className="flex gap-5">
              {SOCIAL.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                  className="overline text-ink-2 hover:text-gold"
                >
                  {s.label}
                </a>
              ))}
            </nav>
          </div>

          <p className="mt-8 text-xs text-ink-3">
            &copy; {new Date().getFullYear()} Zemenay. Sent with thanks to
            everyone we worked with this year.
          </p>
        </Reveal>
      </div>

      {/* The adey abeba field closes the page off, in its own colours. It is a
          block in the flow rather than a backdrop behind the text: at full
          strength the photograph is far too bright to read white type over,
          and dimming it enough to fix that would have thrown away the reason
          for using it. Its top edge is already faded to transparent in the
          asset itself, so it grows out of the blue rather than butting
          against it. */}
      <Reveal>
        <div
          aria-hidden
          className="relative h-[clamp(9rem,24vw,17rem)] w-full bg-cover bg-bottom"
          style={{ backgroundImage: 'url(/art/meadow.png)' }}
        >
          {/* Flowers coming to rest. Everything above has petals falling past
              the bottom of the screen forever; here they finally land, one at a
              time over the half-minute or so someone spends at the foot of the
              page, so the motif closes instead of looping. */}
          {SETTLED.map(([left, top, size, rot, delay], i) => (
            <span
              key={i}
              className="settle-petal absolute"
              style={{
                left: `${left}%`,
                top: `${top}%`,
                width: size,
                height: size,
                ['--settle-rot' as string]: `${rot}deg`,
                ['--settle-delay' as string]: `${delay}s`,
              }}
            >
              <Image
                src="/art/adey.png"
                alt=""
                width={256}
                height={256}
                className="h-full w-full drop-shadow-[0_4px_10px_rgba(0,0,0,0.35)]"
              />
            </span>
          ))}
        </div>
      </Reveal>
    </footer>
  );
}
