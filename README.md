# J-WATER

Aplicação estática em evolução para apresentar informações educativas sobre hidratação e uma estimativa contextualizada para adultos saudáveis. O método científico e a interface da versão 2.0 serão entregues em etapas; a lógica legada ainda está presente durante a preparação da nova arquitetura.

## Requisitos

- Node.js 20.19+ ou 22.12+
- npm

## Desenvolvimento

```bash
npm install
npm run dev
```

O Vite abre a página inicial. A calculadora e a página educativa ficam disponíveis pela navegação do site.

## Verificações locais

```bash
npm run typecheck
npm run lint
npm test
npm run build
npm run preview
```

O runner Vitest está configurado em `tests/`. Os testes do motor de cálculo serão adicionados quando sua metodologia for implementada e aprovada.

## Arquitetura

- `src/pages/`: páginas HTML da aplicação.
- `src/css/`: estilos globais e por página.
- `src/scripts/main.ts`: entrada TypeScript da aplicação.
- `src/scripts/`: lógica legada temporariamente preservada.
- `src/assets/`: imagens e ícones existentes.
- `docs/ARCHITECTURE.md`: decisões de arquitetura e separação planejada.
- `docs/ROADMAP.md`: entregas e gates de aprovação.
- `docs/TESTING.md`: estratégia de validação.

O Vite usa `src/` como raiz, gera uma aplicação estática em `dist/` e mantém as três páginas como entradas independentes. Não há backend, autenticação, histórico ou banco de dados.

## Publicação

O build estático pode ser publicado em serviços que hospedam arquivos HTML. Configure o serviço para publicar `dist/` e valide a navegação entre as três páginas no ambiente escolhido. O arquivo `_redirects` é copiado para o build para compatibilidade com Netlify.

## Aviso sobre a versão legada

A calculadora antiga não deve ser usada como orientação de saúde: sua fórmula estima gasto energético e o resultado é rotulado como volume de água sem uma conversão validada. A revisão do método ocorrerá na Entrega 03.
