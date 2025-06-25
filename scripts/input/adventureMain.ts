import Adventure from "./models/adventure.js";
import Playlist from "./models/playlist.js";
import Song from "./models/song.js";

function StartAventure():void {
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
        return;
    }

    const AdventureId: number = parseInt(idParam);



    $.getJSON("/json/adventures.json", function(data) {
        const object = data.find((i:any) => i.hasOwnProperty("Id") && i.Id === AdventureId);

        if(!object){
            return;
        }

        const newAdventure: Adventure | undefined = Adventure.Load(object);
        console.log(newAdventure)
    });
}





// Trigger start when document is fully loaded and ready
$(StartAventure);