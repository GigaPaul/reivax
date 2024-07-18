import InitIndexView from "./modules/main/index.js";
import InitAventureView from "./modules/main/aventure.js";
import InitDisplayView from "./modules/main/display.js";
import InitCardsView from "./modules/main/cards.js";


let pageName = window.location.pathname.split("/").pop();

// Find the current link in the navbar
$("#headerNavbar").find("a").each(function() {
    let href = $(this).prop("href").split("/").pop();

    if(href === pageName) {
        $(this).addClass("active");
    }
})

switch(pageName) {
    case "index.php":
    case "":
        InitIndexView();
        break;

    case "aventure.php":
        InitAventureView();
        break;

    case "display.php":
        InitDisplayView();
        break;

    case "cards.php":
        InitCardsView();
        break;

    default:
        console.log(`${pageName} n'est pas présente dans le main switch.`);
        break;
}