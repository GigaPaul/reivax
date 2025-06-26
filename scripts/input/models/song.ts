import Fetchable from "./fetchable.js";
import Globals from "./../globals.js";

// A named song
export default class Song extends Fetchable {
    //#region Fields
    Name: string = "Unnamed Song";
    Url: string = "nothing.mp3";
    Element: HTMLAudioElement | null = null;

    TableLabel: string = Globals.SongTableLabel;
    static Path: string = "/uploads/audio/";
    //#endregion



    //#region Constructor
    constructor(id: number | null = null) {
        super(id);
    }
    //#endregion


    
    //#region Methods
    Play(): void {
        console.log(this.Element);
        if(!this.Element) {
            return;
        }

        this.Element.play();
        $(this.Element).prop("currentTime", 145.392);
    }



    Stop(): void {
        if(!this.Element) {
            return;
        }

        this.Element.pause();
        $(this.Element).off("ended");
    }



    CreateElement(): void {
        this.Element = document.createElement("audio");
        $(this.Element)
            .prop("src", Song.Path + this.Url)
            .prop("controls", true)
            .prop("muted", true)
            .data("object", this);
    }
    //#endregion
}