import * as GLOBALS from "../globals/const.js";
import * as FUNC from "../globals/func.js";
import { CleanLoop } from "./cleanloop.js"





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
            this.isLoop = false;
        }
    }



    Copy(obj) {
        this.id_playlist = obj.id_playlist ?? null;
        this.name = obj.name;
        this.musics = [...obj.musics];
        this.intro = obj.intro;
        this.outro = obj.outro;
        this.isShuffled = obj.is_shuffle;
        this.isLoop = obj.is_loop;
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
        let that = this;

        let article = document.createElement("article");
        $(article).addClass("col-4 mb-3");
        this.element = article
        $(article).data("playlist", this);

        let card = document.createElement("div");
        $(card).addClass("card");
        article.appendChild(card);

        let audios = document.createElement("output");
        // $(audios).addClass("music__audios d-none");
        $(audios).addClass("music__audios");
        article.appendChild(audios);



        // Initial Audio
        // Séparation des urls
        let urls = [];

        $(this.musics).each(function() {
            urls.push(this.url);
        })

        // Constitution de la data
        let data = {
            "urls": urls,
            "fadeTime": GLOBALS.MUSIC_FADE_TIME,
            "isLoop": this.isLoop,
            "isShuffle": this.isShuffled,
            "volume": $("#MusicVolume").val() / 100
        }

        // Création de la CleanLoop
        let cleanLoop = new CleanLoop(data);
        cleanLoop.exclusivityId = "Ceciestuntest";
        let initialAudio = cleanLoop.audio;

        $(initialAudio)
            .prop("preload", "metadata")
            // .prop("controls", true)
            .attr("data-volume", "musique");
        audios.appendChild(initialAudio);


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
        let toggleCheckbox = document.createElement("input");
        $(toggleCheckbox)
            .addClass("music__toggle btn-check")
            .prop("id", `togglePlaylist-${this.id_playlist}`)
            .prop("name", "activePlaylist")
            .prop("type", "checkbox")
            .val(this.id_playlist);
        songControls.appendChild(toggleCheckbox);
            
        let togglePlayLabel = document.createElement("label");
        $(togglePlayLabel)
            .addClass("btn btn-success mb-1")
            .prop("for", `togglePlaylist-${this.id_playlist}`);
        songControls.appendChild(togglePlayLabel);

        let togglePlayIcon = document.createElement("i");
        $(togglePlayIcon).addClass("fa-solid fa-play");
        togglePlayLabel.appendChild(togglePlayIcon);
            
        let togglePauseLabel = document.createElement("label");
        $(togglePauseLabel)
            .addClass("btn btn-danger mb-1")
            .prop("for", `togglePlaylist-${this.id_playlist}`);
        songControls.appendChild(togglePauseLabel);
        
        let togglePauseIcon = document.createElement("i");
        $(togglePauseIcon).addClass("fa-solid fa-pause");
        togglePauseLabel.appendChild(togglePauseIcon);
        


        // SHUFFLE BUTTON
        let shuffleButton = document.createElement("input");
        $(shuffleButton)
            .prop("type", "checkbox")
            .prop("id", `playlist_${this.id_playlist}`)
            .prop("checked", this.isShuffled)
            .addClass("btn-check");
        songControls.appendChild(shuffleButton);

        let shuffleLabel = document.createElement("label");
        $(shuffleLabel)
            .addClass("btn btn-outline-primary")
            .prop("for", `playlist_${this.id_playlist}`);
        songControls.appendChild(shuffleLabel);

        let shuffleIcon = document.createElement("i");
        $(shuffleIcon).addClass("fa-solid fa-shuffle");
        shuffleLabel.appendChild(shuffleIcon);

        // CURRENT SONG
        let currentSong = document.createElement("div");
        $(currentSong).addClass("w-100")
        categoryBody.appendChild(currentSong);

        let songTitle = document.createElement("h5");
        $(songTitle).addClass("music__songTitle");
        currentSong.appendChild(songTitle);

        let timeContainer = document.createElement("div");
        currentSong.appendChild(timeContainer)

        let progressBarContainer = document.createElement("div");
        $(progressBarContainer).addClass("progress").prop("role", "progressbar");
        timeContainer.appendChild(progressBarContainer);

        let progressbar = document.createElement("div");
        $(progressbar)
            .addClass("progress-bar progress-bar-striped bg-danger progress-bar-animated")
            .css("width", "0%");
        progressBarContainer.appendChild(progressbar);


        let timestamps = document.createElement("div");
        $(timestamps).addClass("timestamp d-flex justify-content-between");
        timeContainer.appendChild(timestamps);

        let timestampCurrent = document.createElement("p");
        $(timestampCurrent).addClass("timestamp__current m-0");
        timestamps.appendChild(timestampCurrent);

        let timestampEnd = document.createElement("p");
        $(timestampEnd).addClass("timestamp__end m-0");
        timestamps.appendChild(timestampEnd);



        // EVENTS
        // Toggle
        $(toggleCheckbox).on("change", function(e) {
            // Si la checkbox est maintenant coché (Jouer la musique)
            if(this.checked) {
                let name = $(this).prop("name");
                let inputs = $(`input[name='${name}']`).not(this);

                $(inputs).each(function() {
                    if(this.checked) {
                        this.checked = false;
                        $(this).trigger("change");
                    }
                });

                // that.VisualPlay();
                that.PlayAudios();
            }
            // Si la checkbox est maintenant décochée (Mettre la musique en pause)
            else {
                // that.VisualPause();

                // If the pause is triggered by clicking on the pause button directly
                // (Audios will be automatically paused if it's a transition from a playlist to another)
                if(!e.isTrigger) {
                    that.PauseAudios();
                }
            }
        });


        // Shuffle
        $(shuffleButton).on("change", function() {
            that.isShuffled = this.checked;

            $(audios).children("audio").each(function() {
                $(this).data("cleanloop").isShuffle = that.isShuffled;
            })

            if(that.isShuffled) {
                $(this).addClass("btn-info").removeClass("btn-outline-info");
            }
            else {
                $(this).addClass("btn-outline-info").removeClass("btn-info");
            }
        });



        // When the audio metadata is loaded, display the informations about the current music
        $(cleanLoop.audio).on("loadedmetadata", function() {
            let thisCleanLoop = $(this).data("cleanloop");

            let currentMusic = thisCleanLoop.playlist[0];
            let name = null;

            // Find a music using the current url
            $(that.musics).each(function() {
                if(this.url === currentMusic) {
                    name = this.name;
                    return false;
                }
            });

            // If no name was found, use "Musique sans nom"
            if(name === null) {
                name = "Musique sans nom";
            }
            
            $(songTitle).text(name);
            $(timestampCurrent).text(FUNC.SecondsToMinutes(0));
            $(timestampEnd).text(FUNC.SecondsToMinutes(thisCleanLoop.audio.duration));
        })





        $(cleanLoop.audio).on("timeupdate", function() {

            let thisCleanLoop = $(this).data("cleanloop");

            if(thisCleanLoop.clone !== null) {
                return;
            }

            // Avancé du timestamp actuel
            $(timestampCurrent).text(FUNC.SecondsToMinutes(thisCleanLoop.audio.currentTime));

            // Event de remplissage de la barre de progrès
            let percent = ( thisCleanLoop.audio.currentTime / thisCleanLoop.audio.duration ) * 100;
            $(progressbar).css("width", `${percent}%`);
        })
    }





    // VisualPlay() {
    //     let button = $(this.element).find(".music__toggle");
    //     let label = $(button).siblings(`label[for='${$(button).prop("id")}']`);
    //     let icon = $(label).children("i");

    //     $(label).addClass("btn-danger").removeClass("btn-success");
    //     $(icon).addClass("fa-pause").removeClass("fa-play");
    // }




    PlayAudios() {
        $(this.element).find(".music__audios").children("audio").each(function() {
            this.play();
        });
    }





    // VisualPause() {
    //     let button = $(this.element).find(".music__toggle");
    //     let label = $(button).siblings(`label[for='${$(button).prop("id")}']`);
    //     let icon = $(label).children("i");

    //     $(label).addClass("btn-success").removeClass("btn-danger");
    //     $(icon).addClass("fa-play").removeClass("fa-pause");
    // }





    PauseAudios() {
        $(this.element).find(".music__audios").children("audio").each(function() {
            this.pause();
        });
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