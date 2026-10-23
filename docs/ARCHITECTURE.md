# Arquitetura do J-WATER 2.0

## Direção e estado

Aplicação estática, executada no navegador e sem backend. O escopo não requer autenticação, contas, histórico ou banco de dados. Vite constrói três documentos HTML independentes, e TypeScript separa o motor de cálculo da leitura do formulário e da apresentação do resultado.

A versão 2.0 está em preparação na branch `feature/jwater-2.0`. O build local não equivale a uma publicação; merge, publicação e release remota aguardam autorização explícita.

## Estrutura existente

- `src/index.html`: landing page.
- `src/pages/calculator.html`: página da calculadora.
- `src/pages/sobre.html`: conteúdo educativo e referências apresentadas ao visitante.
- `src/domain/hydration.ts`: tipos, limites de entrada, equação de regressão e resultado estruturado, sem acesso ao DOM.
- `src/domain/hydration.test.ts`: testes unitários do motor de cálculo.
- `src/scripts/calculator.ts`: validação do fluxo da interface, formatação pt-BR e atualização do resultado.
- `src/scripts/calculator.test.ts`: testes da formatação e apresentação do resultado.
- `src/scripts/main.ts`: ponto de entrada TypeScript da calculadora.
- `src/css/variables.css`: tokens de identidade visual e aliases antigos ainda necessários ao legado.
- `src/css/components/header.css`: cabeçalho compartilhado das páginas internas.
- `src/css/styles/`: estilos de página para landing, calculadora e conteúdo educativo.
- `src/css/page-transitions.css`: transições de navegação com CSS View Transition API como aprimoramento progressivo.
- `src/assets/brand/`, `src/assets/icons/`, `src/assets/illustrations/` e `src/assets/decorative/`: SVGs de marca, conteúdo visual e ícones.
- `src/public/_redirects`: fallback de URL copiado ao build para hospedagem Netlify.
- `docs/EDUCATIONAL-CONTENT.md`: fontes, escopo e regras editoriais que embasam o texto educativo.

Os arquivos `src/scripts/index.js` e `src/scripts/models/waterCalculator.js`, assim como imagens antigas em `src/assets/img/`, são material legado. Eles não são importados pelas páginas atuais e não entram no bundle Vite; permanecem no repositório preservados, sem serem tratados como funcionalidade ativa.

## Limites entre camadas

1. O HTML fornece estrutura semântica, navegação e rótulos acessíveis.
2. `calculator.ts` lê o formulário, chama a função de domínio, formata os valores e atualiza as regiões de resultado e erro.
3. `hydration.ts` valida dados e calcula uma estimativa sem conhecer HTML, CSS ou browser APIs.
4. O conteúdo editorial tem fonte e limites registrados; não altera a equação e não oferece decisão clínica.
5. SVGs decorativos não carregam significado exclusivo: o texto adjacente comunica o conteúdo.

## Decisões registradas

- HTML, CSS, TypeScript e Vite, sem framework de UI ou dependências de runtime.
- Build estático de múltiplas páginas. `base: "./"` permite que referências geradas sejam relativas à rota e a publicação sob subdiretório.
- A equação exploratória de Yamada et al. (2022) estima *water turnover* adulto. A conversão para água total de alimentos e bebidas é uma aproximação adicional; resultado não é prescrição, meta individual ou volume de água pura.
- EFSA (2010) aparece somente como referência populacional comparativa.
- Temperatura, umidade e altitude são opcionais e inseridas manualmente. Quando omitidas, o resultado identifica o cenário-base. O HDI fica fixado como alto no escopo atual.
- A aplicação não envia ou persiste as entradas do formulário, não usa geolocalização e não possui API.
- A transição entre documentos é aplicada apenas onde navegador e navegação same-origin oferecem suporte; `prefers-reduced-motion` desativa animações e rolagem suave, e o comportamento padrão dos links permanece como fallback.

## Build e publicação

`vite.config.ts` usa `src/` como raiz, inclui as três páginas no build e escreve em `dist/`. O preview deve ser validado localmente antes de escolher uma hospedagem. Não há configuração de CI ou publicação automática. Deploy, merge em `main` e push remoto dependem de aprovação do proprietário.
