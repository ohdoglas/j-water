# Conteúdo educativo sobre hidratação

## Escopo editorial

A página `src/pages/sobre.html` oferece informação geral e leitura introdutória. Não diagnostica desidratação, define uma meta individual, oferece tratamento, nem substitui avaliação ou orientação de profissionais de saúde.

O termo **água total** é explicado como água de água potável, outras bebidas e umidade dos alimentos, em linha com as referências de ingestão usadas pela EFSA. A estimativa do J-WATER continua sendo uma aproximação exploratória baseada no modelo descrito em `HYDRATION-METHODOLOGY.md`; seu resultado não deve ser entendido como volume de água pura a beber.

## Regras para futuras edições

- Descrever diferenças entre pessoas e situações sem transformar fatores isolados em multiplicadores ou metas.
- Não afirmar benefícios clínicos, cognitivos, dermatológicos ou de desempenho sem fonte diretamente aplicável e linguagem cuidadosamente qualificada.
- Não apresentar cor da urina, sede ou sintomas como diagnóstico automático.
- Não sugerir que beber o máximo possível seja seguro ou desejável.
- Não alterar o cálculo com base em condições clínicas, medicamentos, gravidez, amamentação ou esporte sem método apropriado e revisão profissional.
- Para condições que podem exigir restrição de líquidos, orientar a pessoa a seguir o plano da equipe de saúde; não recomendar uma quantidade alternativa.
- Manter fontes junto ao conteúdo ou no bloco de referências, com instituição, escopo e idioma identificados.
- Revisar os links e afirmações quando o conteúdo for alterado.

## Afirmações apresentadas nesta versão

| Afirmação | Escopo usado na página | Fonte |
|---|---|---|
| Água total pode vir de água potável, outras bebidas e umidade dos alimentos. | Definição de referência, não instrução de consumo individual. | [EFSA, Dietary Reference Values — summary report](https://www.efsa.europa.eu/sites/default/files/2017_09_DRVs_summary_report.pdf) |
| Atividade, clima quente, febre, vômitos e diarreia podem mudar o contexto de ingestão. | Informação geral; a página não calcula ajustes para esses eventos. | [CDC, About Water and Healthier Drinks](https://www.cdc.gov/healthy-weight-growth/water-healthy-drinks/index.html) |
| As necessidades e referências populacionais variam; a água vem principalmente de bebidas e também de alimentos. | A página evita derivar uma meta individual. | [CDC, About Water and Healthier Drinks](https://www.cdc.gov/healthy-weight-growth/water-healthy-drinks/index.html) |
| Ingestão excessiva de água pode contribuir para hiponatremia associada a exercício prolongado. | Aviso contextual, sem instruções de reposição esportiva. | [CDC Yellow Book, Heat and Cold Illness in Travelers](https://www.cdc.gov/yellow-book/hcp/environmental-hazards-risks/heat-and-cold-illness-in-travelers.html) |
| Pessoas com doença renal crônica podem precisar limitar líquidos conforme avaliação profissional. | Exemplo de por que uma estimativa geral pode não se aplicar; não é recomendação clínica. | [NIDDK, Healthy Eating for Adults with Chronic Kidney Disease](https://www.niddk.nih.gov/health-information/kidney-disease/chronic-kidney-disease-ckd/healthy-eating-adults-chronic-kidney-disease) |
| O modelo de Yamada estima circulação de água, não determina sozinho hidratação adequada. | Detalhes, limites e equação estão no documento da metodologia. | [Yamada et al. (2022)](https://pmc.ncbi.nlm.nih.gov/articles/PMC9764345/) |

## Componentes visuais e acessibilidade

- `src/assets/illustrations/water-sources.svg` representa água, bebidas e alimentos como fontes visuais distintas, sem propor proporções quantitativas.
- Os ícones de atividade, clima, alimento e informação são decorativos dentro de cartões cujo texto traz todo o significado.
- Perguntas frequentes usam `<details>` e `<summary>` nativos, sem depender de hover ou JavaScript.
- Animações são decorativas e respeitam `prefers-reduced-motion`.
- Toda informação relevante permanece no texto; nenhuma explicação depende apenas de cor ou ilustração.

## Conteúdo da comparação de consumo

A comparação em `src/pages/calculator.html` apresenta blocos educativos escolhidos somente pelo cenário matemático (`below`, `near`, `above`) em `src/content/comparison-education.ts`. O cenário não determina sintomas, diagnóstico, estado fisiológico ou uma ação clínica.

- **Abaixo:** sintomas comuns são descritos como possibilidades gerais associadas em algumas situações à ingestão insuficiente/perdas; o texto explica que não são deduzidos do valor comparado. Sugestões são hábitos flexíveis e não definem volumes.
- **Próximo:** explica funções fisiológicas gerais da água e deixa claro que proximidade não comprova adequação nem garante benefício extra.
- **Acima:** informa que a comparação não caracteriza problema e inclui aviso específico sobre ingestão excessiva durante exercício prolongado, sem prescrever limites.
- **Todos os cenários:** avisam que condições e tratamentos individuais prevalecem sobre a estimativa; há orientação de procurar atendimento urgente diante de sinais graves, sem afirmar que a ferramenta consegue avaliá-los.

Fontes institucionais verificadas para essa edição: [NHS — desidratação](https://www.nhs.uk/conditions/dehydration/), [MedlinePlus — desidratação](https://medlineplus.gov/dehydration.html), [National Academies — funções e fontes de água total](https://www.nationalacademies.org/read/10925/chapter/2), [CDC Yellow Book — calor e hiponatremia associada a exercício](https://www.cdc.gov/yellow-book/hcp/environmental-hazards-risks/heat-and-cold-illness-in-travelers.html) e [NIDDK — líquidos e doença renal crônica](https://www.niddk.nih.gov/health-information/kidney-disease/chronic-kidney-disease-ckd/healthy-eating-adults-chronic-kidney-disease).
