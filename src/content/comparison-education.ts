import type { HydrationComparison } from "../domain/hydration-comparison";
import type { Locale } from "../scripts/i18n";

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

const englishEducation: Record<HydrationComparison["scenario"], ComparisonEducation> = {
  below: {
    heading: "What this difference can and cannot tell you",
    introduction: "In some situations involving insufficient fluid intake or fluid loss, people may experience thirst, dry mouth, darker or less frequent urine, tiredness, headache, or dizziness. These signs have many possible causes and cannot be inferred from the difference calculated here.",
    points: [
      "This comparison does not confirm dehydration or explain symptoms. Hydration status depends on context and, when needed, professional assessment.",
      "Heat, exercise, fever, vomiting, diarrhea, and some medicines can change fluid losses; this comparison does not estimate those effects.",
    ],
    practicalHeading: "Simple ways to notice your routine",
    practicalTips: [
      "Keep a drink within reach and use breaks or meals as a chance to drink, without following a rigid schedule.",
      "In hot weather or during physical activity, consider the context and fluid losses; avoid trying to compensate by drinking a large amount at once.",
      "Notice thirst and persistent changes in your routine as clues, not diagnostic tests.",
    ],
  },
  near: {
    heading: "The role of water in the body",
    introduction: "Water supports normal physiological functions: it helps transport substances, maintain circulating volume, remove waste, and balance body temperature.",
    points: [
      "Being close to the calculated number does not prove adequate hydration. The estimate and reported intake are approximations of total water from beverages and food.",
      "Needs vary with activity, environment, and health. For people who are already adequately hydrated, drinking beyond their needs does not guarantee more energy, focus, or performance.",
    ],
    practicalHeading: "For a flexible routine",
    practicalTips: [
      "Keep drinks available and adapt your habits to the weather, activities, and professional guidance you have received.",
      "Thirst and urine colour can be useful observations, but neither determines hydration status on its own.",
    ],
  },
  above: {
    heading: "More water does not always mean more benefit",
    introduction: "A reported total above the estimate does not, by itself, indicate a problem or an added benefit. This comparison only describes the distance between two approximate numbers.",
    points: [
      "Drinking a large volume in a short time can be dangerous. During prolonged exercise, excessive water intake is associated with a risk of hyponatremia, a change in blood sodium.",
      "Do not force fluids to exceed the estimate. Needs depend on context, and this tool does not provide individual safety limits.",
    ],
    practicalHeading: "A balanced perspective",
    practicalTips: [
      "Consider your overall routine, including beverages and water in food, rather than pursuing a higher number for its own sake.",
      "During prolonged activity, intense heat, or symptoms, follow guidance appropriate to the situation; this calculator does not replace professional advice.",
    ],
  },
};

export function getComparisonEducation(scenario: HydrationComparison["scenario"], locale: Locale = "pt-BR"): ComparisonEducation {
  return (locale === "en" ? englishEducation : comparisonEducation)[scenario];
}
