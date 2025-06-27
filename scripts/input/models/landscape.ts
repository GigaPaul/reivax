import Globals from "../globals.js";
import Fetchable from "./fetchable.js";
import Supabase from "./supabase.js";

// Image or video being displayed on the display page
export default class Landscape extends Fetchable {
    //#region Fields
    Element: HTMLDivElement | null = null;
    Name: string = "Unnamed Landscape";
    Url: string = "nothing.jpg";

    TableLabel: string = Globals.LandscapeTableLabel;
    //#endregion

    
    
    //#region Constructors
    constructor(id: number | null = null) {
        super(id);
    }
    //#endregion



    //#region Methods
    async Select(): Promise<void> {
        if(!this.Id) {
            return;
        }

        const client = await Supabase.GetClient();
        
        const { error } = await client
            .from("Display")
            .update({id_landscape: this.Id})
            .eq("id", 1);
    }



    static async Deselect(): Promise<void> {
        const client = await Supabase.GetClient();
        
        const { error } = await client
            .from("Display")
            .update({id_landscape: null})
            .eq("id", 1);
    }
    //#endregion
}