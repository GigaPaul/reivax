import Fetchable from "./fetchable.js";
import Globals from "./../globals.js";

// A named song
export default class Song extends Fetchable {
    //#region Fields
    Name: string = "Unnamed Song";
    Url: string = "nothing.mp3";
    Element: HTMLDivElement | null = null;

    TableLabel: string = Globals.SongTableLabel;
    static Path: string = "/uploads/audio/";
    //#endregion



    //#region Properties
    get AudioElement(): HTMLAudioElement | undefined {
        if(!this.Element) {
            return;
        }

        return $(this.Element).find("audio")[0] as HTMLAudioElement | undefined;
    }

    get CheckboxIsCurrentElement(): HTMLInputElement | undefined {
        if(!this.Element) {
            return;
        }

        return $(this.Element).find(`input[name='${Globals.SongCheckboxInputName}']`)[0] as HTMLInputElement | undefined;
    }
    //#endregion



    //#region Constructor
    constructor(id: number | null = null) {
        super(id);
    }
    //#endregion


    
    //#region Methods
    Play(): void {
        if(!this.AudioElement) {
            return;
        }

        if(!Globals.CurrentAdventure) {
            return;
        }

        for(const playlist of Globals.CurrentAdventure.Playlists) {
            for(const song of playlist.Songs) {
                if(song === this) {
                    continue;
                }

                if(!song.AudioElement) {
                    continue;
                }

                $(song.AudioElement).off("ended");
            }
        }

        this.AudioElement.play();
        $(this.AudioElement).prop("currentTime", 145.392);
    }



    Stop(): void {
        if(!this.AudioElement) {
            return;
        }

        this.AudioElement.pause();
    }



    CreateElement(): void {
        const that = this;
        this.Element = document.createElement("div");
        $(this.Element)
            .data("object", this);
        
        let audio: HTMLAudioElement = document.createElement("audio");
        $(audio)
            .prop("src", Song.Path + this.Url)
            .prop("controls", true);
        this.Element.appendChild(audio);

        let checkbox: HTMLInputElement = document.createElement("input");
        $(checkbox).prop("type", "checkbox").prop("name", Globals.SongCheckboxInputName);
        this.Element.appendChild(checkbox);


        // Events
        // Check the checkbox when the song is being played
        $(audio).on("play", function() {
            const name = $(checkbox).prop("name");
            $(`input[name='${name}']`).prop("checked", false);
            $(checkbox).prop("checked", true);
        });

        // Update global toggle button and global current playing song name
        $(audio).on("play pause", () => {
            const toggle = $(`#${Globals.PlaylistToggleId}`)[0];
            const currentSongName = $(`#${Globals.PlaylistCurrentSongNameId}`)[0];

            if(!Globals.CurrentAdventure?.CurrentSong) {
                $(toggle).addClass("hidden");
                return;
            }
            
            $(toggle).removeClass("hidden");
            $(currentSongName).text(that.Name);
        });
    }
    //#endregion
}