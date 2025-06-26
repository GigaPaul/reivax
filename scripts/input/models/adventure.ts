import Song from "./song.js";
import Fetchable from "./fetchable.js";
import Landscape from "./landscape.js";
import Playlist from "./playlist.js";
import Globals from "../globals.js";
import Supabase from './supabase.js';

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
        this.Joints.push(Globals.LandscapeTableLabel, Globals.PlaylistTableLabel, Globals.SongTableLabel);
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
        const that = this;

        this.Joints.forEach(joint => {
            if(object.hasOwnProperty(joint)) {
                const jointObjectArray: any[] = (object as any)[joint];
                jointObjectArray.forEach(jointObject => {
                    switch(joint) {
                        case Globals.LandscapeTableLabel:
                            const newLandscape: Landscape = new Landscape(jointObject.id)
                            newLandscape.Fetch();
                            that.Landscapes.push(newLandscape);
                            break;
                            
                        case Globals.PlaylistTableLabel:
                            const newPlaylist: Playlist = new Playlist(jointObject.id);
                            newPlaylist.Fetch();
                            that.Playlists.push(newPlaylist);
                            break;

                        case Globals.SongTableLabel:
                            const newAmbience: Song = new Song(jointObject.id);
                            newAmbience.Fetch();
                            that.Ambiences.push(newAmbience);
                            break;
                    }
                });
            }
        });
    }

    static async FetchAll(): Promise<Adventure[]> {
        const client = await Supabase.GetClient();
        const { data } = await client
            .from(Globals.AdventureTableLabel)
            .select("*");

        if(!data) {
            return [];
        }

        const result: Adventure[] = [];

        data.forEach((obj: any) => {
            const newAdventure: Adventure = new Adventure();
            newAdventure.Load(obj);
            result.push(newAdventure);
        });

        return result;
    }
    //#endregion
}