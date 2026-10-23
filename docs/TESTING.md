# Estratégia de testes

## Ferramentas

- TypeScript (`tsc --noEmit`) para verificar tipos.
- ESLint para código TypeScript e configurações.
- Vitest para testes unitários puros do domínio.
- Build Vite para validar a geração estática das três páginas.

## Cobertura planejada

- Entrega 03: casos de referência da metodologia, entradas fora do limite e valores inválidos.
- Entrega 04: fluxo preencher → calcular → ler resultado → refazer cálculo.
- Entrega 06: navegação por teclado, mensagens de validação, movimento reduzido e revisão em telas móveis.

## Estado nesta entrega

O runner está configurado, mas ainda não há testes de produto. A lógica de hidratação não foi implementada; portanto, os testes do domínio entram junto com a Entrega 03. O comando `npm test` aceita temporariamente a ausência de testes para que a configuração possa ser verificada nesta etapa.
