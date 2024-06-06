import { Ambience } from "./ambience.js";
import { Playlist } from "./music.js";
import { Landscape } from "./landscape.js";
import { AMBIENCE_OUTPUT, MUSIC_OUTPUT, LANDSCAPE_OUTPUT } from "./../index.js";





export class Adventure {
    constructor(obj) {
        this.ambiences = obj.ambiences;
        this.landscapes = obj.landscapes;
        this.playlists = obj.playlists;
        this.sounds = obj.sounds;
    }




    LoadAmbiences() {
        $(this.ambiences).each(function() {
            let ambience = new Ambience(this);
            ambience.Load();
            AMBIENCE_OUTPUT.appendChild(ambience.element);
        });
    }




    LoadLandscapes() {
        $(this.landscapes).each(function() {
            let landscape = new Landscape(this);
            landscape.Load();
            LANDSCAPE_OUTPUT.appendChild(landscape.element);
        });
    }




    LoadPlaylists() {
        $(this.playlists).each(function() {
            let playlist = new Playlist(this);
            playlist.Load();
            MUSIC_OUTPUT.appendChild(playlist.element);
        });
    }




    LoadSounds() {

    }
}