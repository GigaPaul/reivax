import { Adventure } from "./../../classes/adventure.js";
import { Landscape } from "./../../modules/landscape.js";
import { Ambience } from "../../classes/ambience.js";
import { SoundFamily } from "../../classes/sound.js";
import { Playlist } from "../../classes/playlist.js";
import { ADVENTURE_LIST } from "./../../globals/elements.js";
import * as FUNC from './../../globals/func.js';














class AdventureForm {
    constructor(element) {
        this.element = element;
        $(this.element).data("adventureform", this);
        this.adventure = new Adventure();

        let that = this;
        $(this.element).on("submit", function(e) {
            e.preventDefault();
            that.SubmitForm();
            $(that.element).modal("hide");
        });
    }


    async Load(adventure = new Adventure()) {
        $(this.element).modal("show");
        $(this.element).find(".accordion-button").addClass("collapsed");
        $(this.element).find(".accordion-collapse").removeClass("show");

        this.adventure = adventure;
        let that = this;

        let nameInput = $(this.element).find("input[name='name']")[0];
        let descInput = $(this.element).find("textarea[name='description']")[0];

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
            $(nameInput).val(this.adventure.name);
            $(descInput).val(this.adventure.description);



            // LANDSCAPES
            this.LoadAdventureLandscapeCard();
    
    
    
            // AMBIENCES
            this.LoadAdventureAmbienceCard();
    
    
    
            // SOUNDS
            this.LoadAdventureSoundCard();

    
     
    
            // MUSICS
            this.LoadAdventureMusicCard();
        }
    }
    

    Init() {
        this.InitResetSearchBtns();
        this.InitLandscapeSearch();
        this.InitAmbienceSearch();
        this.InitSoundSearch();
        this.InitMusicSearch();
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



    InitMusicSearch() {
        let that = this;

        $(this.element).find("#searchPlaylist").on("input", function() {
            // Si le champs de recherche est rempli, faire une recherche
            if(this.value.length > 0) {
                let send = {
                    type: "search",
                    for: "playlists",
                    search: this.value
                };
        
        
                $.post("controller.php", send, function(data) {
                    let result = jQuery.parseJSON(data);
                    let output = $("#formOutputMusics")[0];
                    $(output).html("")
                
                    if(result.length > 0) {
                        $(result).each(function() {
                            let thisPlaylist = new Playlist(this);
                            let card = thisPlaylist.CreateFormCard(that.adventure);

                            output.appendChild(card);
                        });
                    }
                    else {
                        let error = "Aucune musique correspondant à votre recherche n'a été trouvé.";
                        FUNC.CreateError(error, output);
                    }
        
                });
            }
            // Si le champs de recherche est vide, montrer les musiques de l'aventure
            else {
                that.LoadAdventureMusicCard();
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





    LoadAdventureMusicCard() {
        $("#formOutputMusics").html("");

        // If there are no musics
        if(this.adventure.playlists.length === 0) {
            let error = "Cette aventure ne contient encore aucune musique. Faites une recherche pour en rajouter.";
            FUNC.CreateError(error, $("#formOutputMusics")[0])
        }
        // If there are musics
        else {
            let that = this;

            $(this.adventure.playlists).each(function() {
                let card = this.CreateFormCard(that.adventure);
                $("#formOutputMusics")[0].appendChild(card);
            });
        }
    }





    async SubmitForm() {
        let that = this;

        let name = $(this.element).find("input[name='name']").val();
        let description = $(this.element).find("textarea[name='description']").val();
        let background = $(this.element).find("input[name='background']")[0].files[0];

        this.adventure.name = name;
        this.adventure.description = description


        // If there are no background change, push immediately the adventure
        if(background === undefined) {
            await this.adventure.Push();
            RetrieveAdventures();
        }
        // Otherwise, upload the background image first
        else {
            // Upload de l'image de fond
            let formData = new FormData();
            formData.append("type", "upload");
            formData.append("for", "file");
            formData.append("background", background);


            $.ajax({
                type: "POST",
                url: "controller.php",
                data: formData,
                processData: false,
                contentType: false,
                success: async function(data) {
                    try {
                        let result = jQuery.parseJSON(data);
                        console.log(result);
                        // Update the adventure background with the newly uploaded image
                        that.adventure.background = result[0];

                        // Then push the adventure
                        await that.adventure.Push();
                        RetrieveAdventures();
                    } catch(error) {
                        console.log("Erreur détectée");
                        console.log(data);
                    }
                }
            })
        }
        



        let toast = document.createElement("div");
        $(toast)
            .addClass("toast align-items-center text-white bg-success border-0 fade hide mt-1")
            .prop("role", "alert")
            .prop("aria-live", "assertive")
            .prop("aria-atomic", true)
            .attr("data-bs-delay", 5000);
        $("#popupContainer")[0].appendChild(toast);
        
        let content = document.createElement("div");
        $(content).addClass("d-flex");
        toast.appendChild(content);

        let body = document.createElement("div");
        $(body).addClass("toast-body");
        content.appendChild(body);

        let text = document.createElement("p");
        $(text).addClass("m-0");
        $(text).text("L'aventure a été mise à jour avec succès!");
        body.appendChild(text);

        let bootstrapToast = new bootstrap.Toast(toast);
        bootstrapToast.show();
    }
}





// let FORM = new AdventureForm($("#editAdventureForm")[0]);
// FORM.Init();
// $("#NewAdventureBtn").on("click", function() {
//     FORM.Load();
// })















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
        $(ADVENTURE_LIST).find("article").remove();

        $(queriedAdventure).each(function() {
            let adventure = new Adventure(this);
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
        $("#editAdventureForm").data("adventureform").Load(adventure);
    })
    //

    btnContainer.appendChild(editBtn);

    $(loadBtn).on("click", function() {
        window.location.href = `aventure.php?id_aventure=${adventure.id_aventure}`;
    })

    return article;
}






export default function InitIndexView() {
    RetrieveAdventures();


    $(".modal-form").on("show.bs.modal", function() {
        this.reset();
    })
    
    // FORMULAIRE AVENTURE
    $("#editAdventureForm").on("show.bs.modal", function() {
        $(this).find("output").html("");
    })
    
    
    
    
    
    
    // FORMULAIRE DÉCOR
    $("#landscapeForm").on("submit", function(e) {
        e.preventDefault();
        
        let formData = new FormData(this);
        
        $.ajax({
            type: "POST",
            url: "controller.php",
            data: formData,
            processData: false,
            contentType: false,
            success: function(data) {
                try {
                    let result = jQuery.parseJSON(data);
    
                    let newLandscape = new Landscape();
                    newLandscape.name = formData.get("name");
                    newLandscape.url = result[0];
    
                    newLandscape.Push();
                } catch(error) {
                    console.log("Erreur détectée");
                    console.log(data);
                    console.log(error);
                }
            }
        })
        
        $(this).modal("hide");
    })
    
    
    
    
    
    // FORMULAIRE AMBIANCE
    $("#ambienceForm").on("submit", function(e) {
        e.preventDefault();
        
        let formData = new FormData(this);
        
        $.ajax({
            type: "POST",
            url: "controller.php",
            data: formData,
            processData: false,
            contentType: false,
            success: function(data) {
                try {
                    let result = jQuery.parseJSON(data);
    
                    let newAmbience = new Ambience();
                    newAmbience.name = formData.get("name");
                    newAmbience.url = result[0];
    
                    newAmbience.Push();
                } catch(error) {
                    console.log("Erreur détectée");
                    console.log(data);
                    console.log(error);
                }
            }
        })
        
        $(this).modal("hide");
    })
    
    
    
    
    
    // FORMULAIRE SOUND
    $("#soundForm").on("submit", function(e) {
        e.preventDefault();
        
        let formData = new FormData(this);
    
        
        $.ajax({
            type: "POST",
            url: "controller.php",
            data: formData,
            processData: false,
            contentType: false,
            success: function(data) {
                try {
                    let result = jQuery.parseJSON(data);
    
                    let obj = {
                        "name": formData.get("name"),
                        "frequency": formData.get("frequency"),
                        "is_loop": formData.get("is_loop") === "on",
                        "sounds": []
                    }
    
    
                    $(result).each(function() {
                        obj.sounds.push({"url": this});
                    });
    
                    let newSoundFamily = new SoundFamily(obj);
    
                    newSoundFamily.Push();
                } catch(error) {
                    console.log("Erreur détectée");
                    console.log(data);
                    console.log(error);
                }
            }
        })
        
        $(this).modal("hide");
    })
    
    
    
    
    
    $("#playlistForm").find("input[name='url[]']").on("change", function(e) {
        let output = $(this).siblings("output")[0];
        $(output).html("");
    
        let ul = document.createElement("ul");
        $(ul).addClass("list-group");
        output.appendChild(ul);
    
        if(e.target.files.length > 0) {
            $(e.target.files).each(function() {
                let li = document.createElement("li");
                $(li).addClass("list-group-item list-group-item-action");
                ul.appendChild(li);
    
                let row = document.createElement("div");
                $(row).addClass("row");
                li.appendChild(row);
    
                let leftCol = document.createElement("col");
                $(leftCol).addClass("col-6");
                row.appendChild(leftCol);
                
                let urlInput = document.createElement("input");
                $(urlInput)
                    .addClass("form-control form-control-plaintext")
                    .prop("type", "text")
                    .prop("name", "musicUrl[]")
                    .prop("readonly", true)
                    .val(this.name);
                leftCol.appendChild(urlInput);
    
                let rightCol = document.createElement("col");
                $(rightCol).addClass("col-6");
                row.appendChild(rightCol);
                
                let nameInput = document.createElement("input");
                $(nameInput)
                    .addClass("form-control")
                    .prop("type", "text")
                    .prop("name", "musicName[]")
                    .prop("placeholder", "Nom de la musique")
                    .prop("autocomplete", "off")
                    .prop("required", true);
                rightCol.appendChild(nameInput);
            });
        }
    });
    
    // FORMULAIRE MUSIC
    $("#playlistForm").on("submit", function(e) {
        e.preventDefault();
        
        let formData = new FormData(this);
    
    
        
        $.ajax({
            type: "POST",
            url: "controller.php",
            data: formData,
            processData: false,
            contentType: false,
            success: function(data) {
                try {
                    let urls = jQuery.parseJSON(data);
                    let names = formData.getAll("musicName[]");
    
                    let musics = [];
                    for(let i = 0; i < urls.length; i++) {
                        let thisMusic = {
                            "name": names[i],
                            "url": urls[i]
                        }
    
                        musics.push(thisMusic);
                    }
                    
                    let obj = {
                        "name": formData.get("name"),
                        "musics": musics,
                        "is_shuffle": formData.get("isShuffled") === "on"
                    }
    
                    let newPlaylist = new Playlist(obj);
                    newPlaylist.Push();
    
                } catch(error) {
                    console.log("Erreur détectée");
                    console.log(data);
                    console.log(error);
                }
            }
        })
        
        $(this).modal("hide");
    })




    let FORM = new AdventureForm($("#editAdventureForm")[0]);
    FORM.Init();
    $("#NewAdventureBtn").on("click", function() {
        FORM.Load();
    })
}

// InitIndexView();