import { Ambience } from "./ambience.js";
import { Playlist } from "./music.js";
import { Landscape } from "./landscape.js";
import { SoundFamily } from "./sound.js";
import { AMBIENCE_OUTPUT, MUSIC_OUTPUT, LANDSCAPE_OUTPUT, SOUND_OUTPUT } from "./../index.js";





export class Adventure {
    constructor(obj) {
        this.ambiences = obj.ambiences;
        this.landscapes = obj.landscapes;
        this.playlists = obj.playlists;
        this.soundFamilies = obj.soundfamilies;
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
        $(this.soundFamilies).each(function() {
            let soundFamily = new SoundFamily(this);
            soundFamily.Load();
            SOUND_OUTPUT.appendChild(soundFamily.element);
        });
    }
}