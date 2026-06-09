import type { SVGProps } from "react";

export const HomeIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    aria-hidden="true"
    fill="none"
    focusable="false"
    height="20"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth="2"
    viewBox="0 0 24 24"
    width="20"
    {...props}
  >
    <path d="m3 11 9-8 9 8" />
    <path d="M5 10v10h14V10" />
    <path d="M9 20v-6h6v6" />
  </svg>
);

export const SettingsIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    aria-hidden="true"
    fill="none"
    focusable="false"
    height="20"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth="2"
    viewBox="0 0 24 24"
    width="20"
    {...props}
  >
    <path d="M4 7h4" />
    <path d="M12 7h8" />
    <path d="M10 5v4" />
    <path d="M4 17h8" />
    <path d="M16 17h4" />
    <path d="M14 15v4" />
  </svg>
);
