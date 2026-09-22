# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

delegated: Astro (componentização real via `.astro`/ilhas, conteúdo de projetos/certificações como Markdown/JSON, zero-JS por padrão, TypeScript opcional). Escolhido em substituição ao HTML/CSS/JS vanilla atual porque resolve os problemas estruturais identificados na auditoria (arquivo `script.js` com erro de sintaxe fatal não detectado, duplicação de CSS entre breakpoints, ausência de componentização, dificuldade de adicionar novos projetos) sem introduzir a complexidade de um framework de aplicação como Next.js, que não é justificada pelo escopo do produto (sem backend, sem dados dinâmicos, atualização pouco frequente por uma única pessoa).

## Users

Recrutadores técnicos e não-técnicos, e líderes de engenharia avaliando candidatos júnior/estagiário para vagas de desenvolvimento frontend. Situação: avaliação rápida (poucos segundos a minutos) de um portfólio entre múltiplos candidatos. Job a ser feito: confirmar se o candidato tem fundamentos técnicos reais e comunica-se com profissionalismo o suficiente para prosseguir no processo seletivo.

## Product Purpose

Apresentar Wesley Telles como candidato credível a vagas júnior/estágio de desenvolvimento frontend, através de evidência técnica concreta (projetos reais com contexto) e uma narrativa profissional diferenciada, convertendo a visita em contato direto (LinkedIn/e-mail) com recrutadores.

## Positioning

Desenvolvedor frontend em formação com trajetória atípica: veio da área de logística antes de migrar para tecnologia (estuda ADS no SENAC, Recife/PE), já aplicou conhecimento técnico em contextos reais fora de sala de aula (desafio corporativo Porto Digital × Banco do Brasil, projeto de impacto social para agricultores familiares). A combinação "bagagem de organização/processos de outra área + fundamentos técnicos aplicados a projetos reais" é o que um concorrente puramente acadêmico não pode replicar da mesma forma.

## Operating Context

Site estático de página única, hospedado no Netlify (`portfoliotelles.netlify.app`), atualizado esporadicamente (semanas/meses entre edições) por uma única pessoa sem equipe de suporte técnico. Sem backend, sem autenticação, sem dados dinâmicos externos. CV disponível como PDF para download.

## Capabilities and Constraints

- Sem servidor/backend: todo o conteúdo (projetos, certificações, skills) deve poder ser editado como dados estáticos (arquivos), sem exigir infraestrutura adicional.
- Deploy deve continuar simples via CDN estática (Netlify ou equivalente), sem exigir servidor dedicado.
- Mantenedor único, não desenvolvedor sênior ainda — a arquitetura deve favorecer facilidade de manutenção futura (adicionar projeto = adicionar arquivo de dados, não editar lógica).
- Conteúdo real confirmado: 3 projetos (SeedTech, AX Charge, Portfólio Pixel Art em Figma), 7 certificações, bio pessoal completa, CV em PDF. Não fabricar projetos, métricas ou testemunhos além do que já existe.
- Tema claro/escuro é um requisito confirmado a preservar.

## Brand Commitments

Nome: Wesley Telles. Identidade visual atual usa paleta azul-violeta (`#3D52D5`) sobre fundo claro/escuro alternável, tipografia Bricolage Grotesque (títulos) + DM Sans (corpo), e um elemento de assinatura visual de "pixel art" associado ao autor — este elemento deve ser preservado conceitualmente (reformulado, não descartado) por já funcionar como diferenciação pessoal.

## Evidence on Hand

- **Projetos (3, reais, com repositório/link):**
  1. SeedTech — app web para agricultores familiares, integração com IPA — https://xandeezx.github.io/SeedTech/
  2. AX Charge — app mobile de rotas para carros elétricos, desenvolvido para o desafio Porto Digital × Banco do Brasil — https://github.com/Matheus13245/Projeto-PortoDigital
  3. Portfólio Pixel Art — design de UI em Figma com estética pixel art — https://www.figma.com/proto/fyPiCBirBNe94nVwqAGhq1/Portf%C3%B3lio
- **Certificações (7):** SENAC RiseUp/Rocketseat, GitHub Copilot/CESAR School, Design Thinking/SEBRAE, HTML e CSS/Alura, Lógica de Programação/Fundação Bradesco, IA e Regulação/TIC em Trilhas, Psicologia Aplicada a UX/TIC em Trilhas.
- **CV:** `assets/cv.pdf` (Wesley_Telles_CV.pdf).
- **Contato:** e-mail (wesleytellesbr@gmail.com), LinkedIn (linkedin.com/in/wesley-telles), GitHub (github.com/WesleyTelles).
- Sem depoimentos, sem estudos de caso publicados por terceiros, sem métricas de produto verificáveis (uso, usuários, etc.) além do que os próprios projetos descrevem — nada disso deve ser inventado.

## Product Principles

1. Evidência antes de afirmação: qualquer alegação de capacidade técnica deve estar ancorada em um projeto real, nunca em métrica subjetiva (ex.: abandonar barras de percentual de skill).
2. A narrativa pessoal (trajetória logística → tech) é diferenciação, não desculpa — deve aparecer depois da prova técnica, nunca antes dela.
3. Contato deve ser sempre acessível e nunca escondido atrás de mais de uma camada de navegação, em qualquer dispositivo.
4. Manutenção futura por uma pessoa não-sênior deve ser trivial: adicionar conteúdo não deve exigir tocar em lógica de código.
5. Performance e acessibilidade são requisitos de arquitetura desde o início, não polimento de última hora.

## Accessibility & Inclusion

Nenhum requisito específico de usuário foi declarado além do padrão esperado de um site profissional público: navegação completa por teclado, suporte a leitor de tela nos componentes interativos (modal, alternância de tema, toast de confirmação) e respeito a `prefers-reduced-motion`.
