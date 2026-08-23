'use client';

import Image from 'next/image';
import { useState } from 'react';
import { PROJECTS, type Project } from '../data/projects';
import { Reveal } from './Reveal';

/**
 * The work, as photo cards that drop into place on scroll and open on click.
 * Cards toggle independently rather than behaving as an accordion, so two can
 * be left open side by side.
 */
export function Projects() {
  const [open, setOpen] = useState<string | null>(null);

  return (
    <section id="work" className="relative z-10 py-[clamp(4rem,12vh,8rem)]">
      <div className="shell">
        <Reveal className="max-w-2xl">
          <p className="overline">Some of the work</p>
          <h2 className="mt-3 h2">A year of things that shipped</h2>
          <p className="mt-4 text-[clamp(0.98rem,3vw,1.1rem)] leading-relaxed text-ink-3">
            Open any card for the detail behind it.
          </p>
        </Reveal>

        <ul className="mt-[clamp(2rem,6vh,3.5rem)] grid list-none grid-cols-1 gap-6 p-0 sm:grid-cols-2 lg:grid-cols-3">
          {PROJECTS.map((p, i) => (
            // Stagger by index so the cards land in reading order rather than
            // all at once.
            <Reveal as="li" key={p.id} delay={i * 90} className="flex">
              <Card
                project={p}
                isOpen={open === p.id}
                onToggle={() => setOpen(open === p.id ? null : p.id)}
              />
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}

function Card({
  project,
  isOpen,
  onToggle,
}: {
  project: Project;
  isOpen: boolean;
  onToggle: () => void;
}) {
  // A photo named in the data but not yet on disk should not leave a broken
  // frame behind. Tracking the load failure lets the empty state say which file
  // is missing, which is more use than a torn image icon.
  const [imageFailed, setImageFailed] = useState(false);
  const hasPhoto = Boolean(project.image) && !imageFailed;

  return (
    <article
      className={`glass group flex w-full flex-col overflow-hidden transition-[border-color,background,transform] duration-300 ${
        isOpen ? 'border-sky/60 bg-white/8' : 'hover:-translate-y-1 hover:border-white/30'
      }`}
    >
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-controls={`panel-${project.id}`}
        className="cursor-pointer text-left"
      >
        <span className="relative block aspect-[16/10] overflow-hidden bg-accent/40">
          {hasPhoto ? (
            <Image
              src={project.image as string}
              alt={project.title}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              onError={() => setImageFailed(true)}
            />
          ) : (
            <span className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-[repeating-linear-gradient(135deg,#ffffff0a_0_10px,transparent_10px_20px)] px-4 text-center">
              <span aria-hidden className="text-2xl opacity-60">
                &#9634;
              </span>
              <span className="text-[0.7rem] leading-snug text-ink-3">
                add a photo at
                <br />
                <code className="text-cyan">
                  {project.image ?? `public/projects/${project.id}.jpg`}
                </code>
              </span>
            </span>
          )}

          {/* Scrim, so the chip stays legible over any photograph. */}
          <span
            aria-hidden
            className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-navy/70 to-transparent"
          />
          <span className="absolute top-3 left-3 rounded-full border border-white/25 bg-navy/60 px-3 py-1 text-[0.65rem] tracking-[0.16em] text-ink-2 uppercase backdrop-blur-sm">
            {project.tag}
          </span>
        </span>

        <span className="flex items-start justify-between gap-4 px-5 pt-5">
          <span className="dg text-[1.2rem] leading-snug">
            {project.title}
          </span>
          <span
            aria-hidden
            className={`mt-1 shrink-0 text-gold transition-transform duration-300 ${
              isOpen ? 'rotate-45' : ''
            }`}
          >
            &#43;
          </span>
        </span>
        <span className="mt-1.5 block px-5 pb-5 text-sm leading-relaxed text-ink-3">
          {project.blurb}
        </span>
      </button>

      {/* grid-template-rows 0fr to 1fr is the one way to transition to a height
          the content decides without measuring it in JS. The inner element has
          to own the overflow clip. */}
      <div
        id={`panel-${project.id}`}
        className="grid transition-[grid-template-rows] duration-400 ease-out"
        style={{ gridTemplateRows: isOpen ? '1fr' : '0fr' }}
      >
        <div className="overflow-hidden">
          <div className="mx-5 border-t border-white/10 pt-4 pb-5">
            <p className="text-sm leading-relaxed text-ink-2">{project.detail}</p>
            <ul className="mt-3 list-none space-y-2 p-0 text-sm text-ink-3">
              {project.points.map((point) => (
                <li key={point} className="flex gap-2.5">
                  <span aria-hidden className="mt-2 h-1 w-1 shrink-0 rounded-full bg-gold" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
            {project.href ? (
              <a
                href={project.href}
                target="_blank"
                rel="noreferrer"
                className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-cyan hover:underline"
                // Keyboard focus must not reach a link inside a collapsed
                // panel, and inert is the only thing that takes it out of the
                // tab order and the a11y tree at once while the row is still
                // transitioning open.
                {...(isOpen ? {} : { inert: true, tabIndex: -1 })}
              >
                See the project
                <span aria-hidden>&rarr;</span>
              </a>
            ) : null}
          </div>
        </div>
      </div>
    </article>
  );
}
