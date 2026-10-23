# Arquitetura do J-WATER 2.0

## Direção

Aplicação estática, executada no navegador e sem backend. O escopo não requer autenticação, contas, histórico nem banco de dados. Vite reúne as páginas e os assets para publicação estática; TypeScript será usado na lógica nova, com a interface separada do cálculo.

## Estrutura atual e planejada

- `src/pages/`: entradas HTML existentes.
- `src/css/`: folhas de estilo atuais; o sistema visual será revisto na Entrega 02.
- `src/scripts/main.ts`: entrada TypeScript que, nesta etapa, carrega a lógica legada.
- `src/scripts/models/`: contém o cálculo antigo; será substituído somente depois da aprovação metodológica na Entrega 03.
- `src/domain/`: destino planejado para tipos, validação e motor puro de cálculo.
- `src/content/`: destino planejado para conteúdo educativo e referências.
- `src/assets/`: imagens atuais; novos símbolos e ilustrações vetoriais serão definidos antes do layout.
- `tests/`: testes do domínio e do fluxo, adicionados com as entregas correspondentes.

## Limites entre camadas

1. Componentes e páginas coletam dados e exibem estados.
2. Validação converte entradas da interface para dados aceitos pelo domínio.
3. O motor de cálculo permanece independente do DOM e retorna resultado estruturado com fonte e limitações.
4. Conteúdo educativo mantém referências fora dos componentes.

## Decisões registradas

- Vite + TypeScript, sem framework de UI nesta fase.
- Build estático para hospedar em serviços como GitHub Pages ou Vercel.
- EFSA foi escolhida como referência inicial para a discussão metodológica; os valores serão tratados como ingestão adequada de água total para adultos, não como necessidade clínica individual.
- A equação atual permanece apenas como legado temporário e não será usada como base científica da versão 2.0.
