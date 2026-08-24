import Image from 'next/image';
import { SERVICES } from '../data/services';
import { Reveal } from './Reveal';

/**
 * What Zemenay does, ahead of the work that proves it.
 *
 * Deliberately typographic where the project section is photographic. Two grids
 * of picture cards back to back would read as one long undifferentiated deck,
 * and this half is a list of offers rather than a gallery, so it gets a ruled
 * index instead: number, name, one line, and a link out to the real page.
 */
export function Services() {
  return (
    <section id="services" className="relative z-10 pt-[clamp(3rem,10vh,6rem)]">
      {/* A drift of small blue flowers behind the list. It is the same trick the
          falling petals play, held still: adey abeba in Zemenay blue. Kept very
          faint and masked to nothing at the edges, so it reads as texture in the
          background rather than as a picture competing with the type. */}
      <Image
        src="/art/blue-drift.webp"
        alt=""
        aria-hidden
        width={1400}
        height={984}
        className="pointer-events-none absolute -top-8 right-0 -z-10 w-[min(46rem,80%)] opacity-[0.18] [mask-image:radial-gradient(60%_60%_at_65%_40%,#000_0%,transparent_75%)]"
      />

      <div className="shell">
        <Reveal className="max-w-2xl">
          <p className="overline">What we do</p>
          <h2 className="mt-3 h2">Six ways we plug into a team</h2>
        </Reveal>

        <ul className="mt-[clamp(2rem,5vh,3rem)] grid list-none grid-cols-1 gap-x-10 gap-y-0 p-0 md:grid-cols-2">
          {SERVICES.map((service, i) => (
            <Reveal as="li" key={service.id} delay={i * 70}>
              <a
                href={service.href}
                target="_blank"
                rel="noreferrer"
                className="group block border-t border-white/12 py-6 transition-colors duration-300 hover:border-gold/70"
              >
                <span className="flex items-baseline gap-4">
                  <span className="dg text-[0.78rem] tracking-[0.18em] text-gold">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="dg text-[1.35rem] leading-tight transition-colors duration-300 group-hover:text-gold">
                    {service.title}
                  </span>
                  <span
                    aria-hidden
                    className="ml-auto shrink-0 translate-x-0 text-gold opacity-0 transition-all duration-300 group-hover:translate-x-1 group-hover:opacity-100"
                  >
                    &rarr;
                  </span>
                </span>
                <span className="mt-2 block max-w-md pl-[2.6rem] text-[0.9rem] leading-relaxed text-ink-3">
                  {service.blurb}
                </span>
              </a>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
