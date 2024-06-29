export class CleanLoop {
    constructor(args = {}) {

        // AUDIO
        let audioIsValid = args.audio !== undefined && args.audio.nodeType !== undefined && args.audio.tagName === "AUDIO";
        audioIsValid ? 
            this.audio = args.audio : 
            this.audio = document.createElement("audio");

        // VOLUME
        let volumeIsValid = args.volume !== undefined && typeof args.volume === "number";
        volumeIsValid ? 
            this.volume = args.volume : 
            this.volume = this.audio.volume;        

        // URLS
        let urlsIsValid = args.urls !== undefined && Array.isArray(args.urls);
        urlsIsValid ? 
            this.urls = args.urls : 
            this.urls = [];

        // PLAYLIST
        let playlistIsValid = args.playlist !== undefined && Array.isArray(args.playlist);
        playlistIsValid ? 
            this.playlist = args.playlist : 
            this.playlist = [];

        // IS LOOP
        let boolLoopIsValid = args.isLoop !== undefined && typeof args.isLoop === "boolean";
        boolLoopIsValid ? 
            this.isLoop = args.isLoop : 
            this.isLoop = true;

        // IS SHUFFLE
        let boolShuffleIsValid = args.isShuffle !== undefined && typeof args.isShuffle === "boolean";
        boolShuffleIsValid ? 
            this.isShuffle = args.isShuffle : 
            this.isShuffle = true;
            
        // FADE TIME
        let fadeTimeIsValid = args.fadeTime !== undefined && typeof Number.isInteger(args.fadeTime);
        fadeTimeIsValid ? 
            this.fadeTime = args.fadeTime : 
            this.fadeTime = 1000;

        // Simpler init
        this.clone = null;
        this.#InitPlaylist();
        this.#AddEvents();
        $(this.audio).data("cleanloop", this);
    }

    #volumeTarget = 0;

    /**
     * @param {number} value
     */
    set volume(value) {
        this.#volumeTarget = value;
        this.audio.volume = value;
    }

    get volume() {
        return this.#volumeTarget;
    }






    #AddEvents() {
        let that = this;

        $(this.audio).on("timeupdate", function(event) {
            that.#OnTimeupdate();
        });
        
        $(this.audio).on("pause", function() {
            // Prevent trigger on end of audio
            if(that.audio.currentTime === that.audio.duration) {
                that.#OnEnd();
                return;
            }
            that.#OnPause();
        });

        $(this.audio).on("play", function() {
            that.#OnPlay();

            // Prevent trigger on initial play
            if(that.audio.currentTime === 0) {
                that.#OnStart();
                return;
            }

            that.#OnResume();
        });
    }
    





    #InitPlaylist() {
        if(this.playlist.length > 0) {
            return;
        }

        if(this.isShuffle) {
            this.Shuffle();
        }
        else {
            this.ReLoop();
        }
        
        $(this.audio).prop("src", this.playlist[0])   
    }





    #OnTimeupdate() {
        if(isNaN(this.audio.duration)) {
            return;
        }

        if(this.audio.paused) {
            return;
        }
    
        let buffer = this.fadeTime / 1000;

        if(this.audio.currentTime < this.audio.duration - buffer)
        {
            return;
        }

        if(this.clone !== null) {
            return;
        }

        this.#Next();
    }





    #OnPause() {
        if(this.clone === null) {
            return;
        }

        $(this.audio).stop();

        this.clone.audio.pause();
        $(this.clone.audio).stop();
    }





    #OnPlay() {
        let event = new Event("cl_play");
        this.audio.dispatchEvent(event);


        if(!this.IsExclusive()) {
            return;
        }

        let mustTransition = false;
        let thatCleanLoop = this;


        let toStop = [];

        $("audio").each(function() {
            // Si l'audio itéré est l'audio lié à la CleanLoop
            if(this === thatCleanLoop.audio) {
                return true;
            }

            // Si l'audio itéré est le clone de cette CleanLoop
            if(this === thatCleanLoop.clone?.audio) {
                return true;
            }

            // Si l'audio itéré est en pause
            if(this.paused) {
                return true;
            }

            // Si l'audio itéré n'a pas de CleanLoop liée
            let thisCleanLoop = $(this).data("cleanloop");
            if(thisCleanLoop === undefined) {
                return true;
            }

            // Si la CleanLoop itéré n'est pas exclusive
            if(!thisCleanLoop.IsExclusive()) {
                return true;
            }

            // Si la CleanLoop itéré et la CleanLoop actuelle n'ont pas le même ID d'exclusivité
            if(thisCleanLoop.exclusivityId !== thatCleanLoop.exclusivityId) {
                return true;
            }




            mustTransition = true;
            toStop.push(this);
        });

        if(mustTransition) {
            let targetVolume = this.volume;
            this.audio.volume = 0;

            $(this.audio).animate({volume: targetVolume}, this.fadeTime);

            $(toStop).each(function() {
                // In case the fade time is greater than the duration of the audio
                let fadeTime = (this.duration - this.currentTime) * 1000;

                if(fadeTime > thatCleanLoop.fadeTime) {
                    fadeTime = thatCleanLoop.fadeTime;
                }

                $(this).animate({volume: 0}, fadeTime, function()
                {
                    this.pause();
                })
            })
        }
    }





    #OnStart() {
        let event = new Event("cl_start");
        this.audio.dispatchEvent(event);
    }





    #OnEnd() {
        let event = new Event("cl_end");
        this.audio.dispatchEvent(event);
    }





    #OnResume() {
        if(this.clone === null) {
            return;
        }

        if($(this.audio).is(":animated")) {
            return;
        }

        // Dans le cas où l'utilisateur met pause pendant la transition puis relance
        let fadeTime = (this.audio.duration - this.audio.currentTime) * 1000;
        this.#IntroduceClone(fadeTime);
        this.#GentlyGo(fadeTime);
    }
    




    #GentlyGo(fadeTime) {
        $(this.audio).animate({volume: 0}, fadeTime, function()
        {
            this.remove();
        })
    }





    #IntroduceClone(fadeTime) {
        // if(this.targetVolume === null) {
        //     this.targetVolume = this.audio.volume;
        // }

        this.clone.audio.play();
        $(this.clone.audio).animate({volume: this.volume}, fadeTime)
    }





    #Next() {
        if(this.urls.length === 0) {
            return;
        }

        let event = new Event("cl_transition");
        this.audio.dispatchEvent(event);


        let currentUrl = this.playlist[0];

        // Suppression du premier élément
        this.playlist.shift();
        
        if(this.playlist.length === 0) {
            if(!this.isLoop) {
                return;
            }

            if(this.isShuffle) {
                this.Shuffle(currentUrl);
            }
            else {
                this.ReLoop();
            }
            
        }

        // In case the fade time is greater than the duration of the audio
        let fadeTime = (this.audio.duration - this.audio.currentTime) * 1000;

        if(fadeTime > this.fadeTime) {
            fadeTime = this.fadeTime;
        }

        // Clone the current audio to prepare the seemless loop
        this.#Clone();
        
        // Play the new audio
        this.#IntroduceClone(fadeTime);

        // Pause current audio
        this.#GentlyGo(fadeTime);
    }





    #Clone() {
        let clonedAudio = $(this.audio).clone(true)[0];
        let nextUrl = this.playlist[0];

        $(clonedAudio)
            .prop("volume", 0)
            .prop("src", nextUrl);
        this.audio.parentNode.appendChild(clonedAudio);

        let cloneData = {
            "audio": clonedAudio,
            "urls": [...this.urls],
            "playlist": [...this.playlist],
            "isLoop": this.isLoop,
            "isShuffle": this.isShuffle,
            "fadeTime": this.fadeTime
        }

        this.clone = new CleanLoop(cloneData)

        let event = new Event("cl_clone")
        this.audio.dispatchEvent(event);
    }





    IsExclusive() {
        return $(this.audio).prop("cl-exclusivity-id") !== undefined;
    }



    get exclusivityId() {
        if(!this.IsExclusive()) {
            return undefined;
        }

        return $(this.audio).prop("cl-exclusivity-id");
    }



    set exclusivityId(id) {
        $(this.audio).prop("cl-exclusivity-id", id);
    }





    Next() {
        this.#Next();
    }




    
    Shuffle(prevent = null) {
        this.ReLoop();

        // Ne pas aller plus loin s'il n'y a qu'un son à jouer en tout
        if(this.urls.length === 1) {
            return;
        }

        let currentIndex = this.playlist.length;

        while(currentIndex != 0) {
            let randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;

            [this.playlist[currentIndex], this.playlist[randomIndex]] = [this.playlist[randomIndex], this.playlist[currentIndex]];
        }

        // S'il faut éviter qu'une certaine URL soit la première de liste
        if(prevent === null) {
            return;
        }

        // Et que cette URL est bel et bien première de liste
        if(this.playlist[0] !== prevent) {
            return;
        }

        // Déplacer l'url de la première à la deuxième place
        this.playlist.shift();
        this.playlist.splice(1, 0, prevent);
    }





    ReLoop() {
        this.playlist = [...this.urls];
    }
}




// let audio = $("audio")[0];
// let displayer = $("p")[0];
// let sounds = [
//     "assets/upload/audios/AMB_Drustvar_Crickets_Loop_FlavorKit_01_7T7GVrPdAOJghCy.ogg",
//     "assets/upload/audios/FX_PA_Fire_Small_Loop_h0h2ICr1wVvi6sT.ogg",
//     "assets/upload/audios/GilneasStageCoach_WheelsOS_01_k4ETt7vQKtHL1Zo.ogg",
//     "assets/upload/audios/fx_fw_wolfhowl_dry_07_Ai1wVIs9r58dmC1.ogg",
// ];

// let names = [
//     "Criquets",
//     "Feu",
//     "Chariot",
//     "Loup"
// ]

// let data = {
//     "audio": audio,
//     "displayer": displayer,
//     "urls": sounds,
//     "names": names
// };

// new CleanLoop(data);