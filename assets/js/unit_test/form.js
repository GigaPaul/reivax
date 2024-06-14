import { Adventure } from "../classes/adventure.js";
import { Landscape } from "../modules/landscape.js";
import { Ambience } from "../modules/ambience.js";
import { ADVENTURE_LIST } from "../globals/elements.js";
import * as FUNC from '../globals/func.js';
import { SoundFamily } from "../modules/sound.js";

RetrieveAdventures();


class AdventureForm {
    constructor(element) {
        this.element = element;
        this.adventure = new Adventure();
    }


    async Load(adventure = new Adventure()) {
        $(this.element).modal("show");
        this.adventure = adventure;
        let that = this;

        // New adventure
        if(adventure.id_aventure === null) {
            let errorLandscape = "Cette aventure ne contient encore aucun décor. Faites une recherche pour en rajouter.";
            FUNC.CreateError(errorLandscape, $("#formOutputLandscapes")[0])

            let errorAmbience = "Cette aventure ne contient encore aucune ambiance. Faites une recherche pour en rajouter.";
            FUNC.CreateError(errorAmbience, $("#formOutputAmbiences")[0])

            let errorSound = "Cette aventure ne contient encore aucun son. Faites une recherche pour en rajouter.";
            FUNC.CreateError(errorSound, $("#formOutputSounds")[0])

            let errorMusic = "Cette aventure ne contient encore aucune musique. Faites une recherche pour en rajouter.";
            FUNC.CreateError(errorMusic, $("#formOutputMusics")[0])
            return;
        }
        // Load existing adventure
        else {
            await adventure.Fetch(this.id);

            let idInput = $(this.element).find("input[name='id_aventure']")[0];
            $(idInput).val(this.adventure.id_aventure);

            let nameInput = $(this.element).find("input[name='name']")[0];
            $(nameInput).val(this.adventure.name);

            let descInput = $(this.element).find("textarea[name='description']")[0];
            $(descInput).val(this.adventure.description);



            // LANDSCAPES
            this.LoadAdventureLandscapeCard();
    
    
    
            // AMBIENCES
            this.LoadAdventureAmbienceCard();
    
    
    
            // SOUNDS
            this.LoadAdventureSoundCard();

    
     
    
            // MUSICS
            // If there are no musics
            if(this.adventure.playlists.length === 0) {
                let error = "Cette aventure ne contient encore aucune musique. Faites une recherche pour en rajouter.";
                FUNC.CreateError(error, $("#formOutputMusics")[0])
            }
            // If there are musics
            else {
                $(this.adventure.playlists).each(function() {
    
                    this.CreateFormCard($("#formOutputMusics")[0]);
                });
            }
        }
    }
    

    Init() {
        this.InitResetSearchBtns();
        this.InitLandscapeSearch();
        this.InitAmbienceSearch();
        this.InitSoundSearch();
    }

    InitResetSearchBtns() {
        $(this.element).find(".resetSearch").on("click", function() {
            let searchBar = $(this).siblings('input[type="search"]')[0];
            $(searchBar).val("").trigger("input");
        })
    }

    InitLandscapeSearch() {
        let that = this;

        $(this.element).find("#searchLandscape").on("input", function() {
            // Si le champs de recherche est rempli, faire une recherche
            if(this.value.length > 0) {
                let send = {
                    type: "search",
                    for: "landscapes",
                    search: this.value
                };
        
        
                $.post("controller.php", send, function(data) {
                    let result = jQuery.parseJSON(data);
                    let output = $("#formOutputLandscapes")[0];
                    $(output).html("")
                
                    if(result.length > 0) {
                        $(result).each(function() {
                            let thisLandscape = new Landscape(this);
                            let card = thisLandscape.CreateFormCard(that.adventure);

                            output.appendChild(card);
                        });
                    }
                    else {
                        let error = "Aucun décor correspondant à votre recherche n'a été trouvé.";
                        FUNC.CreateError(error, output);
                    }
        
                });
            }
            // Si le champs de recherche est vide, montrer les décors de l'aventure
            else {
                that.LoadAdventureLandscapeCard();
            }
        });
    }



    InitAmbienceSearch() {

        let that = this;

        $(this.element).find("#searchAmbience").on("input", function() {
            // Si le champs de recherche est rempli, faire une recherche
            if(this.value.length > 0) {
                let send = {
                    type: "search",
                    for: "ambiences",
                    search: this.value
                };
        
        
                $.post("controller.php", send, function(data) {
                    let result = jQuery.parseJSON(data);
                    let output = $("#formOutputAmbiences")[0];
                    $(output).html("")
                
                    if(result.length > 0) {
                        $(result).each(function() {
                            let thisAmbience = new Ambience(this);
                            let card = thisAmbience.CreateFormCard(that.adventure);

                            output.appendChild(card);
                        });
                    }
                    else {
                        let error = "Aucune ambiance correspondant à votre recherche n'a été trouvé.";
                        FUNC.CreateError(error, output);
                    }
        
                });
            }
            // Si le champs de recherche est vide, montrer les ambiances de l'aventure
            else {
                that.LoadAdventureAmbienceCard();
            }
        });
    }



    InitSoundSearch() {

        let that = this;

        $(this.element).find("#searchSon").on("input", function() {
            // Si le champs de recherche est rempli, faire une recherche
            if(this.value.length > 0) {
                let send = {
                    type: "search",
                    for: "soundFamilies",
                    search: this.value
                };
        
        
                $.post("controller.php", send, function(data) {
                    let result = jQuery.parseJSON(data);
                    let output = $("#formOutputSounds")[0];
                    $(output).html("")
                
                    if(result.length > 0) {
                        $(result).each(function() {
                            let thisSound = new SoundFamily(this);
                            let card = thisSound.CreateFormCard(that.adventure);

                            output.appendChild(card);
                        });
                    }
                    else {
                        let error = "Aucun son correspondant à votre recherche n'a été trouvé.";
                        FUNC.CreateError(error, output);
                    }
        
                });
            }
            // Si le champs de recherche est vide, montrer les sons de l'aventure
            else {
                that.LoadAdventureSoundCard();
            }
        });
    }



    LoadAdventureLandscapeCard() {
        $("#formOutputLandscapes").html("");

        // If there are no landscapes
        if(this.adventure.landscapes.length === 0) {
            let error = "Cette aventure ne contient encore aucun décor. Faites une recherche pour en rajouter.";
            FUNC.CreateError(error, $("#formOutputLandscapes")[0])
        }
        // If there are landscapes
        else {
            let that = this;

            $(this.adventure.landscapes).each(function() {
                let card = this.CreateFormCard(that.adventure);

                $("#formOutputLandscapes")[0].appendChild(card);
            })            
        }
    }





    LoadAdventureAmbienceCard() {
        $("#formOutputAmbiences").html("");

        // If there are no ambiences
        if(this.adventure.ambiences.length === 0) {
            let error = "Cette aventure ne contient encore aucune ambiance. Faites une recherche pour en rajouter.";
            FUNC.CreateError(error, $("#formOutputAmbiences")[0])
        }
        // If there are ambiences
        else {
            let that = this;

            $(this.adventure.ambiences).each(function() {
                let card = this.CreateFormCard(that.adventure);
                $("#formOutputAmbiences")[0].appendChild(card);
            });
        }
    }





    LoadAdventureSoundCard() {
        $("#formOutputSounds").html("");

        // If there are no sounds
        if(this.adventure.soundFamilies.length === 0) {
            let error = "Cette aventure ne contient encore aucun son. Faites une recherche pour en rajouter.";
            FUNC.CreateError(error, $("#formOutputSounds")[0])
        }
        // If there are sounds
        else {
            let that = this;

            $(this.adventure.soundFamilies).each(function() {
                let card = this.CreateFormCard(that.adventure);
                $("#formOutputSounds")[0].appendChild(card);
            });
        }
    }
}

let FORM = new AdventureForm($("#editAdventureForm")[0]);
FORM.Init();





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
            let adventure = new Adventure(this);
            // let card = adventure.CreateCard();
            let card = CreateAdventureCard(adventure);
            ADVENTURE_LIST.appendChild(card);
        })
    });
}


function CreateAdventureCard(adventure) {
    let article = document.createElement("article");
    $(article).addClass("col-4 mb-3");

    let card = document.createElement("div");
    $(card).addClass("card");
    article.appendChild(card);

    let frame = document.createElement("div");
    $(frame)
        .css("height", "130px")
        .css("background-image", `url(${adventure.background})`)
        .css("background-size", "cover")
        .css("background-position", "center")
        .addClass("card-img-top");
    card.appendChild(frame);

    let body = document.createElement("div");
    $(body).addClass("card-body");
    card.appendChild(body);

    let title = document.createElement("h5");
    $(title).addClass("card-title");
    $(title).text(adventure.name);
    body.appendChild(title);

    let btnContainer = document.createElement("div");
    body.appendChild(btnContainer);

    let loadBtn = document.createElement("button");
    $(loadBtn).addClass("btn btn-primary me-2");
    $(loadBtn).text("Charger");
    btnContainer.appendChild(loadBtn);

    let editBtn = document.createElement("button");
    $(editBtn).addClass("btn btn-warning");
    $(editBtn).text("Éditer");

    // Open edit form
    $(editBtn).on("click", function() {
        FORM.Load(adventure);
    })
    //

    btnContainer.appendChild(editBtn);

    $(loadBtn).on("click", function() {
        window.location.href = `aventure.php?id_aventure=${adventure.id_aventure}`;
    })

    return article;
}






$("#editAdventureForm").on("show.bs.modal", function() {
    this.reset();
    $(this).find("output").html("");
})


$("#NewAdventureBtn").on("click", function() {
    FORM.Load();
})