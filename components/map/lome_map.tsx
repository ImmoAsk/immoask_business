"use client";

import { useRef, useState, useSyncExternalStore } from "react";
import type { PointerEvent as ReactPointerEvent, ReactNode, RefObject } from "react";
import { Icon } from "@/components/ui/icon";
import type { IconName } from "@/components/ui/icon";
import { focusRing } from "@/components/ui/styles";
import { cn } from "@/lib/cn";

// Schematic map of Grand Lomé drawn in SVG (no tile provider yet), shared by the features.
// World units: 1000 × 652, an equirectangular box over the area below.
const AREA = { west: 1.12, east: 1.35, north: 6.25, south: 6.1 };
const W = 1000;
const H = 652;
const ZOOMS = [1, 1.5, 2.25, 3.5] as const;

export type MapCoordinates = { lat: number; lng: number };

export type MapMarkerTone = "brand" | "outline" | "orange" | "emerald" | "amber";

export type MapMarker = {
  id: string;
  coordinates: MapCoordinates;
  /** Accessible name of the pin. */
  label: string;
  /** City shown in the "hors carte" note when the marker is outside Grand Lomé. */
  place: string;
  tone: MapMarkerTone;
  icon: IconName;
};

export type MapLegendItem = { label: string; tone: MapMarkerTone };

function project({ lat, lng }: MapCoordinates) {
  return {
    x: ((lng - AREA.west) / (AREA.east - AREA.west)) * W,
    y: ((AREA.north - lat) / (AREA.north - AREA.south)) * H,
  };
}

function inArea({ lat, lng }: MapCoordinates) {
  return lng >= AREA.west && lng <= AREA.east && lat >= AREA.south && lat <= AREA.north;
}

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

type Point = { x: number; y: number };

/** Keeps the view inside the world; a view taller than the world stays vertically centred. */
function clampCenter(center: Point, zoom: number, ratio: number): Point {
  const halfW = W / zoom / 2;
  const halfH = (W / zoom) * ratio / 2;
  return {
    x: clamp(center.x, halfW, W - halfW),
    y: halfH * 2 >= H ? H / 2 : clamp(center.y, halfH, H - halfH),
  };
}

/** Size of an element as "width×height" (a primitive, so React can compare it), followed with a ResizeObserver. */
function useElementSize(ref: RefObject<HTMLElement | null>) {
  const size = useSyncExternalStore(
    (notify) => {
      const element = ref.current;
      if (!element) return () => {};
      const observer = new ResizeObserver(notify);
      observer.observe(element);
      return () => observer.disconnect();
    },
    () => {
      const rect = ref.current?.getBoundingClientRect();
      return rect && rect.width > 0 ? `${Math.round(rect.width)}x${Math.round(rect.height)}` : "";
    },
    () => "",
  );
  const [width, height] = size ? size.split("x").map(Number) : [0, 0];
  return { width, height };
}

const pinTones: Record<MapMarkerTone, { body: string; tip: string; legend: string }> = {
  brand: {
    body: "bg-brand-600 text-white dark:bg-brand-500",
    tip: "border-t-brand-600 dark:border-t-brand-500",
    legend: "bg-brand-600 dark:bg-brand-500",
  },
  outline: {
    body: "bg-white text-brand-600 ring-2 ring-inset ring-brand-600 dark:bg-zinc-900 dark:text-brand-100 dark:ring-brand-500",
    tip: "border-t-brand-600 dark:border-t-brand-500",
    legend: "border-2 border-brand-600 dark:border-brand-500",
  },
  orange: { body: "bg-orange-500 text-white", tip: "border-t-orange-500", legend: "bg-orange-500" },
  amber: { body: "bg-amber-500 text-white", tip: "border-t-amber-500", legend: "bg-amber-500" },
  emerald: { body: "bg-emerald-600 text-white", tip: "border-t-emerald-600", legend: "bg-emerald-600" },
};

export type LomeMapProps = {
  markers: MapMarker[];
  selectedId: string | null;
  onSelect: (id: string | null) => void;
  /** Marker hovered elsewhere (e.g. in a list), drawn larger. */
  highlightedId?: string | null;
  /** Card shown above the selected marker. */
  renderPopup?: (id: string, close: () => void) => ReactNode;
  legend?: MapLegendItem[];
  /** Extra control in the top-left corner (e.g. a link). */
  topLeft?: ReactNode;
  /**
   * Fill the height given by `className` (e.g. "h-[560px]") instead of the map's natural
   * 1000 × 652 shape; the view widens or deepens to match.
   */
  fill?: boolean;
  ariaLabel?: string;
  className?: string;
};

export function LomeMap({
  markers,
  selectedId,
  onSelect,
  highlightedId,
  renderPopup,
  legend,
  topLeft,
  fill = false,
  ariaLabel = "Carte — Grand Lomé",
  className,
}: LomeMapProps) {
  const [zoomIndex, setZoomIndex] = useState(0);
  const [center, setCenter] = useState<Point>({ x: W / 2, y: H / 2 });
  const [followedId, setFollowedId] = useState(selectedId);
  const surfaceRef = useRef<HTMLDivElement>(null);
  const drag = useRef<{ pointerId: number; x: number; y: number; center: Point } | null>(null);
  const size = useElementSize(surfaceRef);
  const ratio = size.width > 0 ? Math.round((size.height / size.width) * 1000) / 1000 : H / W;

  const zoom = ZOOMS[zoomIndex];
  const onMap = markers.filter((marker) => inArea(marker.coordinates));
  const offMap = markers.filter((marker) => !inArea(marker.coordinates));
  const selected = onMap.find((marker) => marker.id === selectedId) ?? null;

  // A marker picked outside the map is brought into view (state adjusted during render, no effect).
  if (followedId !== selectedId) {
    setFollowedId(selectedId);
    if (selected) setCenter(clampCenter(project(selected.coordinates), zoom, ratio));
  }

  const view = clampCenter(center, zoom, ratio);
  const vw = W / zoom;
  const vh = vw * ratio;
  const vx = view.x - vw / 2;
  const vy = view.y - vh / 2;
  const toPercent = (point: Point) => ({ left: ((point.x - vx) / vw) * 100, top: ((point.y - vy) / vh) * 100 });

  function zoomTo(index: number) {
    const next = clamp(index, 0, ZOOMS.length - 1);
    const focus = selected ? project(selected.coordinates) : view;
    setZoomIndex(next);
    setCenter(clampCenter(focus, ZOOMS[next], ratio));
  }

  function onPointerDown(event: ReactPointerEvent<HTMLDivElement>) {
    if (zoom === 1 || (event.target as Element).closest("button, a")) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    drag.current = { pointerId: event.pointerId, x: event.clientX, y: event.clientY, center: view };
  }

  function onPointerMove(event: ReactPointerEvent<HTMLDivElement>) {
    const start = drag.current;
    const surface = surfaceRef.current;
    if (!start || start.pointerId !== event.pointerId || !surface) return;
    const scale = vw / surface.getBoundingClientRect().width;
    setCenter(
      clampCenter(
        { x: start.center.x - (event.clientX - start.x) * scale, y: start.center.y - (event.clientY - start.y) * scale },
        zoom,
        ratio,
      ),
    );
  }

  const popup = selected && renderPopup ? toPercent(project(selected.coordinates)) : null;

  return (
    <section
      aria-label={ariaLabel}
      className={cn(
        "relative overflow-hidden rounded-3xl border border-zinc-100 bg-white shadow-[0_1px_3px_rgba(16,24,40,0.05)] dark:border-white/10 dark:bg-zinc-950",
        className,
      )}
    >
      <div
        ref={surfaceRef}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={() => (drag.current = null)}
        onPointerCancel={() => (drag.current = null)}
        className={cn(
          "relative w-full touch-none select-none",
          fill ? "h-full" : "aspect-[1000/652]",
          zoom > 1 && "cursor-grab active:cursor-grabbing",
        )}
      >
        <MapBackground viewBox={`${vx} ${vy} ${vw} ${vh}`} />

        {onMap.map((marker) => {
          const position = toPercent(project(marker.coordinates));
          if (position.left < -5 || position.left > 105 || position.top < -5 || position.top > 105) return null;
          const tone = pinTones[marker.tone];
          const active = marker.id === selectedId;
          const highlighted = active || marker.id === highlightedId;
          return (
            <button
              key={marker.id}
              type="button"
              aria-label={marker.label}
              aria-pressed={active}
              onClick={() => onSelect(active ? null : marker.id)}
              style={{ left: `${position.left}%`, top: `${position.top}%` }}
              className={cn(
                "group absolute -translate-x-1/2 -translate-y-full cursor-pointer pb-2 outline-none transition-transform",
                highlighted ? "z-20 scale-115" : "z-10 hover:scale-110",
              )}
            >
              <span
                className={cn(
                  "grid size-7 place-items-center rounded-full shadow-[0_4px_10px_rgba(16,24,40,0.25)] ring-offset-2 group-focus-visible:ring-2 group-focus-visible:ring-brand-500 sm:size-9",
                  tone.body,
                  active && "outline-4 outline-brand-200/80 dark:outline-brand-700/70",
                )}
              >
                <Icon name={marker.icon} className="size-3.5 sm:size-4.5" strokeWidth={2.2} />
              </span>
              <span
                aria-hidden="true"
                className={cn(
                  "absolute bottom-0 left-1/2 -translate-x-1/2 border-x-[6px] border-t-[9px] border-x-transparent",
                  tone.tip,
                )}
              />
            </button>
          );
        })}

        {selected && popup && renderPopup ? (
          <div
            className="pointer-events-none absolute z-30 w-[min(320px,85%)]"
            style={{
              left: `${clamp(popup.left, 26, 74)}%`,
              top: `${popup.top}%`,
              // Above the pin when ~260px fit above it, else below.
              transform:
                (popup.top / 100) * (size.height || 400) > 260
                  ? "translate(-50%, calc(-100% - 52px))"
                  : "translate(-50%, 14px)",
            }}
          >
            <div className="pointer-events-auto rounded-2xl border border-zinc-100 bg-white p-3 shadow-[0_12px_32px_rgba(16,24,40,0.18)] dark:border-white/10 dark:bg-zinc-900">
              {renderPopup(selected.id, () => onSelect(null))}
            </div>
          </div>
        ) : null}
      </div>

      {topLeft ? <div className="absolute top-2 left-2 z-30 sm:top-3 sm:left-3">{topLeft}</div> : null}

      {offMap.length > 0 ? (
        <p className="absolute top-2 right-2 z-30 rounded-full border border-zinc-200 bg-white/95 px-2.5 py-1 text-[11px] font-medium text-zinc-600 shadow-sm sm:top-3 sm:right-3 sm:px-3 sm:py-1.5 sm:text-xs dark:border-white/10 dark:bg-zinc-900/95 dark:text-zinc-300">
          {offMap.length} hors carte : {[...new Set(offMap.map((marker) => marker.place))].join(", ")}
        </p>
      ) : null}

      {legend && legend.length > 0 ? (
        <ul
          aria-label="Légende"
          className="absolute bottom-3 left-3 z-30 hidden flex-wrap gap-x-4 gap-y-1 rounded-2xl border border-zinc-200 bg-white/95 px-3.5 py-2 text-xs font-medium text-zinc-600 shadow-sm sm:flex dark:border-white/10 dark:bg-zinc-900/95 dark:text-zinc-300"
        >
          {legend.map((item) => (
            <li key={item.label} className="flex items-center gap-1.5">
              <span className={cn("size-2.5 rounded-full", pinTones[item.tone].legend)} /> {item.label}
            </li>
          ))}
        </ul>
      ) : null}

      <div className="absolute right-3 bottom-3 z-30 flex flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm dark:border-white/10 dark:bg-zinc-900">
        <MapButton label="Zoomer" icon="plus" disabled={zoomIndex === ZOOMS.length - 1} onClick={() => zoomTo(zoomIndex + 1)} />
        <MapButton label="Dézoomer" icon="minus" disabled={zoomIndex === 0} onClick={() => zoomTo(zoomIndex - 1)} />
        <MapButton
          label="Vue d'ensemble"
          icon="expand"
          disabled={zoomIndex === 0}
          onClick={() => {
            setZoomIndex(0);
            setCenter({ x: W / 2, y: H / 2 });
          }}
        />
      </div>
    </section>
  );
}

function MapButton({
  label,
  icon,
  disabled,
  onClick,
}: {
  label: string;
  icon: IconName;
  disabled: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "grid size-8 cursor-pointer place-items-center border-b border-zinc-100 text-zinc-700 last:border-b-0 hover:bg-zinc-50 disabled:cursor-default disabled:text-zinc-300 sm:size-10 dark:border-white/10 dark:text-zinc-200 dark:hover:bg-white/5 dark:disabled:text-zinc-600",
        focusRing,
      )}
    >
      <Icon name={icon} className="size-4 sm:size-5" strokeWidth={2} />
    </button>
  );
}

const mainRoads = [
  "M0,598 Q500,520 1000,414",
  "M445,515 C440,400 410,230 380,0",
  "M430,505 C340,430 200,340 0,280",
  "M300,560 C300,430 540,360 660,470",
  "M600,470 C720,400 850,330 1000,290",
];

const streets = [
  "M200,590 C220,450 260,300 300,0",
  "M0,430 C200,420 380,380 520,300 S800,200 1000,180",
  "M560,0 C560,150 580,300 600,470",
  "M700,0 C690,150 720,300 760,430",
  "M100,0 C160,150 200,250 260,600",
  "M300,180 C450,170 650,160 1000,120",
  "M0,520 C150,500 300,470 445,515",
  "M820,0 C800,150 820,300 860,420",
];

const places = [
  { label: "Agoè", x: 470, y: 120 },
  { label: "Adidogomé", x: 120, y: 230 },
  { label: "Tokoin", x: 330, y: 400 },
  { label: "Bè", x: 640, y: 430 },
  { label: "Baguida", x: 900, y: 330 },
];

function MapBackground({ viewBox }: { viewBox: string }) {
  return (
    <svg viewBox={viewBox} aria-hidden="true" className="absolute inset-0 size-full" preserveAspectRatio="none">
      <rect x={-2000} y={-2000} width={5000} height={5000} className="fill-[#f3f5f2] dark:fill-zinc-900" />
      <path d="M380,0 C420,60 520,90 560,0 Z M60,90 C120,60 200,120 160,170 C110,200 40,150 60,90 Z" className="fill-[#e4eedb] dark:fill-emerald-950/40" />
      <path d="M520,497 C600,480 700,468 820,441 C700,470 600,486 520,505 Z" className="fill-sky-200 dark:fill-sky-900/60" />
      <g fill="none" strokeLinecap="round">
        {streets.map((d) => (
          <path key={d} d={d} strokeWidth="1.5" vectorEffect="non-scaling-stroke" className="stroke-white dark:stroke-zinc-800" />
        ))}
        {mainRoads.map((d) => (
          <g key={d}>
            <path d={d} strokeWidth="6" vectorEffect="non-scaling-stroke" className="stroke-white dark:stroke-zinc-700" />
            <path d={d} strokeWidth="3" vectorEffect="non-scaling-stroke" className="stroke-amber-200 dark:stroke-zinc-600" />
          </g>
        ))}
      </g>
      <path d="M-2000,925 L0,617 Q500,540 1000,435 L3000,15 L3000,3000 L-2000,3000 Z" className="fill-sky-200/80 dark:fill-sky-950" />
      <path d="M-2000,925 L0,617 Q500,540 1000,435 L3000,15" fill="none" strokeWidth="2" vectorEffect="non-scaling-stroke" className="stroke-sky-300 dark:stroke-sky-800" />
      <g className="fill-zinc-500" fontSize="15" fontWeight="500">
        {places.map((place) => (
          <text key={place.label} x={place.x} y={place.y} textAnchor="middle">
            {place.label}
          </text>
        ))}
      </g>
      <text x="505" y="455" textAnchor="middle" fontSize="38" fontWeight="700" className="fill-zinc-800 dark:fill-zinc-300">
        Lomé
      </text>
      <text x="780" y="610" textAnchor="middle" fontSize="16" fontStyle="italic" className="fill-sky-700/70 dark:fill-sky-400/60">
        Golfe de Guinée
      </text>
    </svg>
  );
}
