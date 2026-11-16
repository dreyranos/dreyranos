import { useEffect, useState } from 'react';
import { MessageCircle, Mail, Sun, Moon, Globe, ArrowDownRight } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { CONTACT_INFO, COPY, type Lang, type Theme } from '../data/portfolioData';

interface HeroSectionProps {
  lang: Lang;
  theme: Theme;
  onToggleLang: (lang: Lang) => void;
  onToggleTheme: (theme: Theme) => void;
}

export function HeroSection({ lang, theme, onToggleLang, onToggleTheme }: HeroSectionProps) {
  const t = COPY[lang];
  const [phraseIdx, setPhraseIdx] = useState(0);
  const [imgFailed, setImgFailed] = useState(false);

  useEffect(() => {
    setPhraseIdx(0);
  }, [lang]);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const timer = window.setInterval(() => {
      setPhraseIdx((prev) => (prev + 1) % t.hero.phrases.length);
    }, 3200);

    return () => window.clearInterval(timer);
  }, [t.hero.phrases.length]);

  const whatsappUrl = `https://wa.me/${CONTACT_INFO.whatsappRaw}?text=${encodeURIComponent(
    lang === 'pt'
      ? 'Olá Andrey! Vi seu portfólio e gostaria de conversar sobre uma oportunidade.'
      : 'Hi Andrey! I saw your portfolio and would like to discuss an opportunity.'
  )}`;

  return (
    <section id="topo" className="pt-24 sm:pt-28 lg:pt-32 pb-16 sm:pb-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Utility & Context Strip */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-8 mb-8 border-b border-zinc-200 dark:border-zinc-800/90"
        >
          <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs sm:text-sm font-mono text-zinc-600 dark:text-zinc-400">
            <span className="text-zinc-950 dark:text-zinc-100 font-medium">{t.hero.metaExp}</span>
            <span aria-hidden="true">·</span>
            <span>{t.hero.metaLoc}</span>
            <span aria-hidden="true">·</span>
            <span className="text-blue-600 dark:text-blue-400 font-medium">{t.hero.metaStatus}</span>
          </div>

          <div className="print:hidden flex items-center gap-2 self-start sm:self-auto shrink-0">
            {/* Segmented Language Control */}
            <div
              role="group"
              aria-label="Language"
              className="inline-flex items-center p-1 rounded-lg bg-zinc-200/70 dark:bg-zinc-900 border border-zinc-300/60 dark:border-zinc-800"
            >
              <Globe className="w-3.5 h-3.5 text-zinc-500 dark:text-zinc-400 ml-1.5 mr-1" aria-hidden="true" />
              {(['pt', 'en'] as Lang[]).map((code) => {
                const active = lang === code;
                return (
                  <button
                    key={code}
                    type="button"
                    onClick={() => onToggleLang(code)}
                    className={`relative px-2.5 py-1 min-h-[32px] rounded-md font-mono text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
                      active
                        ? 'text-zinc-950 dark:text-white'
                        : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-zinc-200'
                    }`}
                  >
                    {active && (
                      <motion.span
                        layoutId="lang-active-bg"
                        transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                        className="absolute inset-0 rounded-md bg-white dark:bg-zinc-800 shadow-xs"
                      />
                    )}
                    <span className="relative z-10 uppercase">{code}</span>
                  </button>
                );
              })}
            </div>

            {/* Segmented Theme Control */}
            <div
              role="group"
              aria-label="Theme"
              className="inline-flex items-center p-1 rounded-lg bg-zinc-200/70 dark:bg-zinc-900 border border-zinc-300/60 dark:border-zinc-800"
            >
              {(['light', 'dark'] as Theme[]).map((mode) => {
                const active = theme === mode;
                return (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => onToggleTheme(mode)}
                    className={`relative inline-flex items-center gap-1.5 px-2.5 py-1 min-h-[32px] rounded-md font-mono text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
                      active
                        ? 'text-zinc-950 dark:text-white'
                        : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-zinc-200'
                    }`}
                  >
                    {active && (
                      <motion.span
                        layoutId="theme-active-bg"
                        transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                        className="absolute inset-0 rounded-md bg-white dark:bg-zinc-800 shadow-xs"
                      />
                    )}
                    <span className="relative z-10 inline-flex items-center gap-1.5">
                      {mode === 'light' ? (
                        <Sun className="w-3.5 h-3.5" aria-hidden="true" />
                      ) : (
                        <Moon className="w-3.5 h-3.5" aria-hidden="true" />
                      )}
                      <span>{mode === 'light' ? t.controls.themeLight : t.controls.themeDark}</span>
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </motion.div>

        {/* Asymmetric 2-Column Hero Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
          {/* Left Column: Typography & Primary Actions */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.06, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-7 flex flex-col justify-between space-y-7 order-2 lg:order-1"
          >
            <div className="space-y-5">
              <h1 className="font-display font-bold tracking-tight leading-[1.05] text-[clamp(2.25rem,4.5vw,3.85rem)] text-zinc-950 dark:text-zinc-50">
                Andrey Ramos
                <span className="block mt-2 text-[clamp(1.45rem,2.6vw,2.25rem)] font-semibold text-zinc-600 dark:text-zinc-400 leading-[1.15]">
                  {t.hero.subtitle}
                </span>
              </h1>

              {/* Animated Dynamic Focus Strip */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-3 py-3 px-4 rounded-xl bg-white dark:bg-[#0e0e12] border border-zinc-200 dark:border-zinc-800 overflow-hidden">
                <span className="font-mono text-xs uppercase tracking-wider text-blue-600 dark:text-blue-400 shrink-0">
                  {t.hero.focusLabel}
                </span>
                <span className="hidden sm:inline text-zinc-300 dark:text-zinc-700" aria-hidden="true">
                  /
                </span>
                <div className="relative flex-1 min-h-[20px] flex items-center overflow-hidden">
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={`${lang}-${phraseIdx}`}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                      className="font-mono text-xs sm:text-sm text-zinc-900 dark:text-zinc-100 truncate block w-full"
                    >
                      {t.hero.phrases[phraseIdx]}
                    </motion.span>
                  </AnimatePresence>
                </div>
              </div>

              <p className="text-base sm:text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-2xl">
                {t.hero.bioBefore}
                <strong className="font-semibold text-zinc-950 dark:text-zinc-100">{t.hero.bioStrong1}</strong>
                {t.hero.bioMid}
                <strong className="font-semibold text-zinc-950 dark:text-zinc-100">{t.hero.bioStrong2}</strong>
                {t.hero.bioMid2}
                <strong className="font-semibold text-zinc-950 dark:text-zinc-100">{t.hero.bioStrong3}</strong>
                {t.hero.bioAfter}
              </p>
            </div>

            {/* Action Cluster + Quick Direct Contact Links */}
            <div className="space-y-4 pt-1">
              <div className="print:hidden flex flex-wrap items-center gap-3">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 min-h-[46px] rounded-xl font-semibold text-sm sm:text-base bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-400 text-white dark:text-zinc-950 transition-all duration-150 active:scale-[0.98] whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-600 dark:focus-visible:ring-offset-[#070709]"
                >
                  <MessageCircle className="w-4 h-4 shrink-0" aria-hidden="true" />
                  <span>{t.hero.ctaWhatsapp}</span>
                </a>

                <a
                  href="#contato"
                  className="inline-flex items-center justify-center gap-2 px-5 py-3.5 min-h-[46px] rounded-xl font-semibold text-sm sm:text-base bg-white dark:bg-[#0e0e12] text-zinc-900 dark:text-zinc-100 border border-zinc-200 dark:border-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-600 transition-all duration-150 active:scale-[0.98] whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
                >
                  <span>{t.hero.ctaContact}</span>
                  <ArrowDownRight className="w-4 h-4 shrink-0" aria-hidden="true" />
                </a>
              </div>

              {/* Clean Direct Contact Inline Line */}
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs sm:text-sm font-mono text-zinc-600 dark:text-zinc-400">
                <a
                  href={`mailto:${CONTACT_INFO.email}`}
                  className="inline-flex items-center gap-1.5 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  <Mail className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                  <span>{CONTACT_INFO.email}</span>
                </a>
                <span aria-hidden="true" className="text-zinc-300 dark:text-zinc-700">·</span>
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 hover:text-blue-600 dark:hover:text-blue-400 transition-colors tabular-nums"
                >
                  <MessageCircle className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                  <span>WhatsApp {CONTACT_INFO.whatsappDisplay}</span>
                </a>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Studio Portrait Frame matching height */}
          <motion.div
            initial={{ opacity: 0, scale: 0.97, y: 14 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5 order-1 lg:order-2 flex relative"
          >
            <div className="relative w-full max-w-[440px] mx-auto lg:max-w-none aspect-[4/4.2] lg:aspect-auto lg:h-full min-h-[320px] rounded-2xl overflow-hidden bg-zinc-900 border border-zinc-200 dark:border-zinc-800 group">
              {!imgFailed ? (
                <img
                  src={CONTACT_INFO.avatarUrl}
                  referrerPolicy="no-referrer"
                  alt="Andrey Ramos - Desenvolvedor Full Stack"
                  onError={() => setImgFailed(true)}
                  className="w-full h-full object-cover object-top grayscale contrast-110 transition-transform duration-500 group-hover:scale-[1.03]"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-zinc-900 via-zinc-950 to-zinc-900 text-zinc-100 p-8 text-center">
                  <span className="font-display text-5xl font-bold tracking-tight text-zinc-100">AR</span>
                  <span className="mt-2 font-mono text-xs text-zinc-400 uppercase tracking-widest">
                    Andrey Ramos
                  </span>
                </div>
              )}

              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent pointer-events-none" />
              <div className="absolute bottom-0 inset-x-0 p-5 sm:p-6 transition-transform duration-300 group-hover:-translate-y-0.5">
                <div className="font-display font-bold text-white text-base sm:text-lg leading-tight">
                  Andrey Ramos
                </div>
                <div className="font-mono text-xs text-zinc-300 mt-1">
                  {t.hero.photoCaptionRole}
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Full-Width 4-Column Key Metrics Strip */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.45, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="mt-10 sm:mt-14 grid grid-cols-2 lg:grid-cols-4 border border-zinc-200 dark:border-zinc-800 rounded-2xl bg-white dark:bg-[#0e0e12] divide-y lg:divide-y-0 lg:divide-x divide-zinc-200 dark:divide-zinc-800 overflow-hidden"
        >
          {t.hero.metrics.map((metric, idx) => (
            <div
              key={metric.label}
              className={`p-5 sm:p-6 ${idx % 2 === 1 ? 'border-l lg:border-l-0 border-zinc-200 dark:border-zinc-800' : ''}`}
            >
              <div className="font-display text-xl sm:text-2xl font-bold text-zinc-950 dark:text-zinc-50 tabular-nums tracking-tight">
                {metric.value}
              </div>
              <div className="font-mono text-xs text-zinc-600 dark:text-zinc-400 mt-1">
                {metric.label}
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
