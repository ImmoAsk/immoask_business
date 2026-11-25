import type { ReactNode, SVGProps } from "react";

const paths = {
  dashboard: (
    <>
      <rect x="3.5" y="3.5" width="7" height="7" rx="1.5" />
      <rect x="13.5" y="3.5" width="7" height="7" rx="1.5" />
      <rect x="3.5" y="13.5" width="7" height="7" rx="1.5" />
      <rect x="13.5" y="13.5" width="7" height="7" rx="1.5" />
    </>
  ),
  cash: (
    <>
      <rect x="2.5" y="6" width="19" height="12" rx="2" />
      <circle cx="12" cy="12" r="2.5" />
      <path d="M6 9.5v5M18 9.5v5" />
    </>
  ),
  wallet: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M21 10h-5a2 2 0 0 0 0 4h5" />
      <path d="M3 9h12" />
    </>
  ),
  building: (
    <>
      <path d="M4 21V5a1.5 1.5 0 0 1 1.5-1.5h8A1.5 1.5 0 0 1 15 5v16" />
      <path d="M15 10h3.5A1.5 1.5 0 0 1 20 11.5V21M2.5 21h19" />
      <path d="M8 7.5h3M8 11h3M8 14.5h3M8 21v-3h3v3" />
    </>
  ),
  users: (
    <>
      <circle cx="9" cy="8" r="3.5" />
      <path d="M2.5 20c.6-3.4 3.2-5.5 6.5-5.5s5.9 2.1 6.5 5.5" />
      <path d="M15.5 4.8a3.5 3.5 0 0 1 0 6.4M18 14.8c1.9.8 3.1 2.6 3.5 5.2" />
    </>
  ),
  key: (
    <>
      <circle cx="8" cy="15" r="4.5" />
      <path d="M11.2 11.8 20 3M16.5 6.5l2.5 2.5M14 9l2 2" />
    </>
  ),
  file: (
    <>
      <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" />
      <path d="M14 3v5h5M9 13h6M9 17h6" />
    </>
  ),
  clipboard: (
    <>
      <rect x="5" y="4.5" width="14" height="16.5" rx="2" />
      <path d="M9 3h6v3H9zM9 11h6M9 15h6" />
    </>
  ),
  wrench: (
    <path d="M14.5 6.5a4 4 0 0 0-5 5L3.5 17.5a2 2 0 0 0 3 3l6-6a4 4 0 0 0 5-5l-2.5 2.5-2.5-.5-.5-2.5z" />
  ),
  calendar: (
    <>
      <rect x="3.5" y="5" width="17" height="15.5" rx="2" />
      <path d="M3.5 10h17M8 3v4M16 3v4" />
    </>
  ),
  calendarCheck: (
    <>
      <rect x="3.5" y="5" width="17" height="15.5" rx="2" />
      <path d="M3.5 10h17M8 3v4M16 3v4M9 15l2 2 4-4" />
    </>
  ),
  bank: <path d="M3 10l9-6 9 6M5 10v8M9 10v8M15 10v8M19 10v8M3 20h18" />,
  shield: (
    <>
      <path d="M12 3l8 3v6c0 4.5-3.2 7.8-8 9-4.8-1.2-8-4.5-8-9V6z" />
      <path d="M8.5 12l2.5 2.5 4.5-5" />
    </>
  ),
  receipt: (
    <>
      <path d="M5 3h14v18l-2.5-1.5L14 21l-2-1.5L10 21l-2.5-1.5L5 21z" />
      <path d="M9 8h6M9 12h6M9 16h3" />
    </>
  ),
  book: (
    <>
      <path d="M12 6.5C10 5 7 4.5 3 5v13c4-.5 7 0 9 1.5 2-1.5 5-2 9-1.5V5c-4-.5-7 0-9 1.5z" />
      <path d="M12 6.5v13" />
    </>
  ),
  search: (
    <>
      <circle cx="11" cy="11" r="6.5" />
      <path d="M20 20l-4.3-4.3" />
    </>
  ),
  clipboardCheck: (
    <>
      <rect x="5" y="4.5" width="14" height="16.5" rx="2" />
      <path d="M9 3h6v3H9zM9 13.5l2 2 4-4" />
    </>
  ),
  trendUp: <path d="M3 17l6-6 4 4 8-8M15 7h6v6" />,
  clock: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5V12l3 2" />
    </>
  ),
  checkCircle: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M8.5 12.5l2.5 2.5 4.5-5" />
    </>
  ),
  badgeCheck: (
    <>
      <path d="M12 2.8l2.3 1.7 2.8-.2.9 2.7 2.4 1.5-.9 2.7.9 2.6-2.4 1.6-.9 2.7-2.8-.2L12 20l-2.3-1.7-2.8.2-.9-2.7-2.4-1.6.9-2.6-.9-2.7 2.4-1.5.9-2.7 2.8.2z" />
      <path d="M9 11.5l2 2 4-4" />
    </>
  ),
  arrowRight: <path d="M5 12h14M13 6l6 6-6 6" />,
  mail: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M3.5 6.5l8.5 6 8.5-6" />
    </>
  ),
  lock: (
    <>
      <rect x="4.5" y="10.5" width="15" height="10" rx="2" />
      <path d="M8 10.5V7.5a4 4 0 0 1 8 0v3M12 14.5v2" />
    </>
  ),
  eye: (
    <>
      <path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z" />
      <circle cx="12" cy="12" r="3" />
    </>
  ),
  eyeOff: (
    <>
      <path d="M10 5.7a9.8 9.8 0 0 1 2-.2c6 0 9.5 6.5 9.5 6.5a17 17 0 0 1-2.6 3.4M6.2 7.2A16.5 16.5 0 0 0 2.5 12S6 18.5 12 18.5a9.4 9.4 0 0 0 4.6-1.2" />
      <path d="M9.9 9.9a3 3 0 0 0 4.2 4.2M3 3l18 18" />
    </>
  ),
  chevronDown: <path d="M6 9l6 6 6-6" />,
  bell: (
    <>
      <path d="M6 16V11a6 6 0 1 1 12 0v5l1.5 2h-15z" />
      <path d="M10 20.5a2 2 0 0 0 4 0" />
    </>
  ),
  sun: (
    <>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
    </>
  ),
  moon: <path d="M20.5 14.5A8.5 8.5 0 0 1 9.5 3.5a8.5 8.5 0 1 0 11 11z" />,
  menu: <path d="M4 6h16M4 12h16M4 18h16" />,
  close: <path d="M6 6l12 12M18 6L6 18" />,
  moreVertical: (
    <>
      <circle cx="12" cy="5.5" r="1" />
      <circle cx="12" cy="12" r="1" />
      <circle cx="12" cy="18.5" r="1" />
    </>
  ),
  home: (
    <>
      <path d="M3.5 11 12 4l8.5 7" />
      <path d="M5.5 9.5V20h13V9.5M10 20v-5h4v5" />
    </>
  ),
  store: (
    <>
      <path d="M4 9.5 5.5 4h13L20 9.5" />
      <path d="M4 9.5a2.7 2.7 0 0 0 5.3 0 2.7 2.7 0 0 0 5.4 0 2.7 2.7 0 0 0 5.3 0" />
      <path d="M5.5 12v8h13v-8M10 20v-4.5h4V20" />
    </>
  ),
  sofa: (
    <>
      <path d="M5 11V8a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v3" />
      <path d="M3 13a2 2 0 0 1 4 0v2h10v-2a2 2 0 0 1 4 0v5H3zM5 18v2M19 18v2" />
    </>
  ),
  trees: (
    <>
      <path d="M3 20h18M7.5 20v-4M16 20v-5" />
      <path d="M7.5 16 4 15.5 7.5 7l3.5 8.5z" />
      <circle cx="16" cy="11" r="3.5" />
    </>
  ),
  mapPin: (
    <>
      <path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21z" />
      <circle cx="12" cy="9.5" r="2.5" />
    </>
  ),
  map: (
    <>
      <path d="M9 4 3.5 6v14L9 18l6 2 5.5-2V4L15 6z" />
      <path d="M9 4v14M15 6v14" />
    </>
  ),
  list: <path d="M9 6h11M9 12h11M9 18h11M4.5 6h.01M4.5 12h.01M4.5 18h.01" />,
  filter: <path d="M3.5 5h17l-6.5 8v5.5l-4 2V13z" />,
  sort: <path d="M7 4v16M3.5 16.5 7 20l3.5-3.5M13.5 6H21M13.5 11h5.5M13.5 16H17" />,
  bed: (
    <>
      <path d="M3 18V6M3 13h18v5M21 13v-1.5a3 3 0 0 0-3-3h-7V13" />
      <circle cx="7" cy="10" r="1.5" />
    </>
  ),
  surface: (
    <>
      <rect x="3.5" y="3.5" width="17" height="17" rx="2" />
      <path d="M3.5 9H7M3.5 14H7M9 3.5V7M14 3.5V7" />
    </>
  ),
  sparkles: (
    <>
      <path d="M11 3.5 12.7 8.3 17.5 10l-4.8 1.7L11 16.5l-1.7-4.8L4.5 10l4.8-1.7z" />
      <path d="M18.5 15v5M16 17.5h5" />
    </>
  ),
  plus: <path d="M12 5v14M5 12h14" />,
  minus: <path d="M5 12h14" />,
  chevronLeft: <path d="M15 6l-6 6 6 6" />,
  chevronRight: <path d="M9 6l6 6-6 6" />,
  expand: <path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5" />,
  reset: (
    <>
      <path d="M4 4v5h5" />
      <path d="M4.6 13.5A7.5 7.5 0 1 0 6.5 6.5L4 9" />
    </>
  ),
  download: <path d="M12 4v11M7 10l5 5 5-5M5 20h14" />,
  whatsapp: (
    <>
      <path d="M4 20l1.2-3.6A8.5 8.5 0 1 1 8 19.1z" />
      <path d="M9 8.5c0 3.2 2.3 5.9 5.5 6.5l1-1.6-2-1-.9.8a4.5 4.5 0 0 1-2.3-2.3l.8-.9-1-2-1.6 1z" />
    </>
  ),
  phone: <path d="M5 3.5h3.5l1.5 4.5-2.3 1.4a11 11 0 0 0 5 5l1.4-2.3 4.5 1.5V17a2.5 2.5 0 0 1-2.5 2.5A15.5 15.5 0 0 1 2.5 6 2.5 2.5 0 0 1 5 3.5z" />,
  alert: (
    <>
      <path d="M10.3 4.2 2.8 17.5A2 2 0 0 0 4.5 20.5h15a2 2 0 0 0 1.7-3L13.7 4.2a2 2 0 0 0-3.4 0z" />
      <path d="M12 9.5v4.5M12 17.2h.01" />
    </>
  ),
  hourglass: <path d="M6.5 3.5h11M6.5 20.5h11M7.5 3.5c0 4.5 4.5 5.5 4.5 8.5s-4.5 4-4.5 8.5M16.5 3.5c0 4.5-4.5 5.5-4.5 8.5s4.5 4 4.5 8.5" />,
  sliders: (
    <>
      <path d="M4 6h9M17 6h3M4 12h3M11 12h9M4 18h11M19 18h1" />
      <circle cx="15" cy="6" r="2" />
      <circle cx="9" cy="12" r="2" />
      <circle cx="17" cy="18" r="2" />
    </>
  ),
  externalLink: <path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5" />,
  pieChart: (
    <>
      <path d="M20.5 13.5A8.5 8.5 0 1 1 10.5 3.6" />
      <path d="M13.5 3.6a8.5 8.5 0 0 1 6.9 6.9h-6.9z" />
    </>
  ),
  check: <path d="m5 12.5 4.5 4.5L19 7.5" />,
  fridge: <path d="M7 3h10a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1zM6 11h12M9 7v2M9 14v3" />,
  door: <path d="M6 21V4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v17M4 21h16M14.5 12h.01" />,
  smartphone: <path d="M8 3h8a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1zM11 18h2" />,
  droplet: <path d="M12 3c3 4.2 6 7.2 6 10.5a6 6 0 0 1-12 0C6 10.2 9 7.2 12 3z" />,
  bolt: <path d="M13 2.5 4.5 14H11l-1 7.5L18.5 10H12z" />,
  snowflake: <path d="M12 2.5v19M4.2 7l15.6 10M4.2 17 19.8 7M9 3.8l3 2.4 3-2.4M9 20.2l3-2.4 3 2.4" />,
  paintRoller: <path d="M5 4h12v5H5zM17 6.5h2v4h-7v3M10.5 13.5h3v7h-3z" />,
  message: <path d="M4.5 5.5h15a1 1 0 0 1 1 1v9.5a1 1 0 0 1-1 1H10l-4.5 3.5V17h-1a1 1 0 0 1-1-1V6.5a1 1 0 0 1 1-1zM8 10h8M8 13h5" />,
} satisfies Record<string, ReactNode>;

export type IconName = keyof typeof paths;

export type IconProps = SVGProps<SVGSVGElement> & {
  name: IconName;
};

/** 24×24 stroke icon. Size and color come from the parent (`size-5`, `text-…`). */
export function Icon({ name, strokeWidth = 1.75, ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      {paths[name]}
    </svg>
  );
}
