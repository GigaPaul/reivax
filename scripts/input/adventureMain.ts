import Adventure from "./models/adventure.js";

const redirectUrl: string = "index.php";

async function StartAventure():Promise<void> {
    const params = new URLSearchParams(document.location.search);
    const idParam: string | null = params.get("id");

    if(!idParam) {
        window.location.replace(redirectUrl);
        return;
    }

    const AdventureId: number = parseInt(idParam);

    const newAdventure: Adventure = new Adventure(AdventureId);
    await newAdventure.Fetch();
    console.log(newAdventure);
    newAdventure.Playlists[0].Start();
    // playlist.Start();
}





// Trigger start when document is fully loaded and ready
$(StartAventure);