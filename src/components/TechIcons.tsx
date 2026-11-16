export function TechIcon({
  id,
  className = 'w-5 h-5',
}: {
  id: string;
  className?: string;
}) {
  switch (id) {
    case 'horse':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className}>
          <path d="M18 4l-3 2-4-1-5 5v3l3 1 1 6h7l-1-6 4-2-1-4 2-2-3-2z" />
          <circle cx="13.5" cy="9" r="0.8" fill="currentColor" />
        </svg>
      );
    case 'dotnet':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className}>
          <polygon points="12 2 21 7 21 17 12 22 3 17 3 7" />
          <path d="M9.5 10.5a2.5 2.5 0 1 0 0 3.5" />
          <path d="M14.5 9.5v5M17 9.5v5M13.5 11h4.5M13.5 13.5h4.5" />
        </svg>
      );
    case 'python':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className}>
          <path d="M12 3c-3.5 0-4 1.5-4 3.5V9h4v1H6.5C4.5 10 3 11.4 3 14s1.3 4 3.5 4H8v-2.2c0-1.7 1.3-2.8 3-2.8h4c1.7 0 3-1.2 3-3V6.5C18 4.5 16.5 3 12 3z" />
          <path d="M12 21c3.5 0 4-1.5 4-3.5V15h-4v-1h5.5c2 0 3.5-1.4 3.5-4s-1.3-4-3.5-4H16v2.2c0 1.7-1.3 2.8-3 2.8H9c-1.7 0-3 1.2-3 3v3.5C6 19.5 7.5 21 12 21z" />
          <circle cx="10" cy="6.2" r="0.7" fill="currentColor" />
          <circle cx="14" cy="17.8" r="0.7" fill="currentColor" />
        </svg>
      );
    case 'bash':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className}>
          <rect x="3" y="4" width="18" height="16" rx="2" />
          <path d="M7.5 9.5L10.5 12l-3 2.5" />
          <path d="M12.5 14.5h4" />
        </svg>
      );
    case 'ts':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className}>
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <path d="M7.5 11.5h5M10 11.5v6" />
          <path d="M17.5 12.2c-.5-.6-1.2-.8-2-.7-1 .1-1.5.7-1.5 1.4 0 1 1 1.3 2 1.7 1 .4 1.7.8 1.7 1.8 0 1-.9 1.6-2 1.6-.9 0-1.6-.3-2.1-.9" />
        </svg>
      );
    case 'js':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className}>
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <path d="M10.5 11.5v4.6c0 1.2-.7 1.9-1.8 1.9-.7 0-1.2-.3-1.5-.8" />
          <path d="M17.5 12.2c-.5-.6-1.2-.8-2-.7-1 .1-1.5.7-1.5 1.4 0 1 1 1.3 2 1.7 1 .4 1.7.8 1.7 1.8 0 1-.9 1.6-2 1.6-.9 0-1.6-.3-2.1-.9" />
        </svg>
      );
    case 'react':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={className}>
          <circle cx="12" cy="12" r="1.8" fill="currentColor" />
          <ellipse cx="12" cy="12" rx="9.5" ry="3.8" />
          <ellipse cx="12" cy="12" rx="9.5" ry="3.8" transform="rotate(60 12 12)" />
          <ellipse cx="12" cy="12" rx="9.5" ry="3.8" transform="rotate(120 12 12)" />
        </svg>
      );
    case 'rn':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={className}>
          <rect x="6" y="2.5" width="12" height="19" rx="2" />
          <circle cx="12" cy="12" r="1.2" fill="currentColor" />
          <ellipse cx="12" cy="12" rx="4.2" ry="1.8" transform="rotate(45 12 12)" />
          <ellipse cx="12" cy="12" rx="4.2" ry="1.8" transform="rotate(-45 12 12)" />
          <path d="M10.5 18.5h3" />
        </svg>
      );
    case 'expo':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
          <path d="M4.5 19.5L11.2 5.2a.9.9 0 0 1 1.6 0l6.7 14.3" />
          <path d="M8.5 15.5l3.5-5.5 3.5 5.5" />
        </svg>
      );
    case 'nw':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className={className}>
          <rect x="6" y="2.5" width="12" height="19" rx="2" />
          <path d="M9 10.5c1-1.4 2.2-1.4 3 0s2 1.4 3 0" />
          <path d="M9 14c1-1.4 2.2-1.4 3 0s2 1.4 3 0" />
        </svg>
      );
    case 'tw':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.85" strokeLinecap="round" strokeLinejoin="round" className={className}>
          <path d="M6.5 10c1-2.8 3.2-4 5.5-3 1.4.6 2 2 3.3 2.5 1.3.5 2.7 0 3.7-1.5-1 2.8-3.2 4-5.5 3-1.4-.6-2-2-3.3-2.5-1.3-.5-2.7 0-3.7 1.5z" />
          <path d="M4 16.5c1-2.8 3.2-4 5.5-3 1.4.6 2 2 3.3 2.5 1.3.5 2.7 0 3.7-1.5-1 2.8-3.2 4-5.5 3-1.4-.6-2-2-3.3-2.5-1.3-.5-2.7 0-3.7 1.5z" />
        </svg>
      );
    case 'ng':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className}>
          <path d="M12 2.5L20 5.5l-1.3 11.2L12 21.5l-6.7-4.8L4 5.5z" />
          <path d="M8.5 16L12 7l3.5 9" />
          <path d="M9.7 13.5h4.6" />
        </svg>
      );
    case 'fmx':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className={className}>
          <rect x="2.5" y="4" width="13" height="10" rx="1.5" />
          <rect x="13" y="9" width="8.5" height="11" rx="1.5" />
          <path d="M6 17h4" />
        </svg>
      );
    case 'vcl':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className={className}>
          <rect x="3" y="4" width="18" height="15" rx="1.5" />
          <path d="M3 8.5h18M9 8.5v10.5M12.5 12.5h5M12.5 15.5h3.5" />
        </svg>
      );
    case 'firebird':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className}>
          <ellipse cx="10.5" cy="6" rx="6.5" ry="2.5" />
          <path d="M4 6v10c0 1.4 2.9 2.5 6.5 2.5" />
          <path d="M4 11c0 1.4 2.9 2.5 6.5 2.5" />
          <path d="M16.5 11.5c2 2 3 3.8 3 5.7a3.5 3.5 0 1 1-7 0c0-1.5.9-3 2.1-4.3.5.9 1.2 1.2 1.9 1.2 0-1 .1-1.9 0-2.6z" />
        </svg>
      );
    case 'linux':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className}>
          <path d="M12 3a4 4 0 0 0-4 4c0 1.6-.8 2.8-1.8 4.4C5 13.3 4.5 15.4 6 17.5c1 1.4 3.2 2 6 2s5-.6 6-2c1.5-2.1 1-4.2-.2-6.1C16.8 9.8 16 8.6 16 7a4 4 0 0 0-4-4z" />
          <circle cx="10.5" cy="7" r="0.6" fill="currentColor" />
          <circle cx="13.5" cy="7" r="0.6" fill="currentColor" />
          <path d="M10.5 9.2l1.5 1 1.5-1" />
          <path d="M7.5 19.5L5.5 21M16.5 19.5l2 1.5" />
        </svg>
      );
    case 'windows':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className={className}>
          <path d="M3.5 5.8L11 4.6v6.7H3.5V5.8z" />
          <path d="M13 4.3L20.5 3v8.3H13V4.3z" />
          <path d="M3.5 12.7H11v6.7l-7.5-1.2v-5.5z" />
          <path d="M13 12.7h7.5V21L13 19.7v-7z" />
        </svg>
      );
    case 'docker':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.65" strokeLinecap="round" strokeLinejoin="round" className={className}>
          <rect x="6" y="9" width="3" height="2.5" />
          <rect x="9.5" y="9" width="3" height="2.5" />
          <rect x="13" y="9" width="3" height="2.5" />
          <rect x="9.5" y="6" width="3" height="2.5" />
          <path d="M3 13.5h15.5c1.5 0 2.5-.8 3-2-.7-.3-1.6-.2-2.2.2-.3-1-1-1.7-1.8-2.2" />
          <path d="M3 13.5c0 3.8 2.8 6.5 7.5 6.5 5.2 0 8.8-2.4 10.5-6.5" />
        </svg>
      );
    case 'git':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className}>
          <circle cx="7" cy="6" r="2.2" />
          <circle cx="7" cy="18" r="2.2" />
          <circle cx="17" cy="9" r="2.2" />
          <path d="M7 8.2v7.6M9.2 17c4 0 7.8-2.2 7.8-5.8" />
        </svg>
      );
    case 'android':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className={className}>
          <path d="M5 13a7 7 0 0 1 14 0v5a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 5 18v-5z" />
          <path d="M5 13h14" />
          <path d="M8.5 7.2L7 4.5M15.5 7.2L17 4.5" />
          <circle cx="9.5" cy="10.2" r="0.8" fill="currentColor" />
          <circle cx="14.5" cy="10.2" r="0.8" fill="currentColor" />
        </svg>
      );
    case 'lineage':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className}>
          <circle cx="12" cy="12" r="2.5" />
          <circle cx="4.5" cy="14" r="2" />
          <circle cx="19.5" cy="14" r="2" />
          <path d="M6.4 13.4c1.2-.5 2.4-.9 3.2-1.1" />
          <path d="M14.4 12.3c.8.2 2 .6 3.2 1.1" />
          <path d="M12 9.5V5.5" />
          <circle cx="12" cy="4.2" r="1.3" />
        </svg>
      );
    case 'mt':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className}>
          <path d="M12 3l8 4-8 4-8-4 8-4z" />
          <path d="M4 12l8 4 8-4" />
          <path d="M4 17l8 4 8-4" />
        </svg>
      );
    case 'ref':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className}>
          <path d="M20 7.5A8.5 8.5 0 0 0 5.5 6.8L4 8.5" />
          <path d="M4 4v4.5h4.5" />
          <path d="M4 16.5a8.5 8.5 0 0 0 14.5.7L20 15.5" />
          <path d="M20 20v-4.5h-4.5" />
          <rect x="9.5" y="9.5" width="5" height="5" />
        </svg>
      );
    case 'auto':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className}>
          <circle cx="9" cy="15" r="3" />
          <path d="M9 10v2M9 18v2M4 15h2M12 15h2M5.5 11.5l1.4 1.4M11.1 17.1l1.4 1.4M5.5 18.5l1.4-1.4M11.1 12.9l1.4-1.4" />
          <path d="M17.5 3.5l-3 5h3.5l-2.5 5" />
        </svg>
      );
    case 'ai':
    default:
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className}>
          <path d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9L12 3z" />
          <circle cx="18.5" cy="18.5" r="1.5" />
          <circle cx="5.5" cy="18.5" r="1.5" />
        </svg>
      );
  }
}
