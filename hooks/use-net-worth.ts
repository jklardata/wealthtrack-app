'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { useUser } from '@clerk/nextjs';
import type { NetWorthEntry, NetWorthFormData } from '@/lib/types';
import {
  localGetEntries,
  localAddEntry,
  localUpdateEntry,
  localDeleteEntry,
  localDeleteEntries,
  localClearEntries,
} from '@/lib/net-worth-storage';

function entryToFormData(entry: NetWorthEntry): NetWorthFormData {
  return {
    date: entry.date,
    stocks: entry.stocks,
    bonds: entry.bonds,
    cash: entry.cash,
    real_estate: entry.real_estate,
    points_value: entry.points_value,
    commodities: entry.commodities,
    other_assets: entry.other_assets,
    total_debts: entry.total_debts,
    pre_tax_income: entry.pre_tax_income,
    monthly_expenses: entry.monthly_expenses,
    notes: entry.notes || undefined,
  };
}

export function useNetWorth() {
  const { isSignedIn, isLoaded } = useUser();
  const [entries, setEntries] = useState<NetWorthEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pendingMigration, setPendingMigration] = useState(false);
  const [localEntryCount, setLocalEntryCount] = useState(0);
  const [migrating, setMigrating] = useState(false);
  const migrationChecked = useRef(false);

  const fetchEntries = useCallback(async () => {
    if (!isLoaded) return;
    setLoading(true);
    setError(null);
    try {
      if (isSignedIn) {
        const response = await fetch('/api/net-worth');
        if (!response.ok) throw new Error('Failed to fetch entries');
        const result = await response.json();
        setEntries(result.data || []);
      } else {
        setEntries(localGetEntries());
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load data');
    } finally {
      setLoading(false);
    }
  }, [isSignedIn, isLoaded]);

  // Detect local data when user signs in
  useEffect(() => {
    if (!isLoaded || !isSignedIn || migrationChecked.current) return;
    migrationChecked.current = true;
    const local = localGetEntries();
    if (local.length > 0) {
      setLocalEntryCount(local.length);
      setPendingMigration(true);
    }
  }, [isLoaded, isSignedIn]);

  useEffect(() => {
    fetchEntries();
  }, [fetchEntries]);

  const migrateLocalEntries = useCallback(async () => {
    setMigrating(true);
    try {
      const local = localGetEntries();
      for (const entry of local) {
        const response = await fetch('/api/net-worth', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(entryToFormData(entry)),
        });
        // 409 = duplicate date — skip it, don't throw
        if (!response.ok && response.status !== 409) {
          const err = await response.json();
          throw new Error(err.error || 'Failed to migrate entries');
        }
      }
      localClearEntries();
      setPendingMigration(false);
      await fetchEntries();
    } finally {
      setMigrating(false);
    }
  }, [fetchEntries]);

  const discardLocalEntries = useCallback(async () => {
    localClearEntries();
    setPendingMigration(false);
    await fetchEntries();
  }, [fetchEntries]);

  const saveEntry = useCallback(
    async (data: NetWorthFormData, editingId?: string) => {
      if (isSignedIn) {
        const url = editingId ? `/api/net-worth/${editingId}` : '/api/net-worth';
        const method = editingId ? 'PUT' : 'POST';
        const response = await fetch(url, {
          method,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to save entry');
        }
      } else {
        if (editingId) {
          localUpdateEntry(editingId, data);
        } else {
          localAddEntry(data);
        }
      }
      await fetchEntries();
    },
    [isSignedIn, fetchEntries]
  );

  const deleteEntry = useCallback(
    async (id: string) => {
      if (isSignedIn) {
        const response = await fetch(`/api/net-worth/${id}`, { method: 'DELETE' });
        if (!response.ok) throw new Error('Failed to delete entry');
      } else {
        localDeleteEntry(id);
      }
      await fetchEntries();
    },
    [isSignedIn, fetchEntries]
  );

  const deleteEntries = useCallback(
    async (ids: string[]): Promise<number> => {
      if (isSignedIn) {
        const response = await fetch('/api/net-worth', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ids }),
        });
        if (!response.ok) throw new Error('Failed to delete entries');
        const result = await response.json();
        await fetchEntries();
        return result.deleted as number;
      } else {
        const count = localDeleteEntries(ids);
        await fetchEntries();
        return count;
      }
    },
    [isSignedIn, fetchEntries]
  );

  return {
    entries,
    loading,
    error,
    isGuest: isLoaded && !isSignedIn,
    pendingMigration,
    localEntryCount,
    migrating,
    fetchEntries,
    saveEntry,
    deleteEntry,
    deleteEntries,
    migrateLocalEntries,
    discardLocalEntries,
  };
}
