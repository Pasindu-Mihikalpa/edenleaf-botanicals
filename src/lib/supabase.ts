import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Product, OrderRecord } from '../types';
import { ALL_PRODUCTS } from '../data/products';

// Read credentials from Vite environment or localStorage override
const SUPABASE_URL =
  (import.meta as any).env?.VITE_SUPABASE_URL ||
  (typeof localStorage !== 'undefined' ? localStorage.getItem('edenleaf_supabase_url') : '') ||
  '';

const SUPABASE_ANON_KEY =
  (import.meta as any).env?.VITE_SUPABASE_ANON_KEY ||
  (typeof localStorage !== 'undefined' ? localStorage.getItem('edenleaf_supabase_anon_key') : '') ||
  '';

let supabaseClient: SupabaseClient | null = null;

export const isSupabaseConfigured = (): boolean => {
  return Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);
};

export const getSupabase = (): SupabaseClient | null => {
  if (!isSupabaseConfigured()) return null;
  if (!supabaseClient) {
    try {
      supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    } catch (e) {
      console.warn('[EdenLeaf] Could not initialize Supabase client:', e);
      return null;
    }
  }
  return supabaseClient;
};

/**
 * Fetch live products from Supabase cloud database.
 * Falls back to local 46 Hayleys cultivars if cloud is unconfigured or unreachable.
 */
export const fetchCloudProducts = async (): Promise<Product[]> => {
  const client = getSupabase();
  if (!client) return ALL_PRODUCTS;

  try {
    const { data, error } = await client
      .from('products')
      .select('*')
      .order('name', { ascending: true });

    if (error || !data || data.length === 0) {
      console.warn('[EdenLeaf] Supabase fetch fallback to local seed:', error?.message);
      return ALL_PRODUCTS;
    }

    return data as Product[];
  } catch (err) {
    console.warn('[EdenLeaf] Supabase network error, fallback to seed:', err);
    return ALL_PRODUCTS;
  }
};

/**
 * Record a customer order in the cloud database.
 */
export const recordCloudOrder = async (order: OrderRecord): Promise<boolean> => {
  const client = getSupabase();
  if (!client) return false;

  try {
    const { error } = await client.from('orders').insert([order]);
    if (error) {
      console.error('[EdenLeaf] Failed to record order in Supabase:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.error('[EdenLeaf] Network error recording order:', err);
    return false;
  }
};

