const P = {
  scale: 'M12 3v18M5 8h14M5 8l-2.5 6a3 3 0 0 0 5 0L5 8zm14 0-2.5 6a3 3 0 0 0 5 0L19 8z',
  cluster: 'M7 7a2 2 0 1 0 0 .01M17 6a2 2 0 1 0 0 .01M12 17a2 2 0 1 0 0 .01M9 8.5l2 6M15.5 8l-2.5 7.2',
  pin: 'M12 21s-6-5.2-6-10a6 6 0 0 1 12 0c0 4.8-6 10-6 10zm0-8a2 2 0 1 0 0-4 2 2 0 0 0 0 4z',
  chart: 'M4 20V4M4 20h16M8 16v-4M12 16V8M16 16v-6',
  store: 'M4 9l1.5-5h13L20 9M4 9v11h16V9M4 9a2.7 2.7 0 0 0 5.3 0 2.7 2.7 0 0 0 5.4 0A2.7 2.7 0 0 0 20 9M10 20v-5h4v5',
  up: 'M4 16l6-6 4 4 6-7M15 7h5v5',
  down: 'M4 8l6 6 4-4 6 7M15 17h5v-5',
  truck: 'M3 6h11v10H3zM14 9h4l3 3v4h-7M7 19a1.7 1.7 0 1 0 0 .01M17 19a1.7 1.7 0 1 0 0 .01',
  layers: 'M12 3l9 5-9 5-9-5 9-5zM3 13l9 5 9-5',
  search: 'M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14zM20 20l-4-4',
  map: 'M9 4L3 6v14l6-2 6 2 6-2V4l-6 2-6-2zM9 4v14M15 6v14',
  alert: 'M12 8v5M12 17v.01M10.3 4.3L2.7 18a2 2 0 0 0 1.7 3h15.2a2 2 0 0 0 1.7-3L13.7 4.3a2 2 0 0 0-3.4 0z',
  home: 'M4 11l8-7 8 7M6 10v10h12V10',
  download: 'M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3',
  filter: 'M22 3H2l8 9.46V19l4 2v-8.54L22 3z',
  check: 'M20 6L9 17l-5-5',
  refresh: 'M23 4v6h-6M1 20v-6h6M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15',
  chevronRight: 'M9 18l6-6-6-6',
  chevronDown: 'M6 9l6 6 6-6',
  info: 'M12 16v-4M12 8h.01M22 12A10 10 0 1 1 2 12a10 10 0 0 1 20 0z',
  sparkles: 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z',
  cross: 'M18 6L6 18M6 6l12 12',
  arrowLeft: 'M19 12H5M12 19l-7-7 7-7',
}
export default function Icon({ name, size = 22, className = '' }) {
  const path = P[name] || P.info
  return (
    <svg
      className={`icon ${className}`}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={path} />
    </svg>
  )
}
