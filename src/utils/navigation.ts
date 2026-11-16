import { useEffect, useState } from 'react';

export const SECTION_IDS = [
  'topo',
  'sobre',
  'projetos',
  'atuacao',
  'trajetoria',
  'depoimentos',
  'contato',
] as const;

export type SectionId = (typeof SECTION_IDS)[number];

export interface ScreenMeta {
  id: SectionId;
  num: string;
  label: string;
  title: string;
  subtitle: string;
}

export const SCREEN_DIRECTORY: ScreenMeta[] = [
  {
    id: 'topo',
    num: '00',
    label: 'Início',
    title: 'Início · Andrey Ramos',
    subtitle: 'Engenharia de Software & Visão Geral',
  },
  {
    id: 'sobre',
    num: '01',
    label: 'Sobre',
    title: 'Sobre Andrey Ramos',
    subtitle: 'Perfil, Retrato & Manifesto Técnico',
  },
  {
    id: 'projetos',
    num: '02',
    label: 'Projetos',
    title: 'Projetos & Arquitetura',
    subtitle: 'Sistemas em Produção, Stack & GitHub',
  },
  {
    id: 'atuacao',
    num: '03',
    label: 'Atuação',
    title: 'Áreas de Atuação',
    subtitle: 'Fluxos Demonstrativos Interativos',
  },
  {
    id: 'trajetoria',
    num: '04',
    label: 'Trajetória',
    title: 'Trajetória Profissional',
    subtitle: '2014 ao Presente · Evolução em TI',
  },
  {
    id: 'depoimentos',
    num: '05',
    label: 'Depoimentos',
    title: 'Depoimentos & Impacto',
    subtitle: 'Relatos de Arquitetura, Dados & Operação',
  },
  {
    id: 'contato',
    num: '06',
    label: 'Contato',
    title: 'Contato Direto',
    subtitle: 'WhatsApp, E-mail & Conexão',
  },
];

export interface ScreenTransitionDetail {
  meta: ScreenMeta;
  targetY: number;
}

/**
 * Smoothly scrolls to a target section screen (respecting reduced motion preferences)
 * without covering the viewport with a floating overlay.
 */
export function smoothScrollTo(selector: string, offsetPx = 68) {
  if (typeof window === 'undefined') return;

  const targetY =
    selector === '#topo'
      ? 0
      : (() => {
          const el = document.querySelector(selector);
          if (!el) return null;
          const rect = el.getBoundingClientRect();
          return Math.max(0, window.scrollY + rect.top - offsetPx);
        })();

  if (targetY === null) return;

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  window.scrollTo({
    top: targetY,
    behavior: reduced ? 'auto' : 'smooth',
  });
}

/**
 * Tracks which section screen is currently active in the viewport
 */
export function useActiveSection(): SectionId {
  const [active, setActive] = useState<SectionId>('topo');

  useEffect(() => {
    let frameId: number | null = null;

    const detect = () => {
      frameId = null;
      const scrollMarker = window.scrollY + window.innerHeight * 0.38;
      let current: SectionId = 'topo';

      for (const id of SECTION_IDS) {
        const el = document.getElementById(id);
        if (!el) continue;
        const absTop = el.getBoundingClientRect().top + window.scrollY;
        if (absTop <= scrollMarker) {
          current = id;
        }
      }
      setActive(current);
    };

    const onScroll = () => {
      if (frameId === null) {
        frameId = window.requestAnimationFrame(detect);
      }
    };

    detect();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (frameId !== null) window.cancelAnimationFrame(frameId);
    };
  }, []);

  return active;
}

export interface ContactPrefillDetail {
  topic: string;
  message?: string;
}

/**
 * Transitions cleanly to #contato and pre-populates composer topic/message
 */
export function prefillAndScrollToContact(topic: string, message?: string) {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(
      new CustomEvent<ContactPrefillDetail>('portfolio:prefill-contact', {
        detail: { topic, message },
      })
    );
  }
  smoothScrollTo('#contato');
}
