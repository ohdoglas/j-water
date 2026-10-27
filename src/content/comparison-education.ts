import type { HydrationComparison } from "../domain/hydration-comparison";

export interface ComparisonEducation {
  heading: string;
  introduction: string;
  points: string[];
  practicalHeading: string;
  practicalTips: string[];
}

const comparisonEducation: Record<HydrationComparison["scenario"], ComparisonEducation> = {
  below: {
    heading: "O que essa diferença pode e não pode dizer",
    introduction: "Em algumas situações de ingestão insuficiente ou perda de líquidos, podem ocorrer sede, boca seca, urina mais escura ou menos frequente, cansaço, dor de cabeça ou tontura. Esses sinais têm várias causas e não podem ser deduzidos da diferença calculada aqui.",
    points: [
      "A comparação não confirma desidratação e não explica sintomas. A avaliação do estado de hidratação depende de contexto e, quando necessário, de avaliação profissional.",
      "Calor, exercício, febre, vômitos, diarreia e alguns medicamentos podem mudar as perdas de líquidos; esta comparação não estima esses efeitos.",
    ],
    practicalHeading: "Ideias simples para observar sua rotina",
    practicalTips: [
      "Deixe uma bebida acessível e associe pausas ou refeições a uma oportunidade de beber, sem seguir um cronograma rígido.",
      "Em dias quentes ou durante atividade física, considere o contexto e as perdas; evite tentar compensar bebendo um grande volume de uma só vez.",
      "Observe sede e mudanças persistentes na rotina como pistas, não como testes diagnósticos.",
    ],
  },
  near: {
    heading: "O papel da água no organismo",
    introduction: "A água participa de funções fisiológicas normais: ajuda no transporte de substâncias, na manutenção do volume circulante, na remoção de resíduos e no equilíbrio térmico do corpo.",
    points: [
      "Estar perto do número calculado não comprova hidratação adequada. A estimativa e o consumo informado são aproximações de água total, que pode vir de bebidas e alimentos.",
      "As necessidades variam com atividade, ambiente e estado de saúde. Em pessoas já adequadamente hidratadas, beber além da necessidade não garante mais energia, concentração ou desempenho.",
    ],
    practicalHeading: "Para manter uma rotina flexível",
    practicalTips: [
      "Mantenha bebidas disponíveis e ajuste seus hábitos ao clima, às atividades e às orientações profissionais que você já recebeu.",
      "A sede e a cor da urina podem ser observações auxiliares, mas não determinam sozinhas o estado de hidratação.",
    ],
  },
  above: {
    heading: "Mais água não significa sempre mais benefício",
    introduction: "Um total informado acima da estimativa não indica, por si só, um problema nem um benefício adicional. A comparação só descreve a distância entre dois números aproximados.",
    points: [
      "Beber grandes volumes em pouco tempo pode ser perigoso. Durante exercícios prolongados, a ingestão excessiva de água está associada ao risco de hiponatremia, uma alteração do sódio no sangue.",
      "Não force líquidos para ultrapassar a estimativa. As necessidades dependem do contexto e esta ferramenta não fornece limites de segurança individuais.",
    ],
    practicalHeading: "Uma observação equilibrada",
    practicalTips: [
      "Considere o conjunto da rotina, incluindo bebidas e água presente nos alimentos, em vez de buscar um número maior por si só.",
      "Em atividade prolongada, calor intenso ou sintomas, siga orientação apropriada ao contexto; a calculadora não substitui aconselhamento profissional.",
    ],
  },
};

export function getComparisonEducation(scenario: HydrationComparison["scenario"]): ComparisonEducation {
  return comparisonEducation[scenario];
}
