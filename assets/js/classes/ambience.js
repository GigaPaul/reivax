import * as GLOBALS from "../globals/const.js";
import * as FUNC from "../globals/func.js";


export class Ambience {
    constructor(obj = null) {
        if(obj !== null) {
            this.Copy(obj);
        }
        else {
            this.id_ambience = null;
            this.name = "";
            this.url = "";
        }

        this.element;
    }


    Copy(obj) {
        this.id_ambience = obj.id_ambience;
        this.name = obj.name;
        this.url = obj.url;
    }

    Load() {
        let that = this;

        let article = document.createElement("article");
        $(article).addClass("ambience_art me-2");
        this.element = article;
    
        let button = document.createElement("button");
        $(button).text(this.name);
        $(button).addClass("btn btn-primary").css("width", "max-content");
        article.appendChild(button);

        let nbOfAudios = 2;

        for(let i = 0; i < nbOfAudios; i++) {
            let audio = document.createElement("audio");

            $(audio)
                .prop("src", this.url)
                .attr("data-volume", "ambiance")
                .prop("volume", 0);

            article.appendChild(audio);

            $(audio).on("timeupdate", function() {
                if(this.paused) {
                    return;
                }
        
                if(isNaN(this.duration)) {
                    return;
                }

                let activeAudios = $(that.element).find("audio.active");

                if(activeAudios.length === 0) {
                    return;
                }
    
                let transitionTime = 1000;
                let buffer = transitionTime / 1000;
    
                if(this.currentTime <= this.duration - buffer)
                {
                    return;
                }
                
                let otherAudio = $(this).siblings("audio")[0];

                if(!otherAudio.paused) {
                    return;
                }
    
    
                FUNC.PauseAudio(this, transitionTime * 2);
                $(this).removeClass("active");
    
                let volume = $("#AmbianceVolume").val() / 100;
                $(otherAudio).addClass("active");
                FUNC.PlayAudio(otherAudio, volume, transitionTime);
            })
        }



    
        $(button).on("click", function() {
            let isOngoing = false;
            let audios = $(article).find("audio");

            $(audios).each(function() {
                if(!this.paused) {
                    isOngoing = true;
                }
            });


            if(isOngoing) {
                Ambience.StopAllAudios();
            }
            else {
                if(!$(this).hasClass("active")) {
                    $(that.element.parentNode).find("button").removeClass("active");
                    $(this).addClass("active");
                }
    
                Ambience.SetAs(that);
            }
        });
    }



    async Push() {
        let send = {
            type: "update",
            for: "ambience",
            ambience: this
        };

        if(this.id_ambience === null) {
            send.type = "insert";
        }

        let that = this;

        await $.post("controller.php", send, function(data) {
            try {
                if (send.type === "insert") {
                    that.id_ambience = data;
                }
            } catch(error) {
                console.log("Erreur détectée");
                console.log(data);
                console.log(error);
            }
        })
    }





    CreateFormCard(adventure) {
        let that = this;

        let article = document.createElement("article");
        $(article).addClass("col-2 mb-2");

        let isActive = adventure.IsUsingAmbience(this);
        
        let id = `formCheckboxAmbience${this.id_ambience}`;

        let checkbox = document.createElement("input");
        $(checkbox)
            .prop("type", "checkbox")
            .prop("name", "ambiences[]")
            .prop("value", this.id_ambience)
            .prop("checked", isActive)
            .prop("id", id)
            .addClass("btn-check");
        article.appendChild(checkbox);

        $(checkbox).on("change", function() {
            if(this.checked) {
                adventure.AddAmbience(that);
            }
            else {
                adventure.RemoveAmbience(that);
            }
        })

        let label = document.createElement("label");
        $(label)
            .addClass("btn btn-outline-primary w-100 text-truncate")
            .prop("for", id)
            .text(this.name);
        article.appendChild(label);


        return article;
    }





    static SetAs(ambience) {
        // Find a paused audio of the concerned Ambience
        let audioToPlay = $(ambience.element).find("audio").filter((index, node) => { return node.paused });

        if(audioToPlay.length === 0) {
            console.log(`Aucun audio de l'ambiance ${ambience.name} n'est actuellement en pause.`);
            return;
        }

        audioToPlay = audioToPlay[0];

        // Go through all the ambience audio
        $("#ambienceSelector").find("audio").each(function() {
            // Play the one we previously selected
            if(this === audioToPlay) {
                $(this).addClass("active");
                let volume = $("#AmbianceVolume").val() / 100;
                FUNC.PlayAudio(this, volume, GLOBALS.AMBIENCE_FADE_TIME);
            }
            // Pause those who were playing
            else if(!this.paused) {
                Ambience.StopThisAudio(this);
            }
        });
    }




    StopAudios() {
        let audios = $(this.element).find("audio");

        $(audios).each(function() {
            Ambience.StopThisAudio(this);
        })

    }



    static StopThisAudio(element) {
        if(element.paused) {
            return;
        }

        let transitionTime = GLOBALS.AMBIENCE_FADE_TIME;

        let fadeTimeMs = GLOBALS.AMBIENCE_FADE_TIME / 1000;
        
        if(element.currentTime > element.duration - fadeTimeMs) {
            transitionTime = ( element.duration - element.currentTime ) * 1000;
        }

        $(element).removeClass("active").stop();
        FUNC.PauseAudio(element, transitionTime);
    }



    static StopAllAudios() {
        $("#ambienceSelector").find("audio").each(function() {
            Ambience.StopThisAudio(this);
        });
    }
}