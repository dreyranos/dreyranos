import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ArrowUpRight } from 'lucide-react';
import { PROFILE } from '../data/portfolio';
import { smoothScrollTo, useActiveSection } from '../utils/navigation';
import { RollingText } from './AquaEffects';

const NAV_LINKS = [
  { href: '#sobre', id: 'sobre', num: '01', label: 'Sobre' },
  { href: '#projetos', id: 'projetos', num: '02', label: 'Projetos' },
  { href: '#atuacao', id: 'atuacao', num: '03', label: 'Atuação' },
  { href: '#trajetoria', id: 'trajetoria', num: '04', label: 'Trajetória' },
  { href: '#depoimentos', id: 'depoimentos', num: '05', label: 'Depoimentos' },
  { href: '#contato', id: 'contato', num: '06', label: 'Contato' },
] as const;

export default function Navbar() {
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
          ? 'bg-[#060609]/94 backdrop-blur-md border-b border-[#4C1D95]/35 shadow-[0_6px_28px_rgba(0,0,0,0.55)]'
          : 'bg-[#060609] border-b border-white/10'
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
          className="inline-flex items-baseline gap-2.5 whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#826BC2]"
        >
          <span className="inline-block w-2 h-2 bg-[#5B21B6] shrink-0 self-center" />
          <span className="font-display text-[16px] sm:text-[18px] font-bold tracking-tight text-white">
            <RollingText text={PROFILE.name} />
          </span>
          <span className="hidden xl:inline font-mono-tabular text-[11px] text-[#8E89A3]">
            {PROFILE.handle}
          </span>
        </a>

        {/* Zone 2: Desktop Single-Line Links (lg+) */}
        <nav
          aria-label="Navegação principal"
          className="hidden lg:flex items-center gap-5 xl:gap-7 text-[13.5px] xl:text-[14px] font-medium text-[#A49EB8]"
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
                className={`relative py-2 whitespace-nowrap shrink-0 transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#826BC2] ${
                  isActive
                    ? 'text-white font-semibold'
                    : 'hover:text-[#9B86D6]'
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
                    className="absolute left-0 right-0 -bottom-0.5 h-[2px] bg-[#5B21B6]"
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
          className="hidden sm:inline-flex lg:hidden items-center gap-2 px-3 py-1.5 border border-[#4C1D95]/40 bg-[#100D18] hover:border-[#826BC2] text-xs font-mono-tabular text-[#F5F4FA] transition-colors whitespace-nowrap shrink-0"
        >
          <span className="text-[#9B86D6] font-semibold">{activeItem.num}</span>
          <span className="text-[#8E89A3]" aria-hidden="true">
            ·
          </span>
          <span className="font-sans font-medium">{activeItem.label}</span>
        </button>

        {/* Zone 3: Single Primary Action + Clean Unified Menu Trigger (<lg) */}
        <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
          <a
            href="#contato"
            onClick={(e) => {
              e.preventDefault();
              handleNavClick('#contato');
            }}
            className="hidden sm:inline-flex items-center justify-center gap-1.5 px-4 lg:px-5 h-[38px] lg:h-[40px] text-[12.5px] lg:text-[13px] font-semibold tracking-tight bg-[#4C1D95] text-white hover:bg-[#5B21B6] transition-colors duration-200 whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#826BC2]"
          >
            <RollingText text="Conversar" />
            <ArrowUpRight className="w-3.5 h-3.5 shrink-0" />
          </a>

          <button
            type="button"
            onClick={openUnifiedDrawer}
            aria-label="Abrir menu de navegação"
            className="lg:hidden inline-flex items-center gap-2.5 px-3 sm:px-3.5 h-[38px] bg-[#100D18] text-[#F5F4FA] border border-[#4C1D95]/45 hover:bg-[#4C1D95] hover:text-white hover:border-[#826BC2] transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#826BC2]"
          >
            <span className="font-mono-tabular text-[11px] font-semibold uppercase tracking-[0.12em]">
              Menu
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
