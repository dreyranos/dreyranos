export type FlowNodeSlot =
  | 'leftTop'
  | 'leftMid'
  | 'leftBot'
  | 'centerHub'
  | 'rightTop'
  | 'rightBot';

export type FlowIconKey =
  | 'mobile'
  | 'desktop'
  | 'web'
  | 'terminal'
  | 'layers'
  | 'server'
  | 'database'
  | 'cpu'
  | 'sparkles'
  | 'shield'
  | 'flame'
  | 'code';

export interface FlowProgramNode {
  slot: FlowNodeSlot;
  label: string;
  sub: string;
  icon: FlowIconKey;
}

export interface FlowProgramScene {
  id: string;
  num: string;
  title: string;
  shortTitle: string;
  fromSlot: FlowNodeSlot;
  toSlot: FlowNodeSlot;
  activeSlots: FlowNodeSlot[];
  narration: string;
  packetLabel: string;
  highlights: string[];
}

export type FlowStageMode =
  | 'hub-topology'
  | 'multi-device'
  | 'sql-tuning'
  | 'pipeline-terminal'
  | 'aosp-stack';

export interface FlowProgram {
  id: string;
  index: string;
  stageMode: FlowStageMode;
  title: string;
  subtitle: string;
  linkedBlueprintNodeId: string;
  zones: [string, string, string];
  nodes: Record<FlowNodeSlot, FlowProgramNode>;
  wires: Array<{ from: FlowNodeSlot; to: FlowNodeSlot }>;
  scenes: FlowProgramScene[];
}

export const SLOT_COORDS: Record<FlowNodeSlot, { x: number; y: number }> = {
  leftTop: { x: 130, y: 92 },
  leftMid: { x: 130, y: 220 },
  leftBot: { x: 130, y: 348 },
  centerHub: { x: 430, y: 220 },
  rightTop: { x: 730, y: 145 },
  rightBot: { x: 730, y: 300 },
};

export const FLOW_PROGRAMS: FlowProgram[] = [
  {
    id: '01.',
    index: '01',
    stageMode: 'hub-topology',
    title: 'Backend & Arquitetura Multi-Tenant',
    subtitle: 'Delphi Horse · C# .NET · Isolamento por Cliente',
    linkedBlueprintNodeId: 'gateway',
    zones: ['01 · CLIENTE / ORIGEM', '02 · GATEWAY MULTI-TENANT', '03 · DOMÍNIO & FIREBIRD'],
    nodes: {
      leftTop: {
        slot: 'leftTop',
        label: 'App Mobile',
        sub: 'React Native + Expo',
        icon: 'mobile',
      },
      leftMid: {
        slot: 'leftMid',
        label: 'Portal & Desktop',
        sub: 'Web / Delphi FMX-VCL',
        icon: 'desktop',
      },
      leftBot: {
        slot: 'leftBot',
        label: 'Integrações B2B',
        sub: 'Webhooks & Parceiros',
        icon: 'code',
      },
      centerHub: {
        slot: 'centerHub',
        label: 'API Gateway',
        sub: 'Delphi Horse · C# .NET',
        icon: 'layers',
      },
      rightTop: {
        slot: 'rightTop',
        label: 'Serviços de Negócio',
        sub: 'Regras Desacopladas',
        icon: 'server',
      },
      rightBot: {
        slot: 'rightBot',
        label: 'Firebird SQL',
        sub: 'Escopo Isolado/Tenant',
        icon: 'database',
      },
    },
    wires: [
      { from: 'leftTop', to: 'centerHub' },
      { from: 'leftMid', to: 'centerHub' },
      { from: 'leftBot', to: 'centerHub' },
      { from: 'centerHub', to: 'rightTop' },
      { from: 'rightTop', to: 'rightBot' },
      { from: 'centerHub', to: 'rightBot' },
    ],
    scenes: [
      {
        id: 'mt-origin',
        num: '01',
        title: 'Autenticação e Identificação de Tenant',
        shortTitle: 'Entrada Autenticada',
        fromSlot: 'leftTop',
        toSlot: 'centerHub',
        activeSlots: ['leftTop', 'leftMid', 'centerHub'],
        narration:
          'Clientes Mobile, Web ou Desktop disparam chamadas REST carregando token JWT e identificador único da empresa no cabeçalho da requisição.',
        packetLabel: 'POST /api/v1/operacao · Header: X-Tenant-ID + Bearer JWT',
        highlights: [
          'Mesmo contrato REST consumido por Mobile, Web e Desktop',
          'Validação prévia de origem e versão de API no cliente',
          'Rastreabilidade ponta a ponta desde a primeira requisição',
        ],
      },
      {
        id: 'mt-gateway',
        num: '02',
        title: 'Middleware Central em Delphi Horse & C# .NET',
        shortTitle: 'Isolamento no Gateway',
        fromSlot: 'leftMid',
        toSlot: 'centerHub',
        activeSlots: ['centerHub'],
        narration:
          'O gateway intercepta a chamada, valida assinatura e permissões e fixa o contexto isolado do tenant antes de qualquer acesso às regras ou ao banco.',
        packetLabel: 'Horse.Middleware.TenantGuard() -> Escopo #042 Ativado',
        highlights: [
          'Zero mistura de dados entre diferentes clientes em produção',
          'Padronização única de logs, exceções e respostas JSON',
          'Baixa sobrecarga com pool de conexões direcionado por tenant',
        ],
      },
      {
        id: 'mt-services',
        num: '03',
        title: 'Orquestração de Regras de Domínio',
        shortTitle: 'Serviços Desacoplados',
        fromSlot: 'centerHub',
        toSlot: 'rightTop',
        activeSlots: ['centerHub', 'rightTop'],
        narration:
          'A camada de serviços aplica regras fiscais, operacionais e integrações externas sem acoplamento com a interface ou com o framework HTTP.',
        packetLabel: 'DomainService.Processar() -> Validações & Contrato OK',
        highlights: [
          'Regras centralizadas fáceis de testar e manter em produção',
          'Integração resiliente com webhooks e APIs de terceiros',
          'Reaproveitamento imediato para novas frentes de negócio',
        ],
      },
      {
        id: 'mt-firebird',
        num: '04',
        title: 'Persistência Direcionada no Firebird SQL',
        shortTitle: 'Gravação Isolada',
        fromSlot: 'rightTop',
        toSlot: 'rightBot',
        activeSlots: ['rightTop', 'rightBot'],
        narration:
          'As instruções SQL executam já filtradas no contexto do cliente com controle transacional rígido e planos de execução indexados.',
        packetLabel: 'FIREBIRD SQL · Transação Isolada · Commit Seguro OK',
        highlights: [
          'Consultas ajustadas para alto volume concorrente',
          'Compatibilidade total com estruturas corporativas ativas',
          'Retorno rápido de payloads para o núcleo da API',
        ],
      },
      {
        id: 'mt-response',
        num: '05',
        title: 'Entrega Uniforme e Auditoria Contínua',
        shortTitle: 'Retorno & Telemetria',
        fromSlot: 'centerHub',
        toSlot: 'leftBot',
        activeSlots: ['centerHub', 'leftTop', 'leftMid', 'leftBot'],
        narration:
          'A resposta padronizada retorna aos clientes conectados e às integrações B2B em tempo real, encerrando o ciclo com integridade garantida.',
        packetLabel: 'HTTP 200 OK · Payload Enxuto Entregue · Zero Downtime',
        highlights: [
          'Redução drástica no tempo de onboarding de novos clientes',
          'Base única escalável sem replicar infraestrutura manual',
          'Ciclo completo observável e pronto para crescer',
        ],
      },
    ],
  },
  {
    id: '02.',
    index: '02',
    stageMode: 'multi-device',
    title: 'Web, Mobile & Desktop Multiplataforma',
    subtitle: 'React Native + Expo · React / Angular · Delphi FMX & VCL',
    linkedBlueprintNodeId: 'mobile',
    zones: ['01 · INTERFACE & EXPERIÊNCIA', '02 · CONTRATOS & ESTADO', '03 · PLATAFORMAS ALVO'],
    nodes: {
      leftTop: {
        slot: 'leftTop',
        label: 'UI & NativeWind',
        sub: 'Design System Consistente',
        icon: 'sparkles',
      },
      leftMid: {
        slot: 'leftMid',
        label: 'Tipagem Estrita',
        sub: 'TypeScript & Pascal',
        icon: 'code',
      },
      leftBot: {
        slot: 'leftBot',
        label: 'Cache & Offline',
        sub: 'Resiliência em Campo',
        icon: 'shield',
      },
      centerHub: {
        slot: 'centerHub',
        label: 'Camada de API',
        sub: 'Contratos JSON & Sync',
        icon: 'layers',
      },
      rightTop: {
        slot: 'rightTop',
        label: 'Mobile & Web',
        sub: 'React Native · Angular/React',
        icon: 'mobile',
      },
      rightBot: {
        slot: 'rightBot',
        label: 'Desktop Nativo',
        sub: 'Delphi VCL & FMX',
        icon: 'desktop',
      },
    },
    wires: [
      { from: 'leftTop', to: 'centerHub' },
      { from: 'leftMid', to: 'centerHub' },
      { from: 'leftBot', to: 'centerHub' },
      { from: 'centerHub', to: 'rightTop' },
      { from: 'centerHub', to: 'rightBot' },
      { from: 'rightTop', to: 'rightBot' },
    ],
    scenes: [
      {
        id: 'plat-design',
        num: '01',
        title: 'Padronização Visual entre Web e Mobile',
        shortTitle: 'Tokens & NativeWind',
        fromSlot: 'leftTop',
        toSlot: 'centerHub',
        activeSlots: ['leftTop', 'leftMid', 'centerHub'],
        narration:
          'A interface nasce padronizada com Tailwind CSS na Web e NativeWind no React Native, mantendo coerência visual e agilidade na entrega de novas telas.',
        packetLabel: 'UI System · Tailwind + NativeWind · Componentes Reutilizáveis',
        highlights: [
          'Experiência responsiva adaptada do celular ao monitor amplo',
          'Menos retrabalho de interface entre portais e aplicativos',
          'Foco em clareza operacional para o usuário final',
        ],
      },
      {
        id: 'plat-mobile',
        num: '02',
        title: 'Operação Ágil em React Native + Expo',
        shortTitle: 'App Mobile em Campo',
        fromSlot: 'centerHub',
        toSlot: 'rightTop',
        activeSlots: ['centerHub', 'rightTop', 'leftBot'],
        narration:
          'Aplicativos móveis em React Native (Expo) operam fluidos em campo com navegação nativa, cache resiliente e sincronização direta com a API central.',
        packetLabel: 'Expo + React Native · Sync Automático Mobile -> Gateway',
        highlights: [
          'Builds ágeis e entregas contínuas Android e iOS via Expo',
          'Tratamento seguro para oscilações de rede em campo',
          'Tipagem estrita em TypeScript prevenindo falhas em tela',
        ],
      },
      {
        id: 'plat-web',
        num: '03',
        title: 'Portais Administrativos em React & Angular',
        shortTitle: 'Interfaces Web Corporativas',
        fromSlot: 'leftMid',
        toSlot: 'rightTop',
        activeSlots: ['leftMid', 'centerHub', 'rightTop'],
        narration:
          'Dashboards gerenciais e portais corporativos em React e Angular consomem os mesmos contratos REST tipados para relatórios e gestão em tempo real.',
        packetLabel: 'SPA TypeScript · Formulários Complexos & Listagens Rápidas',
        highlights: [
          'Arquitetura modular escalável para múltiplas rotinas web',
          'Feedback imediato de estado, filtros e validações',
          'Integração transparente com autenticação centralizada',
        ],
      },
      {
        id: 'plat-desktop',
        num: '04',
        title: 'Desktop Robusto em Delphi VCL & FMX',
        shortTitle: 'Estações Corporativas',
        fromSlot: 'centerHub',
        toSlot: 'rightBot',
        activeSlots: ['centerHub', 'rightBot'],
        narration:
          'No ambiente corporativo e industrial Windows, aplicações Delphi VCL e FMX garantem velocidade nativa e convivem lado a lado com serviços REST modernos.',
        packetLabel: 'Delphi VCL / FMX · Alta Performance em Estações Windows',
        highlights: [
          'Evolução gradual de telas desktop críticas sem interrupção',
          'Comunicação direta com periféricos, impressão e banco local',
          'Integração híbrida com novos recursos web e mobile',
        ],
      },
      {
        id: 'plat-sync',
        num: '05',
        title: 'Ecossistema Conectado em Tempo Real',
        shortTitle: '3 Plataformas em Harmonia',
        fromSlot: 'rightTop',
        toSlot: 'rightBot',
        activeSlots: ['leftTop', 'centerHub', 'rightTop', 'rightBot'],
        narration:
          'O lançamento feito no celular reflete instantaneamente no painel web e no sistema desktop — todos falando a mesma língua sobre uma única fonte de verdade.',
        packetLabel: 'SYNC ATIVO · Mobile + Web + Desktop Unificados',
        highlights: [
          'Mesma regra de negócio aplicada em todas as pontas',
          'Redução de divergências operacionais entre setores',
          'Base sólida para expandir para qualquer nova plataforma',
        ],
      },
    ],
  },
  {
    id: '03.',
    index: '03',
    stageMode: 'sql-tuning',
    title: 'Dados & Modernização de Legado',
    subtitle: 'Firebird SQL · Tuning de Queries · Refatoração Segura',
    linkedBlueprintNodeId: 'database',
    zones: ['01 · DIAGNÓSTICO EM PRODUÇÃO', '02 · TUNING & FACHADA SEGURA', '03 · RESULTADO EM OPERAÇÃO'],
    nodes: {
      leftTop: {
        slot: 'leftTop',
        label: 'Sistema Legado',
        sub: 'Operação 24/7 Ativa',
        icon: 'desktop',
      },
      leftMid: {
        slot: 'leftMid',
        label: 'Queries Lentas',
        sub: 'Gargalos & I/O Alto',
        icon: 'flame',
      },
      leftBot: {
        slot: 'leftBot',
        label: 'Regras Acopladas',
        sub: 'Monólito em Produção',
        icon: 'code',
      },
      centerHub: {
        slot: 'centerHub',
        label: 'Firebird Tuning',
        sub: 'Planos & Índices SQL',
        icon: 'database',
      },
      rightTop: {
        slot: 'rightTop',
        label: 'Camada Limpa',
        sub: 'APIs & Serviços Novos',
        icon: 'layers',
      },
      rightBot: {
        slot: 'rightBot',
        label: 'Zero Downtime',
        sub: 'Entrega Incremental',
        icon: 'shield',
      },
    },
    wires: [
      { from: 'leftTop', to: 'centerHub' },
      { from: 'leftMid', to: 'centerHub' },
      { from: 'leftBot', to: 'centerHub' },
      { from: 'centerHub', to: 'rightTop' },
      { from: 'centerHub', to: 'rightBot' },
      { from: 'rightTop', to: 'rightBot' },
    ],
    scenes: [
      {
        id: 'leg-audit',
        num: '01',
        title: 'Leitura de Cenário com Sistema Rodando',
        shortTitle: 'Diagnóstico Real',
        fromSlot: 'leftMid',
        toSlot: 'centerHub',
        activeSlots: ['leftTop', 'leftMid', 'centerHub'],
        narration:
          'Sem parar a empresa, analisamos consultas pesadas, locks transacionais e planos de execução reais diretamente na base Firebird SQL em uso.',
        packetLabel: 'SQL TRACE · Identificando NATURAL Reads e Gargalos Críticos',
        highlights: [
          'Mapeamento objetivo do que realmente trava a operação diária',
          'Visão herdada da experiência em Suporte N2 em produção',
          'Priorização baseada no impacto imediato para os usuários',
        ],
      },
      {
        id: 'leg-tuning',
        num: '02',
        title: 'Otimização de Índices & Planos Firebird SQL',
        shortTitle: 'Tuning Cirúrgico SQL',
        fromSlot: 'centerHub',
        toSlot: 'rightBot',
        activeSlots: ['centerHub', 'rightBot'],
        narration:
          'Reestruturamos consultas, joins e índices compostos em Firebird SQL, reduzindo leituras em disco e transformando segundos de espera em milissegundos.',
        packetLabel: 'OPTIMIZED PLAN INDEX · Redução Drástica de I/O em Produção',
        highlights: [
          'Queries reescritas sem alterar o resultado esperado pelo negócio',
          'Controle cuidadoso de transações longas e garbage collection',
          'Ganho imediato de fluidez nas telas antigas e nas novas APIs',
        ],
      },
      {
        id: 'leg-extract',
        num: '03',
        title: 'Extração Incremental de Regras Acopladas',
        shortTitle: 'Refatoração em Camadas',
        fromSlot: 'leftBot',
        toSlot: 'rightTop',
        activeSlots: ['leftBot', 'centerHub', 'rightTop'],
        narration:
          'Regras antes presas em telas ou procedures gigantes passam a ser encapsuladas em serviços modulares e APIs modernas passo a passo.',
        packetLabel: 'Strangler Fig Pattern · Módulo Extraído com Testes & Logs',
        highlights: [
          'Substituição progressiva sem "big bang" arriscado',
          'Código documentado, legível e desacoplado para o time',
          'Convivência pacífica entre legado desktop e clientes web/mobile',
        ],
      },
      {
        id: 'leg-migration',
        num: '04',
        title: 'Migrações Seguras & Integridade Relacional',
        shortTitle: 'Evolução de Schema',
        fromSlot: 'leftTop',
        toSlot: 'rightBot',
        activeSlots: ['leftTop', 'centerHub', 'rightBot'],
        narration:
          'Qualquer alteração de estrutura no banco segue scripts versionados e retrocompatíveis, garantindo que nenhum terminal antigo pare durante a atualização.',
        packetLabel: 'SCHEMA MIGRATION · Script Idempotente & Rollback Seguro',
        highlights: [
          'Versionamento rigoroso de scripts DDL e dados de referência',
          'Validação prévia em ambiente espelho antes da virada',
          'Zero perda de dados ou interrupção no expediente do cliente',
        ],
      },
      {
        id: 'leg-modern',
        num: '05',
        title: 'Legado Estável Sustentando Inovação',
        shortTitle: 'Base Pronta para Crescer',
        fromSlot: 'rightTop',
        toSlot: 'rightBot',
        activeSlots: ['centerHub', 'rightTop', 'rightBot'],
        narration:
          'O banco antigo se torna uma base confiável e veloz por trás de APIs modernas — unindo o valor histórico do sistema à agilidade de software novo.',
        packetLabel: 'PRODUÇÃO ESTÁVEL · Legado Otimizado + Novas Interfaces',
        highlights: [
          'Economia real sem jogar fora anos de regras consolidadas',
          'Operação confiável enquanto novos produtos entram no ar',
          'Monitoramento contínuo garantindo performance duradoura',
        ],
      },
    ],
  },
  {
    id: '04.',
    index: '04',
    stageMode: 'pipeline-terminal',
    title: 'Automação & Fluxos Inteligentes com IA',
    subtitle: 'Python · Bash · Compilação · Workflows com IA',
    linkedBlueprintNodeId: 'auto',
    zones: ['01 · GATILHOS & SCRIPTS', '02 · MOTOR PYTHON & IA', '03 · RESULTADO AUDITÁVEL'],
    nodes: {
      leftTop: {
        slot: 'leftTop',
        label: 'Rotinas Manuais',
        sub: 'Builds, Deploys & Coleta',
        icon: 'terminal',
      },
      leftMid: {
        slot: 'leftMid',
        label: 'Shell & Linux',
        sub: 'Bash Pipelines & Cron',
        icon: 'server',
      },
      leftBot: {
        slot: 'leftBot',
        label: 'Dados Brutos',
        sub: 'Logs, Docs & Eventos',
        icon: 'database',
      },
      centerHub: {
        slot: 'centerHub',
        label: 'Python & IA Ops',
        sub: 'Orquestração & Modelos',
        icon: 'sparkles',
      },
      rightTop: {
        slot: 'rightTop',
        label: 'Compilação Auto',
        sub: 'Ex.: Compilador_Python',
        icon: 'code',
      },
      rightBot: {
        slot: 'rightBot',
        label: 'Entrega Segura',
        sub: 'Logs & Alertas Claros',
        icon: 'shield',
      },
    },
    wires: [
      { from: 'leftTop', to: 'centerHub' },
      { from: 'leftMid', to: 'centerHub' },
      { from: 'leftBot', to: 'centerHub' },
      { from: 'centerHub', to: 'rightTop' },
      { from: 'centerHub', to: 'rightBot' },
      { from: 'rightTop', to: 'rightBot' },
    ],
    scenes: [
      {
        id: 'auto-detect',
        num: '01',
        title: 'Mapeamento de Trabalho Repetitivo',
        shortTitle: 'Alvo da Automação',
        fromSlot: 'leftTop',
        toSlot: 'centerHub',
        activeSlots: ['leftTop', 'leftMid', 'centerHub'],
        narration:
          'Identificamos tarefas manuais propensas a erro — empacotamentos, backups, checagens de ambiente ou triagens — para transformá-las em scripts determinísticos.',
        packetLabel: 'REGRA DE ENGENHARIA · Automatizar tudo que for repetitivo',
        highlights: [
          'Eliminação de checklists manuais demorados e falhos',
          'Reprodutibilidade exata entre máquinas e servidores Linux',
          'Ganho direto de horas técnicas para problemas complexos',
        ],
      },
      {
        id: 'auto-bash',
        num: '02',
        title: 'Orquestração de Sistema com Bash & Linux',
        shortTitle: 'Pipelines Bash',
        fromSlot: 'leftMid',
        toSlot: 'centerHub',
        activeSlots: ['leftMid', 'centerHub'],
        narration:
          'Scripts Bash estruturados preparam dependências, validam variáveis, controlam permissões e executam pipelines em servidores Linux de ponta a ponta.',
        packetLabel: '#!/usr/bin/env bash · Preflight Checks & Pipeline Ativo',
        highlights: [
          'Execução limpa em terminal com códigos de saída confiáveis',
          'Rotinas agendadas e verificação contínua de saúde',
          'Integração nativa com Docker, Git e ferramentas de sistema',
        ],
      },
      {
        id: 'auto-python',
        num: '03',
        title: 'Compilação e Automação em Python',
        shortTitle: 'Motor Python',
        fromSlot: 'centerHub',
        toSlot: 'rightTop',
        activeSlots: ['centerHub', 'rightTop'],
        narration:
          'Com Python (como no projeto aberto Compilador_Python), automatizamos builds, empacotamento de projetos e rotinas complexas com clareza e velocidade.',
        packetLabel: 'python3 compiler.py -> Empacotamento & Validação OK',
        highlights: [
          'Padronização de builds repetíveis em um único comando',
          'Tratamento robusto de exceções e relatórios claros',
          'Facilidade para conectar bancos, APIs e arquivos locais',
        ],
      },
      {
        id: 'auto-ai',
        num: '04',
        title: 'Enriquecimento & Triagem com Fluxos de IA',
        shortTitle: 'Workflows com IA',
        fromSlot: 'leftBot',
        toSlot: 'centerHub',
        activeSlots: ['leftBot', 'centerHub', 'rightBot'],
        narration:
          'Modelos de IA entram no pipeline para resumir logs extensos, apoiar análise técnica, estruturar documentação e acelerar decisões da equipe.',
        packetLabel: 'AI WORKFLOW · Síntese Contextual & Classificação Estruturada',
        highlights: [
          'IA aplicada de forma prática dentro de fluxos auditáveis',
          'Redução do tempo de triagem de incidentes e documentos',
          'Saídas estruturadas prontas para revisão humana ou sistema',
        ],
      },
      {
        id: 'auto-audit',
        num: '05',
        title: 'Execução Confiável com Logs Determinísticos',
        shortTitle: 'Pipeline Auditável',
        fromSlot: 'rightTop',
        toSlot: 'rightBot',
        activeSlots: ['centerHub', 'rightTop', 'rightBot'],
        narration:
          'Cada execução registra histórico completo, status claro e notificações objetivas — transformando trabalho manual em operação silenciosa e segura.',
        packetLabel: 'PIPELINE DONE · Artefato Gerado + Log Auditável Gravado',
        highlights: [
          'Previsibilidade total mesmo quando executado sem supervisão',
          'Menos erros humanos em entregas e rotinas diárias',
          'Mais tempo livre para engenharia de alto valor',
        ],
      },
    ],
  },
  {
    id: '05.',
    index: '05',
    stageMode: 'aosp-stack',
    title: 'Android Customizado & Baixo Nível',
    subtitle: 'AOSP · LineageOS · Linguagem C · Linux Build',
    linkedBlueprintNodeId: 'desktop',
    zones: ['01 · HARDWARE & KERNEL', '02 · ÁRVORE AOSP / LINEAGE', '03 · BUILD & PORTABILIDADE'],
    nodes: {
      leftTop: {
        slot: 'leftTop',
        label: 'Hardware & SoC',
        sub: 'Blobs, Kernel & Drivers',
        icon: 'cpu',
      },
      leftMid: {
        slot: 'leftMid',
        label: 'Device Tree',
        sub: 'Manifests & BoardConfig',
        icon: 'layers',
      },
      leftBot: {
        slot: 'leftBot',
        label: 'Código Nativo C',
        sub: 'MCLA-Recompiled-Mobile',
        icon: 'code',
      },
      centerHub: {
        slot: 'centerHub',
        label: 'AOSP / LineageOS',
        sub: 'Build System em Linux',
        icon: 'terminal',
      },
      rightTop: {
        slot: 'rightTop',
        label: 'ROM Sob Medida',
        sub: 'Controle & Estabilidade',
        icon: 'mobile',
      },
      rightBot: {
        slot: 'rightBot',
        label: 'Tuning Sistema',
        sub: 'Performance & Hardware',
        icon: 'shield',
      },
    },
    wires: [
      { from: 'leftTop', to: 'centerHub' },
      { from: 'leftMid', to: 'centerHub' },
      { from: 'leftBot', to: 'centerHub' },
      { from: 'centerHub', to: 'rightTop' },
      { from: 'centerHub', to: 'rightBot' },
      { from: 'rightTop', to: 'rightBot' },
    ],
    scenes: [
      {
        id: 'aosp-hw',
        num: '01',
        title: 'Mapeamento de Hardware, Blobs & Kernel',
        shortTitle: 'Base do Dispositivo',
        fromSlot: 'leftTop',
        toSlot: 'centerHub',
        activeSlots: ['leftTop', 'leftMid', 'centerHub'],
        narration:
          'O trabalho começa nas camadas internas do sistema operacional: alinhamento de kernel, bibliotecas proprietárias (blobs) e configuração precisa de Device Tree.',
        packetLabel: 'DEVICE TREE · Kernel + Vendor Blobs + Manifests Configurados',
        highlights: [
          'Compreensão profunda entre hardware, kernel e framework',
          'Organização limpa de repositórios e patches específicos',
          'Base estável antes de iniciar compilações extensas',
        ],
      },
      {
        id: 'aosp-tree',
        num: '02',
        title: 'Customização de Fontes AOSP & LineageOS',
        shortTitle: 'Customização OS',
        fromSlot: 'leftMid',
        toSlot: 'centerHub',
        activeSlots: ['leftMid', 'centerHub'],
        narration:
          'Ajustamos flags de compilação, permissões SELinux, serviços de sistema e camadas do Android Open Source Project e LineageOS em ambiente Linux.',
        packetLabel: 'lunch lineage_device-userdebug · SELinux & Overlays OK',
        highlights: [
          'Remoção de excessos e foco em comportamento previsível',
          'Resolução cirúrgica de conflitos em árvores de dispositivo',
          'Controle direto sobre segurança e ciclo de boot do Android',
        ],
      },
      {
        id: 'aosp-c',
        num: '03',
        title: 'Portabilidade & Recompilação Nativa em C',
        shortTitle: 'Engenharia Nativa C',
        fromSlot: 'leftBot',
        toSlot: 'centerHub',
        activeSlots: ['leftBot', 'centerHub'],
        narration:
          'Em iniciativas como MCLA-Recompiled-Mobile, trabalhamos próximo à memória e compiladores em linguagem C para portar e otimizar execução em hardware móvel.',
        packetLabel: 'CLANG / NDK ARM64 · Recompilação Nativa em C Otimizada',
        highlights: [
          'Entendimento sólido de ponteiros, memória e ABIs ARM',
          'Ponte entre código nativo de baixo nível e camada Android',
          'Diagnóstico preciso de falhas de execução em binários',
        ],
      },
      {
        id: 'aosp-build',
        num: '04',
        title: 'Compilação Completa da Imagem em Linux',
        shortTitle: 'Build Completo ROM',
        fromSlot: 'centerHub',
        toSlot: 'rightTop',
        activeSlots: ['centerHub', 'rightTop'],
        narration:
          'O ambiente Linux compila frameworks, bibliotecas nativas e imagem final de sistema gerando pacotes flasháveis testados diretamente no dispositivo alvo.',
        packetLabel: 'mka bacon -> system.img + boot.img Gerados com Sucesso',
        highlights: [
          'Domínio de toolchains GNU/Linux, Soong e builds pesados',
          'Validação via ADB, logcat e dmesg após cada ciclo de build',
          'Entrega de imagem enxuta pronta para testes reais',
        ],
      },
      {
        id: 'aosp-tuning',
        num: '05',
        title: 'Estabilidade, Performance & Controle Total',
        shortTitle: 'Sistema Sob Medida',
        fromSlot: 'rightTop',
        toSlot: 'rightBot',
        activeSlots: ['centerHub', 'rightTop', 'rightBot'],
        narration:
          'Essa imersão em baixo nível reforça toda a minha engenharia de software: compreender como sistema, rede e hardware respondem sob pressão real.',
        packetLabel: 'BOOT VERIFICADO · Sistema Fluido & Controle Total',
        highlights: [
          'Visão rara que vai do C/Kernel até APIs e React Native',
          'Capacidade superior de depuração em problemas difíceis',
          'Sistemas otimizados sem depender de caixas-pretas',
        ],
      },
    ],
  },
];
