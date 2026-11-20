"use client";

import { useEffect, useRef, useState } from "react";

/** Tracks an element's content width (for charts drawn in pixels). */
export function useElementWidth<T extends HTMLElement>(initialWidth = 0) {
  const ref = useRef<T>(null);
  const [width, setWidth] = useState(initialWidth);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new ResizeObserver(([entry]) => {
      if (entry) setWidth(Math.round(entry.contentRect.width));
    });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return { ref, width };
}
