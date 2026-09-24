export type TechGroup = {
  label: string;
  items: { name: string; note?: string }[];
};

export const techGroups: TechGroup[] = [
  {
    label: 'Frontend',
    items: [
      { name: 'HTML' },
      { name: 'CSS' },
      { name: 'JavaScript' },
      { name: 'TypeScript' },
      { name: 'React', note: 'AX Charge' },
    ],
  },
  {
    label: 'Mobile',
    items: [
      { name: 'Flutter', note: 'Tipsteria · Red Media' },
      { name: 'Dart', note: 'Tipsteria · Red Media' },
    ],
  },
  {
    label: 'Backend & Dados',
    items: [
      { name: 'Node.js' },
      { name: 'Express' },
      { name: 'Supabase' },
      { name: 'REST APIs' },
      { name: 'SQL' },
    ],
  },
  {
    label: 'Ferramentas & Fluxo',
    items: [
      { name: 'Git' },
      { name: 'GitHub' },
      { name: 'n8n' },
      { name: 'Google Sheets API' },
      { name: 'Figma' },
    ],
  },
];

/** Marcas oficiais de cada tecnologia, para o ticker de tecnologias no topo da página. */
export const tickerStack = [
  { name: 'HTML', color: '#E34F26' },
  { name: 'CSS', color: '#1572B6' },
  { name: 'JavaScript', color: '#F7DF1E' },
  { name: 'TypeScript', color: '#3178C6' },
  { name: 'React', color: '#61DAFB' },
  { name: 'Flutter', color: '#02569B' },
  { name: 'Dart', color: '#0175C2' },
  { name: 'Node.js', color: '#5FA04E' },
  { name: 'Git', color: '#F05032' },
  { name: 'GitHub', color: 'var(--ink)' },
  { name: 'Figma', color: '#F24E1E' },
];

export const certifications = [
  { name: 'SENAC RiseUp', org: 'Rocketseat', year: '2025' },
  { name: 'GitHub Copilot', org: 'CESAR School', year: '2025' },
  { name: 'Design Thinking', org: 'SEBRAE', year: '2025' },
  { name: 'HTML e CSS', org: 'Alura', year: '2025' },
  { name: 'Lógica de Programação', org: 'Fundação Bradesco', year: '2025' },
  { name: 'IA e Regulação', org: 'TIC em Trilhas', year: '2025' },
  { name: 'Psicologia Aplicada a UX', org: 'TIC em Trilhas', year: '2025' },
];
