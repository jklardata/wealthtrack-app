import type { NetWorthEntry, NetWorthFormData } from './types';

const STORAGE_KEY = 'wealthtrack_net_worth_entries';

function computeEntry(data: NetWorthFormData, existingEntry?: NetWorthEntry): NetWorthEntry {
  const total_assets =
    (data.stocks || 0) +
    (data.bonds || 0) +
    (data.cash || 0) +
    (data.real_estate || 0) +
    (data.points_value || 0) +
    (data.commodities || 0) +
    (data.other_assets || 0);
  const net_worth = total_assets - (data.total_debts || 0);
  const now = new Date().toISOString();

  return {
    id: existingEntry?.id || crypto.randomUUID(),
    user_id: 'local',
    date: data.date,
    stocks: data.stocks || 0,
    bonds: data.bonds || 0,
    cash: data.cash || 0,
    real_estate: data.real_estate || 0,
    points_value: data.points_value || 0,
    commodities: data.commodities || 0,
    other_assets: data.other_assets || 0,
    total_assets,
    total_debts: data.total_debts || 0,
    net_worth,
    pre_tax_income: data.pre_tax_income || 0,
    monthly_expenses: data.monthly_expenses || 0,
    notes: data.notes || null,
    created_at: existingEntry?.created_at || now,
    updated_at: now,
  };
}

export function localGetEntries(): NetWorthEntry[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function localSaveEntries(entries: NetWorthEntry[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}

export function localAddEntry(data: NetWorthFormData): NetWorthEntry {
  const entries = localGetEntries();
  const entry = computeEntry(data);
  entries.push(entry);
  localSaveEntries(entries);
  return entry;
}

export function localUpdateEntry(id: string, data: NetWorthFormData): NetWorthEntry {
  const entries = localGetEntries();
  const index = entries.findIndex((e) => e.id === id);
  if (index === -1) throw new Error('Entry not found');
  const updated = computeEntry(data, entries[index]);
  entries[index] = updated;
  localSaveEntries(entries);
  return updated;
}

export function localDeleteEntry(id: string): void {
  localSaveEntries(localGetEntries().filter((e) => e.id !== id));
}

export function localDeleteEntries(ids: string[]): number {
  const idSet = new Set(ids);
  const before = localGetEntries();
  const after = before.filter((e) => !idSet.has(e.id));
  localSaveEntries(after);
  return before.length - after.length;
}

export function localClearEntries(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(STORAGE_KEY);
  }
}
