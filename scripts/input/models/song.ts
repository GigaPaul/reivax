import Fetchable from "./fetchable.js";
import Globals from "./../globals.js";

// A named song
export default class Song extends Fetchable {
    //#region Fields
    Name: string;
    Url: string;
    Element: HTMLAudioElement;

    TableLabel: string = Globals.SongTableLabel;
    static Path: string = "/uploads/audio/";
    //#endregion



    //#region Constructor
    constructor(name: string, url: string) {
        super();
        this.Name = name;
        this.Url = url;

        this.Element = document.createElement("audio");
        $(this.Element)
            .prop("src", Song.Path + this.Url)
            .prop("controls", true)
            .prop("muted", true)
            .data("object", this);
        $("#audioList").append(this.Element);
    }
    //#endregion


    
    //#region Methods
    Play(): void {
        this.Element.play();
        $(this.Element).prop("currentTime", 145.392);
    }



    Stop(): void {
        this.Element.pause();
        $(this.Element).off("ended");
    }
    //#endregion
}