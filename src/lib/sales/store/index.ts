import { env } from '@/lib/env';
import { createMemoryStore } from './memory';
import { createSupabaseStore } from './supabase';
import type { SalesStore } from './types';

let singleton: SalesStore | null = null;

export function salesStoreKind(): 'memory' | 'supabase' {
  return env.supabaseUrl() && env.supabaseServiceRoleKey() ? 'supabase' : 'memory';
}

export function getSalesStore(): SalesStore {
  if (singleton) return singleton;
  singleton = salesStoreKind() === 'supabase' ? createSupabaseStore() : createMemoryStore();
  return singleton;
}

/** Test helper — wipe the process-local singleton. */
export function resetSalesStore(store?: SalesStore): SalesStore {
  singleton = store ?? createMemoryStore();
  return singleton;
}

export type { SalesStore, LeadFilters } from './types';
