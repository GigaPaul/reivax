import Adventure from "./models/adventure.js";
import Globals from "./globals.js";
import Landscape from "./models/landscape.js";

const redirectUrl: string = "index.php";

async function StartAventure():Promise<void> {
    const params = new URLSearchParams(document.location.search);
    const idParam: string | null = params.get("id");

    if(!idParam) {
        window.location.replace(redirectUrl);
        return;
    }

    const AdventureId: number = parseInt(idParam);

    Globals.CurrentAdventure = new Adventure(AdventureId);
    await Globals.CurrentAdventure.Fetch();

    ManageEventListeners();
}

function ManageEventListeners() {
    $(`#${Globals.PlaylistToggleId}`).on("click", () => {

        if(!Globals.CurrentAdventure?.CurrentPlaylist) {
            console.log("No current playlist found.");
            return;
        }

        Globals.CurrentAdventure.CurrentPlaylist.Toggle()
    });
}





// Trigger start when document is fully loaded and ready
$(StartAventure);