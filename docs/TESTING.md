# Estratégia de testes

## Ferramentas

- TypeScript (`tsc --noEmit`) para verificar tipos.
- ESLint para código TypeScript e configurações.
- Vitest para testes unitários puros do domínio e formatação.
- Build Vite para validar a geração estática das páginas.

## Cobertura da calculadora

Os testes do domínio cobrem o cenário-base do estudo, uso explícito dos três parâmetros ambientais, rejeição de parâmetros ambientais incompletos, valores pessoais fora do escopo, campos não utilizados e entradas inválidas. A comparação cobre conversão de L/ml e copos, limites de entrada, zero explícito, divisão segura e cenários abaixo/próximo/acima. Os testes da interface cobrem formatação pt-BR e texto educativo não diagnóstico por cenário.

## Verificação funcional manual

1. Envie o formulário vazio e confira a mensagem de validação.
2. Informe idade adulta, peso, categoria, nível de atividade e status de atleta; deixe o ambiente vazio e confira que o resultado identifica o cenário-base do artigo.
3. Informe apenas uma ou duas variáveis ambientais e confira o erro que pede os três valores.
4. Informe temperatura, umidade e altitude e confira que o resultado marca essas condições como informadas.
5. Confira que resultado, texto e copos representam água total de alimentos e bebidas, arredondada em blocos de 250 ml.
6. Leia os avisos de estimativa, precisão limitada e não substituição de consulta profissional.
7. Refazer a estimativa deve limpar formulário e resultado.

Comando de preview local: `npm run dev -- --host 127.0.0.1`; abra `http://127.0.0.1:5173/pages/calculator.html` (ou a URL/porta impressa pelo Vite).

## Checklist visual e de acessibilidade — Entrega 06

Antes da homologação, percorra as três rotas (`/`, `/pages/calculator.html` e `/pages/sobre.html`) em viewport desktop e móvel, incluindo largura de 320 px. Verifique:

- navegação entre páginas, links externos e estado `aria-current`;
- link “Pular para o conteúdo”, sequência por teclado e foco visível em links, botões, campos e acordeões;
- leitura dos rótulos e mensagens da calculadora, validação, resultado e ação de refazer;
- abertura dos acordeões com mouse, toque e teclado;
- ausência de rolagem horizontal, texto cortado, sobreposição ou controles estreitos;
- movimento respeitando a preferência `prefers-reduced-motion` do sistema;
- transição entre páginas ao navegar por links internos em um navegador com suporte à CSS View Transition API; em navegadores sem suporte, confirme que a navegação normal continua funcionando;
- títulos, descrições, favicon e avisos adequados em cada página.

Essa checklist requer inspeção manual em navegador. Os comandos de typecheck, lint, testes e build não substituem essa revisão visual ou testes com tecnologia assistiva.

A transição entre páginas só deve ser avaliada clicando em links internos entre páginas da mesma origem. Digitar a URL diretamente ou recarregar a página não necessariamente inicia uma transição.

## Registro da Entrega F — 27/10/2026

- Preview local da calculadora: cálculo-base de 2,25 L, comparação abaixo (1,5 L), equivalente (2,25 L) e acima (3 L); diferença, percentuais e conteúdo do cenário corresponderam aos valores de entrada.
- Árvore de acessibilidade do navegador: rótulos dos campos, grupos de rádio, controles, erros, títulos e listas educativas estavam disponíveis; depois de comparar, o foco foi movido para a região “Sua comparação”.
- O `aria-live` foi removido do painel completo: ele contém material de leitura extenso. O painel agora recebe foco programático, evitando anúncio automático de todo o conteúdo.
- `prefers-reduced-motion` está coberto no CSS e a rolagem programática consulta a mesma preferência.
- O texto auxiliar da comparação teve o contraste aumentado; a cor `#586d76` atinge pelo menos 5,19:1 sobre o fundo `#f4fbfc` usado nessa área. É uma checagem calculada para essa combinação, não uma auditoria automatizada de todos os componentes.
- Typecheck, lint, testes unitários, build e `git diff --check` foram executados. O build foi escrito em diretório temporário para preservar `dist/`.
- As media queries de 700 px e 390 px foram revisadas no CSS; teste visual em aparelho físico, largura exata de 320 px, contraste medido e leitor de tela não foram realizados.
- As rotas `index.html`, `pages/calculator.html` e `pages/sobre.html` responderam com HTTP 200 no servidor Vite local.
