import { validateTransaction } from "./validators.js";
import {
  addRecord,
  createRecord,
  deleteRecord,
  replaceRecords,
  state,
  updateRecord,
  updateSettings
} from "./state.js";
import { compileRegex, highlightedFragment, recordMatches } from "./search.js";
import { calculateStats, formatRwf, getLastSevenDays } from "./stats.js";
import { buildExportData, loadSavedData, saveData, validateImportData } from "./storage.js";

const form = document.querySelector(".transaction-form");
const formStatus = document.querySelector("#form-status");
const recordsBody = document.querySelector("#records-body");
const searchInput = document.querySelector("#search-pattern");
const searchError = document.querySelector("#search-error");
const caseToggle = document.querySelector("#case-insensitive");
const sortSelect = document.querySelector("#sort-records");
const submitButton = form.querySelector("button[type='submit']");
const usdRateInput = document.querySelector("#usd-rate");
const eurRateInput = document.querySelector("#eur-rate");
const capInput = document.querySelector("#spending-cap");
const totalRecords = document.querySelector("#total-records");
const totalSpent = document.querySelector("#total-spent");
const topCategory = document.querySelector("#top-category");
const capStatus = document.querySelector("#cap-status");
const budgetLive = document.querySelector("#budget-live");
const miniChart = document.querySelector("#last-seven-chart");
const chartSummary = document.querySelector("#trend-summary");
const settingsStatus = document.querySelector("#settings-status");
const exportButton = document.querySelector("#export-json");
const importInput = document.querySelector("#import-json");
const importButton = document.querySelector("#import-json-button");

const errorTargets = {
  description: document.querySelector("#description-error"),
  amount: document.querySelector("#amount-error"),
  category: document.querySelector("#category-error"),
  date: document.querySelector("#date-error")
};

const settingErrorTargets = {
  usdRate: document.querySelector("#usd-rate-error"),
  eurRate: document.querySelector("#eur-rate-error"),
  cap: document.querySelector("#spending-cap-error")
};

const settingInputs = {
  usdRate: usdRateInput,
  eurRate: eurRateInput,
  cap: capInput
};

// Field-level errors are written next to the input and reflected with aria-invalid.
// This gives visual users and assistive technology users the same validation state.
function setFieldError(name, message) {
  const target = errorTargets[name];
  const input = form.elements[name];

  if (target) {
    target.textContent = message;
  }

  if (input) {
    input.setAttribute("aria-invalid", message ? "true" : "false");
  }
}

function clearErrors() {
  Object.keys(errorTargets).forEach((name) => setFieldError(name, ""));
}

function setSettingError(name, message) {
  const target = settingErrorTargets[name];
  const input = settingInputs[name];

  if (target) {
    target.textContent = message;
  }

  if (input) {
    input.setAttribute("aria-invalid", message ? "true" : "false");
  }
}

function clearSettingErrors() {
  Object.keys(settingErrorTargets).forEach((name) => setSettingError(name, ""));
}

// Persistence is centralized so add, edit, delete, settings, and import all save the same export shape.
function persist() {
  saveData(buildExportData(state.records, state.settings));
}

// Browser storage may contain old or hand-edited data, so it is validated before it replaces sample records.
function loadInitialData() {
  const saved = loadSavedData();

  if (!saved) {
    return;
  }

  const result = validateImportData(saved);

  if (!result.valid) {
    settingsStatus.textContent = "Saved browser data could not be loaded, so sample data is being used.";
    return;
  }

  replaceRecords(result.data.records);
  updateSettings(result.data.settings);
  usdRateInput.value = String(state.settings.usdRate);
  eurRateInput.value = String(state.settings.eurRate);
  capInput.value = state.settings.cap ? String(state.settings.cap) : "";
  settingsStatus.textContent = "Saved browser data loaded.";
}

// Reading through form.elements keeps the DOM access tied to control names rather than layout.
function readFormData() {
  return {
    description: form.elements.description.value,
    amount: form.elements.amount.value,
    category: form.elements.category.value,
    date: form.elements.date.value,
    currency: form.elements.currency.value
  };
}

// Edit mode reuses the add form so the project remains small and understandable for a student build.
function fillForm(record) {
  form.elements.description.value = record.description;
  form.elements.amount.value = record.amount;
  form.elements.category.value = record.category;
  form.elements.date.value = record.date;
  form.elements.currency.value = record.currency;
  state.editingId = record.id;
  submitButton.textContent = "Update transaction";
  formStatus.textContent = `Editing ${record.description}.`;
  form.scrollIntoView({ behavior: "smooth", block: "start" });
  form.elements.description.focus();
}

function resetFormMode(message = "Form cleared.") {
  state.editingId = null;
  submitButton.textContent = "Save transaction";
  clearErrors();
  formStatus.textContent = message;
}

// Sorting returns a copy so filtering and sorting never mutate the stored record order unexpectedly.
function sortRecords(records, sortValue) {
  const sorted = [...records];

  return sorted.sort((a, b) => {
    if (sortValue === "date-asc") {
      return a.date.localeCompare(b.date);
    }

    if (sortValue === "date-desc") {
      return b.date.localeCompare(a.date);
    }

    if (sortValue === "description-asc") {
      return a.description.localeCompare(b.description);
    }

    if (sortValue === "description-desc") {
      return b.description.localeCompare(a.description);
    }

    if (sortValue === "amount-asc") {
      return a.amount - b.amount;
    }

    if (sortValue === "amount-desc") {
      return b.amount - a.amount;
    }

    return 0;
  });
}

// Record amounts keep their original currency in the table; dashboard totals convert to RWF.
function formatAmount(record) {
  return `${record.currency} ${record.amount.toLocaleString(undefined, {
    minimumFractionDigits: record.amount % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2
  })}`;
}

function parsePositiveNumber(value) {
  const trimmed = value.trim();
  const number = Number(trimmed);

  return {
    empty: trimmed === "",
    valid: trimmed !== "" && Number.isFinite(number) && number > 0,
    value: number
  };
}

function parseCap(value) {
  const trimmed = value.trim();
  const number = Number(trimmed);

  return {
    empty: trimmed === "",
    valid: trimmed === "" || (Number.isFinite(number) && number >= 0),
    value: trimmed === "" ? 0 : number
  };
}

// Settings validation is explicit because silent exchange-rate fallbacks can mislead finance users.
function readSettings() {
  const usdRate = parsePositiveNumber(usdRateInput.value);
  const eurRate = parsePositiveNumber(eurRateInput.value);
  const cap = parseCap(capInput.value);

  clearSettingErrors();

  if (!usdRate.valid) {
    setSettingError("usdRate", "Enter a USD rate greater than 0.");
  }

  if (!eurRate.valid) {
    setSettingError("eurRate", "Enter a EUR rate greater than 0.");
  }

  if (!cap.valid) {
    setSettingError("cap", "Enter 0, a positive cap, or leave the field empty.");
  }

  if (!usdRate.valid || !eurRate.valid || !cap.valid) {
    return false;
  }

  updateSettings({
    usdRate: usdRate.value,
    eurRate: eurRate.value,
    cap: cap.value
  });

  return true;
}

// The chart is intentionally simple CSS bars; the accessible text summary carries the same information.
function renderChart() {
  const days = getLastSevenDays(state.records, state.settings);
  miniChart.innerHTML = "";

  days.forEach((day) => {
    const bar = document.createElement("span");
    bar.style.setProperty("--bar-height", `${day.percent}%`);
    bar.title = `${day.date}: ${formatRwf(day.total)}`;
    miniChart.append(bar);
  });

  chartSummary.textContent = days
    .map((day) => `${day.label}: ${formatRwf(day.total)}`)
    .join(", ");
}

function renderDashboard() {
  if (!readSettings()) {
    budgetLive.textContent = "Fix the settings fields before dashboard totals are recalculated.";
    budgetLive.setAttribute("aria-live", "assertive");
    return;
  }

  const stats = calculateStats(state.records, state.settings);
  totalRecords.textContent = String(stats.totalRecords);
  totalSpent.textContent = formatRwf(stats.totalRwf);
  topCategory.textContent = stats.topCategory;
  capStatus.textContent = stats.capStatus.label;
  budgetLive.textContent = stats.capStatus.message;
  budgetLive.setAttribute("aria-live", stats.capStatus.exceeded ? "assertive" : "polite");
  budgetLive.classList.toggle("danger", stats.capStatus.exceeded);

  renderChart();
}

// Search highlighting uses DOM text nodes rather than innerHTML to avoid injecting user-entered regex text.
function appendHighlightedCell(row, value, regex) {
  const cell = document.createElement("td");
  cell.append(highlightedFragment(String(value), regex));
  row.append(cell);
}

// Action buttons are created with native button elements for keyboard and screen-reader support.
function createActionButton(label, className, onClick) {
  const button = document.createElement("button");
  button.className = `table-action ${className}`;
  button.type = "button";
  button.textContent = label;
  button.addEventListener("click", onClick);
  return button;
}

function renderRecords() {
  const compiled = compileRegex(searchInput.value.trim(), caseToggle.checked);
  const regex = compiled.regex;
  const filtered = sortRecords(
    state.records.filter((record) => recordMatches(record, regex)),
    sortSelect.value
  );

  searchError.textContent = compiled.error;
  recordsBody.innerHTML = "";

  if (compiled.error) {
    const row = document.createElement("tr");
    const cell = document.createElement("td");
    cell.colSpan = 5;
    cell.textContent = compiled.error;
    row.append(cell);
    recordsBody.append(row);
    return;
  }

  if (filtered.length === 0) {
    const row = document.createElement("tr");
    const cell = document.createElement("td");
    cell.colSpan = 5;
    cell.textContent = state.records.length === 0 ? "No transactions yet." : "No matching transactions.";
    row.append(cell);
    recordsBody.append(row);
    return;
  }

  filtered.forEach((record) => {
    const row = document.createElement("tr");
    appendHighlightedCell(row, record.date, regex);
    appendHighlightedCell(row, record.description, regex);
    appendHighlightedCell(row, record.category, regex);
    appendHighlightedCell(row, formatAmount(record), regex);

    const actionsCell = document.createElement("td");
    const actionGroup = document.createElement("div");
    actionGroup.className = "table-actions";
    actionGroup.append(
      createActionButton("Edit", "edit", () => fillForm(record)),
      createActionButton("Delete", "delete", () => {
        if (confirm(`Delete "${record.description}"?`)) {
          deleteRecord(record.id);
          renderRecords();
          renderDashboard();
          persist();
          formStatus.textContent = "Transaction deleted.";
        }
      })
    );
    actionsCell.append(actionGroup);
    row.append(actionsCell);
    recordsBody.append(row);
  });
}

function handleSubmit(event) {
  event.preventDefault();
  clearErrors();

  const result = validateTransaction(readFormData());

  if (!result.valid) {
    Object.entries(result.fields).forEach(([name, field]) => {
      setFieldError(name, field.message);
    });

    formStatus.textContent = "Please fix the highlighted fields before saving.";
    form.querySelector("[aria-invalid='true']")?.focus();
    return;
  }

  if (state.editingId) {
    updateRecord(state.editingId, result.data);
    resetFormMode("Transaction updated.");
  } else {
    addRecord(createRecord(result.data));
    formStatus.textContent = "Transaction added.";
  }

  form.reset();
  renderRecords();
  renderDashboard();
  persist();
}

function handleSettingsInput() {
  const settingsAreValid = readSettings();

  if (!settingsAreValid) {
    settingsStatus.textContent = "Settings were not saved because one or more values are invalid.";
    return;
  }

  renderDashboard();
  persist();
  settingsStatus.textContent = "Settings saved in this browser.";
}

function exportJson() {
  if (!readSettings()) {
    settingsStatus.textContent = "Fix settings errors before exporting a backup.";
    return;
  }

  const data = buildExportData(state.records, state.settings);
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = "student-finance-tracker-backup.json";
  link.click();
  URL.revokeObjectURL(url);

  settingsStatus.textContent = "JSON export created.";
}

function importJson() {
  const file = importInput.files[0];

  if (!file) {
    settingsStatus.textContent = "Choose a JSON file before importing.";
    return;
  }

  const reader = new FileReader();
  settingsStatus.textContent = "Reading selected JSON file...";

  reader.addEventListener("load", () => {
    try {
      const parsed = JSON.parse(reader.result);
      const result = validateImportData(parsed);

      if (!result.valid) {
        settingsStatus.textContent = result.message;
        return;
      }

      replaceRecords(result.data.records);
      updateSettings(result.data.settings);
      clearSettingErrors();
      usdRateInput.value = String(state.settings.usdRate);
      eurRateInput.value = String(state.settings.eurRate);
      capInput.value = state.settings.cap ? String(state.settings.cap) : "";
      renderRecords();
      renderDashboard();
      persist();
      settingsStatus.textContent = `Imported ${state.records.length} records successfully.`;
    } catch {
      settingsStatus.textContent = "Import failed because the file is not valid JSON.";
    }
  });

  reader.readAsText(file);
}

if (form) {
  loadInitialData();
  form.addEventListener("submit", handleSubmit);
  form.addEventListener("reset", () => resetFormMode());
  searchInput.addEventListener("input", renderRecords);
  caseToggle.addEventListener("change", renderRecords);
  sortSelect.addEventListener("change", renderRecords);
  usdRateInput.addEventListener("input", handleSettingsInput);
  eurRateInput.addEventListener("input", handleSettingsInput);
  capInput.addEventListener("input", handleSettingsInput);
  exportButton.addEventListener("click", exportJson);
  importButton.addEventListener("click", importJson);
  renderRecords();
  renderDashboard();
  persist();
}
