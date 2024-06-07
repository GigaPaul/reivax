import { Adventure } from "./../modules/adventure.js";
import { ADVENTURE_LIST } from "./../globals/elements.js";

RetrieveAdventures();
// let adventure = new Adventure();
// adventure.Fetch();





function RetrieveAdventures() {
    if(ADVENTURE_LIST === undefined) {
        return;
    }

    let send = {
        type: "selectAll",
        for: "aventures"
    };

    $.post("controller.php", send, function(data) {
        let queriedAdventure = jQuery.parseJSON(data);


        $(queriedAdventure).each(function() {
            let adventure = new Adventure();
            adventure.Copy(this);
            let card = adventure.CreateCard();
            ADVENTURE_LIST.appendChild(card);
        })
    });
}