import Globals from "../globals.js";
import Fetchable from "./fetchable.js";

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
}