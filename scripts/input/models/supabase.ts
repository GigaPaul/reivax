import { createClient, SupabaseClient } from 'https://esm.sh/@supabase/supabase-js';
import Globals from './../globals.js';

export default class Supabase {
    static #client: SupabaseClient | null = null;    


    
    static async GetClient(): Promise<SupabaseClient> {
        if(!Supabase.#client) {
            const data = await $.getJSON(Globals.ConfigPath);
            Supabase.#client = createClient(`https://${data.supabaseProjectId}.supabase.co`, data.supabasePublicAnonKey);
        }

        return Supabase.#client;
    }
}