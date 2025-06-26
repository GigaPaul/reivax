import Supabase from './supabase.js';

export default abstract class Fetchable {
    abstract TableLabel: string;
    Id: number | null = null;
    Joints: string[] = [];



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



    async Fetch(id:number | null = null): Promise<void> {
        if(id) {
            this.Id = id;
        }

        if(!this.Id) {
            console.log("Aucun Id renseigné.")
            return;
        }

        let select = "*";

        this.Joints.forEach(joint => {
            select += `, ${joint}(*)`;
        });

        const client = await Supabase.GetClient();
        const { data } = await client
            .from(this.TableLabel)
            .select(select)
            .eq("id", this.Id)
            .maybeSingle();

        if(!data){
            console.log("Aucune donnée renvoyée par Supabase.")
            return;
        }

        this.Load(data);
    }



    Load(object: any): void {
        const objectKeys: string[] = Object.keys(this);
        for(let i = 0; i < objectKeys.length; i++) {
            const classKey: string = objectKeys[i];
            const matchingKey: string | undefined = Object.keys(object).find((objectKey) => objectKey.toLowerCase() === classKey.toLowerCase());

            if(!matchingKey) {
                continue;
            }

            if(Array.isArray(object[matchingKey])) {
                continue;
            }

            (this as any)[classKey] = object[matchingKey];
        }
    };
}