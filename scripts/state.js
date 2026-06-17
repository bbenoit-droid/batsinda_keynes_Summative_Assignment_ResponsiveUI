const now = new Date().toISOString();

// State is kept in one module so rendering, storage, and validation do not each invent their own data shape.
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
  settings: {
    usdRate: 1300,
    eurRate: 1450,
    cap: 0
  }
};

function nextRecordId() {
  const highestId = state.records.reduce((highest, record) => {
    const match = /^txn_(\d+)$/.exec(record.id);
    return match ? Math.max(highest, Number(match[1])) : highest;
  }, 0);

  return `txn_${String(highestId + 1).padStart(4, "0")}`;
}

// New records receive timestamps here so the form code can focus on user input only.
export function createRecord(data) {
  const timestamp = new Date().toISOString();

  return {
    id: nextRecordId(),
    ...data,
    createdAt: timestamp,
    updatedAt: timestamp
  };
}

// Records are added to the top because recent spending is usually the first thing students review.
export function addRecord(record) {
  state.records = [record, ...state.records];
}

// Updating preserves the original createdAt value and changes only the edited fields plus updatedAt.
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

// Import replaces the current list only after storage validation has accepted every record.
export function replaceRecords(records) {
  state.records = records;
  state.editingId = null;
}

// Settings are merged so adding a new setting later does not require every caller to supply all keys.
export function updateSettings(settings) {
  state.settings = {
    ...state.settings,
    ...settings
  };
}
