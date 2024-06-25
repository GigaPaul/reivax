import * as GLOBALS from "../globals/const.js";
import * as FUNC from "../globals/func.js";
import { MUSIC_AUDIOS } from "./../globals/elements.js";

let CURRENT_MUSIC = null;



export default function InitMusic(){
    $(MUSIC_AUDIOS).children().each(function() {
        $(this).prop("volume", 0);
        $(this).on("timeupdate", FadeTransition);    
        $(this).on("loadedmetadata", InitAudioPlay)
    })
}





export class Playlist {
    constructor(obj = null)
    {
        this.index = 0;
        this.element;
        this.playedMusics = [];

        if(obj !== null) {
            this.Copy(obj);
        }
        else {
            this.id_playlist = null;
            this.name = "";
            this.musics = [];
            this.intro = null;
            this.outro = null;
            this.isShuffled = false;
        }
    }



    Copy(obj) {
        this.id_playlist = obj.id_playlist ?? null;
        this.name = obj.name;
        this.musics = [...obj.musics];
        this.intro = obj.intro;
        this.outro = obj.outro;
        this.isShuffled = obj.is_shuffle;
    }





    async Push() {
        let send = {
            type: "update",
            for: "playlist",
            playlist: this
        };

        if(this.id_playlist === null) {
            send.type = "insert";
        }

        let that = this;

        await $.post("controller.php", send, function(data) {
            try {
                if (send.type === "insert") {
                    that.id_playlist = data;
                }
            } catch(error) {
                console.log("Erreur détectée");
                console.log(data);
                console.log(error);
            }
        })
    }





    Load() {
        if(this.musics.length === 0) {
            return;
        }

        let article = document.createElement("article");
        $(article).addClass("col-4 mb-3");
        this.element = article;

        let card = document.createElement("div");
        $(card).addClass("card");
        article.appendChild(card);

        // HEADER
        let categoryHeader = document.createElement("div");
        $(categoryHeader).addClass("card-header");
        card.appendChild(categoryHeader);

        let categoryTitle = document.createElement("h4");
        $(categoryTitle).addClass("m-0");
        $(categoryTitle).text(this.name);
        categoryHeader.appendChild(categoryTitle);


        // BODY
        let categoryBody = document.createElement("div");
        $(categoryBody).addClass("card-body d-flex");
        card.appendChild(categoryBody);

        let songControls = document.createElement("div");
        $(songControls).addClass("d-flex flex-column justify-content-between me-3");
        categoryBody.appendChild(songControls);

        // TOGGLE BUTTON
        let toggleButton = document.createElement("button");
        $(toggleButton).addClass("music__toggle btn btn-success mb-1");
        songControls.appendChild(toggleButton);

        let toggleIcon = document.createElement("i");
        $(toggleIcon).addClass("fa-solid fa-play");
        toggleButton.appendChild(toggleIcon);

        // SHUFFLE BUTTON
        let shuffleButton = document.createElement("button");
        $(shuffleButton).addClass("music__shuffle btn");
        songControls.appendChild(shuffleButton);

        let shuffleIcon = document.createElement("i");
        $(shuffleIcon).addClass("fa-solid fa-shuffle");
        shuffleButton.appendChild(shuffleIcon);


        // CURRENT SONG
        let currentSong = document.createElement("div");
        $(currentSong).addClass("w-100")
        categoryBody.appendChild(currentSong);

        let songTitle = document.createElement("h5");
        $(songTitle).text(this.musics[0].name);
        $(songTitle).addClass("music__songTitle");
        currentSong.appendChild(songTitle);

        let progressBarContainer = document.createElement("div");
        $(progressBarContainer).addClass("progressbar");
        currentSong.appendChild(progressBarContainer);

        let progressbar = document.createElement("input");
        $(progressbar)
            .prop("type", "range")
            .val("0")
            .prop("min", "0")
            .prop("max", "100")
            .prop("step", "any")
            .addClass("w-100");
        progressBarContainer.appendChild(progressbar);

        let timestamps = document.createElement("div");
        $(timestamps).addClass("timestamp d-flex justify-content-between");
        progressBarContainer.appendChild(timestamps);

        let timestampCurrent = document.createElement("p");
        $(timestampCurrent).addClass("timestamp__current m-0");
        timestamps.appendChild(timestampCurrent);

        let timestampEnd = document.createElement("p");
        $(timestampEnd).addClass("timestamp__end m-0");
        timestamps.appendChild(timestampEnd);


        
        // HIDDEN PLAYLIST
        let playlist = document.createElement("ul");
        categoryBody.appendChild(playlist);
        $(playlist).addClass("music__playlist d-none");

        $(this.musics).each(function()
        {
            let li = document.createElement("li");
            $(li).data("url", this.url);
            playlist.appendChild(li);
        });


        if(this.isShuffled) {
            $(shuffleButton).addClass("btn-info");
        }
        else {
            $(shuffleButton).addClass("btn-outline-info");
        }



        // EVENTS
        // Toggle
        let that = this;
        $(toggleButton).on("click", function() {
            let icon = $(this).children("i");
            if(CURRENT_MUSIC === that) {
                that.stop();
                $(this).addClass("btn-success").removeClass("btn-danger");
                $(icon).addClass("fa-play").removeClass("fa-stop");
            }
            // If this is not the current music
            else {
                that.start();
                $(this).addClass("btn-danger").removeClass("btn-success");
                $(icon).addClass("fa-stop").removeClass("fa-play");
            }
        });


        // Shuffle
        $(shuffleButton).on("click", function() {
            that.isShuffled = !that.isShuffled;

            if(that.isShuffled) {
                $(this).addClass("btn-info").removeClass("btn-outline-info");
            }
            else {
                $(this).addClass("btn-outline-info").removeClass("btn-info");
            }
        });
    }





    static isMusicPlaying() {
        let isPlaying = false;

        $(MUSIC_AUDIOS).children().each(function() {
            if(!this.paused)
            {
                isPlaying = true;
                // Break the each function
                return false;
            } 
        })

        return isPlaying
    }





    getNextSong() {
        if(this.musics.length === 1) {
            return this.musics[0];
        }

        // Si la playlist est en mode shuffle et doit choisir une musique aléatoire à chaque fois
        if(this.isShuffled)
        {
            let remainingSongs = []

            // Si toutes les musiques ont été jouées
            if(this.musics.length === this.playedMusics.length)
            {
                this.playedMusics = [];
                remainingSongs = [...this.musics];

                // On retire la musique qui est actuellement jouée pour ne pas répéter deux fois la même musique
                remainingSongs.splice(this.index, 1);
            }
            // S'il reste encore des musiques à jouer
            else
            {
                let that = this;

                remainingSongs = [...this.musics].filter(function(item)
                {
                    return !that.playedMusics.includes(item);
                })
                
            }

            let length = remainingSongs.length;
            let randomIndex = Math.floor(Math.random() * length);

            return remainingSongs[randomIndex];
        }
        // Si la musique est en mode normal et choisit la musique suivante à chaque fois
        else
        {
            let nextIndex = this.index + 1;

            // Si la dernière musique vient d'être jouée
            if(nextIndex === this.musics.length)
            {
                nextIndex = 0;
            }
            
            return this.musics[nextIndex];
        }
    }




    start() {
        CURRENT_MUSIC = this;
        let songPlayed = this.musics[0];

        if(this.isShuffled)
        {
            let length = this.musics.length;
            let randomIndex = Math.floor(Math.random() * length);
            songPlayed = this.musics[randomIndex];
        }

        this.play(songPlayed);
    }



    static pause() {
        let playingAudio = $(MUSIC_AUDIOS).children(".active")[0] ?? $(MUSIC_AUDIOS).children()[0];
        
        $(playingAudio).removeClass("active");


        if(!playingAudio.paused)
        {
            $(playingAudio).animate({volume: 0}, GLOBALS.MUSIC_FADE_TIME, function()
            {
                playingAudio.pause();
                playingAudio.currentTime = 0;
            });
        }
    }




    stop() {
        this.index = 0;
        this.playedMusics = [];
        Playlist.pause();
        CURRENT_MUSIC = null;
    }




    next() {
        let nextSong = this.getNextSong();
        this.play(nextSong);
    }





    play(music) {
        this.index = this.musics.indexOf(music);
        this.playedMusics.push(music);

        let playingAudio = $(MUSIC_AUDIOS).children(".active")[0] ?? $(MUSIC_AUDIOS).children()[0];
        let pausedAudio = $(MUSIC_AUDIOS).children().filter(function() { return this !== playingAudio})[0];


        if(Playlist.isMusicPlaying()){
            Playlist.pause();
        }
        
        $(pausedAudio).addClass("active");
        $(pausedAudio).prop("src", music.url);
        

        pausedAudio.play();
        let volume = $("#MusicVolume").val() / 100;
        $(pausedAudio).animate({volume: volume}, GLOBALS.MUSIC_FADE_TIME);
        
        let title = $(this.element).find(".music__songTitle");
        $(title).text(music.name);

        console.log(`${music.name} en cours d'écoute.`);
    }




    CreateFormCard(adventure) {
        let that = this;

        let article = document.createElement("article");
        $(article).addClass("col-3 fade show adventureForm__music");

        let isActive = adventure.IsUsingMusic(this);

        let checkbox = document.createElement("input");
        $(checkbox)
            .prop("type", "checkbox")
            .prop("name", "playlists[]")
            .prop("value", this.id_playlist)
            .prop("checked", isActive);
        $(checkbox).addClass("d-none");
        article.appendChild(checkbox);

        let card = document.createElement("div");
        $(card).addClass("card fade show overflow-hidden");
        article.appendChild(card);

        let header = document.createElement("div");
        $(header).addClass("card-header musicForm__header");
        card.appendChild(header);

        $(header).on("click", function() {
            $(checkbox).prop("checked", !$(checkbox).prop("checked"));
            $(checkbox).trigger("change");
        });

        $(checkbox).on("change", function() {
            if(this.checked) {
                adventure.AddMusic(that);
            }
            else {
                adventure.RemoveMusic(that);
            }
        });

        let title = document.createElement("p");
        $(title).addClass("text-truncate user-select-none m-0")
        $(title).text(this.name);
        header.appendChild(title);

        $(this.musics).each(function() {
            let audio = document.createElement("audio");
            $(audio).addClass("w-100 m-0 p-0");
            $(audio)
                .prop("src", this.url)
                .prop("controls", true);
            card.appendChild(audio);
        });

        return article;
    }
}









function InitAudioPlay() {
    let timestampEnd = $(CURRENT_MUSIC.element).find(".timestamp__end");
    $(timestampEnd).text(FUNC.SecondsToMinutes(this.duration));
}





function FadeTransition() {
    if(CURRENT_MUSIC === null)
    {
        return;
    }

    if(this.paused)
    {
        return;
    }

    if(isNaN(this.duration))
    {
        return;
    }

    if(!$(this).hasClass("active"))
    {
        return;
    }

    // Update timestamp from modals
    let timestamp = $(CURRENT_MUSIC.element).find(".timestamp__current");
    timestamp.text(FUNC.SecondsToMinutes(this.currentTime));

    let range = $(CURRENT_MUSIC.element).find(".progressbar input[type='range']");
    let relativeVal = (this.currentTime / this.duration) * 100;
    $(range).val(relativeVal);
    //

    let buffer = GLOBALS.MUSIC_FADE_TIME / 1000;

    if(this.currentTime <= this.duration - buffer)
    {
        return;
    }
        
    CURRENT_MUSIC.next();
}