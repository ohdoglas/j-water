import { calculateHydrationEstimate, type HydrationEstimate } from "../domain/hydration";

export interface FormattedHydrationEstimate {
  liters: string;
  milliliters: string;
  cups: string;
  populationReference: string;
  environment: string;
}

const formatNumber = (value: number, fractionDigits = 0): string =>
  new Intl.NumberFormat("pt-BR", { maximumFractionDigits: fractionDigits }).format(value);

export function formatHydrationEstimate(estimate: HydrationEstimate): FormattedHydrationEstimate {
  const environment = estimate.environmentSource === "study-reference-scenario"
    ? "Condições ambientais usadas: cenário-base do exemplo publicado (10 °C, 50% de umidade relativa, altitude 0 m). O modelo mantém fixa a categoria de país com IDH alto."
    : `Condições ambientais informadas: ${formatNumber(estimate.temperatureC, 1)} °C, ${formatNumber(estimate.relativeHumidityPercent)}% de umidade relativa e altitude ${formatNumber(estimate.altitudeMeters)} m. O modelo mantém fixa a categoria de país com IDH alto.`;

  return {
    liters: formatNumber(estimate.dailyTotalWaterLiters, 2),
    milliliters: formatNumber(estimate.dailyTotalWaterMl),
    cups: formatNumber(estimate.cupEquivalent),
    populationReference: `${formatNumber(estimate.populationReferenceMl)} ml/dia`,
    environment,
  };
}

export function initializeHydrationCalculator(root: Document = document): void {
  const form = root.querySelector<HTMLFormElement>("#hydration-form");
  const formError = root.querySelector<HTMLParagraphElement>("#form-error");
  const resultPanel = root.querySelector<HTMLElement>("#calculation-result");
  const litersOutput = root.querySelector<HTMLElement>("#result-liters");
  const millilitersOutput = root.querySelector<HTMLElement>("#result-milliliters");
  const cupsOutput = root.querySelector<HTMLElement>("#result-cups");
  const populationReferenceOutput = root.querySelector<HTMLElement>("#population-reference");
  const environmentOutput = root.querySelector<HTMLElement>("#environment-used");
  const newCalculationButton = root.querySelector<HTMLButtonElement>("#new-calculation");

  if (
    !form || !formError || !resultPanel || !litersOutput || !millilitersOutput ||
    !cupsOutput || !populationReferenceOutput || !environmentOutput || !newCalculationButton
  ) return;

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(form);
    const environmentValues = ["temperatureC", "relativeHumidityPercent", "altitudeMeters"]
      .map((name) => formData.get(name)?.toString().trim() ?? "");
    const hasEnvironmentalValue = environmentValues.some((value) => value !== "");
    const environment = hasEnvironmentalValue
      ? {
          temperatureC: environmentValues[0] === "" ? undefined : Number(environmentValues[0]),
          relativeHumidityPercent: environmentValues[1] === "" ? undefined : Number(environmentValues[1]),
          altitudeMeters: environmentValues[2] === "" ? undefined : Number(environmentValues[2]),
        }
      : undefined;
    const athleteValue = formData.get("athlete");
    const calculation = calculateHydrationEstimate({
      ageYears: Number(formData.get("ageYears")),
      sexCategory: formData.get("sexCategory"),
      bodyWeightKg: Number(formData.get("bodyWeightKg")),
      activityLevel: formData.get("activityLevel"),
      athlete: athleteValue === "true" ? true : athleteValue === "false" ? false : undefined,
      environment,
    });

    if (!calculation.ok) {
      formError.textContent = calculation.errors[0]?.message ?? "Revise os campos do formulário.";
      formError.hidden = false;
      formError.focus();
      return;
    }

    formError.hidden = true;
    const display = formatHydrationEstimate(calculation.estimate);
    litersOutput.textContent = display.liters;
    millilitersOutput.textContent = display.milliliters;
    cupsOutput.textContent = display.cups;
    populationReferenceOutput.textContent = display.populationReference;
    environmentOutput.textContent = display.environment;
    resultPanel.hidden = false;
    resultPanel.focus({ preventScroll: true });

    const reducedMotion = root.defaultView?.matchMedia("(prefers-reduced-motion: reduce)").matches;
    resultPanel.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth", block: "nearest" });
  });

  newCalculationButton.addEventListener("click", () => {
    form.reset();
    formError.hidden = true;
    resultPanel.hidden = true;
    root.querySelector<HTMLInputElement>("#age-years")?.focus();
  });
}
