import { useState, useRef, useEffect } from 'react';
import {
  motion,
  useInView,
  AnimatePresence,
  useScroll,
  useSpring,
  useTransform,
} from 'motion/react';
import {
  ArrowUpRight,
  Check,
  Copy,
  Printer,
  Send,
  Mail,
} from 'lucide-react';
import { useContent } from '../prefs';
import {
  AnimatedRule,
  Magnetic,
  RollingText,
  ScrollRevealWords,
  CrossVelocityMarquee,
} from './AquaEffects';
import { smoothScrollTo, type ContactPrefillDetail } from '../utils/navigation';

const TOPICS = [
  'Projeto Sob Demanda',
  'Vaga Full-Time',
  'Consultoria em Legado',
  'Parceria Técnica',
];

export default function ContactFooter() {
  const { profile: PROFILE, ui } = useContent();
  const [topic, setTopic] = useState(TOPICS[0]);
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [copied, setCopied] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [sentFeedback, setSentFeedback] = useState('');
  const [emailHovered, setEmailHovered] = useState(false);

  const sayHiRef = useRef<HTMLHeadingElement>(null);
  const footerRef = useRef<HTMLElement>(null);
  const sayHiInView = useInView(sayHiRef, { once: true, margin: '-80px' });

  const { scrollYProgress: rawFooterScroll } = useScroll({
    target: footerRef,
    offset: ['start end', 'start 0.35'],
  });
  const footerScroll = useSpring(rawFooterScroll, {
    stiffness: 120,
    damping: 26,
  });
  const sayHiScale = useTransform(footerScroll, [0, 1], [0.74, 1.03]);
  const sayHiY = useTransform(footerScroll, [0, 1], [42, 0]);

  useEffect(() => {
    const onPrefill = (e: Event) => {
      const custom = e as CustomEvent<ContactPrefillDetail>;
      if (custom.detail?.topic && TOPICS.includes(custom.detail.topic)) {
        setTopic(custom.detail.topic);
      }
      if (custom.detail?.message) {
        setMessage(custom.detail.message);
      }
      setErrorMsg('');
      setSentFeedback('Assunto e resumo pré-selecionados — informe seu nome para enviar.');
    };
    window.addEventListener('portfolio:prefill-contact', onPrefill);
    return () => window.removeEventListener('portfolio:prefill-contact', onPrefill);
  }, []);

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(PROFILE.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2400);
    } catch {
      window.location.href = `mailto:${PROFILE.email}`;
    }
  };

  const buildMessageBody = () => {
    const cleanName = name.trim();
    const cleanMsg = message.trim();
    return `Olá Andrey!${cleanName ? ` Meu nome é ${cleanName}.` : ''} Assunto: ${topic}.${
      cleanMsg
        ? `\n\n${cleanMsg}`
        : ' Gostaria de conversar sobre uma oportunidade ou projeto.'
    }`;
  };

  const handleSendWhatsapp = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    if (!name.trim()) {
      setErrorMsg('Informe seu nome antes de enviar a mensagem.');
      return;
    }
    const text = encodeURIComponent(buildMessageBody());
    setSentFeedback('Mensagem preparada para envio via WhatsApp.');
    window.location.assign(`https://wa.me/${PROFILE.whatsappRaw}?text=${text}`);
  };

  const handleSendEmail = () => {
    setErrorMsg('');
    if (!name.trim()) {
      setErrorMsg('Informe seu nome antes de abrir o e-mail.');
      return;
    }
    const subject = encodeURIComponent(`[Portfólio] ${topic} — ${name.trim()}`);
    const body = encodeURIComponent(buildMessageBody());
    setSentFeedback('Cliente de e-mail acionado com a mensagem.');
    window.location.href = `mailto:${PROFILE.email}?subject=${subject}&body=${body}`;
  };

  const sayHiChars = 'DIGA OLÁ!'.split('');

  return (
    <footer
      ref={footerRef}
      id="contato"
      className="relative z-10 pb-24 sm:pb-16 bg-[var(--bg)]/85 text-[var(--fg)]"
    >
      <CrossVelocityMarquee
        className="mb-14 sm:mb-20"
        topItems={[
          'CONSTRUÇÃO LIMPA',
          'ARQUITETURA MULTI-TENANT',
          'AUTOMAÇÃO & IA',
        ]}
        bottomItems={[
          'DISPONÍVEL PARA NOVOS PROJETOS',
          'SÃO JOSÉ DO RIO PRETO · SP',
          'FULL STACK · ANDROID · DESKTOP',
        ]}
      />

      <motion.div
        initial={{ opacity: 0, y: 26 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.08 }}
        transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-[1380px] mx-auto px-5 sm:px-8 lg:px-14"
      >
        <div className="flex flex-wrap items-center justify-between gap-4 pb-5">
          <h2 className="text-[15px] sm:text-[16px] uppercase tracking-[0.06em] font-semibold text-[var(--fg)]">
            <ScrollRevealWords text="04. Contato Direto" />
          </h2>
          <span className="font-mono-tabular text-xs uppercase tracking-wider text-[var(--soft)]">
            {PROFILE.location} · {PROFILE.country}
          </span>
        </div>
        <AnimatedRule dark className="mb-14 sm:mb-20" />

        {/* Monumental DIGA OLÁ + Double-Wipe Underline Email */}
        <motion.div
          style={{ scale: sayHiScale, y: sayHiY }}
          className="text-center mb-16 sm:mb-24 will-change-transform"
        >
          <p className="text-xs sm:text-sm font-mono-tabular uppercase tracking-[0.14em] text-[var(--soft)] mb-4">
            <ScrollRevealWords
              text="QUER CONSTRUIR OU MODERNIZAR UM SISTEMA?"
              className="justify-center"
            />
          </p>

          <h3
            ref={sayHiRef}
            className="font-display font-extrabold uppercase tracking-[-0.04em] text-[clamp(3.25rem,11vw,9.5rem)] leading-[0.88] text-[var(--fg)] mb-8 overflow-hidden flex justify-center"
          >
            {sayHiChars.map((char, idx) => (
              <motion.span
                key={`${char}-${idx}`}
                initial={{ y: '100%', opacity: 0 }}
                animate={
                  sayHiInView
                    ? { y: '0%', opacity: 1 }
                    : { y: '100%', opacity: 0 }
                }
                transition={{
                  duration: 0.55,
                  delay: 0.045 * idx,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="inline-block"
              >
                {char === ' ' ? '\u00A0' : char}
              </motion.span>
            ))}
          </h3>

          <div className="flex flex-col items-center gap-3">
            <button
              type="button"
              onClick={handleCopyEmail}
              onMouseEnter={() => setEmailHovered(true)}
              onMouseLeave={() => setEmailHovered(false)}
              className="relative w-fit overflow-hidden font-display font-semibold uppercase tracking-[-0.025em] text-[clamp(1.35rem,5.5vw,5rem)] leading-tight text-[var(--fg)] hover:text-[var(--soft)] transition-colors pb-3 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--line)]"
            >
              <span>{PROFILE.email}</span>

              <motion.span
                aria-hidden="true"
                animate={{
                  x: emailHovered ? '110%' : '0%',
                }}
                transition={{ duration: 0.55, ease: [0.76, 0, 0.24, 1] }}
                className="absolute bottom-0 left-0 w-full h-[3px] sm:h-[6px] bg-white/25"
              />
              <motion.span
                aria-hidden="true"
                animate={{
                  x: emailHovered ? '0%' : '-110%',
                }}
                transition={{ duration: 0.55, ease: [0.76, 0, 0.24, 1] }}
                className="absolute bottom-0 left-0 w-full h-[3px] sm:h-[6px] bg-[var(--soft)]"
              />
            </button>

            <div className="flex items-center gap-3 text-xs font-mono-tabular text-[var(--soft)] mt-1">
              <button
                type="button"
                onClick={handleCopyEmail}
                className="inline-flex items-center gap-1.5 hover:text-[var(--fg)] transition-colors py-1"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-[var(--soft)]" />
                    <span className="text-[var(--soft)] font-semibold">
                      E-mail copiado para a área de transferência
                    </span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Clique no endereço acima para copiar</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </motion.div>

        {/* Quick Message Composer & Direct Channels */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 border border-[var(--line)] bg-[var(--bg)] p-6 sm:p-10 mb-16">
          <div className="lg:col-span-5 flex flex-col justify-between">
            <div>
              <p className="text-xs font-mono-tabular uppercase tracking-wider text-[var(--soft)] mb-2">
                Canais Diretos
              </p>
              <h4 className="font-display text-2xl font-bold text-[var(--fg)] mb-3">
                Compositor de Mensagem Rápida
              </h4>
              <p className="text-sm leading-relaxed text-[var(--soft)] mb-8">
                Escreva uma nota rápida sobre seu projeto, vaga ou desafio técnico e abra diretamente no WhatsApp ou no seu aplicativo de e-mail.
              </p>
            </div>

            <div className="space-y-3 border-t border-[var(--line)] pt-5 text-sm">
              <div className="flex items-center justify-between gap-4">
                <span className="text-[var(--muted)]">WhatsApp</span>
                <a
                  href={`https://wa.me/${PROFILE.whatsappRaw}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono-tabular font-semibold text-[var(--fg)] hover:text-[var(--soft)] inline-flex items-center gap-1"
                >
                  <span>{PROFILE.whatsappDisplay}</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
              </div>

              <div className="flex items-center justify-between gap-4">
                <span className="text-[var(--muted)]">LinkedIn</span>
                <a
                  href={PROFILE.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-[var(--fg)] hover:text-[var(--soft)] inline-flex items-center gap-1"
                >
                  <span>andrey-ramos</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
              </div>

              <div className="flex items-center justify-between gap-4">
                <span className="text-[var(--muted)]">GitHub</span>
                <a
                  href={PROFILE.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono-tabular font-semibold text-[var(--fg)] hover:text-[var(--soft)] inline-flex items-center gap-1"
                >
                  <span>{PROFILE.handle}</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>

          <form
            onSubmit={handleSendWhatsapp}
            className="lg:col-span-7 space-y-5 lg:pl-8 lg:border-l border-[var(--line)]"
            noValidate
          >
            <div>
              <label className="block text-xs font-mono-tabular uppercase tracking-wider text-[var(--soft)] mb-2">
                Assunto
              </label>
              <div className="flex flex-wrap gap-2">
                {TOPICS.map((item) => {
                  const active = topic === item;
                  return (
                    <button
                      key={item}
                      type="button"
                      onClick={() => setTopic(item)}
                      className={`relative z-10 px-3.5 py-2 text-xs font-medium border transition-colors duration-200 whitespace-nowrap shrink-0 ${
                        active
                          ? 'text-[var(--btn-fg)] border-[var(--line)]'
                          : 'bg-[var(--bg)] text-[var(--soft)] border-[var(--line)] hover:border-[var(--line)]'
                      }`}
                    >
                      {active && (
                        <motion.span
                          layoutId="contactTopicActive"
                          transition={{
                            type: 'spring',
                            stiffness: 380,
                            damping: 32,
                          }}
                          className="absolute inset-0 bg-[var(--btn)] -z-10"
                          aria-hidden="true"
                        />
                      )}
                      {item}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label
                htmlFor="contact-name"
                className="block text-xs font-mono-tabular uppercase tracking-wider text-[var(--soft)] mb-2"
              >
                Seu Nome
              </label>
              <input
                id="contact-name"
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (errorMsg) setErrorMsg('');
                }}
                placeholder="Ex.: Mariana Souza"
                className="w-full px-4 py-3 bg-[var(--bg)] border border-[var(--line)] text-sm text-[var(--fg)] placeholder:text-[var(--muted)] focus:outline-none focus:border-[var(--line)]"
              />
            </div>

            <div>
              <label
                htmlFor="contact-message"
                className="block text-xs font-mono-tabular uppercase tracking-wider text-[var(--soft)] mb-2"
              >
                Como posso ajudar?
              </label>
              <textarea
                id="contact-message"
                rows={3}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Compartilhe um resumo do projeto, vaga ou desafio técnico..."
                className="w-full px-4 py-3 bg-[var(--bg)] border border-[var(--line)] text-sm text-[var(--fg)] placeholder:text-[var(--muted)] focus:outline-none focus:border-[var(--line)] resize-y"
              />
            </div>

            <AnimatePresence mode="wait">
              {errorMsg ? (
                <motion.p
                  key="contact-error"
                  role="alert"
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.2 }}
                  className="text-xs font-medium text-[var(--soft)]"
                >
                  {errorMsg}
                </motion.p>
              ) : sentFeedback ? (
                <motion.p
                  key="contact-sent"
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.2 }}
                  className="text-xs font-medium text-[var(--soft)]"
                >
                  {sentFeedback}
                </motion.p>
              ) : null}
            </AnimatePresence>

            <div className="flex flex-wrap items-center gap-3 pt-1">
              <Magnetic strength={0.2}>
                <button
                  type="submit"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 min-h-[44px] bg-[var(--btn)] text-[var(--btn-fg)] text-sm font-semibold hover:bg-[var(--soft)] transition-colors whitespace-nowrap shrink-0"
                >
                  <Send className="w-4 h-4 shrink-0" />
                  <RollingText text="Enviar via WhatsApp" />
                </button>
              </Magnetic>

              <button
                type="button"
                onClick={handleSendEmail}
                className="inline-flex items-center justify-center gap-2 px-5 py-3 min-h-[44px] border border-[var(--line)] text-[var(--fg)] text-sm font-semibold hover:border-[var(--line)] hover:text-[var(--soft)] transition-colors whitespace-nowrap shrink-0"
              >
                <Mail className="w-4 h-4 shrink-0" />
                <RollingText text="Enviar por E-mail" />
              </button>
            </div>
          </form>
        </div>

        {/* Quiet Editorial Footer */}
        <div className="pt-8 border-t border-[var(--line)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-[var(--muted)]">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <span className="font-display font-bold text-[var(--fg)] text-sm">
              {PROFILE.name}
            </span>
            <span aria-hidden="true">·</span>
            <span>{ui.footerRole}</span>
            <span aria-hidden="true">·</span>
            <span>{PROFILE.location}</span>
          </div>

          <div className="flex flex-wrap items-center gap-4 no-print">
            <button
              type="button"
              onClick={() => window.print()}
              className="inline-flex items-center gap-1.5 font-medium text-[var(--soft)] hover:text-[var(--fg)] transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Salvar Currículo em PDF</span>
            </button>
            <span aria-hidden="true">·</span>
            <a
              href="#topo"
              onClick={(e) => {
                e.preventDefault();
                smoothScrollTo('#topo', 0);
              }}
              className="font-medium text-[var(--soft)] hover:text-[var(--fg)] transition-colors"
            >
              Voltar ao topo ↑
            </a>
          </div>
        </div>
      </motion.div>
    </footer>
  );
}
