import { validateCategory, validateDate, validateDescription } from "./formChecks.js";

const STORAGE_KEY = "student-budget-tracker:data";

export function loadSavedData() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : null;
  } catch {
    return null;
  }
}

export function saveData(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function buildExportData(records, settings) {
  return {
    app: "Student Budget Tracker",
    version: 1,
    exportedAt: new Date().toISOString(),
    settings,
    records
  };
}

export function validateImportData(data) {
  if (!data || typeof data !== "object" || Array.isArray(data)) {
    return { valid: false, message: "Imported JSON must be an object." };
  }

  if (!Array.isArray(data.records)) {
    return { valid: false, message: "Imported JSON must include a records array." };
  }

  const settings = validateSettings(data.settings || {});

  if (!settings.valid) {
    return settings;
  }

  const seenIds = new Set();
  const records = [];

  for (const [index, record] of data.records.entries()) {
    const result = validateImportedRecord(record, seenIds);

    if (!result.valid) {
      return { valid: false, message: `Record ${index + 1}: ${result.message}` };
    }

    records.push(result.record);
  }

  return {
    valid: true,
    data: {
      records,
      settings: settings.settings
    }
  };
}

function validateSettings(settings) {
  const usdRate = Number(settings.usdRate ?? 1300);
  const eurRate = Number(settings.eurRate ?? 1450);
  const cap = Number(settings.cap ?? 0);
  const theme = validateChoice(settings.theme, ["light", "dark"], "light");
  const defaultCurrency = validateChoice(settings.defaultCurrency, ["RWF", "USD", "EUR"], "RWF");
  const displayCurrency = validateChoice(settings.displayCurrency, ["RWF", "USD", "EUR"], "RWF");
  const showWeeklyChart =
    typeof settings.showWeeklyChart === "boolean" ? settings.showWeeklyChart : true;
  const compactTable = typeof settings.compactTable === "boolean" ? settings.compactTable : false;
  const confirmBeforeDelete =
    typeof settings.confirmBeforeDelete === "boolean" ? settings.confirmBeforeDelete : true;

  if (!Number.isFinite(usdRate) || usdRate <= 0) {
    return { valid: false, message: "Settings must include a positive USD rate." };
  }

  if (!Number.isFinite(cap) || cap < 0) {
    return { valid: false, message: "Settings cap must be zero or a positive number." };
  }

  if (!Number.isFinite(eurRate) || eurRate <= 0) {
    return { valid: false, message: "Settings must include a positive EUR rate." };
  }

  return {
    valid: true,
    settings: {
      usdRate,
      eurRate,
      cap,
      theme,
      defaultCurrency,
      displayCurrency,
      showWeeklyChart,
      compactTable,
      confirmBeforeDelete
    }
  };
}

function validateChoice(value, allowedValues, fallback) {
  return allowedValues.includes(value) ? value : fallback;
}

function validateImportedRecord(record, seenIds) {
  if (!record || typeof record !== "object" || Array.isArray(record)) {
    return { valid: false, message: "Record must be an object." };
  }

  if (typeof record.id !== "string" || !/^txn_\d+$/.test(record.id)) {
    return { valid: false, message: "Record id must look like txn_0001." };
  }

  if (seenIds.has(record.id)) {
    return { valid: false, message: "Record ids must be unique." };
  }

  seenIds.add(record.id);

  const description = validateDescription(String(record.description ?? ""));
  const amount = validateImportedAmount(record.amount);
  const category = validateCategory(String(record.category ?? ""));
  const date = validateDate(String(record.date ?? ""));
  const currency = validateCurrency(record.currency);
  const createdAt = validateTimestamp(record.createdAt, "createdAt");
  const updatedAt = validateTimestamp(record.updatedAt, "updatedAt");

  const checks = [description, amount, category, date, currency, createdAt, updatedAt];
  const failed = checks.find((check) => !check.valid);

  if (failed) {
    return { valid: false, message: failed.message };
  }

  return {
    valid: true,
    record: {
      id: record.id,
      description: description.value,
      amount: amount.value,
      category: category.value,
      date: date.value,
      currency: currency.value,
      createdAt: createdAt.value,
      updatedAt: updatedAt.value
    }
  };
}

function validateImportedAmount(value) {
  if (typeof value !== "number" || !Number.isFinite(value) || value < 0) {
    return { valid: false, message: "Amount must be a zero or positive number." };
  }

  if (!/^(0|[1-9]\d*)(\.\d{1,2})?$/.test(String(value))) {
    return { valid: false, message: "Amount must use no more than two decimal places." };
  }

  return { valid: true, value, message: "" };
}

function validateCurrency(value) {
  if (value !== "RWF" && value !== "USD" && value !== "EUR") {
    return { valid: false, message: "Currency must be RWF, USD, or EUR." };
  }

  return { valid: true, value, message: "" };
}

function validateTimestamp(value, fieldName) {
  if (typeof value !== "string" || Number.isNaN(Date.parse(value))) {
    return { valid: false, message: `${fieldName} must be a valid timestamp.` };
  }

  return { valid: true, value, message: "" };
}
