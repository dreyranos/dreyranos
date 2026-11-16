export interface ShowcaseProject {
  id: string;
  index: string;
  titleTop: string;
  titleBottom: string;
  category: string;
  year: string;
  shortDesc: string;
  fullDesc: string;
  architectureNotes: string[];
  stack: string[];
  metrics: { value: string; label: string }[];
  image: string;
  imageAlt: string;
  repoUrl?: string;
  repoLabel?: string;
}

export interface ArchNode {
  id: string;
  layer: 'client' | 'core' | 'data';
  shortTitle: string;
  shortSub: string;
  title: string;
  desc: string;
  stackLabel: string;
  responsibilities: string[];
}

export interface TechItem {
  id: string;
  name: string;
  category: 'backend' | 'frontend' | 'infra' | 'praticas';
  sub: string;
  usage: string;
}

export interface ExperienceRole {
  id: string;
  company: string;
  role: string;
  period: string;
  duration: string;
  startYear: number;
  endYear: number;
  track: 'dev' | 'infra' | 'mgmt';
  trackLabel: string;
  elevation: number;
  location: string;
  current?: boolean;
  summary: string;
  highlights: string[];
  transitionNote: string;
  subRoles?: { role: string; period: string }[];
}

export interface GitHubRepo {
  name: string;
  description: string | null;
  language: string | null;
  html_url: string;
  homepage: string | null;
  updated_at: string;
}

export interface TestimonialItem {
  id: string;
  index: string;
  author: string;
  initials: string;
  role: string;
  context: string;
  track: string;
  quote: string;
  outcome: string;
  year: string;
}

export const PROFILE = {
  name: 'Andrey Ramos',
  handle: '@dreyranos',
  role: 'Desenvolvedor Full Stack',
  location: 'São José do Rio Preto, SP',
  country: 'Brasil',
  experienceLabel: '9+ anos de experiência',
  availability: 'Disponível para novos projetos',
  email: 'andreyranos@gmail.com',
  whatsappRaw: '5517992083142',
  whatsappDisplay: '(17) 99208-3142',
  githubUrl: 'https://github.com/dreyranos',
  linkedinUrl: 'https://www.linkedin.com/in/andrey-ramos-6302722a3',
  avatarUrl: 'https://github.com/dreyranos.png',
  heroImage: '/src/assets/images/hero_engineering_studio_1794851124552.jpg',
  currentRoleBadge: 'Atuação Atual · Full Stack @ PROANSI',
  bio: 'Construo e sustento sistemas em produção combinando arquitetura de APIs multi-tenant, modernização de sistemas legados e aplicações mobile, web e desktop com foco em precisão técnica, escalabilidade e valor ao negócio.',
  manifestoParts: {
    statement1:
      'Desenvolvedor Full Stack com mais de 9 anos criando APIs Multi-Tenant, modernizando sistemas em Firebird e Delphi e entregando software escalável.',
    statement2:
      'Código legível — decisões documentadas, mudanças incrementais e automação de tudo que for repetitivo.',
  },
  pillars: ['Escalabilidade', 'Desempenho', 'Valor ao Negócio'],
  metrics: [
    { value: '9+ anos', label: 'Engenharia em Produção' },
    { value: 'Multi-Tenant', label: 'APIs Delphi Horse & C# .NET' },
    { value: 'Full Stack', label: 'Web, React Native & Desktop' },
    { value: 'Automação', label: 'Python, Bash & Fluxos de IA' },
  ],
};

export const SHOWCASE_PROJECTS: ShowcaseProject[] = [
  {
    id: 'multi-tenant-core',
    index: '01',
    titleTop: 'MULTI',
    titleBottom: 'TENANT',
    category: 'Backend & Arquitetura',
    year: '2023 — Atual',
    shortDesc:
      'APIs em Delphi Horse e C# .NET com isolamento estrito por cliente sobre bases Firebird SQL modernizadas.',
    fullDesc:
      'Núcleo de serviços corporativos projetado para atender múltiplos clientes simultaneamente com resolução automática de contexto de tenant, autenticação centralizada e refatoração gradual do legado sem interromper a operação em produção.',
    architectureNotes: [
      'Roteamento centralizado com validação de credenciais e isolamento lógico por tenant.',
      'Tuning de consultas críticas em Firebird SQL garantindo baixa latência sob carga concorrente.',
      'Regras de negócio desacopladas em serviços padronizados para consumo simultâneo Web, Mobile e Desktop.',
    ],
    stack: ['Delphi Horse', 'C# .NET', 'Firebird SQL', 'Multi-Tenant', 'REST APIs'],
    metrics: [
      { value: '100%', label: 'Isolamento por Tenant' },
      { value: 'Zero Downtime', label: 'Evolução Incremental' },
    ],
    image: '/src/assets/images/showcase_multitenant_arch_1794851125902.jpg',
    imageAlt: 'Composição arquitetural modular representando isolamento multi-tenant',
  },
  {
    id: 'mobile-desktop',
    index: '02',
    titleTop: 'MOBILE',
    titleBottom: 'DESKTOP',
    category: 'Ecossistema Multiplataforma',
    year: '2020 — Atual',
    shortDesc:
      'Aplicativos em React Native (Expo + NativeWind), interfaces React/Angular e sistemas robustos Delphi VCL/FMX.',
    fullDesc:
      'Entrega ponta a ponta de clientes nativos e web conectados ao mesmo ecossistema de APIs. Aplicativos móveis fluidos para operação em campo e softwares desktop de alta performance para ambientes corporativos e industriais.',
    architectureNotes: [
      'Interfaces mobile responsivas construídas com React Native, Expo e NativeWind.',
      'Aplicações desktop corporativas em Delphi VCL e FMX com comunicação direta com serviços REST.',
      'Portais administrativos em React, TypeScript e Angular com tipagem estrita e alta manutenibilidade.',
    ],
    stack: ['React Native', 'Expo', 'NativeWind', 'TypeScript', 'Angular', 'Delphi FMX/VCL'],
    metrics: [
      { value: '3 Plataformas', label: 'Mobile, Web & Desktop' },
      { value: 'Tipagem Estrita', label: 'TypeScript & Object Pascal' },
    ],
    image: '/src/assets/images/showcase_mobile_desktop_1794851126784.jpg',
    imageAlt: 'Smartphone e notebook em superfície de pedra travertino representando entrega multiplataforma',
  },
  {
    id: 'automation-ai',
    index: '03',
    titleTop: 'PYTHON',
    titleBottom: '& IA OPS',
    category: 'Automação & Compilação',
    year: 'Open Source · 2026',
    shortDesc:
      'Scripts avançados em Python e Bash, pipelines operacionais, compiladores de projetos e fluxos inteligentes com IA.',
    fullDesc:
      'Ferramentas e rotinas desenhadas para eliminar trabalho manual repetitivo. Inclui o projeto aberto Compilador_Python para empacotamento e automação de builds Python, além de orquestrações Bash e workflows assistidos por inteligência artificial.',
    architectureNotes: [
      'Automação de rotinas de build, empacotamento e deploy via Python e Bash em servidores Linux.',
      'Integração de fluxos com modelos de IA para triagem técnica, documentação e produtividade.',
      'Padronização de pipelines repetitivos com logs determinísticos e execução segura.',
    ],
    stack: ['Python', 'Bash', 'Linux', 'Docker', 'Fluxos com IA'],
    metrics: [
      { value: 'GitHub', label: 'Compilador_Python' },
      { value: 'CI / Scripts', label: 'Automação Contínua' },
    ],
    image: '/src/assets/images/showcase_automation_ai_1794851125718.jpg',
    imageAlt: 'Hardware de servidor com linhas ópticas simbolizando pipelines de automação e IA',
    repoUrl: 'https://github.com/dreyranos/Compilador_Python',
    repoLabel: 'Ver Compilador_Python no GitHub',
  },
  {
    id: 'android-aosp',
    index: '04',
    titleTop: 'ANDROID',
    titleBottom: 'SYSTEMS',
    category: 'Baixo Nível & AOSP',
    year: 'Pesquisa & Builds',
    shortDesc:
      'Compilação e customização de ROMs Android com AOSP e LineageOS, além de projetos nativos em C como MCLA-Recompiled-Mobile.',
    fullDesc:
      'Exploração profunda da camada de sistema operacional e compilação nativa: configuração de árvores de dispositivos, builds completos de AOSP e LineageOS em Linux e recompilação/portabilidade de software nativo em C para dispositivos móveis.',
    architectureNotes: [
      'Build e customização de imagens AOSP e LineageOS sob medida em ambiente Linux.',
      'Portabilidade de código nativo em C para arquitetura mobile no repositório MCLA-Recompiled-Mobile.',
      'Ajustes em nível de sistema para estabilidade, performance e controle de hardware.',
    ],
    stack: ['AOSP', 'LineageOS', 'C', 'Linux', 'Android'],
    metrics: [
      { value: 'AOSP', label: 'Builds & Kernel' },
      { value: 'Linguagem C', label: 'Portabilidade Mobile' },
    ],
    image: '/src/assets/images/showcase_android_aosp_1794851127426.jpg',
    imageAlt: 'Placa eletrônica e tela móvel sobre pedra basáltica representando engenharia AOSP e baixo nível',
    repoUrl: 'https://github.com/dreyranos/MCLA-Recompiled-Mobile',
    repoLabel: 'Ver MCLA-Recompiled-Mobile no GitHub',
  },
];

export const ARCH_NODES: ArchNode[] = [
  {
    id: 'mobile',
    layer: 'client',
    shortTitle: 'App Mobile',
    shortSub: 'React Native + Expo',
    title: 'App Mobile — React Native + Expo',
    desc: 'Aplicativos móveis multiplataforma com interface fluida usando NativeWind, consumindo endpoints autenticados e isolados por tenant.',
    stackLabel: 'React Native · Expo · NativeWind',
    responsibilities: [
      'Navegação nativa e cache local resiliente',
      'Autenticação JWT com escopo automático de tenant',
      'Design system consistente via NativeWind',
    ],
  },
  {
    id: 'desktop',
    layer: 'client',
    shortTitle: 'App Desktop',
    shortSub: 'Delphi FMX / VCL',
    title: 'App Desktop — Delphi FMX / VCL',
    desc: 'Aplicações desktop de alto desempenho em ambientes corporativos e industriais, integradas às APIs modernas e sistemas em produção.',
    stackLabel: 'Delphi FMX · Delphi VCL',
    responsibilities: [
      'Operação contínua em estações Windows corporativas',
      'Integração híbrida com banco legado e APIs REST',
      'Evolução gradual de telas críticas sem parada operacional',
    ],
  },
  {
    id: 'auto',
    layer: 'client',
    shortTitle: 'Automações',
    shortSub: 'Python / Bash / IA',
    title: 'Automações — Python / Bash / IA',
    desc: 'Pipelines automatizados, rotinas agendadas e fluxos inteligentes com IA eliminando tarefas manuais e integrando sistemas.',
    stackLabel: 'Python · Bash · Fluxos com IA',
    responsibilities: [
      'Orquestração de backups, builds e verificações em Linux',
      'Processamento automatizado e enriquecimento com IA',
      'Monitoramento e alertas operacionais determinísticos',
    ],
  },
  {
    id: 'gateway',
    layer: 'core',
    shortTitle: 'API Gateway',
    shortSub: 'Autenticação + Tenant Isolation',
    title: 'API Gateway — Autenticação + Tenant',
    desc: 'Roteamento centralizado com validação de credenciais e resolução automática de contexto por tenant, permitindo que múltiplos clientes operem de forma isolada e segura sobre a mesma infraestrutura.',
    stackLabel: 'Delphi Horse · C# .NET',
    responsibilities: [
      'Validação de tokens e resolução imediata do contexto do cliente',
      'Padronização de payloads, contratos e tratamento de erros',
      'Controle de acesso e isolamento estrito entre tenants',
    ],
  },
  {
    id: 'services',
    layer: 'data',
    shortTitle: 'Serviços de Negócio',
    shortSub: 'Regras padronizadas & integrações',
    title: 'Serviços de Negócio & Integrações',
    desc: 'Camada desacoplada com regras de negócio padronizadas, integração com serviços externos e evolução incremental sem impacto no cliente.',
    stackLabel: 'Arquitetura Backend · Integrações',
    responsibilities: [
      'Encapsulamento de regras fiscais, operacionais e de domínio',
      'Desacoplamento progressivo de módulos monolíticos',
      'Integrações REST e filas com tolerância a falhas',
    ],
  },
  {
    id: 'database',
    layer: 'data',
    shortTitle: 'Firebird SQL',
    shortSub: 'Base legada modernizada & otimizada',
    title: 'Firebird SQL — Camada de Dados',
    desc: 'Otimização de queries críticas, modelagem relacional segura e modernização gradual de bases legadas mantendo total integridade em produção.',
    stackLabel: 'Firebird SQL · Tuning & Legado',
    responsibilities: [
      'Análise de planos de execução e criação de índices estratégicos',
      'Migrações seguras compatíveis com sistemas legados ativos',
      'Integridade transacional e alta disponibilidade em produção',
    ],
  },
];

export const SERVICES_LIST = [
  {
    index: '01.',
    line1: 'BACKEND &',
    line2: 'ARQUITETURA',
    align: 'left' as const,
    summary:
      'APIs em Delphi com Horse e em C# .NET, modelagem multi-tenant com isolamento por cliente, integrações complexas e padronização de serviços.',
    highlights: ['Delphi Horse', 'C# .NET', 'Multi-Tenant'],
  },
  {
    index: '02.',
    line1: 'WEB, MOBILE',
    line2: '& DESKTOP',
    align: 'right' as const,
    summary:
      'Interfaces web modernas com Angular e React, aplicativos com React Native (Expo) + NativeWind e desktop robusto em Delphi VCL e FMX.',
    highlights: ['React Native + Expo', 'Angular / React', 'Delphi FMX / VCL'],
  },
  {
    index: '03.',
    line1: 'DADOS &',
    line2: 'LEGADO',
    align: 'left' as const,
    summary:
      'Especialista em Firebird SQL, tuning de consultas críticas e refatoração incremental sem parar a operação em produção.',
    highlights: ['Firebird SQL', 'Tuning de Queries', 'Refatoração Segura'],
  },
  {
    index: '04.',
    line1: 'AUTOMAÇÃO',
    line2: '& FLUXOS IA',
    align: 'right' as const,
    summary:
      'Scripts avançados em Python e Bash, pipelines de automação operacional e fluxos de trabalho inteligentes com IA.',
    highlights: ['Python', 'Bash', 'Fluxos de IA'],
  },
  {
    index: '05.',
    line1: 'ANDROID',
    line2: 'CUSTOMIZADO',
    align: 'left' as const,
    summary:
      'Customização em baixo nível, compilação e build de ROMs Android sob medida utilizando AOSP e LineageOS em ambiente Linux.',
    highlights: ['AOSP', 'LineageOS', 'Linux'],
  },
];

export const TECH_STACK: TechItem[] = [
  { id: 'horse', name: 'Horse (Delphi)', category: 'backend', sub: 'APIs em Delphi', usage: 'Construção de APIs REST leves com middleware centralizado de autenticação e resolução multi-tenant.' },
  { id: 'dotnet', name: 'C# .NET', category: 'backend', sub: 'Backend & APIs', usage: 'Serviços backend tipados, microsserviços integradores e regras de domínio corporativas.' },
  { id: 'python', name: 'Python', category: 'backend', sub: 'Automação & IA', usage: 'Scripts de compilação (Compilador_Python), automações operacionais e fluxos com IA.' },
  { id: 'bash', name: 'Bash', category: 'backend', sub: 'Scripts & Pipelines', usage: 'Rotinas determinísticas de deploy, build e manutenção em ambientes Linux.' },
  { id: 'ts', name: 'TypeScript', category: 'frontend', sub: 'Tipagem Estática', usage: 'Base estritamente tipada para aplicações web React, Angular e mobile Expo.' },
  { id: 'js', name: 'JavaScript', category: 'frontend', sub: 'Web & Runtime', usage: 'Interatividade de clientes web, automações de build e integração com APIs.' },
  { id: 'react', name: 'React', category: 'frontend', sub: 'Interfaces Web', usage: 'Painéis administrativos, portais responsivos e interfaces de alta reatividade.' },
  { id: 'rn', name: 'React Native', category: 'frontend', sub: 'Apps Mobile', usage: 'Aplicativos móveis em produção integrados em tempo real às APIs multi-tenant.' },
  { id: 'expo', name: 'Expo', category: 'frontend', sub: 'Ecossistema Mobile', usage: 'Build, distribuição OTA e aceleração de entregas multiplataforma Android/iOS.' },
  { id: 'nw', name: 'NativeWind', category: 'frontend', sub: 'Estilização Mobile', usage: 'Design system utilitário consistente entre projetos web Tailwind e apps mobile.' },
  { id: 'tw', name: 'Tailwind CSS', category: 'frontend', sub: 'UI Moderna', usage: 'Arquitetura visual enxuta e responsiva com tokens consistentes e zero CSS redundante.' },
  { id: 'ng', name: 'Angular', category: 'frontend', sub: 'Web Corporativa', usage: 'Sistemas web corporativos estruturados em módulos, formulários complexos e serviços REST.' },
  { id: 'fmx', name: 'Delphi FMX', category: 'frontend', sub: 'Multiplataforma', usage: 'Aplicações cliente ricas com performance nativa integradas ao núcleo REST.' },
  { id: 'vcl', name: 'Delphi VCL', category: 'frontend', sub: 'Desktop Windows', usage: 'Sustentação e evolução gradual de ERPs desktop críticos sem parar a operação.' },
  { id: 'firebird', name: 'Firebird SQL', category: 'infra', sub: 'Banco de Dados', usage: 'Tuning de planos de execução, índices críticos e modernização segura de esquemas legados.' },
  { id: 'linux', name: 'Linux', category: 'infra', sub: 'Servidores & CLI', usage: 'Operação em produção, scripts Bash, containers e builds completos de Android AOSP.' },
  { id: 'windows', name: 'Windows', category: 'infra', sub: 'Ambiente Desktop', usage: 'Homologação e sustentação de sistemas VCL/desktop em parques corporativos.' },
  { id: 'docker', name: 'Docker', category: 'infra', sub: 'Containers', usage: 'Padronização de ambientes isolados para serviços, builds e bancos de teste.' },
  { id: 'git', name: 'Git', category: 'infra', sub: 'Versionamento', usage: 'Fluxos incrementais documentados, revisão de código e rastreabilidade de entregas.' },
  { id: 'android', name: 'Android', category: 'infra', sub: 'Sistema & AOSP', usage: 'Compilação de sistema operacional, trees de dispositivos e projetos nativos em C.' },
  { id: 'lineage', name: 'LineageOS', category: 'infra', sub: 'ROMs Customizadas', usage: 'Adaptação e compilação de ROMs customizadas focadas em estabilidade e controle.' },
  { id: 'mt', name: 'APIs Multi-Tenant', category: 'praticas', sub: 'Arquitetura', usage: 'Isolamento estrito por cliente sobre infraestrutura compartilhada com resolução no gateway.' },
  { id: 'ref', name: 'Refatoração de Legado', category: 'praticas', sub: 'Evolução Segura', usage: 'Extração progressiva de regras monolíticas mantendo compatibilidade em produção.' },
  { id: 'auto', name: 'Automação de Processos', category: 'praticas', sub: 'Produtividade', usage: 'Eliminação de gargalos manuais repetitivos com scripts e pipelines auditáveis.' },
  { id: 'ai', name: 'Fluxos com IA', category: 'praticas', sub: 'Workflows Inteligentes', usage: 'Orquestração de modelos de IA para triagem técnica, síntese e produtividade de engenharia.' },
];

export const EXPERIENCE: ExperienceRole[] = [
  {
    id: 'proansi',
    company: 'PROANSI',
    role: 'Desenvolvedor Full Stack',
    period: 'jul. 2023 – presente',
    duration: '3 anos 5 meses',
    startYear: 2023.5,
    endYear: 2026.9,
    track: 'dev',
    trackLabel: 'Engenharia Full Stack',
    elevation: 5,
    location: 'São José do Rio Preto, SP',
    current: true,
    summary:
      'Atuação direta no desenvolvimento full stack, arquitetura de APIs multi-tenant, evolução de aplicativos mobile e desktop e modernização contínua de sistemas em produção.',
    highlights: [
      'Arquitetura de APIs multi-tenant em Delphi Horse e C# .NET',
      'Aplicativos mobile (React Native + Expo) e portais Web integrados',
      'Otimização crítica em Firebird SQL e evolução de legado sem downtime',
    ],
    transitionNote:
      'Ciclo atual consolidando visão de infraestrutura, suporte N2 e gestão em arquitetura de produção end-to-end.',
  },
  {
    id: 'hepta',
    company: 'Hepta Tecnologia e Informática',
    role: 'Analista de Suporte N2',
    period: 'out. 2022 – jun. 2023',
    duration: '9 meses',
    startYear: 2022.75,
    endYear: 2023.48,
    track: 'infra',
    trackLabel: 'Sustentação & Dados N2',
    elevation: 4,
    location: 'São José do Rio Preto, SP',
    summary:
      'Diagnóstico avançado de incidentes em produção, análise de banco de dados, sustentação técnica e interface direta entre operação e engenharia.',
    highlights: [
      'Investigação de causa raiz diretamente em logs e consultas SQL',
      'Resolução de gargalos críticos antes do escalonamento para código',
      'Ponte técnica entre demandas operacionais e squad de desenvolvimento',
    ],
    transitionNote:
      'Aprofundou o olhar diagnóstico sobre falhas em produção que hoje guia decisões preventivas de arquitetura.',
  },
  {
    id: 'tesla',
    company: 'Tesla Marcações Industriais',
    role: 'Gestor de TI',
    period: 'jun. 2022 – set. 2022',
    duration: '4 meses',
    startYear: 2022.42,
    endYear: 2022.74,
    track: 'mgmt',
    trackLabel: 'Gestão & Governança de TI',
    elevation: 3.5,
    location: 'São José do Rio Preto, SP',
    summary:
      'Gestão de infraestrutura, governança de tecnologia, continuidade operacional e alinhamento técnico junto às áreas industriais.',
    highlights: [
      'Governança de parque tecnológico e priorização de demandas industriais',
      'Continuidade operacional e padronização de rotinas de infraestrutura',
      'Alinhamento estratégico entre tecnologia e metas da operação',
    ],
    transitionNote:
      'Trouxe visão executiva de custo, risco operacional e impacto direto no negócio para cada entrega técnica.',
  },
  {
    id: 'casa-das-vacinas',
    company: 'Casa das Vacinas',
    role: 'Desenvolvedor & Assistente de TI',
    period: 'jan. 2017 – jun. 2022',
    duration: '5 anos 6 meses',
    startYear: 2017.0,
    endYear: 2022.41,
    track: 'dev',
    trackLabel: 'Base TI → Desenvolvimento',
    elevation: 2.5,
    location: 'São José do Rio Preto, SP',
    summary:
      'Trajetória contínua evoluindo da sustentação de infraestrutura de TI até o desenvolvimento interno de sistemas e automações operacionais.',
    highlights: [
      'Promoção interna de Assistente de TI para Desenvolvedor após 3 anos',
      'Criação de ferramentas internas e automação de rotinas clínicas/operacionais',
      'Sustentação completa de rede, servidores e aplicações em uso diário',
    ],
    transitionNote:
      'Onde nasceu a transição prática da infraestrutura pura para construção de software sob medida.',
    subRoles: [
      { role: 'Desenvolvedor', period: 'jan. 2020 – jun. 2022 · 2 anos 6 meses' },
      { role: 'Assistente de TI', period: 'jan. 2017 – jan. 2020 · 3 anos 1 mês' },
    ],
  },
];

export const EDUCATION = {
  id: 'etec',
  school: 'Etec Philadelpho Gouvêa Netto',
  course: 'Curso Técnico Integrado em Tecnologia da Informação',
  period: '2014 – 2016',
  duration: '3 anos',
  startYear: 2014.0,
  endYear: 2016.9,
  trackLabel: 'Formação Técnica em TI',
  elevation: 1.3,
  summary:
    'Formação técnica estruturada em lógica de programação, bancos de dados relacionais, redes e fundamentos de engenharia de software.',
  highlights: [
    'Lógica estruturada, algoritmos e orientação a objetos',
    'Fundamentos de modelagem SQL, redes e sistemas operacionais',
    'Primeiros projetos práticos em desenvolvimento e infraestrutura',
  ],
  transitionNote:
    'Alicerce técnico que abriu a porta para o primeiro ciclo profissional em TI logo após a conclusão.',
};

export const EXECUTIVE_EDGE = [
  'Vivência real de infraestrutura e suporte N2 até arquitetura e gestão de TI.',
  'Capacidade de manter o legado estável enquanto constrói o novo ecossistema.',
  'Foco pragmático em produtividade com automação (Python, Bash e IA).',
];

export const FALLBACK_REPOS: GitHubRepo[] = [
  {
    name: 'dreyranos',
    description: 'Portfólio técnico e arquitetura de referência em TypeScript e React.',
    language: 'TypeScript',
    html_url: 'https://github.com/dreyranos/dreyranos',
    homepage: 'https://dreyranos.vercel.app',
    updated_at: '2026-11-16T15:11:07Z',
  },
  {
    name: 'Compilador_Python',
    description: 'Compilador de Projetos em Python para automação de empacotamento.',
    language: 'Python',
    html_url: 'https://github.com/dreyranos/Compilador_Python',
    homepage: null,
    updated_at: '2026-11-15T23:45:12Z',
  },
  {
    name: 'MCLA-Recompiled-Mobile',
    description: 'Estudo de recompilação e portabilidade nativa em linguagem C para mobile.',
    language: 'C',
    html_url: 'https://github.com/dreyranos/MCLA-Recompiled-Mobile',
    homepage: null,
    updated_at: '2026-10-21T18:52:58Z',
  },
];

export const TESTIMONIALS: TestimonialItem[] = [
  {
    id: 't-multitenant',
    index: '01',
    author: 'Rafael Mendes',
    initials: 'RM',
    role: 'Coordenador de Arquitetura ERP',
    context: 'Ecossistema Multi-Tenant · Produção',
    track: 'Delphi Horse · C# .NET',
    quote:
      'A reestruturação das APIs com isolamento estrito por tenant eliminou gargalos de concorrência e permitiu escalar novos clientes mantendo total previsibilidade na operação.',
    outcome: '100% de isolamento lógico entre empresas',
    year: '2025',
  },
  {
    id: 't-firebird',
    index: '02',
    author: 'Camila Ferreira',
    initials: 'CF',
    role: 'Gerente de Operações & Dados',
    context: 'Modernização de Legado & SQL',
    track: 'Firebird SQL · Tuning',
    quote:
      'Consultas críticas que travavam o fechamento operacional foram reduzidas para milissegundos sem parar nenhum módulo ativo em Delphi VCL durante a migração.',
    outcome: 'Evolução incremental sem downtime',
    year: '2024',
  },
  {
    id: 't-mobile',
    index: '03',
    author: 'Lucas Andrade',
    initials: 'LA',
    role: 'Líder Técnico Mobile',
    context: 'Aplicativo de Operação em Campo',
    track: 'React Native · Expo · NativeWind',
    quote:
      'O aplicativo entregue conectou o time de campo às mesmas APIs do ERP corporativo com interface limpa, sincronização resiliente e entregas frequentes sem regressões.',
    outcome: 'Experiência única Web, Mobile & Desktop',
    year: '2025',
  },
  {
    id: 't-automacao',
    index: '04',
    author: 'Thiago Nogueira',
    initials: 'TN',
    role: 'Especialista de Infraestrutura & DevOps',
    context: 'Pipelines de Build & Automação',
    track: 'Python · Bash · Fluxos de IA',
    quote:
      'Rotinas manuais de empacotamento e triagem que consumiam horas da equipe passaram a rodar de forma determinística via scripts Python, Bash e workflows assistidos por IA.',
    outcome: 'Redução drástica de retrabalho manual',
    year: '2026',
  },
  {
    id: 't-n2',
    index: '05',
    author: 'Mariana Costa',
    initials: 'MC',
    role: 'Supervisora de Atendimento Técnico',
    context: 'Sustentação Crítica & N2',
    track: 'Diagnóstico · Banco & Logs',
    quote:
      'A facilidade de cruzar logs de aplicação com planos SQL acelerava o diagnóstico de incidentes antes mesmo de escalar para o código, elevando o SLA da operação.',
    outcome: 'Causa raiz identificada com precisão',
    year: '2023',
  },
  {
    id: 't-industrial',
    index: '06',
    author: 'Eduardo Silveira',
    initials: 'ES',
    role: 'Diretor de Operações Industriais',
    context: 'Governança & Continuidade de TI',
    track: 'Gestão de TI · Sistemas',
    quote:
      'Raro encontrar alguém que transita com naturalidade entre servidores, suporte ao chão de fábrica e decisões de arquitetura focadas no retorno real para o negócio.',
    outcome: 'Visão prática de infraestrutura ao negócio',
    year: '2024',
  },
];
