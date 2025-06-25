export default abstract class Fetchable {
    abstract TableLabel: string;
    Id: number | null = null;
    
    
    
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
            return;
        }

        // Fetch here
    }
}