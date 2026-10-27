import { describe, expect, it } from "vitest";
import { calculateHydrationEstimate } from "../domain/hydration";
import { compareHydrationIntake } from "../domain/hydration-comparison";
import { formatHydrationComparison, formatHydrationEstimate } from "./calculator";

describe("formatHydrationEstimate", () => {
  it("formats the estimate, comparison reference and disclosed default scenario in Brazilian Portuguese", () => {
    const calculation = calculateHydrationEstimate({
      ageYears: 30,
      sexCategory: "female",
      bodyWeightKg: 60,
      activityLevel: "moderate",
      athlete: false,
    });
    if (!calculation.ok) throw new Error("Expected a valid estimate");

    expect(formatHydrationEstimate(calculation.estimate)).toEqual({
      liters: "2,25",
      milliliters: "2.250",
      cups: "9",
      populationReference: "2.000 ml/dia",
      environment: "Condições ambientais usadas: cenário-base do exemplo publicado (10 °C, 50% de umidade relativa, altitude 0 m). O modelo mantém fixa a categoria de país com IDH alto.",
    });
  });

  it("describes user-provided environmental conditions", () => {
    const calculation = calculateHydrationEstimate({
      ageYears: 30,
      sexCategory: "female",
      bodyWeightKg: 60,
      activityLevel: "moderate",
      athlete: false,
      environment: { temperatureC: 24, relativeHumidityPercent: 65, altitudeMeters: 760 },
    });
    if (!calculation.ok) throw new Error("Expected a valid estimate");

    expect(formatHydrationEstimate(calculation.estimate).environment)
      .toBe("Condições ambientais informadas: 24 °C, 65% de umidade relativa e altitude 760 m. O modelo mantém fixa a categoria de país com IDH alto.");
  });
});

describe("formatHydrationComparison", () => {
  it("formats a lower reported amount without presenting it as a diagnosis", () => {
    const result = compareHydrationIntake(2_500, 1_500);
    if (!result.ok) throw new Error("Expected valid comparison values");

    expect(formatHydrationComparison(result.comparison)).toMatchObject({
      estimateLiters: "2,5",
      reportedLiters: "1,5",
      difference: "1.000 ml abaixo da estimativa",
      percentage: "60%",
      estimateLevel: "100.00%",
      reportedLevel: "60.00%",
      maximumLiters: "2,5",
      scenarioTitle: "Consumo abaixo da estimativa",
      scenarioMessage: expect.stringContaining("não comprova desidratação"),
      education: expect.objectContaining({
        heading: "O que essa diferença pode e não pode dizer",
        introduction: expect.stringContaining("não podem ser deduzidos da diferença"),
        practicalTips: expect.arrayContaining([expect.stringContaining("grande volume de uma só vez")]),
      }),
    });
  });

  it("scales both vessels to the larger value when reported intake is above the estimate", () => {
    const result = compareHydrationIntake(2_500, 3_000);
    if (!result.ok) throw new Error("Expected valid comparison values");

    expect(formatHydrationComparison(result.comparison)).toMatchObject({
      reportedLiters: "3",
      difference: "500 ml acima da estimativa",
      percentage: "120%",
      maximumLiters: "3",
      estimateLevel: "83.33%",
      reportedLevel: "100.00%",
      scenarioTitle: "Consumo acima da estimativa",
      scenarioMessage: expect.stringContaining("não significa obter benefícios adicionais"),
      education: expect.objectContaining({
        heading: "Mais água não significa sempre mais benefício",
        points: expect.arrayContaining([expect.stringContaining("hiponatremia")]),
      }),
    });
  });

  it("identifies the comparative tolerance separately from a health claim", () => {
    const result = compareHydrationIntake(2_500, 2_750);
    if (!result.ok) throw new Error("Expected valid comparison values");

    expect(formatHydrationComparison(result.comparison)).toMatchObject({
      scenarioTitle: "Consumo próximo da estimativa",
      scenarioMessage: expect.stringContaining("faixa de segurança médica"),
      education: expect.objectContaining({
        heading: "O papel da água no organismo",
        points: expect.arrayContaining([expect.stringContaining("não comprova hidratação adequada")]),
      }),
    });
  });
});
