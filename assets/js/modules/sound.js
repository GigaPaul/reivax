import * as GLOBALS from "../globals/const.js";
import * as FUNC from "../globals/func.js";





export class SoundFamily {
    constructor(obj = null) {

        this.urls = [];

        if(obj !== null) {
            this.Copy(obj);
        }
        else {
            this.id_soundFamily = null;
            this.name = "";
            this.frequency = 0;
            this.isLoop = true;
        }

        this.element;
    }


    Copy(obj) {
        this.id_soundFamily = obj.id_soundfamily ?? null;
        this.name = obj.name;
        this.isLoop = obj.is_loop;

        let frequency = 0;

        if(Number.isInteger(obj.frequency)) {
            frequency = obj.frequency;
        }
        else {
            let parsed = parseInt(obj.frequency);
            if(!isNaN(parsed)) {
                frequency = parsed;
            }
        }

        this.frequency = frequency;

        let that = this;
        $(obj.sounds).each(function() {
            that.urls.push(this.url);
        });
    }



    async Push() {
        let send = {
            type: "update",
            for: "soundFamily",
            soundFamily: this
        };

        if(this.id_soundFamily === null) {
            send.type = "insert";
        }

        let that = this;

        await $.post("controller.php", send, function(data) {
            try {
                if (send.type === "insert") {
                    that.id_soundFamily = data;
                }
            } catch(error) {
                console.log("Erreur détectée");
                console.log(data);
                console.log(error);
            }
        })
    }





    Load() {
        let that = this;

        let container = document.createElement("div");
        $(container).addClass("sounds__container col-3");
        this.element = container;

        let button = document.createElement("button");
        $(button).addClass("btn btn-primary w-100 mb-3")
        $(button).text(this.name);
        $(button).on("click", function() {
            let sound = new Sound(that);
            sound.Create();
        });
        $(container).append(button);

    }


    CreateFormCard(adventure) {
        let that = this;

        let article = document.createElement("article");
        $(article).addClass("col-2 mb-2");

        let isActive = adventure.IsUsingSound(this);
        
        let id = `formCheckboxSound${this.id_soundFamily}`;

        let checkbox = document.createElement("input");
        $(checkbox)
            .prop("type", "checkbox")
            .prop("name", "soundFamilies[]")
            .prop("value", this.id_soundFamily)
            .prop("checked", isActive)
            .prop("id", id)
            .addClass("btn-check");
        article.appendChild(checkbox);

        $(checkbox).on("change", function() {
            if(this.checked) {
                adventure.AddSound(that);
            }
            else {
                adventure.RemoveSound(that);
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
}


class Sound {
    constructor(soundFamily) {
        this.family = soundFamily;
        this.element;
        this.audio;
        this.playBtn;
        this.order = 0;
    }





    Create() {
        let that = this;
        // let playlistLi = $(this).siblings(".sounds__playlist").children("li");
    
        let article = document.createElement("article");
        $(article).addClass("sounds__article card w-max-content shadow mb-4 mt-0");
        $(article).css("margin", "auto");
        this.element = article;
        $("#activeSounds").append(article);
    
        let header = document.createElement("div");
        $(header).addClass("card-header");
        $(article).append(header);
    
        let title = document.createElement("h3");
        $(title).text(this.family.name);
        $(title).addClass("text-center m-0");
        $(header).append(title);
    
        let body = document.createElement("div");
        $(body).addClass("card-body");
        $(article).append(body);
    
        let container = document.createElement("div");
        $(container).addClass("sounds__activeContainer d-flex align-items-center");
        $(body).append(container);
    
    
        let audio = document.createElement("audio");
        $(audio).addClass("sounds__audio fadeout_audio")
            .prop("volume", 0)
            .attr("data-volume", "sons")
            .on("timeupdate", function() {
                that.Next();
            });
        this.audio = audio;
        $(container).append(audio);
    
        let play = document.createElement("button");
        $(play).html(`<i class="fa-solid fa-play"></i>`);
        $(play).addClass("sounds__play btn btn-success me-3");
        $(play).on("click", function() {
            that.Play();
        });
        this.playBtn = play;
        $(container).append(play);
    
    
    
        // FREQUENCY
        let frequency = document.createElement("div");
        $(frequency).addClass("sounds__frequency d-flex align-items-center me-3");
        $(container).append(frequency);
    
        let labelFrequency = document.createElement("label");
        $(labelFrequency).text("Fréquence");
        $(labelFrequency).addClass("me-2")
        $(frequency).append(labelFrequency);
    
    
        let inputFrequency = document.createElement("input");
        $(inputFrequency).addClass("form-control-range");
        $(inputFrequency).css("width", "100px")
        $(inputFrequency).prop("type", "range");
        $(inputFrequency).prop("min", "0");
        $(inputFrequency).prop("max", "30");
        $(inputFrequency).prop("value", this.family.frequency / 1000);
        $(inputFrequency).addClass("me-2")
        $(frequency).append(inputFrequency);
    
        let outputFrequency = document.createElement("output");
        $(outputFrequency).text($(inputFrequency).val());
        $(inputFrequency).on("input", function()
        {
            $(outputFrequency).text($(this).val());
            that.family.frequency = $(this).val() * 1000;
        })
        $(frequency).append(outputFrequency);
    
    
    
        // LOOP
        let loop = document.createElement("div");
        $(container).append(loop);
        $(loop).addClass("me-3");
    
        let loopLabel = document.createElement("label");
        $(loopLabel).text("Loop")
        $(loopLabel).addClass("me-2");
        $(loop).append(loopLabel);
    
        let loopInput = document.createElement("input");
        $(loopInput).addClass("form-check-input");
        $(loopInput).prop("type", "checkbox");
        $(loopInput).prop("name", "soundIsLooping");
        $(loopInput).prop("checked", this.family.isLoop);
        $(loop).append(loopInput);
    
        let remove = document.createElement("button");
        $(remove).addClass("sounds__delete btn btn-danger");
        $(remove).html(`<i class="fa-solid fa-stop">`);
        $(remove).on("click", function() {
            that.Remove();
        });
        $(container).append(remove);
    }





    Remove() {
        let that = this;
        let audio = $(this.element).find("audio")[0];
        let speedMs = 500;
    
        $(this.element).animate({height: 0}, speedMs)
        $(audio).animate({volume: 0}, speedMs, function() {
            $(that.element).remove();
        })
    }


    Next() {
        let buffer = 0.2;

        if(isNaN(this.audio.duration))
        {
            return;
        }
    
        if(this.audio.currentTime <= this.audio.duration - buffer)
        {
            return;
        }
    
        // let playlist = $(this.element).find(".sounds__activePlaylist")
        // let playlistLi = $(playlist).children("li");
    
        let last = this.family.urls.length - 1;
        // parseInt($(playlistLi).length - 1);
    
        if(this.order == last) {    
            if(!this.family.isLoop) {
                return;
            }
            
            this.order = 0;
        }
        else {
            this.order++;
        }
    
        let url = this.family.urls[this.order];
        $(this.audio).prop("src", url);
    

        if(this.family.frequency > 0)
        {
            let volume = $("#SonsVolume").val() / 100;
            FUNC.Wait(this.family.frequency).then(() => { 
                FUNC.PlayAudio(this.audio, volume, GLOBALS.SOUND_FADE_TIME)
            });
        }
        else
        {
            $(this.audio).prop("currentTime", 0);
            this.audio.play();
        }
    }



    Play() {
        let that = this;
        let icon = $(this.playBtn).children("i");
    
        $(icon).toggleClass("fa-play fa-pause");
        $(this.playBtn).toggleClass("btn-warning btn-success");
    
        if(this.audio.paused)
        {
            let url = this.family.urls[this.order];
            $(this.audio).prop("src", url);
            let volume = $("#SonsVolume").val() / 100;
            FUNC.PlayAudio(this.audio, volume, GLOBALS.SOUND_FADE_TIME)
        }
        else
        {
            $(this.audio).animate({volume: 0}, GLOBALS.SOUND_FADE_TIME, function()
            {
                that.audio.pause();
                $(that.audio).prop("currentTime", 0);
            })
        }
    }
}