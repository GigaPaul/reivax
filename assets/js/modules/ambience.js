import * as GLOBALS from "../globals/const.js";
import * as FUNC from "../globals/func.js";


export class Ambience {
    constructor(obj) {
        this.id_ambience = obj.id_ambience;
        this.name = obj.name;
        this.url = obj.url;
        this.element;
    }

    Load() {
        let article = document.createElement("article");
        $(article).addClass("ambience_art me-2");
        this.element = article;
    
        let button = document.createElement("button");
        $(button).text(this.name);
        $(button).addClass("btn btn-primary");
        article.appendChild(button);
    
        let audio = document.createElement("audio");
        $(audio)
            .prop("src", this.url)
            .attr("data-volume", "ambiance")
            .prop("loop", true)
            .prop("volume", 0);
            // .prop("id", `ambience_${url}`);
        article.appendChild(audio);

        let that = this;
    
        $(button).on("click", function() {
            // Si le bouton est cliqué alors que le son n'était pas joué
            if(audio.paused) {
                if(!$(this).hasClass("active"))
                {
                    $(that.element.parentNode).find("button").removeClass("active");
                    $(this).addClass("active");
                }
    
                SetAmbienceAs(audio);
            }
            // Si le bouton est cliqué alors que le son est en train d'être joué
            else {
                $(this).removeClass("active");
                ResetAmbience();
            }
        });
    }





    CreateFormCard(parent) {
        let article = document.createElement("article");
        $(article).addClass("col-2 mb-2");
        parent.appendChild(article);

        let checkbox = document.createElement("input");
        $(checkbox)
            .prop("type", "checkbox")
            .prop("name", "ambiences[]")
            .prop("value", this.id_ambience)
            .prop("checked", true);
        $(checkbox).addClass("d-none");
        article.appendChild(checkbox);

        let button = document.createElement("button");
        $(button).prop("type", "button");
        $(button).addClass("btn btn-primary w-100 text-truncate");
        $(button).text(this.name);
        article.appendChild(button);

        $(button).on("click", function() {
            $(checkbox).prop("checked", !$(checkbox).prop("checked"));
            $(checkbox).trigger("change");
        });

        $(checkbox).on("change", function() {
            $(button).toggleClass("btn-outline-primary", !this.checked)
            $(button).toggleClass("btn-primary", this.checked)
        });
    }
}







function ResetAmbience()
{
    let audioIndex = $("#ambienceSelector").find("audio");

    $(audioIndex).each(function()
    {
        FUNC.PauseAudio(this, GLOBALS.AMBIENCE_FADE_TIME);
    })
}





function SetAmbienceAs(element)
{

    let audioIndex = $("#ambienceSelector").find("audio");

    // Jouer l'ambiance sélectionnée et mettre en pause les autres
    $(audioIndex).each(function()
    {
        // Jouer l'ambiance concernée
        if(this == element)
        {
            if(this.paused)
            {
                let volume = $("#AmbianceVolume").val() / 100;
                FUNC.PlayAudio(this, volume, GLOBALS.AMBIENCE_FADE_TIME);
            }            
        }
        // Si une autre ambiance est jouée, la mettre sur pause
        else
        {
            FUNC.PauseAudio(this, GLOBALS.AMBIENCE_FADE_TIME);
        }
    })
}