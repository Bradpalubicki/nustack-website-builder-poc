/**
 * Supabase Module Exports
 */

// Browser client exports
export { createClient as createBrowserClient, getSupabaseClient, type User, type Session } from './client';

// Server client exports
export { createClient as createServerClient, createAdminClient, getUser, getSession } from './server';

// Re-export middleware
export { updateSession } from './middleware';
