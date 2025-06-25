import Adventure from "./models/adventure.js";
import Playlist from "./models/playlist.js";
import Song from "./models/song.js";
import Supabase from './models/supabase.js';
import Globals from './globals.js';

const redirectUrl: string = "index.php";

async function StartAventure():Promise<void> {
    const adventure: Adventure = new Adventure("Aventure", "rien.jpg");
    const playlist: Playlist = new Playlist("Bidule");
    const song1: Song = new Song("Silence1", "2-minutes-and-30-seconds-of-silence.mp3");
    const song2: Song = new Song("Silence2", "2-minutes-and-30-seconds-of-silence.mp3");
    const song3: Song = new Song("Silence3", "2-minutes-and-30-seconds-of-silence.mp3");
    playlist.Songs.push(song1, song2, song3);
    adventure.Playlists.push(playlist);
    playlist.Start();

    const params = new URLSearchParams(document.location.search);
    const idParam: string | null = params.get("id");

    if(!idParam) {
        window.location.replace(redirectUrl);
        return;
    }

    const AdventureId: number = parseInt(idParam);

    const supabase:Supabase = await Supabase.CreateClient();

    const newAdventure: Adventure = new Adventure(AdventureId);
    await newAdventure.Fetch(supabase);
    // console.log(newAdventure);
}





// Trigger start when document is fully loaded and ready
$(StartAventure);