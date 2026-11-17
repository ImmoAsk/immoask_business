"use client";

import { useEffect } from "react";

const SELECTOR = '[data-reveal=""]';

/**
 * Fades in every `[data-reveal]` element of the landing page once it scrolls into view.
 * Elements stay observed while hidden (e.g. inactive pricing tab) and reveal when shown.
 * Elements added later (e.g. re-rendered after a language switch) are picked up too.
 */
export function LandingRevealObserver() {
  useEffect(() => {
    let index = 0;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          (entry.target as HTMLElement).dataset.reveal = "in";
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.15 },
    );

    const watch = (element: HTMLElement) => {
      element.style.setProperty("--reveal-delay", `${(index++ % 4) * 70}ms`);
      observer.observe(element);
    };

    document.querySelectorAll<HTMLElement>(SELECTOR).forEach(watch);

    const mutations = new MutationObserver((records) => {
      for (const record of records) {
        record.addedNodes.forEach((node) => {
          if (!(node instanceof HTMLElement)) return;
          if (node.matches(SELECTOR)) watch(node);
          node.querySelectorAll<HTMLElement>(SELECTOR).forEach(watch);
        });
      }
    });
    mutations.observe(document.body, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      mutations.disconnect();
    };
  }, []);

  return null;
}
