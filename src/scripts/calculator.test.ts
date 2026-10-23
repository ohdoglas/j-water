import { describe, expect, it } from "vitest";
import { calculateHydrationEstimate } from "../domain/hydration";
import { formatHydrationEstimate } from "./calculator";

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
