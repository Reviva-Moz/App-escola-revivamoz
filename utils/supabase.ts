import { createClient } from '@supabase/supabase-js';

// Environment variables are expected to be available under process.env.
// They must be configured in the execution environment.
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

// Initialize to null. It will be created only if env vars are present.
let supabaseClient = null;

if (supabaseUrl && supabaseAnonKey) {
    try {
        supabaseClient = createClient(supabaseUrl, supabaseAnonKey);
    } catch (e) {
        console.error("Error initializing Supabase client:", e);
    }
} else {
    console.warn(
        "Supabase URL and Anon Key are not defined in the environment variables. " +
        "The application will fall back to using static mock data. " +
        "Please set up your VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to connect to the database."
    );
}

export const supabase = supabaseClient;
