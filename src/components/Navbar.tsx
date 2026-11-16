import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ArrowUpRight, Moon, Sun } from 'lucide-react';
import { smoothScrollTo, useActiveSection } from '../utils/navigation';
import { RollingText } from './AquaEffects';
import { useContent, usePrefs } from '../prefs';

export default function Navbar() {
  const { ui, profile: PROFILE } = useContent();
  const { lang, theme, setLang, setTheme } = usePrefs();
  const NAV_LINKS = ui.nav;
  const [scrolled, setScrolled] = useState(false);
  const activeSection = useActiveSection();

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 24);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleNavClick = (href: string) => {
    smoothScrollTo(href);
  };

  const openUnifiedDrawer = () => {
    window.dispatchEvent(new CustomEvent('portfolio:open-drawer'));
  };

  const activeItem =
    NAV_LINKS.find((item) => item.id === activeSection) ?? NAV_LINKS[0];

  return (
    <header
      className={`sticky top-0 z-40 transition-all duration-300 ${
        scrolled
          ? 'bg-[var(--bg)]/94 backdrop-blur-md border-b border-[var(--line)]/35 shadow-[0_6px_28px_rgba(0,0,0,0.55)]'
          : 'bg-[var(--bg)] border-b border-[var(--line)]'
      }`}
    >
      <div className="max-w-[1380px] mx-auto px-4 sm:px-8 lg:px-14 h-[62px] sm:h-[68px] flex items-center justify-between gap-3 sm:gap-6">
        {/* Zone 1: Editorial Wordmark */}
        <a
          href="#topo"
          onClick={(e) => {
            e.preventDefault();
            smoothScrollTo('#topo', 0);
          }}
          className="inline-flex items-baseline gap-2.5 whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--line)]"
        >
          <span className="inline-block w-2 h-2 bg-[var(--soft)] shrink-0 self-center" />
          <span className="font-display text-[16px] sm:text-[18px] font-bold tracking-tight text-[var(--fg)]">
            <RollingText text={PROFILE.name} />
          </span>
          <span className="hidden xl:inline font-mono-tabular text-[11px] text-[var(--muted)]">
            {PROFILE.handle}
          </span>
        </a>

        {/* Zone 2: Desktop Single-Line Links (lg+) */}
        <nav
          aria-label="Navegação principal"
          className="hidden lg:flex items-center gap-5 xl:gap-7 text-[13.5px] xl:text-[14px] font-medium text-[var(--soft)]"
        >
          {NAV_LINKS.map((link) => {
            const isActive = activeSection === link.id;
            return (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick(link.href);
                }}
                className={`relative py-2 whitespace-nowrap shrink-0 transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--line)] ${
                  isActive
                    ? 'text-[var(--fg)] font-semibold'
                    : 'hover:text-[var(--soft)]'
                }`}
              >
                <RollingText text={link.label} />
                {isActive && (
                  <motion.span
                    layoutId="navActiveUnderline"
                    transition={{
                      type: 'spring',
                      stiffness: 380,
                      damping: 32,
                    }}
                    className="absolute left-0 right-0 -bottom-0.5 h-[2px] bg-[var(--soft)]"
                  />
                )}
              </a>
            );
          })}
        </nav>

        {/* Balanced Multi-View Center Readout (Tablet / Split View: sm..md) */}
        <button
          type="button"
          onClick={openUnifiedDrawer}
          aria-label="Abrir índice de seções"
          className="hidden sm:inline-flex lg:hidden items-center gap-2 px-3 py-1.5 border border-[var(--line)]/40 bg-[var(--bg)] hover:border-[var(--line)] text-xs font-mono-tabular text-[var(--fg)] transition-colors whitespace-nowrap shrink-0"
        >
          <span className="text-[var(--soft)] font-semibold">{activeItem.num}</span>
          <span className="text-[var(--muted)]" aria-hidden="true">
            ·
          </span>
          <span className="font-sans font-medium">{activeItem.label}</span>
        </button>

        {/* Zone 3: Single Primary Action + Clean Unified Menu Trigger (<lg) */}
        <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              aria-label={theme === 'dark' ? ui.light : ui.dark}
              title={theme === 'dark' ? ui.light : ui.dark}
              className="inline-flex items-center justify-center w-9 h-9 border border-[var(--line)] text-[var(--fg)] hover:bg-[var(--wash)] transition-colors"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            <button
              type="button"
              onClick={() => setLang(lang === 'pt' ? 'en' : 'pt')}
              aria-label={ui.langLabel}
              className="inline-flex items-center justify-center h-9 px-2.5 border border-[var(--line)] text-[11px] font-mono-tabular font-semibold tracking-wider text-[var(--fg)] hover:bg-[var(--wash)] transition-colors"
            >
              {lang === 'pt' ? 'EN' : 'PT'}
            </button>
          </div>
          <a
            href="#contato"
            onClick={(e) => {
              e.preventDefault();
              handleNavClick('#contato');
            }}
            className="hidden sm:inline-flex items-center justify-center gap-1.5 px-4 lg:px-5 h-[38px] lg:h-[40px] text-[12.5px] lg:text-[13px] font-semibold tracking-tight bg-[var(--btn)] text-[var(--btn-fg)] hover:bg-[var(--soft)] transition-colors duration-200 whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--line)]"
          >
            <RollingText text={ui.talk} />
            <ArrowUpRight className="w-3.5 h-3.5 shrink-0" />
          </a>

          <button
            type="button"
            onClick={openUnifiedDrawer}
            aria-label={ui.openMenu}
            className="lg:hidden inline-flex items-center gap-2.5 px-3 sm:px-3.5 h-[38px] bg-[var(--bg)] text-[var(--fg)] border border-[var(--line)]/45 hover:bg-[var(--card)] hover:text-[var(--fg)] hover:border-[var(--line)] transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--line)]"
          >
            <span className="font-mono-tabular text-[11px] font-semibold uppercase tracking-[0.12em]">
              {ui.menu}
            </span>
            <span className="flex flex-col gap-[4px] w-4" aria-hidden="true">
              <span className="block w-full h-[1.5px] bg-current" />
              <span className="block w-3/4 h-[1.5px] bg-current self-end" />
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}
