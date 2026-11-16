import { useEffect, useState } from 'react';
import { Printer, X, Mail, Phone, MapPin, Globe, FileText } from 'lucide-react';
import { CONTACT_INFO, COPY, STACK_ITEMS, type Lang } from '../data/portfolioData';

interface ResumePreviewModalProps {
  isOpen: boolean;
  initialLang: Lang;
  onClose: () => void;
}

export function ResumePreviewModal({
  isOpen,
  initialLang,
  onClose,
}: ResumePreviewModalProps) {
  const [resumeLang, setResumeLang] = useState<Lang>(initialLang);

  useEffect(() => {
    if (isOpen) {
      setResumeLang(initialLang);
    }
  }, [isOpen, initialLang]);

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const copy = COPY[resumeLang];
  const r = copy.resume;
  const edu = copy.exp.education;
  const edge = copy.exp.edge;

  const handlePrint = () => {
    const previousTitle = document.title;
    document.title =
      resumeLang === 'pt'
        ? 'Andrey_Ramos_Curriculo_Full_Stack'
        : 'Andrey_Ramos_Resume_Full_Stack';

    const restoreTitle = () => {
      document.title = previousTitle;
      window.removeEventListener('afterprint', restoreTitle);
    };

    window.addEventListener('afterprint', restoreTitle);
    window.print();
    window.setTimeout(restoreTitle, 1000);
  };

  return (
    <div
      id="resume-print-root"
      role="dialog"
      aria-modal="true"
      aria-labelledby="resume-preview-title"
      className="fixed inset-0 z-50 flex flex-col bg-zinc-950/90 backdrop-blur-md print:static print:inset-auto print:bg-white print:backdrop-blur-none"
    >
      {/* Print Preview Top Toolbar */}
      <div className="print:hidden shrink-0 border-b border-zinc-800 bg-zinc-950/95 px-4 sm:px-6 py-3">
        <div className="max-w-5xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-lg bg-zinc-900 border border-zinc-800 text-blue-400 flex items-center justify-center shrink-0">
              <FileText className="w-4 h-4" aria-hidden="true" />
            </div>
            <div className="min-w-0">
              <h2
                id="resume-preview-title"
                className="font-display text-sm sm:text-base font-bold text-zinc-100 truncate"
              >
                {r.toolbarTitle}
              </h2>
              <p className="text-[11px] font-mono text-zinc-400 truncate">
                {CONTACT_INFO.name} · A4 (210 × 297 mm)
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            {/* Resume Language Switcher */}
            <div
              role="group"
              aria-label={r.langSwitchLabel}
              className="inline-flex items-center rounded-lg border border-zinc-800 bg-zinc-900 p-0.5 text-xs font-mono"
            >
              <button
                type="button"
                onClick={() => setResumeLang('pt')}
                className={`px-2.5 py-1.5 rounded-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 ${
                  resumeLang === 'pt'
                    ? 'bg-zinc-100 text-zinc-950 font-semibold'
                    : 'text-zinc-400 hover:text-zinc-100'
                }`}
              >
                PT-BR
              </button>
              <button
                type="button"
                onClick={() => setResumeLang('en')}
                className={`px-2.5 py-1.5 rounded-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 ${
                  resumeLang === 'en'
                    ? 'bg-zinc-100 text-zinc-950 font-semibold'
                    : 'text-zinc-400 hover:text-zinc-100'
                }`}
              >
                EN
              </button>
            </div>

            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-2 px-4 py-2 min-h-[40px] rounded-lg bg-blue-600 hover:bg-blue-500 text-[var(--fg)] text-xs sm:text-sm font-semibold transition-colors active:scale-[0.98] whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
            >
              <Printer className="w-4 h-4 shrink-0" aria-hidden="true" />
              <span>{r.printCta}</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              aria-label={r.closeLabel}
              className="inline-flex items-center justify-center gap-1.5 px-3 py-2 min-h-[40px] min-w-[40px] rounded-lg border border-zinc-800 bg-zinc-900 text-zinc-300 hover:text-[var(--fg)] hover:border-zinc-700 transition-colors text-xs font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400"
            >
              <X className="w-4 h-4 shrink-0" aria-hidden="true" />
              <span className="hidden sm:inline">{r.closeLabel}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Scrollable A4 Paper Viewport */}
      <div
        onClick={(e) => {
          if (e.target === e.currentTarget) {
            onClose();
          }
        }}
        className="flex-1 overflow-y-auto px-3 sm:px-6 lg:px-10 py-6 sm:py-8 print:overflow-visible print:p-0 print:m-0"
      >
        <div
          id="resume-print-sheet"
          className="mx-auto w-full max-w-[210mm] min-h-[297mm] bg-white text-zinc-950 rounded-sm shadow-2xl shadow-black/60 border border-zinc-300 px-6 py-8 sm:px-[16mm] sm:py-[14mm] print:max-w-none print:min-h-0 print:shadow-none print:border-0 print:rounded-none print:p-0"
        >
          {/* CV Header */}
          <header className="border-b-2 border-zinc-900 pb-4 mb-5 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <p className="text-[10px] font-mono uppercase tracking-[0.18em] text-blue-700 font-semibold mb-1">
                {r.experienceBadge} · {r.availability}
              </p>
              <h1 className="font-display text-3xl sm:text-[26pt] font-extrabold tracking-tight text-zinc-950 leading-none">
                {CONTACT_INFO.name}
              </h1>
              <p className="mt-1.5 text-sm sm:text-[10.5pt] font-semibold text-zinc-700">
                {r.headline}
              </p>
            </div>

            <div className="text-[11px] sm:text-[9pt] text-zinc-700 space-y-1 sm:text-right font-mono">
              <div className="flex sm:justify-end items-center gap-1.5">
                <MapPin className="w-3 h-3 text-blue-700 shrink-0" aria-hidden="true" />
                <span>{r.location}</span>
              </div>
              <div className="flex sm:justify-end items-center gap-1.5">
                <Mail className="w-3 h-3 text-blue-700 shrink-0" aria-hidden="true" />
                <a href={`mailto:${CONTACT_INFO.email}`} className="hover:underline text-zinc-900">
                  {CONTACT_INFO.email}
                </a>
              </div>
              <div className="flex sm:justify-end items-center gap-1.5">
                <Phone className="w-3 h-3 text-blue-700 shrink-0" aria-hidden="true" />
                <a
                  href={`https://wa.me/${CONTACT_INFO.whatsappRaw}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline text-zinc-900 tabular-nums"
                >
                  {CONTACT_INFO.whatsappIntl}
                </a>
              </div>
              <div className="flex sm:justify-end items-center gap-1.5 flex-wrap">
                <Globe className="w-3 h-3 text-blue-700 shrink-0" aria-hidden="true" />
                <a
                  href={CONTACT_INFO.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline text-zinc-900"
                >
                  linkedin.com/in/andrey-ramos-6302722a3
                </a>
                <span aria-hidden="true" className="text-zinc-400">·</span>
                <a
                  href={CONTACT_INFO.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline text-zinc-900"
                >
                  github.com/dreyranos
                </a>
              </div>
            </div>
          </header>

          {/* 01 · Summary */}
          <section className="resume-block mb-5">
            <h2 className="text-[10px] font-mono uppercase tracking-[0.16em] font-bold text-blue-700 border-b border-zinc-200 pb-1 mb-2">
              {r.summaryTitle}
            </h2>
            <p className="text-[12.5px] sm:text-[9.5pt] leading-[1.55] text-zinc-800">
              {r.summaryBody}
            </p>
            <blockquote className="mt-2.5 pl-3 border-l-2 border-blue-700 text-[11.5px] sm:text-[9pt] text-zinc-700 italic">
              <span className="not-italic font-mono text-[10px] uppercase tracking-wider text-zinc-500 mr-2">
                {r.manifestoLabel}:
              </span>
              “{r.manifestoQuote}”
            </blockquote>
          </section>

          {/* 02 · Professional Experience */}
          <section className="mb-5">
            <h2 className="text-[10px] font-mono uppercase tracking-[0.16em] font-bold text-blue-700 border-b border-zinc-200 pb-1 mb-3">
              {r.experienceTitle}
            </h2>
            <div className="space-y-4">
              {r.experienceItems.map((item) => (
                <article
                  key={`${item.company}-${item.role}`}
                  className="resume-block"
                >
                  <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-0.5">
                    <div className="flex flex-wrap items-baseline gap-x-2">
                      <h3 className="font-display text-[14px] sm:text-[10.5pt] font-bold text-zinc-950">
                        {item.role}
                      </h3>
                      <span className="text-zinc-400" aria-hidden="true">·</span>
                      <span className="text-[13px] sm:text-[10pt] font-semibold text-blue-700">
                        {item.company}
                      </span>
                      {item.current && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-mono font-semibold text-emerald-700">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" aria-hidden="true" />
                          {r.currentLabel}
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] sm:text-[8.5pt] font-mono text-zinc-500 shrink-0">
                      {item.period}
                    </span>
                  </div>

                  <p className="text-[11px] sm:text-[8.5pt] text-zinc-500 mb-1.5">
                    {item.location}
                  </p>

                  <ul className="space-y-1 pl-4 list-disc marker:text-blue-700 text-[12px] sm:text-[9.2pt] leading-[1.45] text-zinc-800">
                    {item.highlights.map((bullet, idx) => (
                      <li key={idx}>{bullet}</li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </section>

          {/* 03 · Core Expertise & Architecture */}
          <section className="resume-block mb-5">
            <h2 className="text-[10px] font-mono uppercase tracking-[0.16em] font-bold text-blue-700 border-b border-zinc-200 pb-1 mb-2.5">
              {r.expertiseTitle}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2.5">
              {r.expertiseItems.map((expItem) => (
                <div key={expItem.title} className="text-[12px] sm:text-[9pt]">
                  <h3 className="font-semibold text-zinc-950">{expItem.title}</h3>
                  <p className="text-zinc-700 leading-snug mt-0.5">{expItem.detail}</p>
                </div>
              ))}
            </div>
          </section>

          {/* 04 · Technical Stack */}
          <section className="resume-block mb-5">
            <h2 className="text-[10px] font-mono uppercase tracking-[0.16em] font-bold text-blue-700 border-b border-zinc-200 pb-1 mb-2.5">
              {r.skillsTitle}
            </h2>
            <div className="space-y-1.5 text-[12px] sm:text-[9pt]">
              {r.skillGroups.map((group) => {
                const groupItems = STACK_ITEMS.filter((s) => s.cat === group.cat).map((s) =>
                  resumeLang === 'en' && s.nameEn ? s.nameEn : s.name
                );
                return (
                  <div key={group.cat} className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-2">
                    <span className="font-mono text-[11px] sm:text-[8.5pt] font-semibold text-zinc-900 sm:w-44 shrink-0">
                      {group.label}:
                    </span>
                    <span className="text-zinc-700 leading-snug">
                      {groupItems.join(' · ')}
                    </span>
                  </div>
                );
              })}
            </div>
          </section>

          {/* 05 · Education, Languages & Key Differentiators */}
          <section className="resume-block grid grid-cols-1 sm:grid-cols-2 gap-6 pt-1">
            <div className="space-y-4">
              <div>
                <h2 className="text-[10px] font-mono uppercase tracking-[0.16em] font-bold text-blue-700 border-b border-zinc-200 pb-1 mb-2">
                  {r.educationTitle}
                </h2>
                <h3 className="font-semibold text-[12.5px] sm:text-[9.5pt] text-zinc-950">
                  {edu.school}
                </h3>
                <p className="text-[12px] sm:text-[9pt] text-zinc-700 mt-0.5">{edu.course}</p>
                <p className="text-[11px] sm:text-[8.5pt] font-mono text-zinc-500 mt-0.5">
                  {edu.period}
                </p>
              </div>

              <div>
                <h2 className="text-[10px] font-mono uppercase tracking-[0.16em] font-bold text-blue-700 border-b border-zinc-200 pb-1 mb-2">
                  {r.languagesTitle}
                </h2>
                <ul className="space-y-1 text-[12px] sm:text-[9pt] text-zinc-800">
                  {r.languagesList.map((langItem) => (
                    <li key={langItem.name} className="flex items-baseline justify-between gap-2">
                      <span className="font-medium text-zinc-950">{langItem.name}</span>
                      <span className="text-zinc-600 text-[11px] sm:text-[8.5pt] font-mono">
                        {langItem.level}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div>
              <h2 className="text-[10px] font-mono uppercase tracking-[0.16em] font-bold text-blue-700 border-b border-zinc-200 pb-1 mb-2">
                {r.differentiatorsTitle}
              </h2>
              <ul className="space-y-1.5 pl-4 list-disc marker:text-blue-700 text-[12px] sm:text-[9pt] leading-snug text-zinc-800">
                {edge.items.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>
          </section>

          {/* Subtle Document Footer */}
          <footer className="mt-6 pt-3 border-t border-zinc-200 flex flex-wrap items-center justify-between gap-2 text-[10px] font-mono text-zinc-500">
            <span>{CONTACT_INFO.name} · {CONTACT_INFO.email}</span>
            <span>{r.footerNote}</span>
          </footer>
        </div>

        {/* Helpful Print Dialog Hint below the preview sheet */}
        <p className="print:hidden text-center text-xs font-mono text-zinc-400 mt-4 max-w-2xl mx-auto">
          {r.printHint}
        </p>
      </div>
    </div>
  );
}
