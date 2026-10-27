import { describe, expect, it } from "vitest";
import { compareHydrationIntake, convertHydrationVolume, normalizeHydrationIntake } from "./hydration-comparison";

describe("convertHydrationVolume", () => {
  it.each([
    [2.5, "L", "ml", 2_500],
    [2_500, "ml", "L", 2.5],
    [1_250, "ml", "ml", 1_250],
    [0, "L", "ml", 0],
  ] as const)("converts %s %s to %s", (value, fromUnit, toUnit, converted) => {
    expect(convertHydrationVolume(value, fromUnit, toUnit)).toEqual({ ok: true, value: converted });
  });

  it.each([
    ["", "L", "ml"],
    ["not a number", "ml", "L"],
    [Number.NaN, "ml", "L"],
    [Number.POSITIVE_INFINITY, "L", "ml"],
    [-1, "ml", "L"],
    [20_001, "ml", "L"],
    ["1", "gallon", "ml"],
  ])("rejects invalid unit conversion: %s %s to %s", (value, fromUnit, toUnit) => {
    expect(convertHydrationVolume(value, fromUnit, toUnit)).toMatchObject({ ok: false });
  });
});

describe("normalizeHydrationIntake", () => {
  it.each([
    [{ mode: "volume", value: 1.5, unit: "L" }, 1_500],
    [{ mode: "volume", value: "1,5", unit: "L" }, 1_500],
    [{ mode: "volume", value: 2_500, unit: "ml" }, 2_500],
    [{ mode: "volume", value: 0, unit: "ml" }, 0],
  ])("normalizes volume entry %s to %s ml", (input, volumeMl) => {
    expect(normalizeHydrationIntake(input)).toEqual({ ok: true, volumeMl });
  });

  it.each([
    [{ mode: "cups", count: 6, cupCapacityMl: 250 }, 1_500],
    [{ mode: "cups", count: "4", cupCapacityMl: "300" }, 1_200],
    [{ mode: "cups", count: 2, cupCapacityMl: 500 }, 1_000],
    [{ mode: "cups", count: 0, cupCapacityMl: 250 }, 0],
    [{ mode: "cups", count: 1, cupCapacityMl: 50 }, 50],
    [{ mode: "cups", count: 1, cupCapacityMl: 2_000 }, 2_000],
  ])("normalizes cup entry %s to %s ml", (input, volumeMl) => {
    expect(normalizeHydrationIntake(input)).toEqual({ ok: true, volumeMl });
  });

  it.each([
    { mode: "volume", value: "", unit: "L" },
    { mode: "volume", value: "   ", unit: "L" },
    { mode: "volume", value: "abc", unit: "ml" },
    { mode: "volume", value: Number.NaN, unit: "ml" },
    { mode: "volume", value: Number.POSITIVE_INFINITY, unit: "ml" },
  ])("rejects missing or nonnumeric volume entry: %s", (input) => {
    expect(normalizeHydrationIntake(input)).toMatchObject({ ok: false });
  });

  it.each([
    { mode: "volume", value: -1, unit: "ml" },
    { mode: "volume", value: 20_001, unit: "ml" },
    { mode: "volume", value: 20.001, unit: "L" },
  ])("rejects volume outside technical bounds: %s", (input) => {
    expect(normalizeHydrationIntake(input)).toMatchObject({
      ok: false,
      errors: [{ code: "out_of_range" }],
    });
  });

  it.each([
    { mode: "cups", count: -1, cupCapacityMl: 250 },
    { mode: "cups", count: 1.5, cupCapacityMl: 250 },
    { mode: "cups", count: 101, cupCapacityMl: 250 },
    { mode: "cups", count: "", cupCapacityMl: 250 },
    { mode: "cups", count: "many", cupCapacityMl: 250 },
    { mode: "cups", count: 1, cupCapacityMl: 49 },
    { mode: "cups", count: 1, cupCapacityMl: 2_001 },
    { mode: "cups", count: 1, cupCapacityMl: 250.5 },
    { mode: "cups", count: 100, cupCapacityMl: 250 },
  ])("rejects invalid or excessive cup entry: %s", (input) => {
    expect(normalizeHydrationIntake(input)).toMatchObject({ ok: false });
  });

  it("rejects invalid mode, unit, non-object input, and unsupported fields", () => {
    expect(normalizeHydrationIntake(null)).toMatchObject({ ok: false, errors: [{ code: "invalid_input" }] });
    expect(normalizeHydrationIntake({ mode: "ounces", value: 8 })).toMatchObject({
      ok: false,
      errors: [{ code: "invalid_field", field: "mode" }],
    });
    expect(normalizeHydrationIntake({ mode: "volume", value: 1, unit: "gallon" })).toMatchObject({
      ok: false,
      errors: [{ code: "invalid_field", field: "unit" }],
    });
    expect(normalizeHydrationIntake({ mode: "volume", value: 1, unit: "L", extra: true })).toMatchObject({
      ok: false,
      errors: [{ code: "invalid_field" }],
    });
  });
});

describe("compareHydrationIntake", () => {
  it("compares a lower reported amount and returns the signed difference and ratio", () => {
    expect(compareHydrationIntake(2_500, 1_500)).toEqual({
      ok: true,
      comparison: {
        estimateMl: 2_500,
        reportedMl: 1_500,
        differenceMl: -1_000,
        absoluteDifferenceMl: 1_000,
        proportion: 0.6,
        percentage: 60,
        scenario: "below",
        proximityToleranceMl: 250,
      },
    });
  });

  it("returns zero difference at equal values", () => {
    expect(compareHydrationIntake(2_500, 2_500)).toMatchObject({
      ok: true,
      comparison: { differenceMl: 0, absoluteDifferenceMl: 0, proportion: 1, percentage: 100, scenario: "near" },
    });
  });

  it("compares a higher reported amount without truncating it", () => {
    expect(compareHydrationIntake(2_500, 3_000)).toMatchObject({
      ok: true,
      comparison: { reportedMl: 3_000, differenceMl: 500, proportion: 1.2, percentage: 120, scenario: "above" },
    });
  });

  it("accepts an intentionally reported zero without dividing by zero", () => {
    expect(compareHydrationIntake(2_500, 0)).toMatchObject({
      ok: true,
      comparison: { reportedMl: 0, differenceMl: -2_500, proportion: 0, percentage: 0, scenario: "below" },
    });
  });

  it.each([
    [2_500, 2_249, "below"],
    [2_500, 2_250, "near"],
    [2_500, 2_500, "near"],
    [2_500, 2_750, "near"],
    [2_500, 2_751, "above"],
  ] as const)("classifies the tolerance boundary: estimate=%s reported=%s", (estimate, reported, scenario) => {
    expect(compareHydrationIntake(estimate, reported)).toMatchObject({
      ok: true,
      comparison: { scenario },
    });
  });

  it.each([
    [0, 1_000],
    [-1, 1_000],
    [Number.NaN, 1_000],
    [Number.POSITIVE_INFINITY, 1_000],
    [Number.MIN_VALUE, 20_000],
    [2_500, -1],
    [2_500, 20_001],
    [2_500, Number.NaN],
    [2_500, Number.POSITIVE_INFINITY],
  ])("rejects invalid comparison values estimate=%s reported=%s", (estimate, reported) => {
    expect(compareHydrationIntake(estimate, reported)).toMatchObject({ ok: false });
  });

  it("rejects a missing reported value", () => {
    expect(compareHydrationIntake(2_500, "")).toMatchObject({
      ok: false,
      errors: [{ code: "required", field: "reportedMl" }],
    });
  });
});
