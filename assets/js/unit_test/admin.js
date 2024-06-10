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





$(".adventureForm__card").each(InitLandscapeFormCards);
$(".ambienceForm_button").each(InitAmbienceButtons);
$(".sonForm_button").each(InitSonButtons);
$(".musicForm__header").each(InitMusicButtons);


// LANDSCAPE
function InitLandscapeFormCards() {
    $(this).on("click", function() {
        if($(this).hasClass("active")) {
            // Remove landscape from adventure
            $(this).removeClass("active");
        }
        else {
            // Add landscape from adventure
            $(this).addClass("active");
        }
    });
}

// AMBIENCE
function InitAmbienceButtons() {
    $(this).on("click", function() {
        if($(this).hasClass("btn-primary")) {
            // Remove ambience from adventure
            $(this)
                .removeClass("active btn-primary")
                .addClass("btn-outline-primary");
        }
        else {
            // Add ambience from adventure
            $(this)
                .addClass("active btn-primary")
                .removeClass("btn-outline-primary");
        }
    });
}

// SONS
function InitSonButtons() {
    $(this).on("click", function() {
        if($(this).hasClass("btn-primary")) {
            // Remove sound from adventure
            $(this)
                .removeClass("active btn-primary")
                .addClass("btn-outline-primary");
        }
        else {
            // Add sound from adventure
            $(this)
                .addClass("active btn-primary")
                .removeClass("btn-outline-primary");
        }
    });
}

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