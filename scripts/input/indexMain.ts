
import Adventure from "./models/adventure.js";

const ADVENTURE_LIST: HTMLElement = $("#adventureList")[0];

async function StartIndex():Promise<void> {
    const allAdventures = await Adventure.FetchAll();

    allAdventures.forEach((adventure: Adventure) => {
        const li: HTMLLIElement = document.createElement("li");
        const a: HTMLElement = document.createElement("a");
        $(a).text(adventure.Name).prop("href", `aventure.php?id=${adventure.Id}`);
        li.appendChild(a);
        ADVENTURE_LIST.appendChild(li);
    });
}





// Trigger start when document is fully loaded and ready
$(StartIndex);