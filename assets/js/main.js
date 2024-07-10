import InitIndexView from "./modules/main/index.js";
import InitAventureView from "./modules/main/aventure.js";
import InitDisplayView from "./modules/main/display.js";


let pageName = window.location.pathname.split("/").pop();

switch(pageName) {
    case "aventure.php":
        InitAventureView();
        break;

    case "index.php":
        InitIndexView();
        break;

    case "display.php":
        InitDisplayView();
        console.log("display");
        break;

    default:
        console.log(`${pageName} n'est pas présente dans le main switch.`);
        break;
}