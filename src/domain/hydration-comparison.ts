export type IntakeUnit = "ml" | "L";
export type ComparisonScenario = "below" | "near" | "above";
export type IntakeField = "mode" | "value" | "unit" | "count" | "cupCapacityMl" | "estimateMl" | "reportedMl";

export interface IntakeInputError {
  code: "invalid_input" | "invalid_field" | "out_of_range" | "required";
  field?: IntakeField;
  message: string;
}

export type IntakeNormalization =
  | { ok: true; volumeMl: number }
  | { ok: false; errors: IntakeInputError[] };

export type VolumeConversion =
  | { ok: true; value: number }
  | { ok: false; errors: IntakeInputError[] };

export interface HydrationComparison {
  estimateMl: number;
  reportedMl: number;
  differenceMl: number;
  absoluteDifferenceMl: number;
  proportion: number;
  percentage: number;
  scenario: ComparisonScenario;
  proximityToleranceMl: 250;
}

export type HydrationComparisonResult =
  | { ok: true; comparison: HydrationComparison }
  | { ok: false; errors: IntakeInputError[] };

const MAX_TOTAL_INTAKE_ML = 20_000;
const MAX_CUP_COUNT = 100;
const MIN_CUP_CAPACITY_ML = 50;
const MAX_CUP_CAPACITY_ML = 2_000;
const PROXIMITY_TOLERANCE_ML = 250 as const;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isMissing(value: unknown): boolean {
  return value === undefined || value === null || (typeof value === "string" && value.trim() === "");
}

function parseFiniteNumber(value: unknown): number | undefined {
  if (typeof value === "number") return Number.isFinite(value) ? value : undefined;
  if (typeof value !== "string") return undefined;

  const trimmed = value.trim();
  if (trimmed === "") return undefined;

  // Accept a comma as the decimal separator for text-based callers.
  const normalized = trimmed.replace(",", ".");
  if (!/^[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:[eE][+-]?\d+)?$/.test(normalized)) {
    return undefined;
  }

  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : undefined;
}

function validateFields(
  input: Record<string, unknown>,
  allowedFields: readonly string[],
): IntakeInputError[] {
  const unknownField = Object.keys(input).find((field) => !allowedFields.includes(field));
  return unknownField
    ? [{
        code: "invalid_field",
        message: `O campo ${unknownField} não é utilizado na comparação.`,
      }]
    : [];
}

function validateTotalVolume(volumeMl: number, field: "value" | "count" | "reportedMl"): IntakeInputError[] {
  if (volumeMl < 0 || volumeMl > MAX_TOTAL_INTAKE_ML) {
    return [{
      code: "out_of_range",
      field,
      message: "Informe um volume equivalente entre 0 e 20.000 ml por dia. Esse limite evita erros de entrada e não representa uma faixa saudável ou recomendação.",
    }];
  }
  return [];
}

/** Converts liters and milliliters, validating the entered quantity against technical input bounds. */
export function convertHydrationVolume(value: unknown, fromUnit: unknown, toUnit: unknown): VolumeConversion {
  const amount = parseFiniteNumber(value);
  if (amount === undefined) {
    return {
      ok: false,
      errors: [{ code: isMissing(value) ? "required" : "invalid_field", field: "value", message: "Informe um valor numérico para converter." }],
    };
  }
  if ((fromUnit !== "ml" && fromUnit !== "L") || (toUnit !== "ml" && toUnit !== "L")) {
    return {
      ok: false,
      errors: [{ code: "invalid_field", field: "unit", message: "Selecione litros (L) ou mililitros (ml)." }],
    };
  }

  const valueInMl = fromUnit === "L" ? amount * 1_000 : amount;
  const volumeErrors = validateTotalVolume(valueInMl, "value");
  if (volumeErrors.length > 0) return { ok: false, errors: volumeErrors };

  return { ok: true, value: toUnit === "L" ? valueInMl / 1_000 : valueInMl };
}

/** Converts a volume or cup-count entry into total-water milliliters. */
export function normalizeHydrationIntake(input: unknown): IntakeNormalization {
  if (!isRecord(input)) {
    return {
      ok: false,
      errors: [{ code: "invalid_input", message: "Informe como deseja indicar seu consumo total de água." }],
    };
  }

  if (input.mode === "volume") {
    const errors = validateFields(input, ["mode", "value", "unit"]);
    if (errors.length > 0) return { ok: false, errors };

    if (input.unit !== "ml" && input.unit !== "L") {
      return {
        ok: false,
        errors: [{ code: "invalid_field", field: "unit", message: "Selecione litros (L) ou mililitros (ml)." }],
      };
    }

    const amount = parseFiniteNumber(input.value);
    if (amount === undefined) {
      return {
        ok: false,
        errors: [{ code: isMissing(input.value) ? "required" : "invalid_field", field: "value", message: "Informe um valor numérico para seu consumo total." }],
      };
    }

    const conversion = convertHydrationVolume(amount, input.unit, "ml");
    return conversion.ok ? { ok: true, volumeMl: conversion.value } : conversion;
  }

  if (input.mode === "cups") {
    const errors = validateFields(input, ["mode", "count", "cupCapacityMl"]);
    if (errors.length > 0) return { ok: false, errors };

    const count = parseFiniteNumber(input.count);
    if (count === undefined) {
      return {
        ok: false,
        errors: [{ code: isMissing(input.count) ? "required" : "invalid_field", field: "count", message: "Informe quantos copos equivalentes consome por dia." }],
      };
    }
    if (!Number.isInteger(count) || count < 0 || count > MAX_CUP_COUNT) {
      return {
        ok: false,
        errors: [{ code: "out_of_range", field: "count", message: "Informe uma quantidade inteira entre 0 e 100 copos. Esse limite evita erros de entrada e não representa uma recomendação." }],
      };
    }

    const cupCapacityMl = parseFiniteNumber(input.cupCapacityMl);
    if (cupCapacityMl === undefined) {
      return {
        ok: false,
        errors: [{ code: isMissing(input.cupCapacityMl) ? "required" : "invalid_field", field: "cupCapacityMl", message: "Informe a capacidade de cada copo em mililitros." }],
      };
    }
    if (!Number.isInteger(cupCapacityMl) || cupCapacityMl < MIN_CUP_CAPACITY_ML || cupCapacityMl > MAX_CUP_CAPACITY_ML) {
      return {
        ok: false,
        errors: [{ code: "out_of_range", field: "cupCapacityMl", message: "Informe uma capacidade inteira entre 50 e 2.000 ml. Esse limite valida a entrada e não representa uma recomendação." }],
      };
    }

    const volumeMl = count * cupCapacityMl;
    const volumeErrors = validateTotalVolume(volumeMl, "count");
    return volumeErrors.length > 0 ? { ok: false, errors: volumeErrors } : { ok: true, volumeMl };
  }

  return {
    ok: false,
    errors: [{ code: "invalid_field", field: "mode", message: "Selecione volume ou copos equivalentes." }],
  };
}

/** Compares two total-water values; scenario labels are comparative, not clinical. */
export function compareHydrationIntake(estimateMl: unknown, reportedMl: unknown): HydrationComparisonResult {
  const errors: IntakeInputError[] = [];
  const estimate = parseFiniteNumber(estimateMl);
  const reported = parseFiniteNumber(reportedMl);

  if (estimate === undefined || estimate <= 0) {
    errors.push({
      code: estimate === undefined && isMissing(estimateMl) ? "required" : estimate === undefined ? "invalid_field" : "out_of_range",
      field: "estimateMl",
      message: "A estimativa precisa ser um número finito maior que zero para permitir a comparação.",
    });
  }
  if (reported === undefined) {
    errors.push({
      code: isMissing(reportedMl) ? "required" : "invalid_field",
      field: "reportedMl",
      message: "Informe um valor numérico para o consumo total autodeclarado.",
    });
  } else {
    errors.push(...validateTotalVolume(reported, "reportedMl"));
  }

  if (errors.length > 0 || estimate === undefined || reported === undefined) {
    return { ok: false, errors };
  }

  const differenceMl = reported - estimate;
  const proportion = reported / estimate;
  const percentage = proportion * 100;
  if (![differenceMl, proportion, percentage].every(Number.isFinite)) {
    return {
      ok: false,
      errors: [{ code: "out_of_range", field: "estimateMl", message: "Os valores informados não permitem uma comparação numérica segura." }],
    };
  }

  const scenario: ComparisonScenario =
    differenceMl < -PROXIMITY_TOLERANCE_ML ? "below" :
      differenceMl > PROXIMITY_TOLERANCE_ML ? "above" :
        "near";

  return {
    ok: true,
    comparison: {
      estimateMl: estimate,
      reportedMl: reported,
      differenceMl,
      absoluteDifferenceMl: Math.abs(differenceMl),
      proportion,
      percentage,
      scenario,
      proximityToleranceMl: PROXIMITY_TOLERANCE_ML,
    },
  };
}
