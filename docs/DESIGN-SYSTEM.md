# Sistema visual — proposta A

## Conceito

Gota geométrica com uma correnteza atravessando seu interior. O desenho procura comunicar frescor e movimento, mantendo formas simples para funcionar em tamanhos pequenos. O wordmark preserva “J-WATER”; o slogan em inglês do logo legado não será reaproveitado.

## Paleta inicial

| Token | Cor | Uso previsto |
|---|---|---|
| Azul-marinho | `#0B2545` | Texto forte e símbolo principal |
| Turquesa | `#09B7B3` | Correnteza e ações de destaque |
| Azul-claro | `#A7ECF1` | Elementos aquosos e fundos de apoio |
| Branco-gelo | `#F4FBFC` | Fundo claro e recorte da onda |
| Azul-céu | `#53B8EA` | Variação de ilustração |

Contraste calculado para pares principais: azul-marinho sobre branco-gelo 14,69:1; azul-marinho sobre turquesa 6,18:1; azul-marinho sobre azul-claro 11,66:1; branco sobre azul-marinho 15,39:1. Turquesa sobre branco-gelo (2,38:1) e azul-céu sobre branco-gelo (2,13:1) não devem ser usados como texto normal. Revalidar estados, tamanhos e superfícies quando a paleta for aplicada à interface.

## Assets nesta proposta

- `src/assets/brand/jwater-logo.svg`: marca horizontal para fundos claros.
- `src/assets/brand/jwater-logo-inverse.svg`: versão para fundos escuros.
- `src/assets/brand/jwater-symbol.svg`: símbolo isolado para favicon e usos compactos.
- `src/assets/illustrations/water-hero.svg`: ilustração decorativa para o hero.
- `src/assets/decorative/wave-divider.svg`: divisor fluido entre seções.
- `src/assets/icons/`: atividade, clima, água nos alimentos, informação e copo.

## Movimento e acessibilidade

Os SVGs não dependem de scripts, fontes remotas ou bibliotecas. As ilustrações puramente decorativas usam `role="presentation"` e `aria-hidden="true"`; os ícones com significado têm título acessível. Na interface, a animação será feita em CSS e desativada ou reduzida com `prefers-reduced-motion`. O indicador do resultado não deve parecer um medidor clínico ou de hidratação individual.

## Aplicação inicial — Entrega 02

A direção A foi aprovada e aplicada à página inicial: wordmark, hero, chamada educativa, navegação, rodapé e divisor de ondas. A navegação compartilhada das páginas existentes também usa o novo logotipo. Os tokens semânticos estão em `src/css/variables.css`; aliases de cor antigos permanecem temporariamente para as páginas ainda não redesenhadas.

A página inicial usa fonte de sistema, sem baixar fonte externa. O movimento da ilustração é discreto e desativado por `prefers-reduced-motion`. A arte do hero é decorativa para tecnologias assistivas; o texto ao redor comunica o propósito. O CTA leva à calculadora existente, sem alterar sua lógica ou fórmula.

O restante da calculadora, a seção educativa e o fluxo do resultado permanecem para entregas posteriores. Esta fatia não integra os ícones de fatores ao formulário nem presume que a estimativa já esteja atualizada.
