# Wesley Telles — Portfólio

Portfólio pessoal, construído com [Astro](https://astro.build).

Acesse: [portfoliotelles.netlify.app](https://portfoliotelles.netlify.app)

---

## Sobre o projeto

Apresenta quem sou como Software Developer: minha trajetória, os projetos reais que construí e as tecnologias que uso no dia a dia. Identidade visual própria: tema escuro com verde-neon de assinatura, tipografia Unbounded + Instrument Sans, e tema claro alternativo.

---

## O que tem nele

- Hero com entrada coreografada e retrato tratado com luz de assinatura
- Ticker contínuo das tecnologias que utilizo
- Projetos apresentados como cases (contexto, papel, decisão técnica), não fichas técnicas
- Timeline visual da trajetória profissional
- Tecnologias agrupadas por função e vinculadas a projetos reais, sem barras de percentual
- Alternância entre tema claro e escuro
- Menu mobile funcional, acessível por teclado
- `prefers-reduced-motion` respeitado em todas as animações

---

## Estrutura

```
portfolio-wesley/
├── src/
│   ├── components/   # Header, Hero, Projects, About, Technologies, Contact, Footer, Icon, SocialCards, TechTicker
│   ├── data/         # projects.ts, tech.ts — conteúdo como dados estruturados
│   ├── layouts/       # Layout.astro (SEO, fontes, tema)
│   ├── pages/         # index.astro
│   ├── scripts/       # reveal.ts (reveal-on-scroll)
│   └── styles/        # global.css (tokens de design)
├── public/
│   └── assets/        # imagens, cv.pdf
├── legacy-vanilla/    # versão anterior do site (HTML/CSS/JS puro), preservada para referência
└── PRODUCT.md          # contexto de produto e princípios do redesign
```

---

## Tecnologias

- [Astro](https://astro.build) — componentização, conteúdo como dados estruturados
- TypeScript
- CSS puro (sem framework de UI)
- Google Fonts — Unbounded e Instrument Sans

## Desenvolvimento

```bash
npm install
npm run dev      # dev server
npm run build    # build de produção
npm run preview  # preview do build
```

---

## Projetos em destaque

**AX Charge** — App de rotas para carros elétricos, desenvolvido em parceria com o Porto Digital e o Banco do Brasil (Residência Tecnológica RISEUP 2025.02).
[Ver repositório](https://github.com/Matheus13245/Projeto-PortoDigital)

**BUCK** — Projeto desenvolvido na Faculdade Senac (Projet Aí 2026.1), reconhecido com 1º lugar e Projeto Destaque.

**Quantum Algorithm Library** — Plataforma que organiza e recomenda algoritmos quânticos por contexto de aplicação, desenvolvida em parceria com a Accenture e o Porto Digital.

---

## Contato

wesleytellesbr@gmail.com
[linkedin.com/in/wesley-telles](https://www.linkedin.com/in/wesley-telles)
[github.com/WesleyTelles](https://github.com/WesleyTelles)
