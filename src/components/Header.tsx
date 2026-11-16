import { useState, type MouseEvent } from 'react';
import { Menu, X, ArrowUpRight } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { COPY, type Lang } from '../data/portfolioData';
import { AmbientSoundToggle } from './AmbientSoundToggle';

interface HeaderProps {
  lang: Lang;
  isNotFound?: boolean;
  onNavigateHome?: (sectionHash?: string) => void;
}

export function Header({ lang, isNotFound = false, onNavigateHome }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const t = COPY[lang];

  const navItems = [
    { href: '#projetos', label: t.nav.projects },
    { href: '#sobre', label: t.nav.about },
    { href: '#arquitetura', label: t.nav.arch },
    { href: '#experiencia', label: t.nav.exp },
    { href: '#github', label: t.nav.github },
  ];

  const handleLinkClick = (e: MouseEvent<HTMLAnchorElement>, href: string) => {
    setMobileMenuOpen(false);
    if (isNotFound && onNavigateHome) {
      e.preventDefault();
      onNavigateHome(href);
    }
  };

  return (
    <header className="fixed top-0 inset-x-0 z-50 bg-[var(--btn)]/85 dark:bg-[var(--bg)]/85 backdrop-blur-md border-b border-zinc-200/80 dark:border-zinc-800/80">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-14 sm:h-16 flex items-center justify-between gap-4 md:gap-8">
        {/* Zone 1: Single-line Brand Wordmark */}
        <a
          href="#topo"
          onClick={(e) => handleLinkClick(e, '#topo')}
          className="font-display font-bold text-base sm:text-lg tracking-tight text-zinc-950 dark:text-zinc-50 whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:focus-visible:ring-blue-400 rounded-md"
        >
          Andrey Ramos
        </a>

        {/* Zone 2: Clean single-line typography navigation links */}
        <nav className="hidden md:flex items-center gap-6 lg:gap-7 text-sm font-medium text-zinc-600 dark:text-zinc-400">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={(e) => handleLinkClick(e, item.href)}
              className="whitespace-nowrap shrink-0 py-1 hover:text-zinc-950 dark:hover:text-[var(--fg)] transition-colors duration-150 border-b border-transparent hover:border-zinc-950/40 dark:hover:border-white/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:focus-visible:ring-blue-400 rounded-sm"
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* Zone 3: Ambient Sound Toggle + Primary Action + Mobile Menu Trigger */}
        <div className="flex items-center gap-2 shrink-0">
          <AmbientSoundToggle lang={lang} />

          <a
            href="#contato"
            onClick={(e) => handleLinkClick(e, '#contato')}
            className="inline-flex items-center gap-1.5 px-4 py-2 min-h-[40px] rounded-lg text-xs sm:text-sm font-semibold bg-zinc-950 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-white text-[var(--fg)] dark:text-zinc-950 transition-all duration-150 active:scale-[0.98] whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-600 dark:focus-visible:ring-offset-[#050507]"
          >
            <span>{t.nav.contact}</span>
            <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
          </a>

          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-label={mobileMenuOpen ? t.controls.menuClose : t.controls.menuOpen}
            aria-expanded={mobileMenuOpen}
            className="md:hidden inline-flex items-center justify-center w-11 h-11 rounded-lg border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Animated Mobile Navigation Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            className="md:hidden border-t border-zinc-200 dark:border-zinc-800 bg-[var(--btn)]/95 dark:bg-[var(--bg)]/95 backdrop-blur-lg px-4 py-3"
          >
            <nav className="flex flex-col space-y-1 max-w-6xl mx-auto">
              {navItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={(e) => handleLinkClick(e, item.href)}
                  className="min-h-[44px] flex items-center px-3 rounded-lg text-sm font-medium text-zinc-800 dark:text-zinc-200 hover:bg-zinc-200/60 dark:hover:bg-zinc-800/70 transition-colors"
                >
                  {item.label}
                </a>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
