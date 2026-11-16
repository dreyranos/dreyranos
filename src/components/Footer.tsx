import { useState, type FormEvent } from 'react';
import { Printer, Mail, ArrowRight, CheckCircle2, AlertCircle, AlertTriangle, Loader2 } from 'lucide-react';
import { CONTACT_INFO, COPY, type Lang } from '../data/portfolioData';
import { useCoreWebVitals } from '../hooks/useCoreWebVitals';

interface FooterProps {
  lang: Lang;
  onOpenResume: () => void;
}

type SubmitStatus = 'idle' | 'submitting' | 'success' | 'error';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function Footer({ lang, onOpenResume }: FooterProps) {
  const t = COPY[lang].footer;
  const newsletter = t.newsletter;
  const vitals = useCoreWebVitals();

  const [email, setEmail] = useState('');
  const [honeypot, setHoneypot] = useState('');
  const [status, setStatus] = useState<SubmitStatus>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const reportIssueHref = (() => {
    const currentUrl = typeof window !== 'undefined' ? window.location.href : '';
    const metricsSummary = [
      vitals.slowReasons.length > 0 ? `Detected: ${vitals.slowReasons.join(', ')}` : '',
      vitals.lcpMs !== null ? `LCP: ${vitals.lcpMs}ms` : '',
      vitals.fcpMs !== null ? `FCP: ${vitals.fcpMs}ms` : '',
      vitals.cls !== null ? `CLS: ${vitals.cls}` : '',
      vitals.fidMs !== null ? `FID: ${vitals.fidMs}ms` : '',
      vitals.loadMs !== null ? `Load: ${vitals.loadMs}ms` : '',
      currentUrl ? `URL: ${currentUrl}` : '',
    ]
      .filter(Boolean)
      .join('\n');

    const subject =
      lang === 'pt'
        ? '[Portfólio] Relato de lentidão / desempenho'
        : '[Portfolio] Slow load performance report';

    const body =
      lang === 'pt'
        ? `Olá Andrey,\n\nNotei lentidão ao carregar o portfólio.\n\nDetalhes técnicos:\n${metricsSummary}`
        : `Hi Andrey,\n\nI experienced slow loading while viewing your portfolio.\n\nDiagnostics:\n${metricsSummary}`;

    return `mailto:${CONTACT_INFO.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  })();

  const handleOpenResumePreview = () => {
    onOpenResume();
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (status === 'submitting') return;

    // Silent drop for automated bot submissions filling the hidden honeypot field
    if (honeypot.trim().length > 0) {
      setStatus('success');
      setEmail('');
      return;
    }

    const trimmedEmail = email.trim();
    if (!EMAIL_REGEX.test(trimmedEmail)) {
      setStatus('error');
      setErrorMessage(newsletter.invalidEmail);
      return;
    }

    setStatus('submitting');
    setErrorMessage(null);

    const endpoint =
      (import.meta.env.VITE_NEWSLETTER_ENDPOINT as string | undefined)?.trim() ||
      `https://formsubmit.co/ajax/${CONTACT_INFO.email}`;

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          email: trimmedEmail,
          _subject: `[Portfolio] Stay Updated signup from ${trimmedEmail}`,
          _template: 'table',
          source: 'Portfolio Footer Newsletter',
          language: lang,
        }),
      });

      const data = (await response.json().catch(() => null)) as
        | { success?: boolean | string; ok?: boolean; message?: string }
        | null;

      if (!response.ok || data?.success === false || data?.success === 'false') {
        throw new Error(data?.message || newsletter.error);
      }

      setStatus('success');
      setEmail('');
    } catch {
      setStatus('error');
      setErrorMessage(newsletter.error);
    }
  };

  const handleReset = () => {
    setStatus('idle');
    setErrorMessage(null);
    setEmail('');
  };

  return (
    <footer className="border-t border-zinc-200 dark:border-zinc-800/80 py-10 sm:py-12 print:py-4 print:border-zinc-300">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Stay Updated Newsletter Sign-up */}
        <div className="print:hidden pb-8 mb-8 border-b border-zinc-200/80 dark:border-zinc-800/80 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="max-w-md">
            <h3 className="font-display text-lg font-bold tracking-tight text-zinc-950 dark:text-zinc-50">
              {newsletter.title}
            </h3>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1 leading-relaxed">
              {newsletter.desc}
            </p>
          </div>

          <div className="w-full lg:max-w-md">
            {status === 'success' ? (
              <div
                role="status"
                aria-live="polite"
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-700 dark:text-emerald-300"
              >
                <div className="flex items-start sm:items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 sm:mt-0" aria-hidden="true" />
                  <span>{newsletter.success}</span>
                </div>
                <button
                  type="button"
                  onClick={handleReset}
                  className="text-xs font-mono font-medium underline underline-offset-4 hover:opacity-80 transition-opacity whitespace-nowrap self-start sm:self-center shrink-0"
                >
                  {newsletter.reset}
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate className="space-y-2">
                {/* Honeypot anti-spam field */}
                <input
                  type="text"
                  name="_honey"
                  tabIndex={-1}
                  autoComplete="off"
                  value={honeypot}
                  onChange={(e) => setHoneypot(e.target.value)}
                  className="hidden"
                  aria-hidden="true"
                />

                <div className="flex flex-col sm:flex-row gap-2.5">
                  <label htmlFor="newsletter-email" className="sr-only">
                    {newsletter.label}
                  </label>
                  <div className="relative flex-1">
                    <Mail
                      className="w-4 h-4 text-zinc-400 dark:text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                      aria-hidden="true"
                    />
                    <input
                      id="newsletter-email"
                      name="email"
                      type="email"
                      required
                      autoComplete="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (status === 'error') {
                          setStatus('idle');
                          setErrorMessage(null);
                        }
                      }}
                      placeholder={newsletter.placeholder}
                      aria-invalid={status === 'error'}
                      aria-describedby={status === 'error' ? 'newsletter-error' : undefined}
                      className="w-full min-h-[44px] pl-10 pr-3.5 py-2.5 rounded-xl bg-white dark:bg-[#0b0b0f] border border-zinc-200 dark:border-zinc-800 text-sm text-zinc-950 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-600 dark:focus:ring-blue-400 transition-colors"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={status === 'submitting'}
                    className="inline-flex items-center justify-center gap-2 px-5 py-2.5 min-h-[44px] rounded-xl bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-400 text-white dark:text-zinc-950 text-sm font-semibold transition-all active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:focus-visible:ring-blue-400"
                  >
                    {status === 'submitting' ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
                        <span>{newsletter.submitting}</span>
                      </>
                    ) : (
                      <>
                        <span>{newsletter.submit}</span>
                        <ArrowRight className="w-4 h-4" aria-hidden="true" />
                      </>
                    )}
                  </button>
                </div>

                {status === 'error' && errorMessage && (
                  <p
                    id="newsletter-error"
                    role="alert"
                    aria-live="polite"
                    className="flex items-center gap-1.5 text-xs text-rose-600 dark:text-rose-400"
                  >
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                    <span>{errorMessage}</span>
                  </p>
                )}
              </form>
            )}
          </div>
        </div>

        {/* Bottom Copyright, Contact & Save PDF Bar */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-4 text-xs font-mono text-zinc-500 dark:text-zinc-400">
          <div className="text-center lg:text-left">
            © 2026 Andrey Ramos ({CONTACT_INFO.handle}) · {t.rights}
          </div>

          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
            <a
              href={`mailto:${CONTACT_INFO.email}`}
              className="hover:text-zinc-950 dark:hover:text-zinc-200 transition-colors"
            >
              {CONTACT_INFO.email}
            </a>
            <span aria-hidden="true">·</span>
            <a
              href={`https://wa.me/${CONTACT_INFO.whatsappRaw}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-zinc-950 dark:hover:text-zinc-200 transition-colors tabular-nums"
            >
              {CONTACT_INFO.whatsappDisplay}
            </a>
            <span className="hidden sm:inline" aria-hidden="true">·</span>
            <span className="hidden sm:inline">{t.role}</span>
          </div>

          <div className="print:hidden flex flex-wrap items-center justify-center gap-3 shrink-0">
            {vitals.isSlow && (
              <a
                href={reportIssueHref}
                title={t.reportIssueTitle}
                className="inline-flex items-center gap-1.5 text-xs font-mono text-amber-700 dark:text-amber-400 hover:underline underline-offset-4 whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 rounded-sm"
              >
                <AlertTriangle className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                <span>{t.reportIssue}</span>
              </a>
            )}

            <button
              type="button"
              onClick={handleOpenResumePreview}
              className="inline-flex items-center gap-2 px-3.5 py-2 min-h-[38px] rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#0b0b0f] text-zinc-800 dark:text-zinc-200 hover:border-blue-600/40 dark:hover:border-blue-400/40 hover:text-blue-600 dark:hover:text-blue-400 transition-colors active:scale-[0.98] whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
            >
              <Printer className="w-3.5 h-3.5" aria-hidden="true" />
              <span>{t.savePdf}</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
