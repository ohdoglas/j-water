# Especificação — Comparação de Hidratação

**Estado:** Entregas A–F concluídas; integração à `main` e publicação pelo GitHub Actions autorizadas.
**Base da auditoria:** commit `dbfcb86c75c3e865ef6efd3a507cf491e9aab20f`, branch `feature/jwater-2.0`.
**Escopo desta entrega:** auditoria e definição funcional. Nenhum código de produto foi alterado.

## 1. Diagnóstico do estado atual

- A aplicação usa TypeScript, Vite e páginas HTML estáticas, sem backend.
- `src/domain/hydration.ts` contém validação e cálculo sem dependência do DOM.
- `src/scripts/calculator.ts` lê o formulário, chama o domínio, formata o resultado e controla a exibição do painel.
- `src/pages/calculator.html` contém o formulário principal e um painel inicialmente oculto (`#calculation-result`). O painel atual já tem aviso de que a estimativa não é prescrição e não avalia o estado de hidratação.
- O resultado é arredondado para incrementos de 250 ml. O valor do domínio representa uma estimativa de água total de alimentos e bebidas, derivada de aproximadamente 85% do *water turnover* previsto pelo modelo Yamada et al. (2022).
- O formulário e o resultado ficam no documento atual. O fluxo observado não grava valores em `localStorage` ou `sessionStorage`, nem os envia a um serviço de rede. O botão de nova estimativa limpa o formulário e oculta o resultado.
- O CSS da calculadora já define cartões, layout responsivo, estados de foco e respeito a `prefers-reduced-motion`.
- Vitest está configurado em ambiente `node`. Existem testes do motor de estimativa e de sua formatação, mas ainda não há motor, formulário ou testes de comparação.
- A branch local `feature/jwater-2.0` está sincronizada com `origin/jwater-2.0`; também aponta para o mesmo commit da `main`. O worktree estava limpo na auditoria.

### Evidências no repositório

- Modelo, campos, limites e retorno: `src/domain/hydration.ts`.
- Conversão do resultado e eventos do formulário: `src/scripts/calculator.ts`.
- Formulário, painel, aviso e ação de reiniciar: `src/pages/calculator.html`.
- Layout, breakpoints e movimento reduzido: `src/css/styles/calculator.css`.
- Testes existentes: `src/domain/hydration.test.ts` e `src/scripts/calculator.test.ts`.
- Vocabulário científico já adotado: `docs/HYDRATION-METHODOLOGY.md` e `docs/EDUCATIONAL-CONTENT.md`.

## 2. Compatibilidade da comparação — decisão necessária

A estimativa atual representa água total de alimentos e bebidas. Uma entrada que pergunte somente quanta água ou quantos líquidos a pessoa bebe representa apenas líquidos de bebidas. Esses valores não têm o mesmo escopo; subtrair um do outro e rotular a diferença como consumo “abaixo”, “próximo” ou “acima” da estimativa pode induzir uma interpretação errada. O estudo de Yamada distingue *water turnover* da água pré-formada em bebidas e alimentos e relata incerteza sobre quanto da ingestão vem dos alimentos. A referência do National Academies também define água total incluindo bebidas e umidade dos alimentos.

### Decisão aprovada para preservar diferença e percentual

Reformular a entrada como **“Estimativa do seu consumo total de água por dia”**, com ajuda breve: considerar água potável, outras bebidas e água presente nos alimentos. O resultado da pessoa será uma estimativa autodeclarada; a comparação continuará sendo aritmética e não indicará hidratação fisiológica.

Na modalidade de copos, apresentar o resultado como **copos equivalentes** do volume total informado. Não sugerir que água dos alimentos foi literalmente ingerida em copos. A capacidade do copo converte o volume informado; não corrige a incerteza da estimativa da pessoa.

### Alternativa se a simplicidade exigir registrar somente bebidas

Se a entrada permanecer limitada ao volume de água/bebidas, mostrar o volume informado ao lado da estimativa de água total, com rótulos e avisos distintos. Remover diferença percentual e cenários de abaixo/próximo/acima. O volume de bebidas informado não permite concluir qual é a ingestão total, pois não inclui a água dos alimentos.

**Não recomendado:** criar uma porcentagem fixa de água proveniente de bebidas para converter individualmente a estimativa total. A referência usada pelo modelo não fornece uma fração individual validada para esse fim.

**Decisão do usuário:** aprovada a primeira alternativa. A entrada será uma estimativa autodeclarada de água total, considerando alimentos e bebidas. O protótipo B aplica esse escopo visualmente.

## 3. Fluxo funcional proposto

1. A pessoa informa os dados atuais e calcula a estimativa J-WATER.
2. O painel atual da estimativa aparece como hoje, com seus limites e aviso médico.
3. A nova seção aparece somente após o cálculo principal bem-sucedido.
4. A pessoa seleciona uma modalidade de cada vez: volume em litros/mililitros ou copos e capacidade.
5. O formulário converte a entrada para mililitros, valida e, apenas com dados válidos, apresenta a comparação.
6. A pessoa pode alterar o volume e refazer a comparação sem repetir o formulário principal.
7. Refazer a estimativa principal limpa a comparação antiga e oculta sua seção até o próximo resultado.

Os dados permanecem na memória e no DOM da página. Não há persistência, histórico, conta ou transmissão. Não perguntar nem armazenar doenças, gravidez, amamentação ou medicamentos.

## 4. Entradas e validação propostas

### Modalidade por volume

- Um campo numérico e seletor de unidade `ml`/`L`.
- Aceitar fração decimal em litros; normalizar internamente para mililitros.

### Modalidade por copos

- Campo para quantidade inteira de copos.
- Capacidades predefinidas de 200, 250, 300 ou 500 ml e opção personalizada.
- Calcular `quantidade de copos × capacidade em ml`.
- Exibir volume total convertido antes ou junto à comparação.

### Validação

- Campo não informado: erro acessível, sem comparação.
- Valor não numérico, negativo, infinito ou capacidade inválida: rejeitar.
- Zero digitado explicitamente: aceitar como entrada matemática válida; apresentar que isso não diagnostica desidratação.
- Proposta de guarda técnica inicial: consumo convertido de 0 a 20.000 ml/dia; quantidade de 0 a 100 copos; capacidade personalizada de 50 a 2.000 ml. Os tetos servem apenas para impedir erros de digitação e produtos absurdos. Não são limite de segurança, faixa saudável ou recomendação de consumo.
- Rejeitar valores acima dos limites em vez de truncá-los ou classificá-los.
- Usar validação textual clara e programática associada ao campo; preservar navegação por teclado e leitor de tela.

## 5. Comparação matemática e cenários

Após a aprovação de uma medida comparável, os valores estarão normalizados para ml:

```text
diferencaMl = consumoTotalInformadoMl - estimativaJWaterMl
proporcao = consumoTotalInformadoMl / estimativaJWaterMl
percentual = proporcao * 100
```

O domínio deve exigir números finitos e estimativa estritamente maior que zero, mesmo que o cálculo atual já retorne estimativas positivas. Não arredondar os operandos antes de calcular; arredondar somente a apresentação. A diferença mantém sinal e deve ser expressa em ml ou litros com precisão visual adequada.

### Faixa de proximidade

Proposta para a mensagem visual: considerar “próximo” quando `|diferencaMl| <= 250 ml`, usando o incremento de arredondamento atual como tolerância de exibição. A interface deve identificá-la como **tolerância comparativa visual**, nunca como intervalo clínico ou de segurança. A diferença numérica exata continua visível mesmo dentro dessa faixa.

- **Abaixo:** diferença menor que −250 ml. Informar diferença e percentual, acrescentando que comparação abaixo da estimativa não comprova desidratação.
- **Próximo:** diferença entre −250 ml e +250 ml, inclusive. Mensagem positiva e neutra, sem dizer que a pessoa está adequadamente hidratada.
- **Acima:** diferença maior que +250 ml. Mostrar a diferença e esclarecer que consumir mais não implica benefício ilimitado nem maior saúde.

Na fronteira, as condições são exclusivas e cobertas por teste. O estado comparativo descreve apenas a relação matemática entre entradas, nunca uma condição clínica.

## 6. Proposta visual e de interação

- Inserir um cartão de comparação logo após o painel de estimativa, com o título sugerido “E você, quanto consome por dia?”.
- Apresentar duas colunas identificadas: “Estimativa J-WATER” e “Consumo total informado”.
- Usar dois recipientes ou barras aquosas, com valor e unidade impressos junto a cada um. No desktop ficam lado a lado; no mobile ficam empilhados.
- A escala visual deve usar como máximo o maior entre os dois valores, sem truncar valores acima da estimativa. A diferença numérica e percentual devem continuar legíveis mesmo quando os valores estão próximos.
- Mostrar a mensagem do cenário em texto, com ícone opcional. Cor, altura de preenchimento e animação nunca são os únicos canais de significado.
- Animação curta de preenchimento apenas como reforço; conteúdo completo aparece sem animação e com `prefers-reduced-motion`.
- Foco transferido ao resultado da comparação após envio válido; erro anunciado sem esconder os valores.
- Ação de editar/recalcular mantém o formulário acessível. Refazer o cálculo principal limpa dados da comparação.

## 7. Conteúdo educativo e segurança

### Conteúdo condicional

- **Abaixo:** explicar que sede, boca seca, urina escura ou menos frequente, cansaço, tontura e dor de cabeça podem aparecer em algumas situações de ingestão insuficiente; não afirmar que a pessoa apresenta esses sinais nem relacioná-los causalmente com a diferença numérica.
- **Próximo:** descrever funções fisiológicas normais da água e sugerir manutenção flexível do hábito. Evitar prometer mais energia, concentração ou desempenho em quem já está adequadamente hidratado; revisões sobre cognição encontram resultados mistos.
- **Acima:** informar que mais água não é automaticamente melhor. Ingestão excessiva, especialmente em períodos prolongados de exercício, pode contribuir para hiponatremia; não prescrever limites horários gerais.
- **Todos os cenários:** manter visível que a calculadora não diagnostica, não mede estado de hidratação e não substitui aconselhamento profissional.

### Orientações práticas

Usar sugestões flexíveis: deixar uma bebida acessível, associar a ingestão a pausas/refeições e prestar atenção a mudanças de clima, exercício e sede. Não criar cronograma rígido, metas incrementais prescritas ou volumes adicionais por hora.

Cor da urina pode aparecer apenas como observação auxiliar, sem tabela de diagnóstico. A interpretação sofre limitações e pode variar com horário, alimentação, medicamentos e características individuais.

### Condições de saúde

Não recolher dados clínicos para decidir cenário ou quantidade. Usar um aviso geral: pessoas com restrição de líquidos, doença renal ou cardíaca, diabetes, gravidez/amamentação ou uso de medicamentos que afetam líquidos devem seguir orientação de sua equipe de saúde. Não recomendar aumento de ingestão que possa contrariar uma orientação recebida.

Conteúdo geral pode indicar procura de atendimento quando há sinais graves, como confusão, desmaio, ausência de urina, respiração acelerada ou batimento acelerado. O texto deve recomendar avaliação urgente sem alegar que a comparação detectou um problema.

## 8. Estratégia de testes para as entregas de implementação

Os testes de domínio permanecerão independentes do DOM no Vitest, cujo ambiente atual é `node`. Evitar adicionar ambiente ou biblioteca DOM sem necessidade comprovada. Cobrir ao menos:

| Área | Casos |
|---|---|
| Conversão | litros↔ml; copos×capacidade; capacidades fixas e personalizada. |
| Validação | vazio, não numérico, decimal, negativo, `NaN`/infinito, capacidade inválida e tetos técnicos. |
| Zero | zero explícito aceito e comparado; campo vazio rejeitado. |
| Comparação | abaixo, igual, acima; diferenças com sinal; proporção e percentual esperados. |
| Proximidade | `−251`, `−250`, `0`, `+250` e `+251 ml` frente à estimativa. |
| Segurança matemática | estimativa zero, negativa ou não finita rejeitada; nenhuma divisão por zero. |
| Estado | mudar entrada refaz a comparação; editar a estimativa reinicia/limpa o resultado comparativo. |
| Limitações clínicas | aviso estático presente; nenhuma pergunta clínica nem ramo de diagnóstico ou ajuste. |

Também validar manualmente teclado, foco, leitor de tela, 320 px e desktop, movimento reduzido, erros e valores maiores que a estimativa. Teste de interface manual não será declarado coberto por teste unitário de domínio.

## 9. Roadmap e gates

| Entrega | Escopo | Gate de aceite |
|---|---|---|
| A — Auditoria e definição funcional | Auditoria atual, compatibilidade de medidas, fórmulas, cenários, segurança, fontes e critérios. | Especificação revisada; usuário aprova qual medida será informada antes do protótipo. |
| B — Protótipo visual | Formas de entrada, comparação em recipientes/barras, estados, conteúdo e responsividade. | Aprovação do layout desktop/mobile e de semântica dos indicadores. |
| C — Motor de comparação | Normalização, validação, comparação e testes puros. | Casos matemáticos, limites e fronteiras da tolerância aprovados nos testes. |
| D — Integração à calculadora | Formulário pós-estimativa, comparação, edição e reinício. | Fluxo funciona sem estado persistente e não exibe comparação com entrada inválida. |
| E — Conteúdo educativo | Mensagens dos cenários, dicas, limitações e referências. | Linguagem e fontes revisadas; nenhuma inferência clínica. |
| F — Qualidade e homologação | Acessibilidade, responsividade, movimento, regressão e documentação. | Testes técnicos e revisão manual concluídos; publicação só após gate aprovado. |

Não iniciar B ou código de C antes da aprovação desta especificação e da escolha da medida comparada.

## 10. Referências recomendadas

1. Yamada Y, Zhang X, Henderson MET, et al. [Variation in human water turnover associated with environmental and lifestyle factors](https://pmc.ncbi.nlm.nih.gov/articles/PMC9764345/). *Science*. 2022;378(6622):909–915. Base do modelo atual e distinção entre *water turnover* e água ingerida.
2. Institute of Medicine. [Dietary Reference Intakes for Water, Potassium, Sodium, Chloride, and Sulfate — Water](https://www.nationalacademies.org/read/10925/chapter/2). National Academies Press, 2005. Funções da água, fontes de água total e interpretação de AI populacional.
3. NHS. [Dehydration](https://www.nhs.uk/conditions/dehydration/). Sinais possíveis e indicações de atendimento urgente, em linguagem pública.
4. MedlinePlus. [Dehydration](https://www.medlineplus.gov/dehydration.html). Sintomas gerais e sinais que requerem atenção médica imediata.
5. CDC Yellow Book. [Heat and Cold Illness in Travelers](https://www.cdc.gov/yellow-book/hcp/environmental-hazards-risks/heat-and-cold-illness-in-travelers.html). Contexto de exercício/calor e risco de ingestão excessiva associada à hiponatremia.
6. Goodman SPJ, Moreland AT, Marino FE. [The effect of active hypohydration on cognitive function: a systematic review and meta-analysis](https://pubmed.ncbi.nlm.nih.gov/30876770/). *Physiology & Behavior*. 2019;204:297–308. Cautela para não prometer benefício cognitivo universal.
7. Kostelnik SB, et al. [The Validity of Urine Color as a Hydration Biomarker within the General Adult Population and Athletes: A Systematic Review](https://pubmed.ncbi.nlm.nih.gov/32330109/). *Journal of the American College of Nutrition*. 2021;40(2):172–179. Limites de interpretação da cor da urina.
8. American Heart Association. [Lifestyle Changes for Heart Failure](https://www.heart.org/en/health-topics/heart-failure/treatment-options-for-heart-failure/lifestyle-changes-for-heart-failure). Exemplo de condição em que a equipe pode orientar restrição de líquidos.

## 11. Entrega B — protótipo visual

Arquivo isolado: `src/prototypes/hydration-comparison.html`, com estilos em `src/css/prototypes/hydration-comparison.css`. A rota fica disponível no servidor Vite em `/prototypes/hydration-comparison.html`, mas não foi adicionada às entradas de build de produção.

O protótipo demonstra as duas modalidades de entrada, comparação em recipientes na mesma escala, diferença, percentual, texto educativo para o estado abaixo e prévias dos três cenários. A troca entre volume e copos é apenas visual. Os valores são estáticos, não há cálculo ou persistência, e o botão não executa ação; essa limitação aparece na própria página.

Foram verificados os links para a seção de hábitos (`#habits-title`) e cuidados (`#care-title`) existentes na página educativa. O CSS inclui breakpoints mobile, foco visível e `prefers-reduced-motion`. A execução/inspeção em navegador e a validação visual por usuário ainda dependem da revisão do protótipo.

Para pré-visualização local, na raiz do repositório:

```bash
npm run dev -- --host 127.0.0.1
```

Abrir `http://127.0.0.1:5173/prototypes/hydration-comparison.html`.

## 12. Entrega C — motor de comparação

Implementação pura, sem acesso ao DOM ou persistência, em `src/domain/hydration-comparison.ts`; testes em `src/domain/hydration-comparison.test.ts`.

- `convertHydrationVolume` converte litros e mililitros em ambas as direções, aceitando valores numéricos ou texto numérico decimal com ponto/vírgula.
- `normalizeHydrationIntake` converte entrada por volume ou copos equivalentes em ml. Exige contagem inteira de 0 a 100 copos e capacidade inteira de 50 a 2.000 ml.
- `compareHydrationIntake` retorna diferença com sinal, diferença absoluta, proporção, percentual e cenário comparativo.
- Os limites técnicos são: volume total de 0 a 20.000 ml; não representam recomendação ou classificação de saúde. Zero explicitamente informado é aceito.
- A tolerância comparativa fica em ±250 ml, inclusive; abaixo de −250 ml classifica `below`, acima de +250 ml classifica `above`. A propriedade `proximityToleranceMl` permite à futura interface explicitar que a faixa é somente visual/comparativa.
- Estimativa zero, negativa, não finita, valores de entrada inválidos e operações que resultariam em razão não finita são rejeitados com erros estruturados e mensagens em português.
- Nenhuma regra clínica, cálculo do estado fisiológico ou ajuste por condição de saúde foi adicionado.

Validação executada: `npm test -- --reporter=dot` (3 arquivos, 71 testes aprovados), `npm run typecheck` e `npm run lint`, todos aprovados. Não foi executado build porque a entrega adiciona apenas módulo de domínio e testes; a integração à página pertence à Entrega D.

## 13. Entrega D — integração à calculadora

A seção `#hydration-comparison` foi adicionada abaixo do resultado principal em `src/pages/calculator.html`; eventos, normalização e atualização visual ficam em `src/scripts/calculator.ts`; os estilos foram integrados a `src/css/styles/calculator.css`.

- A seção só aparece depois que a estimativa principal é calculada com sucesso. Uma nova estimativa inválida oculta e limpa qualquer comparação anterior.
- O formulário alterna entre volume em L/ml e copos equivalentes; inclui capacidades de 200, 250, 300 e 500 ml e capacidade personalizada.
- Erros ficam visíveis, são anunciados por `role=alert`, associados com `aria-describedby` e marcam o campo inválido com `aria-invalid`. Nenhum resultado aparece para uma entrada inválida.
- A comparação exibe ambos os valores, diferença assinada, percentual e cenário textual. Os recipientes usam o maior valor informado como escala máxima, então valores acima da estimativa não são truncados.
- A validação manual registrada na Entrega D é retrospectiva e não valida o novo conteúdo educativo desta etapa.
- Alterar qualquer campo esconde o resultado anterior; a ação de comparar calcula novamente. “Alterar consumo e comparar novamente” foca o campo ativo. “Fazer outra estimativa” reinicia os dois formulários e oculta as duas saídas.
- Os dados ficam apenas na memória da página. Não foi introduzido armazenamento, envio de rede ou pergunta clínica.
- O aviso existente da calculadora permanece. A explicação clínica/educativa detalhada e referências na interface ficam para a Entrega E.

Validação automatizada: `npm test -- --reporter=dot` (3 arquivos, 74 testes aprovados), `npm run typecheck`, `npm run lint` e `npm run build`. O build foi direcionado a uma pasta temporária fora do repositório, pois a configuração padrão esvazia `dist/` e esse diretório já continha arquivos ignorados. Assim, o `dist/` existente foi preservado.

Validação manual no navegador local: estimativa de exemplo 2.250 ml; entrada 1,5 L resultou em 750 ml abaixo e 66,7%; 6 copos personalizados de 500 ml resultaram em 3.000 ml, 750 ml acima e 133,3%, com escala visual máxima de 3 L; zero foi aceito; campo vazio mostrou erro e removeu a comparação anterior; a edição/refazimento e o reinício foram verificados. A comparação observada permaneceu estritamente matemática e não diagnóstica.

## 14. Estados de evidência

- **Verificado no código:** fórmula e escopo do motor de estimativa; validação; armazenamento transitório no documento; estrutura da calculadora; estilos responsivos e movimento reduzido; testes existentes e novos; branch e SHA da auditoria; links da seção educativa usados pelo protótipo.
- **Fundamentado em fontes:** água total inclui alimentos e bebidas; sintomas possíveis de desidratação; sinais graves; risco de excesso em contextos de exercício; cautela sobre cognição e cor da urina; condições que podem exigir orientação individualizada.
- **Protótipo visual, sem lógica de interface:** entrada demonstrativa, recipientes, diferença e percentual estáticos, texto de exemplo e cenários de prévia. Nada disso está integrado à calculadora.
- **Implementado na Entrega C:** normalização e validação de dados, conversões, comparação matemática, rótulo comparativo de cenário e testes unitários puros.
- **Implementado na Entrega D:** formulário pós-estimativa, apresentação dinâmica, validação da interface, edição, recálculo e reinício sem persistência.
- **Implementado na Entrega E:** textos educativos estáticos por cenário, dicas flexíveis, ressalvas clínicas comuns, orientação de sinais graves e fontes institucionais disponíveis na interface.
- **Implementado na Entrega F:** revisão técnica dos fluxos, documentação, build de produção e verificação local de cenários e rotas.
- **Não verificado na Entrega F:** validação com usuários, revisão médica/editorial, teste com leitor de tela, inspeção em vários navegadores e viewport físico de 320 px.

## 15. Entrega E — conteúdo educativo

O conteúdo contextual fica separado em `src/content/comparison-education.ts`. A interface injeta texto via `textContent` e cria itens de lista como nós de texto, sem interpretar conteúdo como HTML. A comparação matemática escolhe apenas um dos três textos educativos; não há análise de sintomas, perfil clínico, nem recomendação numérica individual.

O resultado inclui fontes clicáveis (NHS, MedlinePlus, National Academies, CDC Yellow Book e NIDDK), alerta para não substituir orientação individual e orientação de atendimento urgente para sinais graves, sem tentar fazer triagem. O conteúdo foi redigido em português com base nos escopos das fontes institucionais citadas. Isso é revisão editorial interna; não houve revisão por profissional de saúde.

Evidência da revisão: NHS/MedlinePlus listam sede, boca seca, urina escura ou menos frequente, cansaço, tontura e sinais graves; National Academies define água total como água potável, bebidas e alimentos e descreve funções fisiológicas; CDC Yellow Book relata relação entre ingestão excessiva e hiponatremia associada ao exercício, além de riscos de forçar líquidos; NIDDK explica que pessoas com doença renal crônica podem precisar de aconselhamento individual sobre líquidos.

Validação da Entrega E: `npm test -- --reporter=dot` (3 arquivos, 74 testes aprovados), `npm run typecheck`, `npm run lint`, `git diff --check` e build Vite concluídos sem erros. O build foi direcionado a uma pasta temporária para preservar o `dist/` já existente. A inspeção manual da nova apresentação em navegador e a revisão por profissional de saúde não foram realizadas nesta entrega.

## 16. Entrega F — qualidade e homologação

O painel de comparação foi revisado com os cenários abaixo, equivalente e acima no navegador local. Valores observados: estimativa de 2,25 L comparada com 1,5 L (750 ml abaixo; 66,7%), 2,25 L (equivalente; 100%) e 3 L (750 ml acima; 133,3%); a escala dos recipientes refletiu o maior valor sem truncamento. A árvore de acessibilidade expôs rótulos, controles, títulos, listas educativas, avisos e referências; depois de comparar, o foco foi movido para a região do resultado.

O `aria-live` foi removido do painel completo, pois a região inclui material extenso para leitura. O foco explícito oferece o contexto do resultado sem forçar anúncio automático de toda a educação. A rolagem continua respeitando `prefers-reduced-motion`; o CSS e o controlador consultam essa preferência.

O texto auxiliar pequeno da comparação passou da cor `#71858e` para `#586d76`; a razão de contraste calculada com `#f4fbfc` é de pelo menos 5,19:1. Essa checagem cobre essas combinações de cor, não substitui uma auditoria completa da aplicação.

**Critérios verificados:** testes, typecheck, lint, build estático, ausência de erros de diff, comparação funcional dos três cenários, navegação para as três páginas principais e respostas HTTP destas rotas.

**Verificação parcial/não executada:** as media queries de 700 px e 390 px foram revisadas no CSS, mas não houve confirmação em dispositivo físico ou viewport de exatamente 320 px; não houve medição automática de contraste, teste com leitor de tela, validação em múltiplos navegadores, teste de usuário ou revisão clínica do conteúdo. Esta homologação é técnica e local, não atestado de conformidade WCAG nem aprovação médica/editorial.

Na conclusão técnica da Entrega F, a validação ocorreu localmente em `http://127.0.0.1:5181/pages/calculator.html`; o versionamento e a publicação são registrados no histórico Git e no workflow do GitHub Actions.
