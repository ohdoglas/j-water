import { describe, expect, it } from "vitest";
import { calculateHydrationEstimate } from "./hydration";

const validInput = {
  ageYears: 30,
  sexCategory: "female",
  bodyWeightKg: 60,
  activityLevel: "moderate",
  athlete: false,
} as const;

describe("calculateHydrationEstimate", () => {
  it("uses the published reference scenario when environmental conditions are omitted", () => {
    const result = calculateHydrationEstimate(validInput);

    expect(result).toMatchObject({
      ok: true,
      estimate: {
        physicalActivityLevel: 1.6,
        temperatureC: 10,
        relativeHumidityPercent: 50,
        altitudeMeters: 0,
        environmentSource: "study-reference-scenario",
        dailyTotalWaterMl: 2_250,
        dailyTotalWaterLiters: 2.25,
        cupVolumeMl: 250,
        cupEquivalent: 9,
        populationReferenceMl: 2_000,
      },
    });
  });

  it("uses all supplied environmental conditions and marks the result", () => {
    const result = calculateHydrationEstimate({
      ...validInput,
      environment: { temperatureC: 24, relativeHumidityPercent: 65, altitudeMeters: 760 },
    });

    expect(result).toMatchObject({
      ok: true,
      estimate: {
        environmentSource: "user-provided",
        temperatureC: 24,
        relativeHumidityPercent: 65,
        altitudeMeters: 760,
      },
    });
  });

  it("rejects partially provided environmental conditions", () => {
    expect(calculateHydrationEstimate({
      ...validInput,
      environment: { temperatureC: 24 },
    })).toMatchObject({
      ok: false,
      errors: [{ code: "incomplete_environment" }],
    });
  });

  it.each([
    { ageYears: 17 },
    { ageYears: 97 },
    { bodyWeightKg: 0 },
    { activityLevel: "unknown" },
    { athlete: "yes" },
    { sexCategory: "other" },
  ])("rejects invalid personal input: %s", (override) => {
    expect(calculateHydrationEstimate({ ...validInput, ...override })).toMatchObject({ ok: false });
  });

  it("rejects unsupported height and creatine fields instead of silently using them", () => {
    expect(calculateHydrationEstimate({ ...validInput, heightCm: 170, creatineGrams: 5 })).toMatchObject({
      ok: false,
      errors: [{ code: "invalid_field" }],
    });
  });

  it("rejects non-object input", () => {
    expect(calculateHydrationEstimate(null)).toMatchObject({
      ok: false,
      errors: [{ code: "invalid_input" }],
    });
  });
});
