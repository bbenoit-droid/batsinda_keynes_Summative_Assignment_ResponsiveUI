const now = new Date().toISOString();

export const defaultSettings = {
  usdRate: 1300,
  eurRate: 1450,
  cap: 0,
  theme: "light",
  defaultCurrency: "RWF",
  displayCurrency: "RWF",
  showWeeklyChart: true,
  compactTable: false,
  confirmBeforeDelete: true
};
export const state = {
  records: [
    {
      id: "txn_0001",
      description: "Lunch at cafeteria",
      amount: 2500,
      category: "Food",
      date: "2025-09-29",
      currency: "RWF",
      createdAt: now,
      updatedAt: now
    },
    {
      id: "txn_0002",
      description: "Chemistry textbook",
      amount: 89.99,
      category: "Books",
      date: "2025-09-23",
      currency: "USD",
      createdAt: now,
      updatedAt: now
    },
    {
      id: "txn_0003",
      description: "Bus pass",
      amount: 4500,
      category: "Transport",
      date: "2025-09-20",
      currency: "RWF",
      createdAt: now,
      updatedAt: now
    },
    {
      id: "txn_0004",
      description: "Coffee with friends",
      amount: 8750,
      category: "Entertainment",
      date: "2025-09-28",
      currency: "RWF",
      createdAt: now,
      updatedAt: now
    }
  ],
  editingId: null,
  settings: { ...defaultSettings }
};

function nextRecordId() {
  const highestId = state.records.reduce((highest, record) => {
    const match = /^txn_(\d+)$/.exec(record.id);
    return match ? Math.max(highest, Number(match[1])) : highest;
  }, 0);

  return `txn_${String(highestId + 1).padStart(4, "0")}`;
}
export function createRecord(data) {
  const timestamp = new Date().toISOString();

  return {
    id: nextRecordId(),
    ...data,
    createdAt: timestamp,
    updatedAt: timestamp
  };
}
export function addRecord(record) {
  state.records = [record, ...state.records];
}
export function updateRecord(id, data) {
  state.records = state.records.map((record) =>
    record.id === id
      ? {
          ...record,
          ...data,
          updatedAt: new Date().toISOString()
        }
      : record
  );
}

export function deleteRecord(id) {
  state.records = state.records.filter((record) => record.id !== id);
}

export function findRecord(id) {
  return state.records.find((record) => record.id === id);
}
export function replaceRecords(records) {
  state.records = records;
  state.editingId = null;
}
export function updateSettings(settings) {
  state.settings = {
    ...state.settings,
    ...settings
  };
}
