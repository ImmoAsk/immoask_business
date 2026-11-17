"use client";

import { useEffect, useRef, useState } from "react";
import "../shared/landing_shared.css";
import "./landing_page_stats.css";
import type { LandingPageStatsProps } from "./type";

export function LandingPageStats({ id, items, durationMs = 1400 }: LandingPageStatsProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    let frame = 0;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        observer.disconnect();
        const start = performance.now();
        const tick = (now: number) => {
          const p = Math.min((now - start) / durationMs, 1);
          setProgress(1 - Math.pow(1 - p, 3));
          if (p < 1) frame = requestAnimationFrame(tick);
        };
        frame = requestAnimationFrame(tick);
      },
      { threshold: 0.15 },
    );
    observer.observe(node);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [durationMs]);

  return (
    <section id={id} className="lp-section lp-sectionFlushTop">
      <div className="lp-wrap">
        <div ref={ref} className="lp-stats-stats" data-reveal="">
          {items.map((item) => (
            <div key={item.label}>
              <b>
                {Math.round(item.value * progress)}
                {progress > 0 ? item.suffix : null}
              </b>
              <span>{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
