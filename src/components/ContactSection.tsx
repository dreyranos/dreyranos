import { useState } from 'react';
import { Mail, MessageCircle, Copy, Check, ArrowUpRight, Send } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { CONTACT_INFO, COPY, type Lang } from '../data/portfolioData';
import { SpotlightCard } from './SpotlightCard';

interface ContactSectionProps {
  lang: Lang;
}

export function ContactSection({ lang }: ContactSectionProps) {
  const t = COPY[lang].contact;
  const [copiedField, setCopiedField] = useState<'email' | 'whatsapp' | null>(null);
  const [senderName, setSenderName] = useState('');
  const [selectedTopicIdx, setSelectedTopicIdx] = useState(0);
  const [message, setMessage] = useState('');
  const selectedTopic = t.topics[selectedTopicIdx] ?? t.topics[0];

  const handleCopy = async (value: string, field: 'email' | 'whatsapp') => {
    try {
      await navigator.clipboard.writeText(value);
      setCopiedField(field);
      window.setTimeout(() => {
        setCopiedField((prev) => (prev === field ? null : prev));
      }, 2000);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = value;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      try {
        document.execCommand('copy');
        setCopiedField(field);
        window.setTimeout(() => {
          setCopiedField((prev) => (prev === field ? null : prev));
        }, 2000);
      } finally {
        document.body.removeChild(textarea);
      }
    }
  };

  const composedText = t.defaultGreeting(senderName.trim(), selectedTopic, message.trim());
  const whatsappComposeHref = `https://wa.me/${CONTACT_INFO.whatsappRaw}?text=${encodeURIComponent(composedText)}`;
  const mailtoComposeHref = `mailto:${CONTACT_INFO.email}?subject=${encodeURIComponent(
    `[Portfólio] ${selectedTopic}${senderName.trim() ? ` - ${senderName.trim()}` : ''}`
  )}&body=${encodeURIComponent(composedText)}`;

  return (
    <section id="contato" className="py-16 sm:py-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-4xl mb-10 sm:mb-12"
        >
          <p className="font-mono text-xs tracking-wide text-blue-600 dark:text-blue-400 font-medium">
            {t.kicker}
          </p>
          <h2 className="font-display text-[clamp(2rem,4.2vw,3.35rem)] font-bold tracking-tight text-zinc-950 dark:text-zinc-50 mt-2 leading-[1.08]">
            {t.title}
          </h2>
          <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400 mt-4 leading-relaxed max-w-2xl">
            {t.desc}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Direct Contact Channels */}
          <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
            {/* WhatsApp Card */}
            <SpotlightCard
              delay={0.04}
              className="rounded-2xl p-5 sm:p-6 bg-white dark:bg-[var(--bg)] border border-zinc-200 dark:border-zinc-800/90 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="flex items-start gap-3.5 min-w-0">
                <div className="w-11 h-11 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0">
                  <MessageCircle className="w-5 h-5" aria-hidden="true" />
                </div>
                <div className="min-w-0">
                  <div className="font-mono text-xs text-zinc-500 dark:text-zinc-400">
                    {t.whatsappLabel}
                  </div>
                  <div className="font-display font-bold text-base sm:text-lg text-zinc-950 dark:text-zinc-50 tabular-nums mt-0.5">
                    {CONTACT_INFO.whatsappDisplay}
                  </div>
                  <div className="font-mono text-xs text-zinc-500 dark:text-zinc-400 tabular-nums">
                    {CONTACT_INFO.whatsappIntl}
                  </div>
                </div>
              </div>

              <div className="print:hidden flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => handleCopy('17992083142', 'whatsapp')}
                  className="inline-flex items-center gap-1.5 px-3 py-2 min-h-[40px] rounded-lg border border-zinc-200 dark:border-zinc-800 text-xs font-mono font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors active:scale-[0.97]"
                >
                  <AnimatePresence mode="wait" initial={false}>
                    {copiedField === 'whatsapp' ? (
                      <motion.span
                        key="copied-wa"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.15 }}
                        className="inline-flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400"
                      >
                        <Check className="w-3.5 h-3.5" aria-hidden="true" />
                        <span>{t.copied}</span>
                      </motion.span>
                    ) : (
                      <motion.span
                        key="copy-wa"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.15 }}
                        className="inline-flex items-center gap-1.5"
                      >
                        <Copy className="w-3.5 h-3.5" aria-hidden="true" />
                        <span>{t.copy}</span>
                      </motion.span>
                    )}
                  </AnimatePresence>
                </button>
                <a
                  href={`https://wa.me/${CONTACT_INFO.whatsappRaw}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-2 min-h-[40px] rounded-lg bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-400 text-[var(--fg)] dark:text-zinc-950 text-xs font-semibold transition-all active:scale-[0.98] whitespace-nowrap"
                >
                  <span>{t.whatsappAction}</span>
                  <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
                </a>
              </div>
            </SpotlightCard>

            {/* Email Card */}
            <SpotlightCard
              delay={0.08}
              className="rounded-2xl p-5 sm:p-6 bg-white dark:bg-[var(--bg)] border border-zinc-200 dark:border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="flex items-start gap-3.5 min-w-0">
                <div className="w-11 h-11 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0">
                  <Mail className="w-5 h-5" aria-hidden="true" />
                </div>
                <div className="min-w-0">
                  <div className="font-mono text-xs text-zinc-500 dark:text-zinc-400">
                    {t.emailLabel}
                  </div>
                  <div className="font-display font-bold text-base sm:text-lg text-zinc-950 dark:text-zinc-50 mt-0.5 break-all">
                    {CONTACT_INFO.email}
                  </div>
                </div>
              </div>

              <div className="print:hidden flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => handleCopy(CONTACT_INFO.email, 'email')}
                  className="inline-flex items-center gap-1.5 px-3 py-2 min-h-[40px] rounded-lg border border-zinc-200 dark:border-zinc-800 text-xs font-mono font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors active:scale-[0.97]"
                >
                  <AnimatePresence mode="wait" initial={false}>
                    {copiedField === 'email' ? (
                      <motion.span
                        key="copied-em"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.15 }}
                        className="inline-flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400"
                      >
                        <Check className="w-3.5 h-3.5" aria-hidden="true" />
                        <span>{t.copied}</span>
                      </motion.span>
                    ) : (
                      <motion.span
                        key="copy-em"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.15 }}
                        className="inline-flex items-center gap-1.5"
                      >
                        <Copy className="w-3.5 h-3.5" aria-hidden="true" />
                        <span>{t.copy}</span>
                      </motion.span>
                    )}
                  </AnimatePresence>
                </button>
                <a
                  href={`mailto:${CONTACT_INFO.email}`}
                  className="inline-flex items-center gap-1.5 px-4 py-2 min-h-[40px] rounded-lg bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-white text-[var(--fg)] dark:text-zinc-950 text-xs font-semibold transition-all active:scale-[0.98] whitespace-nowrap"
                >
                  <span>{t.emailAction}</span>
                  <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
                </a>
              </div>
            </SpotlightCard>

            {/* Secondary Social Links */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.45, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
              className="sm:col-span-2 lg:col-span-1 grid grid-cols-1 sm:grid-cols-2 gap-4"
            >
              <a
                href={CONTACT_INFO.linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="spotlight-surface rounded-2xl p-5 bg-white dark:bg-[var(--bg)] border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 flex items-center justify-between gap-3 group"
              >
                <div>
                  <div className="font-display font-bold text-sm sm:text-base text-zinc-950 dark:text-zinc-50">
                    {t.linkedinLabel}
                  </div>
                  <div className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                    {t.linkedinSub}
                  </div>
                </div>
                <ArrowUpRight className="w-4 h-4 text-zinc-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-transform duration-150 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 shrink-0" />
              </a>

              <a
                href={CONTACT_INFO.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="spotlight-surface rounded-2xl p-5 bg-white dark:bg-[var(--bg)] border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 flex items-center justify-between gap-3 group"
              >
                <div>
                  <div className="font-display font-bold text-sm sm:text-base text-zinc-950 dark:text-zinc-50">
                    {t.githubLabel}
                  </div>
                  <div className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                    {t.githubSub}
                  </div>
                </div>
                <ArrowUpRight className="w-4 h-4 text-zinc-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-transform duration-150 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 shrink-0" />
              </a>
            </motion.div>
          </div>

          {/* Quick Message Composer */}
          <SpotlightCard
            delay={0.1}
            className="print:hidden lg:col-span-6 rounded-2xl p-6 sm:p-7 bg-white dark:bg-[var(--bg)] border border-zinc-200 dark:border-zinc-800 flex flex-col justify-between"
          >
            <div>
              <h3 className="font-display font-bold text-lg sm:text-xl text-zinc-950 dark:text-zinc-50">
                {t.composerTitle}
              </h3>
              <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 mt-1">
                {t.composerDesc}
              </p>

              <div className="mt-5 space-y-4">
                <div>
                  <span className="block font-mono text-xs text-zinc-500 dark:text-zinc-400 mb-2">
                    {t.topicLabel}
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {t.topics.map((topic, idx) => {
                      const active = selectedTopicIdx === idx;
                      return (
                        <button
                          key={topic}
                          type="button"
                          onClick={() => setSelectedTopicIdx(idx)}
                          className={`relative px-3 py-1.5 min-h-[36px] rounded-lg font-mono text-xs transition-colors whitespace-nowrap ${
                            active
                              ? 'text-[var(--fg)] dark:text-zinc-950 font-semibold'
                              : 'bg-zinc-100 dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700'
                          }`}
                        >
                          {active && (
                            <motion.span
                              layoutId="contact-topic-pill"
                              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                              className="absolute inset-0 rounded-lg bg-blue-600 dark:bg-blue-500"
                            />
                          )}
                          <span className="relative z-10">{topic}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label htmlFor="contact-name" className="block font-mono text-xs text-zinc-500 dark:text-zinc-400 mb-1.5">
                    {t.nameLabel}
                  </label>
                  <input
                    id="contact-name"
                    type="text"
                    value={senderName}
                    onChange={(e) => setSenderName(e.target.value)}
                    placeholder={t.namePlaceholder}
                    className="w-full px-3.5 py-2.5 min-h-[44px] rounded-xl bg-zinc-50 dark:bg-zinc-900/80 border border-zinc-200 dark:border-zinc-800 text-sm text-zinc-950 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-600 dark:focus:ring-blue-400"
                  />
                </div>

                <div>
                  <label htmlFor="contact-message" className="block font-mono text-xs text-zinc-500 dark:text-zinc-400 mb-1.5">
                    {t.messageLabel}
                  </label>
                  <textarea
                    id="contact-message"
                    rows={3}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder={t.messagePlaceholder}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-900/80 border border-zinc-200 dark:border-zinc-800 text-sm text-zinc-950 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-600 dark:focus:ring-blue-400 resize-none"
                  />
                </div>
              </div>
            </div>

            <div className="mt-6 pt-5 border-t border-zinc-100 dark:border-zinc-800/80 flex flex-col sm:flex-row gap-3">
              <a
                href={whatsappComposeHref}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 min-h-[46px] rounded-xl bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-400 text-[var(--fg)] dark:text-zinc-950 font-semibold text-sm transition-all active:scale-[0.98] whitespace-nowrap"
              >
                <MessageCircle className="w-4 h-4 shrink-0" aria-hidden="true" />
                <span>{t.sendWhatsapp}</span>
              </a>
              <a
                href={mailtoComposeHref}
                className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 min-h-[46px] rounded-xl bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-[var(--fg)] font-semibold text-sm transition-all active:scale-[0.98] whitespace-nowrap"
              >
                <Send className="w-4 h-4 shrink-0" aria-hidden="true" />
                <span>{t.sendEmail}</span>
              </a>
            </div>
          </SpotlightCard>
        </div>
      </div>
    </section>
  );
}
