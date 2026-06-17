export function toRwf(record, usdRate, eurRate = 1450) {
  // Dashboard totals use RWF as the common base so mixed-currency records remain comparable.
  if (record.currency === "USD") {
    return record.amount * usdRate;
  }

  if (record.currency === "EUR") {
    return record.amount * eurRate;
  }

  return record.amount;
}

export function formatRwf(amount) {
  // Rounding avoids false precision because exchange rates are entered manually.
  return `RWF ${Math.round(amount).toLocaleString()}`;
}

export function calculateStats(records, settings) {
  // Stats are derived from state on each render instead of being stored separately and risking drift.
  const totalRwf = records.reduce(
    (sum, record) => sum + toRwf(record, settings.usdRate, settings.eurRate),
    0
  );
  const categoryTotals = records.reduce((totals, record) => {
    totals[record.category] =
      (totals[record.category] || 0) + toRwf(record, settings.usdRate, settings.eurRate);
    return totals;
  }, {});
  const topCategory = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1])[0]?.[0] || "None";

  return {
    totalRecords: records.length,
    totalRwf,
    topCategory,
    capStatus: getCapStatus(totalRwf, settings.cap)
  };
}

export function getCapStatus(totalRwf, cap) {
  // The cap message feeds an ARIA live region, so it is written as a complete sentence.
  if (!cap) {
    return {
      exceeded: false,
      label: "Set a cap",
      message: "Set a spending cap to see remaining budget."
    };
  }

  const difference = cap - totalRwf;

  if (difference >= 0) {
    return {
      exceeded: false,
      label: `${formatRwf(difference)} left`,
      message: `You are under your spending cap by ${formatRwf(difference)}.`
    };
  }

  return {
    exceeded: true,
    label: `${formatRwf(Math.abs(difference))} over`,
    message: `You have exceeded your spending cap by ${formatRwf(Math.abs(difference))}.`
  };
}

export function getLastSevenDays(records, settings, today = new Date()) {
  // The chart intentionally uses the last seven calendar days, not the last seven transaction dates.
  const days = [];
  const start = new Date(today);
  start.setHours(0, 0, 0, 0);

  for (let offset = 6; offset >= 0; offset -= 1) {
    const date = new Date(start);
    date.setDate(start.getDate() - offset);
    const key = date.toISOString().slice(0, 10);
    const total = records
      .filter((record) => record.date === key)
      .reduce((sum, record) => sum + toRwf(record, settings.usdRate, settings.eurRate), 0);

    days.push({
      date: key,
      label: date.toLocaleDateString(undefined, { weekday: "short" }),
      total
    });
  }

  const max = Math.max(...days.map((day) => day.total), 1);

  return days.map((day) => ({
    ...day,
    percent: Math.max(8, Math.round((day.total / max) * 100))
  }));
}
