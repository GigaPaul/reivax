import Adventure from './models/adventure.js';

export default class Globals {
    static AmbienceOutputId: string = "AmbienceOutput";
    static LandscapeOutputId: string = "LandscapeOutput";

    // Playlists
    static PlaylistOutputId: string = "PlaylistOutput";
    static PlaylistToggleId: string = "PlaylistToggle";
    static PlaylistCurrentSongNameId: string = "PlaylistCurrentSongName";
    static SongCheckboxInputName: string = "isCurrent";
    static PlaylistTransitionDuration: number = 5;

    static AdventureTableLabel: string = "Adventures";
    static LandscapeTableLabel: string = "Landscapes";
    static PlaylistTableLabel: string = "Playlists";
    static SongTableLabel: string = "Songs";

    static ConfigPath: string = "./json/config.json";

    static CurrentAdventure: Adventure | null = null;
}