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



$("#editAdventureForm").on("show.bs.modal", function() {
    this.reset();
    $(this).find("output").html("");
})





$(".musicForm__header").each(InitMusicButtons);

// MUSIC
function InitMusicButtons() {
    $(this).on("click", function() {
        let parent = $(this).parent(".card");
        
        if($(parent).hasClass("active")) {
            // Remove landscape from adventure
            $(parent).removeClass("active");
        }
        else {
            // Add landscape from adventure
            $(parent).addClass("active");
        }
    });
}

// RESET SEARCH BARS
$(".resetSearch").on("click", function() {
    let searchBar = $(this).siblings('input[type="search"]')[0];
    $(searchBar).val("");
})