'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * Flips `data-shown` on its child once the element scrolls into view, which is
 * what the `.reveal` rule in globals.css keys its drop-in transition off.
 *
 * The observer disconnects on the first intersection: these are entrances, and
 * re-playing them when a card scrolls back past is distracting on a page this
 * short.
 */
export function Reveal({
  children,
  delay = 0,
  className = '',
  as: Tag = 'div',
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  as?: 'div' | 'li' | 'section';
}) {
  const ref = useRef<HTMLElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Anything already on screen at mount (the first row, on a tall window)
    // should not sit invisible waiting for a scroll that may never come.
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setShown(true);
        io.disconnect();
      },
      { rootMargin: '0px 0px -12% 0px' },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <Tag
      ref={ref as React.Ref<never>}
      data-shown={shown}
      className={`reveal ${className}`}
      style={{ ['--reveal-delay' as string]: `${delay}ms` }}
    >
      {children}
    </Tag>
  );
}
