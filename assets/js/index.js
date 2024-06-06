import InitVolume from "./modules/volume.js";
// import InitLandscape from "./modules/landscape.js";
// import InitAmbience from "./modules/ambience.js";
// import InitSounds from "./modules/sound.js";
import InitMusic from "./modules/music.js";

import { Adventure } from "./modules/adventure.js";

export const LANDSCAPE_OUTPUT = $("#landscapeOutput")[0];
export const AMBIENCE_OUTPUT = $("#ambienceOutput")[0];
export const MUSIC_OUTPUT = $("#musicOutput")[0];
export const MUSIC_AUDIOS = $("#musicAudios");





function LoadAdventure(id_aventure) {
    let send = {
        type: "load",
        for: "aventure",
        id_aventure: id_aventure
    };

    $.post("controller.php", send, function(data) {
        let queriedAdventure = jQuery.parseJSON(data);
        let adventure = new Adventure(queriedAdventure);

        adventure.LoadAmbiences();
        adventure.LoadLandscapes();
        adventure.LoadPlaylists();
        // adventure.LoadSounds();
    });
}

InitVolume();
InitMusic();
LoadAdventure(2);

// InitLandscape();
// InitAmbience();
// InitSounds();