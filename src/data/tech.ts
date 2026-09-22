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
      { name: 'Flutter', note: 'Tipsteria — Red Media' },
      { name: 'Dart', note: 'Tipsteria — Red Media' },
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

export const certifications = [
  { name: 'SENAC RiseUp', org: 'Rocketseat', year: '2025' },
  { name: 'GitHub Copilot', org: 'CESAR School', year: '2025' },
  { name: 'Design Thinking', org: 'SEBRAE', year: '2025' },
  { name: 'HTML e CSS', org: 'Alura', year: '2025' },
  { name: 'Lógica de Programação', org: 'Fundação Bradesco', year: '2025' },
  { name: 'IA e Regulação', org: 'TIC em Trilhas', year: '2025' },
  { name: 'Psicologia Aplicada a UX', org: 'TIC em Trilhas', year: '2025' },
];
