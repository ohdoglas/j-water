import { calculateHydrationEstimate, type HydrationEstimate } from "../domain/hydration";
import {
  compareHydrationIntake,
  normalizeHydrationIntake,
  type HydrationComparison,
} from "../domain/hydration-comparison";
import { getComparisonEducation } from "../content/comparison-education";
import { getCurrentLocale, translateText, type Locale } from "./i18n";

export interface FormattedHydrationEstimate {
  liters: string;
  milliliters: string;
  cups: string;
  populationReference: string;
  environment: string;
}

export interface FormattedHydrationComparison {
  estimateLiters: string;
  reportedLiters: string;
  difference: string;
  percentage: string;
  maximumLiters: string;
  estimateLevel: string;
  reportedLevel: string;
  estimateAccessibleLabel: string;
  reportedAccessibleLabel: string;
  scenarioTitle: string;
  scenarioMessage: string;
  scenarioSymbol: string;
  education: ReturnType<typeof getComparisonEducation>;
}

const formatNumber = (value: number, fractionDigits = 0, locale: Locale = getCurrentLocale()): string =>
  new Intl.NumberFormat(locale, { maximumFractionDigits: fractionDigits }).format(value);

export function formatHydrationEstimate(estimate: HydrationEstimate, locale: Locale = getCurrentLocale()): FormattedHydrationEstimate {
  const environment = estimate.environmentSource === "study-reference-scenario"
    ? locale === "en"
      ? "Environmental conditions used: the reference scenario from the published example (10 °C, 50% relative humidity, 0 m altitude). The model keeps the high-HDI country category fixed."
      : "Condições ambientais usadas: cenário-base do exemplo publicado (10 °C, 50% de umidade relativa, altitude 0 m). O modelo mantém fixa a categoria de país com IDH alto."
    : locale === "en"
      ? `Environmental conditions entered: ${formatNumber(estimate.temperatureC, 1, locale)} °C, ${formatNumber(estimate.relativeHumidityPercent, 0, locale)}% relative humidity, and ${formatNumber(estimate.altitudeMeters, 0, locale)} m altitude. The model keeps the high-HDI country category fixed.`
      : `Condições ambientais informadas: ${formatNumber(estimate.temperatureC, 1, locale)} °C, ${formatNumber(estimate.relativeHumidityPercent, 0, locale)}% de umidade relativa e altitude ${formatNumber(estimate.altitudeMeters, 0, locale)} m. O modelo mantém fixa a categoria de país com IDH alto.`;

  return {
    liters: formatNumber(estimate.dailyTotalWaterLiters, 2, locale),
    milliliters: formatNumber(estimate.dailyTotalWaterMl, 0, locale),
    cups: formatNumber(estimate.cupEquivalent, 0, locale),
    populationReference: `${formatNumber(estimate.populationReferenceMl, 0, locale)} ml${locale === "en" ? "/day" : "/dia"}`,
    environment,
  };
}

export function formatHydrationComparison(comparison: HydrationComparison, locale: Locale = getCurrentLocale()): FormattedHydrationComparison {
  const maximumMl = Math.max(comparison.estimateMl, comparison.reportedMl);
  const estimateLiters = formatNumber(comparison.estimateMl / 1_000, 2, locale);
  const reportedLiters = formatNumber(comparison.reportedMl / 1_000, 2, locale);
  const maximumLiters = formatNumber(maximumMl / 1_000, 2, locale);
  const differenceDirection = comparison.differenceMl < 0 ? (locale === "en" ? "below" : "abaixo") : (locale === "en" ? "above" : "acima");
  const difference = comparison.differenceMl === 0
    ? locale === "en" ? "Intake matches the estimate" : "Consumo equivalente à estimativa"
    : locale === "en"
      ? `${formatNumber(comparison.absoluteDifferenceMl, 0, locale)} ml ${differenceDirection} the estimate`
      : `${formatNumber(comparison.absoluteDifferenceMl, 0, locale)} ml ${differenceDirection} da estimativa`;

  const scenarioContent = (locale === "en" ? {
    below: {
      title: "Intake below the estimate",
      message: "The total water you reported is below the calculated estimate. This mathematical difference does not confirm dehydration or assess your health.",
      symbol: "↓",
    },
    near: {
      title: "Intake close to the estimate",
      message: "The values are close within the 250 ml visual comparison tolerance. This does not confirm adequate hydration or represent a medical safety range.",
      symbol: "≈",
    },
    above: {
      title: "Intake above the estimate",
      message: "The total water you reported is above the estimate. This is not necessarily a problem; drinking more does not mean unlimited added benefit.",
      symbol: "↑",
    },
  } : {
    below: {
      title: "Consumo abaixo da estimativa",
      message: "O total de água que você informou ficou abaixo da estimativa calculada. Essa diferença matemática não comprova desidratação nem avalia seu estado de saúde.",
      symbol: "↓",
    },
    near: {
      title: "Consumo próximo da estimativa",
      message: "Os valores estão próximos dentro da tolerância comparativa visual de 250 ml. Isso não confirma hidratação adequada nem representa uma faixa de segurança médica.",
      symbol: "≈",
    },
    above: {
      title: "Consumo acima da estimativa",
      message: "O total de água que você informou ficou acima da estimativa. Isso não representa necessariamente um problema; consumir mais não significa obter benefícios adicionais de forma ilimitada.",
      symbol: "↑",
    },
  })[comparison.scenario];

  return {
    estimateLiters,
    reportedLiters,
    difference,
    percentage: `${formatNumber(comparison.percentage, 1, locale)}%`,
    maximumLiters,
    estimateLevel: `${((comparison.estimateMl / maximumMl) * 100).toFixed(2)}%`,
    reportedLevel: `${((comparison.reportedMl / maximumMl) * 100).toFixed(2)}%`,
    estimateAccessibleLabel: locale === "en" ? `J-WATER estimate: ${estimateLiters} litres; scale maximum ${maximumLiters} litres.` : `Estimativa J-WATER: ${estimateLiters} litros; escala máxima ${maximumLiters} litros.`,
    reportedAccessibleLabel: locale === "en" ? `Reported total intake: ${reportedLiters} litres; scale maximum ${maximumLiters} litres.` : `Consumo total informado: ${reportedLiters} litros; escala máxima ${maximumLiters} litros.`,
    scenarioTitle: scenarioContent.title,
    scenarioMessage: scenarioContent.message,
    scenarioSymbol: scenarioContent.symbol,
    education: getComparisonEducation(comparison.scenario, locale),
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
  const comparisonSection = root.querySelector<HTMLElement>("#hydration-comparison");
  const comparisonForm = root.querySelector<HTMLFormElement>("#comparison-form");
  const comparisonError = root.querySelector<HTMLParagraphElement>("#comparison-error");
  const comparisonResult = root.querySelector<HTMLElement>("#comparison-result");
  const volumeInputPanel = root.querySelector<HTMLElement>("#volume-input-panel");
  const cupsInputPanel = root.querySelector<HTMLElement>("#cups-input-panel");
  const volumeModeInput = root.querySelector<HTMLInputElement>("#mode-volume");
  const cupsModeInput = root.querySelector<HTMLInputElement>("#mode-cups");
  const cupCapacityInput = root.querySelector<HTMLSelectElement>("#cup-capacity");
  const customCapacityField = root.querySelector<HTMLElement>("#custom-capacity-field");
  const estimateWater = root.querySelector<HTMLElement>("#estimate-water");
  const reportedWater = root.querySelector<HTMLElement>("#reported-water");
  const estimateVessel = root.querySelector<HTMLElement>("#estimate-vessel");
  const reportedVessel = root.querySelector<HTMLElement>("#reported-vessel");
  const comparisonEstimateValue = root.querySelector<HTMLElement>("#comparison-estimate-value");
  const comparisonReportedValue = root.querySelector<HTMLElement>("#comparison-reported-value");
  const comparisonSummary = root.querySelector<HTMLElement>("#comparison-summary");
  const comparisonSummaryMark = root.querySelector<HTMLElement>(".comparison-summary-mark");
  const comparisonScenarioTitle = root.querySelector<HTMLElement>("#comparison-scenario-title");
  const comparisonDifference = root.querySelector<HTMLElement>("#comparison-difference");
  const comparisonPercentage = root.querySelector<HTMLElement>("#comparison-percentage");
  const comparisonMessage = root.querySelector<HTMLElement>("#comparison-message");
  const educationHeading = root.querySelector<HTMLElement>("#comparison-education-heading");
  const educationIntroduction = root.querySelector<HTMLElement>("#comparison-education-introduction");
  const educationPoints = root.querySelector<HTMLUListElement>("#comparison-education-points");
  const practicalHeading = root.querySelector<HTMLElement>("#comparison-practical-heading");
  const practicalTips = root.querySelector<HTMLUListElement>("#comparison-practical-tips");
  const editComparisonButton = root.querySelector<HTMLButtonElement>("#edit-comparison");

  if (
    !form || !formError || !resultPanel || !litersOutput || !millilitersOutput ||
    !cupsOutput || !populationReferenceOutput || !environmentOutput || !newCalculationButton ||
    !comparisonSection || !comparisonForm || !comparisonError || !comparisonResult ||
    !volumeInputPanel || !cupsInputPanel || !volumeModeInput || !cupsModeInput ||
    !cupCapacityInput || !customCapacityField || !estimateWater || !reportedWater ||
    !estimateVessel || !reportedVessel || !comparisonEstimateValue || !comparisonReportedValue ||
    !comparisonSummary || !comparisonSummaryMark || !comparisonScenarioTitle ||
    !comparisonDifference || !comparisonPercentage || !comparisonMessage || !editComparisonButton ||
    !educationHeading || !educationIntroduction || !educationPoints || !practicalHeading || !practicalTips
  ) return;

  let currentEstimateMl: number | undefined;
  let lastEstimate: HydrationEstimate | undefined;
  let lastComparison: HydrationComparison | undefined;

  const renderEntryMode = (): void => {
    const useCups = cupsModeInput.checked;
    volumeInputPanel.hidden = useCups;
    cupsInputPanel.hidden = !useCups;
    customCapacityField.hidden = cupCapacityInput.value !== "custom";
  };

  const clearComparisonResult = (): void => {
    comparisonResult.hidden = true;
    comparisonError.hidden = true;
    comparisonForm.querySelectorAll<HTMLElement>("[aria-invalid='true']").forEach((field) => field.removeAttribute("aria-invalid"));
  };

  const resetComparison = (): void => {
    currentEstimateMl = undefined;
    comparisonForm.reset();
    renderEntryMode();
    clearComparisonResult();
    comparisonSection.hidden = true;
    comparisonEstimateValue.textContent = "—";
    comparisonReportedValue.textContent = "—";
    comparisonDifference.textContent = "—";
    comparisonPercentage.textContent = "—";
    comparisonMessage.textContent = "";
    estimateWater.style.removeProperty("--water-level");
    reportedWater.style.removeProperty("--water-level");
    comparisonSummary.removeAttribute("data-scenario");
  };

  const revealError = (message: string, field?: string): void => {
    comparisonError.textContent = message;
    comparisonError.hidden = false;
    const fieldIds: Record<string, string> = {
      mode: "mode-volume",
      value: "consumption-volume",
      unit: "consumption-unit",
      count: "consumption-cups",
      cupCapacityMl: cupCapacityInput.value === "custom" ? "custom-cup-capacity" : "cup-capacity",
      estimateMl: "consumption-volume",
      reportedMl: "consumption-volume",
    };
    const target = field ? root.querySelector<HTMLElement>(`#${fieldIds[field] ?? ""}`) : null;
    target?.setAttribute("aria-invalid", "true");
    comparisonError.focus();
  };

  const updateComparison = (comparison: HydrationComparison): void => {
    const display = formatHydrationComparison(comparison);
    comparisonEstimateValue.textContent = `${display.estimateLiters} L`;
    comparisonReportedValue.textContent = `${display.reportedLiters} L`;
    comparisonDifference.textContent = display.difference;
    comparisonPercentage.textContent = display.percentage;
    comparisonScenarioTitle.textContent = display.scenarioTitle;
    comparisonSummaryMark.textContent = display.scenarioSymbol;
    comparisonMessage.textContent = display.scenarioMessage;
    educationHeading.textContent = display.education.heading;
    educationIntroduction.textContent = display.education.introduction;
    practicalHeading.textContent = display.education.practicalHeading;
    const renderList = (list: HTMLUListElement, items: string[]): void => {
      list.replaceChildren(...items.map((text) => {
        const item = root.createElement("li");
        item.textContent = text;
        return item;
      }));
    };
    renderList(educationPoints, display.education.points);
    renderList(practicalTips, display.education.practicalTips);
    comparisonSummary.dataset.scenario = comparison.scenario;
    estimateWater.style.setProperty("--water-level", display.estimateLevel);
    reportedWater.style.setProperty("--water-level", display.reportedLevel);
    estimateVessel.setAttribute("aria-label", display.estimateAccessibleLabel);
    reportedVessel.setAttribute("aria-label", display.reportedAccessibleLabel);
    comparisonError.hidden = true;
    comparisonResult.hidden = false;
    comparisonResult.focus({ preventScroll: true });

    const reducedMotion = root.defaultView?.matchMedia("(prefers-reduced-motion: reduce)").matches;
    comparisonResult.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth", block: "nearest" });
  };

  root.addEventListener("jwater:localechange", () => {
    if (lastEstimate && !resultPanel.hidden) {
      const display = formatHydrationEstimate(lastEstimate);
      litersOutput.textContent = display.liters;
      millilitersOutput.textContent = display.milliliters;
      cupsOutput.textContent = display.cups;
      populationReferenceOutput.textContent = display.populationReference;
      environmentOutput.textContent = display.environment;
    }
    if (lastComparison && !comparisonResult.hidden) updateComparison(lastComparison);
  });

  renderEntryMode();
  volumeModeInput.addEventListener("change", renderEntryMode);
  cupsModeInput.addEventListener("change", renderEntryMode);
  cupCapacityInput.addEventListener("change", renderEntryMode);
  comparisonForm.addEventListener("input", clearComparisonResult);
  comparisonForm.addEventListener("change", clearComparisonResult);

  comparisonForm.addEventListener("submit", (event) => {
    event.preventDefault();
    if (currentEstimateMl === undefined) {
      revealError(translateText("Calcule primeiro sua estimativa J-WATER para comparar os valores."));
      return;
    }

    const formData = new FormData(comparisonForm);
    const mode = formData.get("entryMode");
    const normalizedIntake = mode === "volume"
      ? normalizeHydrationIntake({ mode, value: formData.get("volume"), unit: formData.get("unit") })
      : mode === "cups"
        ? normalizeHydrationIntake({
            mode,
            count: formData.get("cups"),
            cupCapacityMl: formData.get("cupCapacity") === "custom"
              ? formData.get("customCupCapacity")
              : formData.get("cupCapacity"),
          })
        : normalizeHydrationIntake({ mode });

    if (!normalizedIntake.ok) {
      revealError(translateText(normalizedIntake.errors[0]?.message ?? "Revise os dados do consumo informado."), normalizedIntake.errors[0]?.field);
      return;
    }

    const comparison = compareHydrationIntake(currentEstimateMl, normalizedIntake.volumeMl);
    if (!comparison.ok) {
      revealError(translateText(comparison.errors[0]?.message ?? "Não foi possível comparar esses valores."), comparison.errors[0]?.field);
      return;
    }

    lastComparison = comparison.comparison;
    updateComparison(comparison.comparison);
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    resetComparison();
    resultPanel.hidden = true;
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
      formError.textContent = translateText(calculation.errors[0]?.message ?? "Revise os campos do formulário.");
      formError.hidden = false;
      formError.focus();
      return;
    }

    formError.hidden = true;
    lastEstimate = calculation.estimate;
    const display = formatHydrationEstimate(calculation.estimate);
    litersOutput.textContent = display.liters;
    millilitersOutput.textContent = display.milliliters;
    cupsOutput.textContent = display.cups;
    populationReferenceOutput.textContent = display.populationReference;
    environmentOutput.textContent = display.environment;
    currentEstimateMl = calculation.estimate.dailyTotalWaterMl;
    comparisonSection.hidden = false;
    resultPanel.hidden = false;
    resultPanel.focus({ preventScroll: true });

    const reducedMotion = root.defaultView?.matchMedia("(prefers-reduced-motion: reduce)").matches;
    resultPanel.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth", block: "nearest" });
  });

  newCalculationButton.addEventListener("click", () => {
    form.reset();
    resetComparison();
    lastEstimate = undefined;
    lastComparison = undefined;
    formError.hidden = true;
    resultPanel.hidden = true;
    root.querySelector<HTMLInputElement>("#age-years")?.focus();
  });

  editComparisonButton.addEventListener("click", () => {
    const activeInput = cupsModeInput.checked
      ? root.querySelector<HTMLInputElement>("#consumption-cups")
      : root.querySelector<HTMLInputElement>("#consumption-volume");
    activeInput?.focus();
    const reducedMotion = root.defaultView?.matchMedia("(prefers-reduced-motion: reduce)").matches;
    comparisonForm.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth", block: "center" });
  });
}
