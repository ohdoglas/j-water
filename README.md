# J-WATER

Aplicação web educativa sobre hidratação, com uma estimativa exploratória de ingestão total de água e comparação com o consumo informado. O projeto mantém um fluxo simples, roda inteiramente no navegador e está disponível em português do Brasil e inglês.

**Acesse:** [ohdoglas.github.io/j-water](https://ohdoglas.github.io/j-water/) · **Repositório:** [github.com/ohdoglas/j-water](https://github.com/ohdoglas/j-water)

> A estimativa é educativa: não é prescrição ou meta clínica, não avalia o estado de hidratação e não substitui consulta ou orientação de um profissional de saúde.

## Funcionalidades

- Calculadora exploratória baseada no modelo de circulação de água (*water turnover*) de Yamada et al. (2022), dentro do escopo e das limitações documentadas.
- Entradas de idade, categoria codificada pelo estudo, peso, atividade habitual, status de atleta e condições ambientais opcionais.
- Comparação matemática entre a estimativa e o consumo total informado em litros, mililitros ou copos equivalentes.
- Conteúdo educativo com explicações, limitações e referências institucionais e científicas.
- Seletor de idioma no cabeçalho para alternar entre português do Brasil e inglês. O idioma é refletido na URL com `?lang=en`; português é o padrão.
- Layout responsivo, navegação por teclado, estados de foco visíveis e respeito à preferência por movimento reduzido.

O resultado representa uma aproximação de água total proveniente de alimentos e bebidas, não um volume de água pura a consumir. O modelo não inclui ajustes individualizados para altura, creatina, doenças, medicamentos, gravidez ou amamentação. Consulte a [metodologia da estimativa](docs/HYDRATION-METHODOLOGY.md) e as [referências educativas](docs/EDUCATIONAL-CONTENT.md).

## Tecnologias

- TypeScript e HTML semântico
- Vite para desenvolvimento e build estático
- CSS modular, sem framework de interface
- Vitest, ESLint e TypeScript para validação
- GitHub Actions e GitHub Pages para build e publicação

## Executar localmente

Requisitos: Node.js 20.19+ ou 22.12+ e npm.

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
- Acrescente `?lang=en` a uma rota para abri-la em inglês, por exemplo `/pages/calculator.html?lang=en`.

## Verificação e build

```bash
npm run typecheck
npm run lint
npm test
npm run build
npm run preview
```

O Vite usa `src/` como raiz e gera o site estático em `dist/`. O workflow [Publicar no GitHub Pages](.github/workflows/deploy-pages.yml) executa typecheck, lint, testes e build em pushes para `main`; após a validação, publica o conteúdo de `dist/`.

## Estrutura do projeto

```text
src/
├── assets/                 Marca, ilustrações e ícones SVG
├── content/                Conteúdo educativo e mensagens comparativas
├── css/                    Estilos globais, componentes e páginas
├── domain/                 Cálculo, validação e comparação independentes do DOM
├── pages/                  Calculadora e conteúdo educativo
├── scripts/                Entradas da aplicação, interface e idiomas
└── index.html              Página inicial
docs/                       Arquitetura, metodologia, design e testes
```

O motor de cálculo e a comparação ficam separados da camada visual, facilitando testes e manutenção. A preferência de idioma é transportada pela URL; dados preenchidos nos formulários não são enviados a uma API nem gravados em armazenamento local.

## Privacidade

O cálculo acontece no navegador. A aplicação não implementa contas, autenticação, histórico, analytics ou backend. Os dados digitados permanecem na página e não são salvos pelo J-WATER.

## Documentação

- [Arquitetura](docs/ARCHITECTURE.md)
- [Metodologia da estimativa](docs/HYDRATION-METHODOLOGY.md)
- [Conteúdo educativo e referências](docs/EDUCATIONAL-CONTENT.md)
- [Sistema visual](docs/DESIGN-SYSTEM.md)
- [Testes e validação](docs/TESTING.md)
- [Roadmap](docs/ROADMAP.md)
- [Histórico de alterações](docs/CHANGELOG.md)
