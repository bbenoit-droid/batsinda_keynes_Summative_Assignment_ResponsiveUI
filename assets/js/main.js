import { validateTransaction } from "./formChecks.js";
import {
  addRecord,
  createRecord,
  deleteRecord,
  defaultSettings,
  replaceRecords,
  state,
  updateRecord,
  updateSettings as saveBudgetSettings
} from "./expenses.js";
import { compileRegex, highlightedFragment, recordMatches } from "./searchTools.js";
import { calculateStats, formatRwf, getLastSevenDays } from "./budget.js";
import { buildExportData, loadSavedData, saveData, validateImportData } from "./savedData.js";

const expenseForm = document.querySelector(".expenseForm");
const formMessage = document.querySelector("#formMessage");
const expenseTableBody = document.querySelector("#expenseTableBody");
const expenseSearch = document.querySelector("#expenseSearch");
const searchError = document.querySelector("#searchError");
const ignoreCaseCheck = document.querySelector("#ignoreCase");
const sortExpenses = document.querySelector("#sortExpenses");
const addExpenseButton = expenseForm.querySelector("#addExpenseButton");
const expenseCurrencySelect = document.querySelector("#expenseCurrency");
const usdRateInput = document.querySelector("#usdRate");
const eurRateInput = document.querySelector("#eurRate");
const monthlyBudgetInput = document.querySelector("#monthlyBudget");
const defaultCurrencySelect = document.querySelector("#defaultCurrency");
const displayCurrencySelect = document.querySelector("#displayCurrency");
const themeToggle = document.querySelector("#themeToggle");
const showWeeklyChartCheck = document.querySelector("#showWeeklyChart");
const compactTableCheck = document.querySelector("#compactTable");
const confirmBeforeDeleteCheck = document.querySelector("#confirmBeforeDelete");
const totalTransactions = document.querySelector("#totalTransactions");
const totalExpenses = document.querySelector("#totalExpenses");
const mainCategory = document.querySelector("#mainCategory");
const remainingBalance = document.querySelector("#remainingBalance");
const budgetMessage = document.querySelector("#budgetMessage");
const chartBox = document.querySelector(".chartBox");
const weeklyChart = document.querySelector("#weeklyChart");
const weeklySummary = document.querySelector("#weeklySummary");
const settingsMessage = document.querySelector("#settingsMessage");
const downloadJsonButton = document.querySelector("#downloadJsonButton");
const jsonFile = document.querySelector("#jsonFile");
const uploadJsonButton = document.querySelector("#uploadJsonButton");
const downloadCsvButton = document.querySelector("#downloadCsvButton");
const clearDataButton = document.querySelector("#clearDataButton");

const errorTargets = {
  description: document.querySelector("#descriptionError"),
  amount: document.querySelector("#amountError"),
  category: document.querySelector("#categoryError"),
  date: document.querySelector("#dateError")
};

const budgetErrorTargets = {
  usdRate: document.querySelector("#usdRateError"),
  eurRate: document.querySelector("#eurRateError"),
  cap: document.querySelector("#monthlyBudgetError")
};

const budgetInputs = {
  usdRate: usdRateInput,
  eurRate: eurRateInput,
  cap: monthlyBudgetInput
};
function setFieldError(name, message) {
  const target = errorTargets[name];
  const input = expenseForm.elements[name];

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

function setBudgetError(name, message) {
  const target = budgetErrorTargets[name];
  const input = budgetInputs[name];

  if (target) {
    target.textContent = message;
  }

  if (input) {
    input.setAttribute("aria-invalid", message ? "true" : "false");
  }
}

function clearBudgetErrors() {
  Object.keys(budgetErrorTargets).forEach((name) => setBudgetError(name, ""));
}
function persist() {
  saveData(buildExportData(state.records, state.settings));
}

function applySavedSettingsToForm() {
  usdRateInput.value = String(state.settings.usdRate);
  eurRateInput.value = String(state.settings.eurRate);
  monthlyBudgetInput.value = state.settings.cap ? String(state.settings.cap) : "";
  defaultCurrencySelect.value = state.settings.defaultCurrency;
  displayCurrencySelect.value = state.settings.displayCurrency;
  themeToggle.checked = state.settings.theme === "dark";
  showWeeklyChartCheck.checked = state.settings.showWeeklyChart;
  compactTableCheck.checked = state.settings.compactTable;
  confirmBeforeDeleteCheck.checked = state.settings.confirmBeforeDelete;
  expenseCurrencySelect.value = state.settings.defaultCurrency;
}

function applyDisplaySettings() {
  document.documentElement.dataset.theme = state.settings.theme;
  document.body.classList.toggle("compactTable", state.settings.compactTable);
  chartBox.hidden = !state.settings.showWeeklyChart;
}
function loadInitialData() {
  const saved = loadSavedData();

  if (!saved) {
    applySavedSettingsToForm();
    applyDisplaySettings();
    return;
  }

  const result = validateImportData(saved);

  if (!result.valid) {
    settingsMessage.textContent = "Saved browser data could not be loaded, so sample data is being used.";
    return;
  }

  replaceRecords(result.data.records);
  saveBudgetSettings(result.data.settings);
  applySavedSettingsToForm();
  applyDisplaySettings();
  settingsMessage.textContent = "Saved browser data loaded.";
}
function readExpenseForm() {
  return {
    description: expenseForm.elements.description.value,
    amount: expenseForm.elements.amount.value,
    category: expenseForm.elements.category.value,
    date: expenseForm.elements.date.value,
    currency: expenseForm.elements.currency.value
  };
}
function fillExpenseForm(record) {
  expenseForm.elements.description.value = record.description;
  expenseForm.elements.amount.value = record.amount;
  expenseForm.elements.category.value = record.category;
  expenseForm.elements.date.value = record.date;
  expenseForm.elements.currency.value = record.currency;
  state.editingId = record.id;
  addExpenseButton.textContent = "Update Expense";
  formMessage.textContent = `Editing ${record.description}.`;
  expenseForm.scrollIntoView({ behavior: "smooth", block: "start" });
  expenseForm.elements.description.focus();
}

function resetExpenseForm(message = "Form cleared.") {
  state.editingId = null;
  addExpenseButton.textContent = "Add Expense";
  clearErrors();
  expenseCurrencySelect.value = state.settings.defaultCurrency;
  formMessage.textContent = message;
}
function sortExpenseList(expenses, sortValue) {
  const sorted = [...expenses];

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
function formatExpenseAmount(record) {
  return `${record.currency} ${record.amount.toLocaleString(undefined, {
    minimumFractionDigits: record.amount % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2
  })}`;
}

function formatDisplayMoney(amountRwf) {
  const currency = state.settings.displayCurrency;

  if (currency === "USD") {
    return `USD ${(amountRwf / state.settings.usdRate).toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })}`;
  }

  if (currency === "EUR") {
    return `EUR ${(amountRwf / state.settings.eurRate).toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })}`;
  }

  return formatRwf(amountRwf);
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
function readBudgetSettings() {
  const usdRate = parsePositiveNumber(usdRateInput.value);
  const eurRate = parsePositiveNumber(eurRateInput.value);
  const cap = parseCap(monthlyBudgetInput.value);

  clearBudgetErrors();

  if (!usdRate.valid) {
    setBudgetError("usdRate", "Enter a USD rate greater than 0.");
  }

  if (!eurRate.valid) {
    setBudgetError("eurRate", "Enter a EUR rate greater than 0.");
  }

  if (!cap.valid) {
    setBudgetError("cap", "Enter 0, a positive budget, or leave the field empty.");
  }

  if (!usdRate.valid || !eurRate.valid || !cap.valid) {
    return false;
  }

  saveBudgetSettings({
    usdRate: usdRate.value,
    eurRate: eurRate.value,
    cap: cap.value,
    defaultCurrency: defaultCurrencySelect.value,
    displayCurrency: displayCurrencySelect.value,
    theme: themeToggle.checked ? "dark" : "light",
    showWeeklyChart: showWeeklyChartCheck.checked,
    compactTable: compactTableCheck.checked,
    confirmBeforeDelete: confirmBeforeDeleteCheck.checked
  });

  return true;
}
function showWeeklyChart() {
  const days = getLastSevenDays(state.records, state.settings);
  weeklyChart.innerHTML = "";

  days.forEach((day) => {
    const bar = document.createElement("span");
    bar.style.setProperty("--bar-height", `${day.percent}%`);
    bar.title = `${day.date}: ${formatRwf(day.total)}`;
    weeklyChart.append(bar);
  });

  weeklySummary.textContent = days
    .map((day) => `${day.label}: ${formatRwf(day.total)}`)
    .join(", ");
}

function showFinancialSummary() {
  if (!readBudgetSettings()) {
    budgetMessage.textContent = "Fix the budget fields before the summary is updated.";
    budgetMessage.setAttribute("aria-live", "assertive");
    return;
  }

  const stats = calculateStats(state.records, state.settings);
  totalTransactions.textContent = String(stats.totalTransactions);
  totalExpenses.textContent = formatDisplayMoney(stats.totalExpenses);
  mainCategory.textContent = stats.mainCategory;

  if (!state.settings.cap) {
    remainingBalance.textContent = "Set budget";
    budgetMessage.textContent = "Enter a monthly budget to see the remaining balance.";
    budgetMessage.setAttribute("aria-live", "polite");
    budgetMessage.classList.remove("danger");
  } else {
    const balance = state.settings.cap - stats.totalExpenses;
    const isOverBudget = balance < 0;
    remainingBalance.textContent = `${formatDisplayMoney(Math.abs(balance))} ${
      isOverBudget ? "over" : "left"
    }`;
    budgetMessage.textContent = isOverBudget
      ? `Your expenses are over the monthly budget by ${formatDisplayMoney(Math.abs(balance))}.`
      : `Your remaining balance is ${formatDisplayMoney(balance)}.`;
    budgetMessage.setAttribute("aria-live", isOverBudget ? "assertive" : "polite");
    budgetMessage.classList.toggle("danger", isOverBudget);
  }

  showWeeklyChart();
}
function appendHighlightedCell(row, value, regex) {
  const cell = document.createElement("td");
  cell.append(highlightedFragment(String(value), regex));
  row.append(cell);
}
function createActionButton(label, className, onClick) {
  const button = document.createElement("button");
  button.className = `smallTableButton ${className}`;
  button.type = "button";
  button.textContent = label;
  button.addEventListener("click", onClick);
  return button;
}

function showExpenseTable() {
  const compiled = compileRegex(expenseSearch.value.trim(), ignoreCaseCheck.checked);
  const regex = compiled.regex;
  const filtered = sortExpenseList(
    state.records.filter((record) => recordMatches(record, regex)),
    sortExpenses.value
  );

  searchError.textContent = compiled.error;
  expenseTableBody.innerHTML = "";

  if (compiled.error) {
    const row = document.createElement("tr");
    const cell = document.createElement("td");
    cell.colSpan = 5;
    cell.textContent = compiled.error;
    row.append(cell);
    expenseTableBody.append(row);
    return;
  }

  if (filtered.length === 0) {
    const row = document.createElement("tr");
    const cell = document.createElement("td");
    cell.colSpan = 5;
    cell.textContent = state.records.length === 0 ? "No expenses added yet." : "No matching expenses.";
    row.append(cell);
    expenseTableBody.append(row);
    return;
  }

  filtered.forEach((record) => {
    const row = document.createElement("tr");
    appendHighlightedCell(row, record.date, regex);
    appendHighlightedCell(row, record.description, regex);
    appendHighlightedCell(row, record.category, regex);
    appendHighlightedCell(row, formatExpenseAmount(record), regex);

    const actionsCell = document.createElement("td");
    const actionGroup = document.createElement("div");
    actionGroup.className = "tableButtons";
    actionGroup.append(
      createActionButton("Edit", "edit", () => fillExpenseForm(record)),
      createActionButton("Delete", "delete", () => {
        const canDelete =
          !state.settings.confirmBeforeDelete || confirm(`Delete "${record.description}"?`);

        if (canDelete) {
          deleteRecord(record.id);
          showExpenseTable();
          showFinancialSummary();
          persist();
          formMessage.textContent = "Expense deleted.";
        }
      })
    );
    actionsCell.append(actionGroup);
    row.append(actionsCell);
    expenseTableBody.append(row);
  });
}

function handleExpenseSubmit(event) {
  event.preventDefault();
  clearErrors();

  const result = validateTransaction(readExpenseForm());

  if (!result.valid) {
    Object.entries(result.fields).forEach(([name, field]) => {
      setFieldError(name, field.message);
    });

    formMessage.textContent = "Please fix the highlighted fields before saving.";
    expenseForm.querySelector("[aria-invalid='true']")?.focus();
    return;
  }

  if (state.editingId) {
    updateRecord(state.editingId, result.data);
    resetExpenseForm("Expense updated.");
  } else {
    addRecord(createRecord(result.data));
    formMessage.textContent = "Expense added.";
  }

  expenseForm.reset();
  showExpenseTable();
  showFinancialSummary();
  persist();
}

function handleBudgetInput() {
  const budgetIsValid = readBudgetSettings();

  if (!budgetIsValid) {
    settingsMessage.textContent = "Settings were not saved because one or more values are invalid.";
    return;
  }

  showFinancialSummary();
  applyDisplaySettings();
  persist();
  settingsMessage.textContent = "Settings saved in this browser.";
}

function exportJson() {
  if (!readBudgetSettings()) {
    settingsMessage.textContent = "Fix settings errors before exporting a backup.";
    return;
  }

  const data = buildExportData(state.records, state.settings);
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = "student-budget-tracker-backup.json";
  link.click();
  URL.revokeObjectURL(url);

  settingsMessage.textContent = "JSON export created.";
}

function exportCsv() {
  const rows = [
    ["Date", "Description", "Category", "Currency", "Amount"],
    ...state.records.map((record) => [
      record.date,
      record.description,
      record.category,
      record.currency,
      String(record.amount)
    ])
  ];
  const csv = rows
    .map((row) => row.map((value) => `"${String(value).replaceAll('"', '""')}"`).join(","))
    .join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = "student-budget-expenses.csv";
  link.click();
  URL.revokeObjectURL(url);
  settingsMessage.textContent = "CSV export created.";
}

function importJson() {
  const file = jsonFile.files[0];

  if (!file) {
    settingsMessage.textContent = "Choose a JSON file before importing.";
    return;
  }

  const reader = new FileReader();
  settingsMessage.textContent = "Reading selected JSON file...";

  reader.addEventListener("load", () => {
    try {
      const parsed = JSON.parse(reader.result);
      const result = validateImportData(parsed);

      if (!result.valid) {
        settingsMessage.textContent = result.message;
        return;
      }

      replaceRecords(result.data.records);
      saveBudgetSettings(result.data.settings);
      clearBudgetErrors();
      applySavedSettingsToForm();
      applyDisplaySettings();
      showExpenseTable();
      showFinancialSummary();
      persist();
      settingsMessage.textContent = `Imported ${state.records.length} records successfully.`;
    } catch {
      settingsMessage.textContent = "Import failed because the file is not valid JSON.";
    }
  });

  reader.readAsText(file);
}

function clearAllData() {
  if (!confirm("Clear all saved data and reset settings? This cannot be undone.")) {
    return;
  }

  replaceRecords([]);
  saveBudgetSettings(defaultSettings);
  applySavedSettingsToForm();
  applyDisplaySettings();
  showExpenseTable();
  showFinancialSummary();
  persist();
  settingsMessage.textContent = "All saved data was cleared and settings were reset.";
}

if (expenseForm) {
  loadInitialData();
  expenseForm.addEventListener("submit", handleExpenseSubmit);
  expenseForm.addEventListener("reset", () => resetExpenseForm());
  expenseSearch.addEventListener("input", showExpenseTable);
  ignoreCaseCheck.addEventListener("change", showExpenseTable);
  sortExpenses.addEventListener("change", showExpenseTable);
  usdRateInput.addEventListener("input", handleBudgetInput);
  eurRateInput.addEventListener("input", handleBudgetInput);
  monthlyBudgetInput.addEventListener("input", handleBudgetInput);
  defaultCurrencySelect.addEventListener("change", handleBudgetInput);
  displayCurrencySelect.addEventListener("change", handleBudgetInput);
  themeToggle.addEventListener("change", handleBudgetInput);
  showWeeklyChartCheck.addEventListener("change", handleBudgetInput);
  compactTableCheck.addEventListener("change", handleBudgetInput);
  confirmBeforeDeleteCheck.addEventListener("change", handleBudgetInput);
  downloadJsonButton.addEventListener("click", exportJson);
  uploadJsonButton.addEventListener("click", importJson);
  downloadCsvButton.addEventListener("click", exportCsv);
  clearDataButton.addEventListener("click", clearAllData);
  showExpenseTable();
  showFinancialSummary();
  persist();
}
