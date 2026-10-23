export type SexCategory = "female" | "male";
export type ActivityLevel = "low" | "moderate" | "active" | "very_active";

export interface EnvironmentalConditions {
  temperatureC: number;
  relativeHumidityPercent: number;
  altitudeMeters: number;
}

export interface HydrationInput {
  ageYears: number;
  sexCategory: SexCategory;
  bodyWeightKg: number;
  activityLevel: ActivityLevel;
  athlete: boolean;
  environment?: Partial<EnvironmentalConditions>;
}

export interface HydrationEstimate {
  ageYears: number;
  sexCategory: SexCategory;
  bodyWeightKg: number;
  activityLevel: ActivityLevel;
  physicalActivityLevel: number;
  athlete: boolean;
  temperatureC: number;
  relativeHumidityPercent: number;
  altitudeMeters: number;
  environmentSource: "user-provided" | "study-reference-scenario";
  predictedWaterTurnoverMl: number;
  dailyTotalWaterMl: number;
  dailyTotalWaterLiters: number;
  cupVolumeMl: 250;
  cupEquivalent: number;
  populationReferenceMl: number;
  model: "Yamada et al. 2022 water-turnover regression";
  includes: readonly ["Water from food", "Water from beverages"];
  limitations: readonly string[];
}

export interface HydrationInputError {
  code: "invalid_input" | "invalid_field" | "incomplete_environment" | "out_of_range";
  field?: string;
  message: string;
}

export type HydrationCalculation =
  | { ok: true; estimate: HydrationEstimate }
  | { ok: false; errors: HydrationInputError[] };

const ACTIVITY_PAL: Record<ActivityLevel, number> = {
  low: 1.4,
  moderate: 1.6,
  active: 1.8,
  very_active: 2.0,
};

const POPULATION_REFERENCE_ML: Record<SexCategory, number> = {
  female: 2_000,
  male: 2_500,
};

const CUP_VOLUME_ML = 250 as const;
const BEVERAGE_AND_FOOD_INTAKE_SHARE = 0.85;
const STUDY_REFERENCE_ENVIRONMENT: EnvironmentalConditions = {
  temperatureC: 10,
  relativeHumidityPercent: 50,
  altitudeMeters: 0,
};

const LIMITATIONS = [
  "É uma estimativa estatística de água total proveniente de alimentos e bebidas; não é uma prescrição, meta clínica ou avaliação do seu estado de hidratação.",
  "O modelo estima water turnover, não a quantidade de água pura a beber. A conversão para ingestão total usa uma proporção aproximada descrita pelos autores.",
  "A equação explicou 47,1% da variação observada no estudo e não determina a necessidade individual com precisão.",
  "Se as condições ambientais forem omitidas, o cálculo usa o cenário de referência do exemplo publicado: 10 °C, 50% de umidade relativa, altitude 0 m e categoria de país com HDI alto.",
  "Altura e creatina não são usadas como ajustes: não há coeficiente validado para incluí-las nesta equação. Não foi somado um volume fixo por uso de creatina.",
  "A equação não é adequada para menores de 18 anos, gravidez, amamentação, condições clínicas ou restrição de líquidos. Siga a orientação da sua equipe de saúde.",
] as const;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isFiniteNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function roundToNearest250(value: number): number {
  return Math.round(value / CUP_VOLUME_ML) * CUP_VOLUME_ML;
}

export function calculateHydrationEstimate(input: unknown): HydrationCalculation {
  if (!isRecord(input)) {
    return {
      ok: false,
      errors: [{ code: "invalid_input", message: "Informe os dados para calcular a estimativa." }],
    };
  }

  const allowedFields = new Set([
    "ageYears", "sexCategory", "bodyWeightKg", "activityLevel", "athlete", "environment",
  ]);
  const unknownField = Object.keys(input).find((key) => !allowedFields.has(key));
  if (unknownField) {
    return {
      ok: false,
      errors: [{ code: "invalid_field", field: unknownField, message: `O campo ${unknownField} não é utilizado pelo modelo.` }],
    };
  }

  const errors: HydrationInputError[] = [];
  const { ageYears, sexCategory, bodyWeightKg, activityLevel, athlete } = input;

  if (!isFiniteNumber(ageYears) || ageYears < 18 || ageYears > 96) {
    errors.push({ code: "out_of_range", field: "ageYears", message: "Informe uma idade entre 18 e 96 anos." });
  }
  if (sexCategory !== "female" && sexCategory !== "male") {
    errors.push({ code: "invalid_field", field: "sexCategory", message: "Selecione uma categoria utilizada na equação do estudo." });
  }
  if (!isFiniteNumber(bodyWeightKg) || bodyWeightKg < 30 || bodyWeightKg > 250) {
    errors.push({ code: "out_of_range", field: "bodyWeightKg", message: "Informe um peso entre 30 e 250 kg." });
  }
  if (typeof activityLevel !== "string" || !(activityLevel in ACTIVITY_PAL)) {
    errors.push({ code: "invalid_field", field: "activityLevel", message: "Selecione um nível de atividade disponível." });
  }
  if (typeof athlete !== "boolean") {
    errors.push({ code: "invalid_field", field: "athlete", message: "Informe se você se identifica como atleta no contexto do modelo." });
  }

  let environment = STUDY_REFERENCE_ENVIRONMENT;
  let environmentSource: HydrationEstimate["environmentSource"] = "study-reference-scenario";
  const environmentInput = input.environment;
  if (environmentInput !== undefined) {
    if (!isRecord(environmentInput)) {
      errors.push({ code: "invalid_field", field: "environment", message: "Confira as condições ambientais informadas." });
    } else {
      const keys = ["temperatureC", "relativeHumidityPercent", "altitudeMeters"] as const;
      const provided = keys.filter((key) => environmentInput[key] !== undefined);
      if (provided.length > 0 && provided.length < keys.length) {
        errors.push({
          code: "incomplete_environment",
          field: "environment",
          message: "Informe temperatura, umidade e altitude; ou deixe os três campos em branco para usar o cenário de referência.",
        });
      } else if (provided.length === keys.length) {
        const candidate = environmentInput;
        const temperatureC = candidate.temperatureC;
        const relativeHumidityPercent = candidate.relativeHumidityPercent;
        const altitudeMeters = candidate.altitudeMeters;
        if (!isFiniteNumber(temperatureC) || temperatureC < -10 || temperatureC > 50) {
          errors.push({ code: "out_of_range", field: "temperatureC", message: "Informe uma temperatura entre −10 °C e 50 °C." });
        }
        if (!isFiniteNumber(relativeHumidityPercent) || relativeHumidityPercent < 0 || relativeHumidityPercent > 100) {
          errors.push({ code: "out_of_range", field: "relativeHumidityPercent", message: "Informe a umidade relativa entre 0% e 100%." });
        }
        if (!isFiniteNumber(altitudeMeters) || altitudeMeters < -500 || altitudeMeters > 9_000) {
          errors.push({ code: "out_of_range", field: "altitudeMeters", message: "Informe uma altitude entre −500 m e 9.000 m." });
        }
        if (
          isFiniteNumber(temperatureC) && temperatureC >= -10 && temperatureC <= 50 &&
          isFiniteNumber(relativeHumidityPercent) && relativeHumidityPercent >= 0 && relativeHumidityPercent <= 100 &&
          isFiniteNumber(altitudeMeters) && altitudeMeters >= -500 && altitudeMeters <= 9_000
        ) {
          environment = { temperatureC, relativeHumidityPercent, altitudeMeters };
          environmentSource = "user-provided";
        }
      }
    }
  }

  if (errors.length > 0) return { ok: false, errors };

  const validAge = ageYears as number;
  const validWeight = bodyWeightKg as number;
  const validSex = sexCategory as SexCategory;
  const validActivity = activityLevel as ActivityLevel;
  const validAthlete = athlete as boolean;
  const physicalActivityLevel = ACTIVITY_PAL[validActivity];
  const sexCode = validSex === "male" ? 1 : 0;
  const athleteCode = validAthlete ? 1 : 0;
  const highHdiCode = 0;
  const { temperatureC, relativeHumidityPercent, altitudeMeters } = environment;

  const predictedWaterTurnoverMl =
    1076 * physicalActivityLevel +
    14.34 * validWeight +
    374.9 * sexCode +
    5.823 * relativeHumidityPercent +
    1070 * athleteCode +
    104.6 * highHdiCode +
    0.4726 * altitudeMeters -
    0.3529 * validAge ** 2 +
    24.78 * validAge +
    1.865 * temperatureC ** 2 -
    19.66 * temperatureC -
    713.1;

  if (!Number.isFinite(predictedWaterTurnoverMl) || predictedWaterTurnoverMl <= 0) {
    return {
      ok: false,
      errors: [{ code: "out_of_range", message: "A combinação informada está fora do intervalo útil desta estimativa." }],
    };
  }

  const dailyTotalWaterMl = roundToNearest250(predictedWaterTurnoverMl * BEVERAGE_AND_FOOD_INTAKE_SHARE);
  const dailyTotalWaterLiters = dailyTotalWaterMl / 1_000;

  return {
    ok: true,
    estimate: {
      ageYears: validAge,
      sexCategory: validSex,
      bodyWeightKg: validWeight,
      activityLevel: validActivity,
      physicalActivityLevel,
      athlete: validAthlete,
      temperatureC,
      relativeHumidityPercent,
      altitudeMeters,
      environmentSource,
      predictedWaterTurnoverMl,
      dailyTotalWaterMl,
      dailyTotalWaterLiters,
      cupVolumeMl: CUP_VOLUME_ML,
      cupEquivalent: dailyTotalWaterMl / CUP_VOLUME_ML,
      populationReferenceMl: POPULATION_REFERENCE_ML[validSex],
      model: "Yamada et al. 2022 water-turnover regression",
      includes: ["Water from food", "Water from beverages"],
      limitations: LIMITATIONS,
    },
  };
}
