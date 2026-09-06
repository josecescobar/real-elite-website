import { env } from '@/lib/env';
import { createMemoryStore } from './memory';
import { createSupabaseStore } from './supabase';
import type { SalesStore } from './types';

type GlobalSales = typeof globalThis & { __realEliteSalesStore?: SalesStore };

const g = globalThis as GlobalSales;

function persistPath(): string | null {
  if (process.env.VITEST) return null;
  return process.env.SALES_MEMORY_FILE || '/tmp/grokbot-sales.json';
}

export function salesStoreKind(): 'memory' | 'supabase' {
  return env.supabaseUrl() && env.supabaseServiceRoleKey() ? 'supabase' : 'memory';
}

export function getSalesStore(): SalesStore {
  if (g.__realEliteSalesStore) return g.__realEliteSalesStore;
  g.__realEliteSalesStore =
    salesStoreKind() === 'supabase'
      ? createSupabaseStore()
      : createMemoryStore({ persistPath: persistPath() });
  return g.__realEliteSalesStore;
}

/** Test helper — wipe the process-local singleton. */
export function resetSalesStore(store?: SalesStore): SalesStore {
  g.__realEliteSalesStore = store ?? createMemoryStore({ persistPath: null });
  return g.__realEliteSalesStore;
}

export type { SalesStore, LeadFilters } from './types';
