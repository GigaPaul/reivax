import Supabase from './models/supabase.js';

export default class Globals {
    static AmbienceOutputId: string = "AmbienceOutput";
    static LandscapeOutputId: string = "LandscapeOutput";
    static PlaylistOutputId: string = "PlaylistOutput";

    static AdventureTableLabel: string = "Adventures";
    static LandscapeTableLabel: string = "Landscapes";
    static PlaylistTableLabel: string = "Playlists";
    static SongTableLabel: string = "Songs";

    static ConfigPath: string = "./json/config.json";
}