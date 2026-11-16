import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import {
  ARCH_NODES,
  EDUCATION,
  EXECUTIVE_EDGE,
  EXPERIENCE,
  PROFILE,
  SERVICES_LIST,
  SHOWCASE_PROJECTS,
  TESTIMONIALS,
} from './data/portfolio';
import { SCREEN_DIRECTORY } from './utils/navigation';

export type Lang = 'pt' | 'en';
export type Theme = 'dark' | 'light';

type Prefs = {
  lang: Lang;
  theme: Theme;
  setLang: (lang: Lang) => void;
  setTheme: (theme: Theme) => void;
};

const PrefsContext = createContext<Prefs | null>(null);

function readLang(): Lang {
  try {
    return localStorage.getItem('lang') === 'en' ? 'en' : 'pt';
  } catch {
    return 'pt';
  }
}

function readTheme(): Theme {
  try {
    return localStorage.getItem('theme') === 'light' ? 'light' : 'dark';
  } catch {
    return 'dark';
  }
}

export function PrefsProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(readLang);
  const [theme, setThemeState] = useState<Theme>(readTheme);

  useEffect(() => {
    document.documentElement.classList.toggle('light', theme === 'light');
    document.documentElement.lang = lang === 'en' ? 'en' : 'pt-BR';
    document.title =
      lang === 'en'
        ? 'Andrey Ramos | Profile and work'
        : 'Andrey Ramos | Perfil e trabalhos';
    try {
      localStorage.setItem('theme', theme);
      localStorage.setItem('lang', lang);
    } catch {
      /* ignore private mode */
    }
  }, [lang, theme]);

  const value = useMemo<Prefs>(
    () => ({
      lang,
      theme,
      setLang: setLangState,
      setTheme: setThemeState,
    }),
    [lang, theme],
  );

  return <PrefsContext.Provider value={value}>{children}</PrefsContext.Provider>;
}

export function usePrefs() {
  const ctx = useContext(PrefsContext);
  if (!ctx) throw new Error('usePrefs must be used inside PrefsProvider');
  return ctx;
}

const UI = {
  pt: {
    talk: 'Conversar',
    menu: 'Menu',
    openMenu: 'Abrir menu de navegação',
    seeWork: 'Ver trabalhos',
    seeProfile: 'Ver perfil',
    follow: 'Seguir para',
    heroKicker: 'Apresentação · perfil e trabalhos',
    heroLine: 'Crio sistemas, apps e automações que a empresa usa todo dia.',
    heroFocus: 'Sistemas · apps · automação',
    stamp: 'PERFIL · TRABALHOS · ROLAR ·',
    worksHeading: 'Trabalhos em produção',
    worksTitle: 'TRABALHOS SELECIONADOS',
    howItWorks: 'Ver como funciona',
    howBuilt: 'Como foi feito',
    systemMap: 'Como o sistema se organiza',
    profileTitle: '01. Perfil',
    howIWork: 'Como eu trabalho',
    supportLine: 'Do suporte ao sistema que a empresa usa hoje',
    careerTitle: 'Do curso técnico até hoje',
    careerMap: 'Mapa de Evolução · 2014 — Atual',
    footerRole: 'Sistemas, apps e automações',
    introTag: 'SISTEMAS E APPS',
    introLine: 'SISTEMAS · APPS · AUTOMAÇÃO',
    introStatus: 'Abrindo o perfil',
    introSkip: 'CLIQUE PARA AVANÇAR',
    light: 'Claro',
    dark: 'Escuro',
    langLabel: 'Idioma',
    themeLabel: 'Tema',
    nav: [
      { href: '#sobre', id: 'sobre', num: '01', label: 'Perfil' },
      { href: '#projetos', id: 'projetos', num: '02', label: 'Trabalhos' },
      { href: '#atuacao', id: 'atuacao', num: '03', label: 'Atuação' },
      { href: '#trajetoria', id: 'trajetoria', num: '04', label: 'Trajetória' },
      { href: '#depoimentos', id: 'depoimentos', num: '05', label: 'Depoimentos' },
      { href: '#contato', id: 'contato', num: '06', label: 'Contato' },
    ],
    drawer: ['Início', 'Perfil', 'Trabalhos', 'Atuação', 'Trajetória', 'Depoimentos', 'Contato'],
    screens: {
      topo: { label: 'Início', subtitle: 'Quem sou e o que eu faço' },
      sobre: { label: 'Perfil', subtitle: 'Um pouco sobre mim' },
      projetos: { label: 'Trabalhos', subtitle: 'O que já entreguei' },
      atuacao: { label: 'Atuação', subtitle: 'Onde eu posso ajudar' },
      trajetoria: { label: 'Trajetória', subtitle: 'De 2014 até hoje' },
      depoimentos: { label: 'Depoimentos', subtitle: 'O que dizem de quem trabalhou comigo' },
      contato: { label: 'Contato', subtitle: 'WhatsApp, e-mail e conversa' },
    },
    filters: ['Toda a jornada (2014–hoje)', 'Criação de sistemas', 'Suporte e gestão'],
    hints: ['Ver a trajetória', 'Ver esse trabalho', 'Ver onde atuo', 'Ver automações'],
  },
  en: {
    talk: 'Talk',
    menu: 'Menu',
    openMenu: 'Open navigation menu',
    seeWork: 'See the work',
    seeProfile: 'See the profile',
    follow: 'Continue to',
    heroKicker: 'Introduction · profile and work',
    heroLine: 'I build systems, apps, and automations a company uses every day.',
    heroFocus: 'Systems · apps · automation',
    stamp: 'PROFILE · WORK · SCROLL ·',
    worksHeading: 'Work in use',
    worksTitle: 'SELECTED WORK',
    howItWorks: 'See how it works',
    howBuilt: 'How it was built',
    systemMap: 'How the system fits together',
    profileTitle: '01. Profile',
    howIWork: 'How I work',
    supportLine: 'From support desk to the system the company uses',
    careerTitle: 'From technical school to today',
    careerMap: 'Path · 2014 — now',
    footerRole: 'Systems, apps, and automation',
    introTag: 'SYSTEMS AND APPS',
    introLine: 'SYSTEMS · APPS · AUTOMATION',
    introStatus: 'Opening the profile',
    introSkip: 'CLICK TO CONTINUE',
    light: 'Light',
    dark: 'Dark',
    langLabel: 'Language',
    themeLabel: 'Theme',
    nav: [
      { href: '#sobre', id: 'sobre', num: '01', label: 'Profile' },
      { href: '#projetos', id: 'projetos', num: '02', label: 'Work' },
      { href: '#atuacao', id: 'atuacao', num: '03', label: 'Focus' },
      { href: '#trajetoria', id: 'trajetoria', num: '04', label: 'Path' },
      { href: '#depoimentos', id: 'depoimentos', num: '05', label: 'Stories' },
      { href: '#contato', id: 'contato', num: '06', label: 'Contact' },
    ],
    drawer: ['Home', 'Profile', 'Work', 'Focus', 'Path', 'Stories', 'Contact'],
    screens: {
      topo: { label: 'Home', subtitle: 'Who I am and what I do' },
      sobre: { label: 'Profile', subtitle: 'A short introduction' },
      projetos: { label: 'Work', subtitle: 'What I have shipped' },
      atuacao: { label: 'Focus', subtitle: 'Where I can help' },
      trajetoria: { label: 'Path', subtitle: 'From 2014 to today' },
      depoimentos: { label: 'Stories', subtitle: 'What people I worked with say' },
      contato: { label: 'Contact', subtitle: 'WhatsApp, email, and a conversation' },
    },
    filters: ['The whole path (2014–now)', 'Building systems', 'Support and management'],
    hints: ['See the path', 'See this work', 'See where I help', 'See automations'],
  },
} as const;

const EN_PROFILE = {
  role: 'I build the systems a company uses',
  experienceLabel: '9+ years in the field',
  availability: 'Open to new work',
  currentRoleBadge: 'Now at PROANSI',
  bio: 'I update what already exists without stopping the company. And I automate the work someone still does by hand.',
  manifestoParts: {
    statement1: 'Several companies share one system, each in its own space, with fast screens.',
    statement2: 'I update things without stopping the work — and automate whatever repeats.',
  },
  metrics: [
    { value: '9+ years', label: 'Building real systems' },
    { value: 'Many companies', label: 'One system, nothing mixed' },
    { value: 'Phone and PC', label: 'Site, app, and desktop' },
    { value: 'Automatic', label: 'Routines and AI' },
  ],
};

const EN_PROJECTS: Record<string, { titleTop: string; titleBottom: string; category: string; shortDesc: string; fullDesc: string }> = {
  'multi-tenant-core': {
    titleTop: 'MANY',
    titleBottom: 'COMPANIES',
    category: 'One system, many clients',
    shortDesc: 'One system serves several companies. Each one only sees its own data.',
    fullDesc: 'Several companies use the same place. Each one only sees what is theirs, and the old system stays online while that happens.',
  },
  'mobile-desktop': {
    titleTop: 'IN YOUR',
    titleBottom: 'POCKET',
    category: 'Phone, site, and computer',
    shortDesc: 'A phone app, a website, and a desktop program. All tied to the same system.',
    fullDesc: 'People in the field use the phone. People at the office use the computer. Both talk to the same base.',
  },
  'automation-ai': {
    titleTop: 'ON',
    titleBottom: 'AUTOPILOT',
    category: 'Less manual work',
    shortDesc: 'The task the team repeats every day starts running on its own, with help from AI.',
    fullDesc: 'Routines, packaging, and sorting no longer depend on someone clicking the same button. Includes the open Compilador Python project.',
  },
  'android-aosp': {
    titleTop: 'UNDER',
    titleBottom: 'THE HOOD',
    category: 'Inside the phone',
    shortDesc: 'When a normal app is not enough, I change the Android system itself.',
    fullDesc: 'I assemble and adjust the phone system for cases the app store cannot cover.',
  },
};

const EN_ARCH: Record<string, { shortTitle: string; shortSub: string; title: string; desc: string }> = {
  mobile: { shortTitle: 'On the phone', shortSub: 'Everyday app', title: 'Phone app', desc: 'The app the team uses in the field, tied to the company system.' },
  desktop: { shortTitle: 'On the computer', shortSub: 'Office program', title: 'Desktop program', desc: 'The program that stays open all day at the office or on the factory floor.' },
  auto: { shortTitle: 'Automatic', shortSub: 'Routines and AI', title: 'Automatic routines', desc: 'Repeated tasks start happening on their own, with help from AI.' },
  gateway: { shortTitle: 'The front door', shortSub: 'Who gets in', title: 'The front door', desc: 'Each person signs in and only sees their own company.' },
  services: { shortTitle: 'The rules', shortSub: 'How the company works', title: 'The business rules', desc: 'Price, orders, and routine live in one place, and can change without taking the system down.' },
  database: { shortTitle: 'The data', shortSub: 'The company files', title: 'Where the data lives', desc: 'I make lookups faster and update the old base without losing what is already there.' },
};

const EN_SERVICES = [
  { line1: 'BEHIND', line2: 'THE SYSTEM', summary: 'The engine that takes the orders, separates each company, and does not mix the data.' },
  { line1: 'WHAT', line2: 'PEOPLE USE', summary: 'Website, phone app, and desktop program, made for the everyday.' },
  { line1: 'OLDER', line2: 'SYSTEMS', summary: 'I make the system that already exists faster, without closing the company to do it.' },
  { line1: 'ON', line2: 'AUTOPILOT', summary: 'What repeats starts running on its own, with help from AI.' },
  { line1: 'A CUSTOM', line2: 'PHONE', summary: 'I adjust Android itself when a regular app is not enough.' },
];

const EN_EXPERIENCE: Record<string, { role?: string; summary: string; highlights: string[] }> = {
  proansi: {
    summary: 'Today I build the company systems: phone, computer, and what runs behind them, without stopping what already works.',
    highlights: ['Several companies in one system, each in its own space', 'App, site, and program tied together', 'The old system gets faster without closing the operation'],
  },
  hepta: {
    summary: 'When the system stalled, I found the cause and explained it to the people who would fix it.',
    highlights: ['Looked at logs and the database to find the real cause', 'Cleared the worst slowdowns before they reached the code', 'Translated the operation’s needs for the people building the system'],
  },
  tesla: {
    summary: 'I looked after the factory’s technology: what had to work every day.',
    highlights: ['Kept the machines and the network running', 'Chose what to fix first on the floor', 'Lined technology up with the daily operation'],
  },
  'casa-das-vacinas': {
    summary: 'I started in support and went on to build the company’s own systems.',
    highlights: ['Promoted from IT assistant to developer after 3 years', 'Built internal tools and automated clinic routines', 'Kept the network, servers, and daily apps running'],
  },
};

const EN_TESTIMONIALS: Record<string, { role: string; context: string; track: string; quote: string; outcome: string }> = {
  't-multitenant': {
    role: 'ERP architecture lead',
    context: 'Several companies, one system',
    track: 'Systems',
    quote: 'Separating each company inside the same system removed the traffic jams and let us add clients without surprises.',
    outcome: 'Each company stays in its own space',
  },
  't-firebird': {
    role: 'Operations manager',
    context: 'Faster data',
    track: 'Data',
    quote: 'Lookups that froze the daily close dropped to a blink, and we never had to shut the system down.',
    outcome: 'Updated without stopping the work',
  },
  't-mobile': {
    role: 'Mobile lead',
    context: 'App for the field team',
    track: 'Phone',
    quote: 'The app put the field team on the same system as the office, with a clear screen and steady updates.',
    outcome: 'Phone, site, and computer together',
  },
  't-automacao': {
    role: 'Infrastructure specialist',
    context: 'Less manual work',
    track: 'Automation',
    quote: 'Packing and sorting that ate hours now run on their own.',
    outcome: 'Much less repeated work',
  },
  't-n2': {
    role: 'Support supervisor',
    context: 'Finding the real problem',
    track: 'Support',
    quote: 'He could connect the error trail to the data and name the cause before anyone else had to dig into the code.',
    outcome: 'The cause showed up faster',
  },
  't-industrial': {
    role: 'Industrial operations director',
    context: 'From the floor to the system',
    track: 'Management',
    quote: 'Rare to find someone who moves easily between servers, the factory floor, and decisions that actually help the business.',
    outcome: 'Technology tied to the operation',
  },
};

export function useContent() {
  const { lang } = usePrefs();
  return useMemo(() => {
    const ui = UI[lang];
    const profile = lang === 'en' ? { ...PROFILE, ...EN_PROFILE } : PROFILE;
    const projects =
      lang === 'en'
        ? SHOWCASE_PROJECTS.map((item) => ({ ...item, ...EN_PROJECTS[item.id] }))
        : SHOWCASE_PROJECTS;
    const services =
      lang === 'en'
        ? SERVICES_LIST.map((item, index) => ({ ...item, ...EN_SERVICES[index] }))
        : SERVICES_LIST;
    const arch =
      lang === 'en'
        ? ARCH_NODES.map((item) => ({ ...item, ...EN_ARCH[item.id] }))
        : ARCH_NODES;
    const experience =
      lang === 'en'
        ? EXPERIENCE.map((item) => ({ ...item, ...EN_EXPERIENCE[item.id] }))
        : EXPERIENCE;
    const education =
      lang === 'en'
        ? {
            ...EDUCATION,
            course: 'Technical program in information technology',
            summary: 'Technical school: programming, data, and networks.',
            trackLabel: 'Technical training',
          }
        : EDUCATION;
    const edge =
      lang === 'en'
        ? [
            'I have gone from the support desk to running the technology.',
            'I update the old system without stopping the company.',
            'I take the repeated work off the team.',
          ]
        : EXECUTIVE_EDGE;
    const testimonials =
      lang === 'en'
        ? TESTIMONIALS.map((item) => ({ ...item, ...EN_TESTIMONIALS[item.id] }))
        : TESTIMONIALS;
    const screens = SCREEN_DIRECTORY.map((screen) => ({
      ...screen,
      label: ui.screens[screen.id as keyof typeof ui.screens].label,
      title: ui.screens[screen.id as keyof typeof ui.screens].label,
      subtitle: ui.screens[screen.id as keyof typeof ui.screens].subtitle,
    }));
    return { lang, ui, profile, projects, services, arch, experience, education, edge, testimonials, screens };
  }, [lang]);
}
