import Song from "./song.js";
import Fetchable from "./fetchable.js";
import Landscape from "./landscape.js";
import Playlist from "./playlist.js";
import Globals from "../globals.js";

export default class Adventure extends Fetchable {
    //#region Fields
    Ambiences: Song[] = [];
    Background: string | null = null;
    Description: string | null = null;
    Landscapes: Landscape[] = [];
    Name: string = "Unnamed Adventure";
    Playlists: Playlist[] = [];

    TableLabel: string = Globals.AdventureTableLabel;
    //#endregion


    //#region Properties
    get CurrentPlaylist(): Playlist | undefined {
        return this.Playlists.find(i => i.CurrentSong);
    }

    get CurrentSong(): Song | undefined {
        return this.CurrentPlaylist?.CurrentSong;
    }
    //#endregion



    //#region Constructors
    constructor(id: number | null = null) {
        super(id);
    }
    //#endregion



    //#region Methods
    StartPlaylist(id: number): void {
        const playlist: Playlist | undefined = this.Playlists.find(i => i.Id === id);

        if(!playlist){
            return;
        }

        if(this.CurrentPlaylist === playlist) {
            return;
        }

        this.StopPlaylists();
        playlist.PlayNextSong();
    }



    StopPlaylists(): void {
        this.Playlists.forEach(playlist => {
            playlist.Stop();
        });
    }



    Load(object: any): void {
        super.Load(object);
    }
    //#endregion
}