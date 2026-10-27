# Changelog

Este documento registra mudanças relevantes por versão.

## J-WATER 2.0 — análise comparativa de hidratação (27/10/2026)

- Adicionada comparação opcional entre a estimativa e o consumo total informado, com entrada em litros/ml ou copos equivalentes.
- Adicionados cenários aritméticos e conteúdo educativo contextual, avisos clínicos e fontes institucionais.
- A interface continua sem contas, armazenamento ou transmissão dos dados do formulário.

## J-WATER 2.0 — 23/10/2026

- Atualizou a identidade visual da landing page e adicionou marca e ilustrações SVG.
- Separou a calculadora em motor TypeScript sem DOM, controlador de interface e testes automatizados.
- Substituiu a fórmula legada no fluxo ativo por uma estimativa exploratória baseada em regressão de *water turnover*, com condições e limitações apresentadas junto ao resultado.
- Reorganizou a página de hidratação com conteúdo educativo referenciado, perguntas frequentes acessíveis e avisos para situações clínicas.
- Refinou os pontos de foco, texto do resultado, metadados e contraste; adicionou transições de navegação progressivas e respeita movimento reduzido.
- Atualizou documentação de arquitetura, método, conteúdo editorial, testes, design e preparação da release.
- Configurou publicação contínua no GitHub Pages a partir da branch `main`, após verificações automatizadas.

### Validação registrada

- Typecheck, lint, 13 testes Vitest, build estático e `npm audit` passaram durante a preparação local.
- Preview local respondeu HTTP 200 nas três rotas principais e em todas as referências locais `src`/`href` verificadas; `_redirects` foi incluído no build.
- A publicação é validada após a integração em `main` pelo workflow do GitHub Actions.
