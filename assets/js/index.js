import InitVolume from "./modules/volume.js";
import InitLandscape from "./modules/landscape.js";
import InitAmbience from "./modules/ambience.js";
import InitSounds from "./modules/sound.js";
import InitMusic from "./modules/music.js";

export const LANDSCAPE_OUTPUT = $("#landscapeOutput")[0];
export const MUSIC_AUDIOS = $("#musicAudios");


InitVolume();
InitLandscape();
InitAmbience();
InitSounds();
InitMusic();