import { createClient, SupabaseClient } from 'https://esm.sh/@supabase/supabase-js';
import Globals from './../globals.js';

export default class Supabase {
    Client: SupabaseClient;

    constructor(projectId: string, publicAnonKey: string) {
        this.Client = createClient(projectId, publicAnonKey);
    }

    static async CreateClient(): Promise<Supabase> {
        const data = await $.getJSON(Globals.ConfigPath);
        return new Supabase(`https://${data.supabaseProjectId}.supabase.co`, data.supabasePublicAnonKey);
    }
}