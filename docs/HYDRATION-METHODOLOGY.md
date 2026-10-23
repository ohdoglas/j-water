# Metodologia da estimativa de hidratação

## Finalidade e linguagem

O J-WATER oferece uma **estimativa educativa de ingestão total de água**. Não é prescrição médica, diagnóstico, avaliação do estado de hidratação ou meta clínica individual. Não substitui consulta nem orientação de profissional de saúde. A interface deve manter esse aviso visível antes do cálculo e junto ao resultado.

O resultado estima água proveniente de alimentos e bebidas. Não representa um volume de água pura que a pessoa deva beber. O copo de 250 ml é apenas uma equivalência aritmética.

## Modelo de pesquisa

O domínio em `src/domain/hydration.ts` implementa a equação de regressão de Yamada et al. (2022), desenvolvida com medições de *water turnover* em 5.604 pessoas de 26 países. A equação adulta prevê *water turnover* (WT, ml/dia) usando nível de atividade física (PAL), peso, sexo codificado pelo estudo, umidade relativa, status de atleta, categoria de HDI do país, altitude e termos quadráticos de idade e temperatura:

```text
WT = 1076×PAL + 14.34×peso + 374.9×sexo + 5.823×umidade
   + 1070×atleta + 104.6×HDI + 0.4726×altitude
   − 0.3529×idade² + 24.78×idade + 1.865×temperatura²
   − 19.66×temperatura − 713.1
```

Codificações do estudo: sexo feminino = 0 e masculino = 1; atleta = 0 ou 1; HDI alto = 0, médio = 1 e baixo = 2. A versão atual usa a categoria de HDI alto como cenário-base fixo. O PAL selecionado na interface é uma aproximação de nível habitual (1,4; 1,6; 1,8; 2,0), não uma medição individual de gasto energético.

Os autores indicam que ingestão total de água por alimentos e bebidas corresponde a aproximadamente 85% de WT. O J-WATER aplica essa proporção como uma segunda aproximação, arredonda o resultado a blocos de 250 ml e apresenta alimentos e bebidas em conjunto. Não converte o valor em água pura.

Se temperatura, umidade e altitude forem informadas, a equação usa esses valores. Se os três campos ficarem vazios, o motor adota o cenário usado em um exemplo do artigo: 10 °C, 50% de umidade relativa, altitude 0 m e HDI alto. O resultado identifica qual cenário foi usado. Preencher apenas parte dos campos produz erro de validação.

## Limites e segurança

- O modelo explicou 47,1% da variação de WT no conjunto analisado; não prevê com precisão a necessidade de uma pessoa específica.
- WT não é a mesma medida que ingestão. A conversão aproximada para água de alimentos e bebidas carrega incerteza adicional; a contribuição de água dos alimentos é particularmente incerta.
- O artigo diz que a equação representa médias observadas em condições usuais e não avaliou marcadores para determinar se participantes estavam adequadamente hidratados.
- A equação não inclui altura. Peso e sexo são usados pelos autores como aproximação de massa livre de gordura na versão simplificada. A altura não é usada como ajuste no J-WATER.
- Creatina não recebe acréscimo fixo: a evidência consultada não sustenta um volume adicional universal por seu uso. O uso de creatina não será perguntado nem usado como multiplicador.
- Atividade física recebe um PAL aproximado e uma variável separada de status de atleta. Isso não calcula perdas específicas de uma sessão esportiva nem suor individual.
- A categoria HDI é fixada como alta no cenário atual; isso limita a adequação do modelo para pessoas em contextos classificados de outra forma.
- Menores de 18 anos, gravidez, amamentação, doenças, medicamentos e restrição de líquidos ficam fora do escopo da equação. O site orienta essas pessoas a seguir aconselhamento profissional e não aplica ajustes clínicos.
- Informações de temperatura, umidade e altitude são opcionais. Nenhum dado de localização, GPS ou formulário é enviado ou salvo pelo cálculo atual.

## Referências

1. Yamada Y, Zhang X, Henderson MET, et al. [Variation in human water turnover associated with environmental and lifestyle factors](https://pmc.ncbi.nlm.nih.gov/articles/PMC9764345/). *Science*. 2022;378(6622):909–915. doi:10.1126/science.abm8668.
2. EFSA Panel on Dietetic Products, Nutrition, and Allergies (NDA). [Scientific Opinion on Dietary Reference Values for water](https://efsa.onlinelibrary.wiley.com/doi/10.2903/j.efsa.2010.1459). *EFSA Journal*. 2010;8(3):1459. doi:10.2903/j.efsa.2010.1459. Usada apenas como comparação populacional (AI), não como entrada da equação personalizada.
3. Lopez RM, et al. [Does creatine supplementation hinder exercise heat tolerance or hydration status? A systematic review with meta-analyses](https://pubmed.ncbi.nlm.nih.gov/19295968/). *Journal of Athletic Training*. 2009;44(2):215–223. doi:10.4085/1062-6050-44.2.215.
