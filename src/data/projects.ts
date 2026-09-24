export type Project = {
  slug: string;
  name: string;
  category: string;
  context: string;
  role: string;
  decision: string;
  stack: string[];
  links: { label: string; url: string }[];
  /** Nome do arquivo em src/assets/images/projects/ (resolvido via import.meta.glob em Projects.astro). Deixe undefined até ter uma imagem real. */
  image?: string;
  /** 'screenshot' = tela real do app (mostra moldura de navegador). 'concept' = imagem conceitual/de capa (sem moldura de navegador, para não implicar que é a UI real). */
  imageKind?: 'screenshot' | 'concept';
  /** Domínio exibido na barra do "navegador" quando imageKind é 'screenshot'. */
  domain: string;
  /** Empresa parceira do projeto, quando houver: exibe o símbolo dela como selo. */
  partner?: 'accenture';
};

export const projects: Project[] = [
  {
    slug: 'ax-charge',
    name: 'AX Charge',
    category: 'Frontend · Porto Digital × Banco do Brasil',
    context:
      'Desenvolvido em parceria com o Porto Digital e o Banco do Brasil, no contexto da Residência Tecnológica RISEUP 2025.02 (CoDay). O app trabalha com estações de carregamento de veículos elétricos, disponibilidade, autonomia e estimativa de tempo até 80% de carga.',
    role: 'Desenvolvimento frontend, consumindo dados de estações e integrando a experiência de rota e carregamento.',
    decision:
      'Estruturação da interface para lidar com dados que mudam em tempo real (disponibilidade de estações) sem travar a experiência de navegação do usuário.',
    stack: ['React', 'APIs', 'Dados em tempo real'],
    links: [{ label: 'Repositório', url: 'https://github.com/Matheus13245/Projeto-PortoDigital' }],
    domain: 'github.com/Matheus13245',
    image: 'ax-charge-cover.jpg',
    imageKind: 'concept',
  },
  {
    slug: 'buck',
    name: 'BUCK',
    category: 'Faculdade Senac · Projet Aí 2026.1 · 1º lugar e Projeto Destaque',
    context:
      'Projeto desenvolvido na Faculdade Senac como parte do Projet Aí 2026.1, reconhecido com 1º lugar e Projeto Destaque entre os times participantes.',
    role: 'Construção de produto de ponta a ponta em equipe acadêmica, da concepção à entrega final.',
    decision:
      'Priorização de escopo sob prazo fixo de projeto acadêmico, mantendo qualidade de entrega que resultou no reconhecimento da banca.',
    stack: ['Frontend', 'Trabalho em equipe', 'Construção de produto'],
    links: [],
    domain: 'projetai.senac.br',
  },
  {
    slug: 'quantum-algorithm-library',
    name: 'Quantum Algorithm Library',
    category: 'Frontend · Accenture × Porto Digital',
    context:
      'Plataforma interativa desenvolvida em parceria com a Accenture e o Porto Digital, que organiza e estrutura algoritmos quânticos por características e contexto de aplicação. Facilita a exploração, comparação e recomendação de algoritmos quânticos para diferentes tipos de usuários (profissionais de TI, físicos e químicos) que abordam o problema de formas distintas: desempenho computacional, modelagem de fenômenos físicos ou aplicação prática em simulações químicas.',
    role: 'Desenvolvimento frontend da aplicação.',
    decision:
      'A organização e apresentação de algoritmos quânticos hoje exige conhecimento técnico prévio e não acompanha a evolução constante da área. A plataforma integra exploração e recomendação de algoritmos com suporte à análise comparativa, reduzindo essa barreira de entrada.',
    stack: ['Next.js', 'TypeScript', 'Node.js'],
    links: [],
    domain: 'accenture.com',
    image: 'quantum-cover.webp',
    imageKind: 'concept',
    partner: 'accenture',
  },
];
