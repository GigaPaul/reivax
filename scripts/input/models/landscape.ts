import Globals from "../globals";
import Fetchable from "./fetchable";

// Image or video being displayed on the display page
export default class Landscape extends Fetchable {
    //#region Fields
    Element: HTMLDivElement | null = null;
    Name: string;
    Url: string;

    TableLabel: string = Globals.LandscapeTableLabel;
    //#endregion

    
    
    //#region Constructors
    constructor(name: string, url: string) {
        super();

        this.Name = name;
        this.Url = url;
    }
    //#endregion
}