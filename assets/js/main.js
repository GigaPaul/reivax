import InitVolume from "./modules/volume.js";
import { Adventure } from "./classes/adventure.js";
import { LANDSCAPE_OUTPUT, AMBIENCE_OUTPUT, MUSIC_OUTPUT, SOUND_OUTPUT } from "./globals/elements.js";

let params = new URL(document.location.toString()).searchParams;


async function LoadAdventure(id_aventure) {
    let adventure = new Adventure();
    await adventure.Fetch(id_aventure);

    adventure.LoadAmbiences(AMBIENCE_OUTPUT);
    adventure.LoadLandscapes(LANDSCAPE_OUTPUT);
    adventure.LoadPlaylists(MUSIC_OUTPUT);
    adventure.LoadSounds(SOUND_OUTPUT);
}





InitVolume();

if(params.has("id_aventure")) {
    LoadAdventure(params.get("id_aventure"));
}
