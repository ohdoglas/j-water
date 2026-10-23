# J-WATER

J-WATER é uma aplicação web estática com conteúdo educativo sobre hidratação e uma calculadora exploratória de ingestão total de água. O fluxo é direto: acessar, informar os dados, calcular e ler o resultado — sem conta, histórico ou backend.

> **Estado:** J-WATER 2.0. A aplicação está publicada em [ohdoglas.github.io/j-water](https://ohdoglas.github.io/j-water/). A estimativa é educativa, não é prescrição médica e não substitui avaliação ou orientação de um profissional de saúde.

## O que a aplicação faz

- Apresenta uma estimativa exploratória baseada na regressão de *water turnover* de Yamada et al. (2022), para adultos dentro do escopo documentado.
- Usa idade, categoria de sexo codificada pelo estudo, peso, nível habitual de atividade aproximado, status de atleta e condições ambientais opcionais.
- Informa as condições ambientais assumidas quando temperatura, umidade e altitude não são fornecidas.
- Apresenta a estimativa como água total de alimentos e bebidas; copos de 250 ml são apenas equivalência matemática, não uma instrução de consumo de água pura.
- Explica limites científicos e situações clínicas que não devem ser ajustadas pela calculadora.

O motor não determina necessidade individual, não avalia o estado de hidratação, não calcula perdas de um treino e não aplica ajustes por altura, creatina, doença, medicamento, gravidez ou amamentação. Consulte [a metodologia](docs/HYDRATION-METHODOLOGY.md) antes de interpretar os números.

## Requisitos

- Node.js 20.19+ ou 22.12+
- npm

## Executar localmente

```bash
npm ci
npm run dev
```

Para disponibilizar o servidor local ao navegador na própria máquina:

```bash
npm run dev -- --host 127.0.0.1
```

Rotas principais:

- `/` — página inicial
- `/pages/calculator.html` — calculadora
- `/pages/sobre.html` — conteúdo educativo

## Verificações

```bash
npm run typecheck
npm run lint
npm test
npm run build
npm run preview
```

O build produz arquivos estáticos em `dist/`. Os testes automatizados cobrem o motor de cálculo e a formatação da calculadora. A checklist de fluxo funcional, teclado, movimento reduzido e revisão visual está em [docs/TESTING.md](docs/TESTING.md).

## Estrutura

- `src/index.html` e `src/pages/`: três páginas HTML independentes.
- `src/domain/hydration.ts`: validação e motor de cálculo sem dependência do DOM.
- `src/scripts/calculator.ts`: coleta do formulário, formatação pt-BR e atualização do resultado.
- `src/scripts/main.ts`: entrada TypeScript da calculadora.
- `src/css/`: estilos por página, cabeçalho compartilhado, tokens e transições de navegação.
- `src/assets/`: marca, ilustrações e ícones SVG.
- `src/public/_redirects`: regra de fallback copiada ao build para hospedagens Netlify.
- `docs/`: arquitetura, método, conteúdo editorial, design, testes e roadmap.

Os arquivos `src/scripts/index.js`, `src/scripts/models/waterCalculator.js` e algumas imagens em `src/assets/img/` pertencem ao projeto legado. Eles não são carregados pelo fluxo atual e permanecem preservados como referência; não fazem parte do bundle da versão atual.

## Publicação estática

O Vite usa `src/` como raiz e gera um site de múltiplas páginas em `dist/`. Para hospedar, execute `npm run build` e configure a plataforma para servir o conteúdo de `dist/`. Não é necessária função, banco de dados ou variável de ambiente.

Os links e assets usam caminhos relativos para funcionar sob o subdiretório `/j-water/` do GitHub Pages. O workflow em `.github/workflows/deploy-pages.yml` executa as verificações, gera o build de produção e publica `dist/` quando há push na branch `main`; também pode ser iniciado manualmente pela aba **Actions**. A publicação atual usa GitHub Actions como fonte do GitHub Pages. O arquivo `src/public/_redirects` é destinado a hospedagens Netlify.

## Privacidade e segurança

O cálculo é executado no navegador. Os dados do formulário não são enviados a uma API, gravados em armazenamento local ou mantidos após sair da página. A aplicação não implementa autenticação, analytics ou backend. Links externos são abertos apenas quando selecionados pelo visitante.

## Documentação

- [Arquitetura](docs/ARCHITECTURE.md)
- [Metodologia da estimativa](docs/HYDRATION-METHODOLOGY.md)
- [Conteúdo educativo e referências](docs/EDUCATIONAL-CONTENT.md)
- [Sistema visual](docs/DESIGN-SYSTEM.md)
- [Testes e validação](docs/TESTING.md)
- [Roadmap](docs/ROADMAP.md)
- [Changelog](docs/CHANGELOG.md)
