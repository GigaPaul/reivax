import Supabase from './supabase.js';
import Globals from './../globals.js';
import Adventure from './adventure.js';

export default abstract class Fetchable {
    abstract TableLabel: string;
    Id: number | null = null;



    constructor(id: number | null = null) {
        this.Id = id;
    }
    
    
    
    async Push(): Promise<void> {
        if(!this.Id) {
            // Insert
        }
        else {
            // Update
        }
    }



    async Fetch(supabase: Supabase, id:number | null = null): Promise<void> {
        if(id) {
            this.Id = id;
        }

        if(!this.Id) {
            return;
        }

        const { data } = await supabase.Client
            .from(this.TableLabel)
            .select("*, Landscapes(*)")
            .eq("id", this.Id)
            .maybeSingle();

        console.log(data);
        if(!data){
            return;
        }

        this.Load(data);
    }



    Load(object: any): void {
        Object.keys(this).forEach(classKey => {
            const matchingKey: string | undefined = Object.keys(object).find((objectKey) => objectKey.toLowerCase() === classKey.toLowerCase());

            if(matchingKey) {
                (this as any)[classKey] = object[matchingKey];
            }
        });
    };
}