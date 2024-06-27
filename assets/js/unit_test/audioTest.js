export class CleanLoop {
    constructor(args = {}) {
        // AUDIO
        let audioIsValid = args.audio !== undefined && args.audio.nodeType !== undefined && args.audio.tagName === "AUDIO";
        audioIsValid ? 
            this.audio = args.audio : 
            this.audio = document.createElement("audio");

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
        this.targetVolume = null;
        this.#InitAudio();
        this.#AddEvents();
    }





    #AddEvents() {
        let that = this;

        $(this.audio).on("timeupdate", function() {
            that.#OnTimeupdate();
        });
        
        $(this.audio).on("pause", function() {
            // Prevent trigger on end of audio
            if(this.currentTime === this.duration) {
                return;
            }
            that.#OnPause();
        });

        $(this.audio).on("play", function() {
            // Prevent trigger on initial play
            if(this.currentTime === 0) {
                return;
            }

            that.#OnResume();
        });
    }
    





    #InitAudio() {
        if(this.playlist.length > 0) {
            return;
        }

        let initialUrl = this.audio.attributes.getNamedItem("src")?.value;

        // S'il y a quelque chose de renseigné dans l'attribut "src" de l'audio
        if(initialUrl !== undefined) {
            // Si le src de l'audio est inclus dans la liste d'urls
            if(this.urls.includes(initialUrl)) {
                let index = this.urls.indexOf(initialUrl);

                // Si le src n'est pas le premier élément des urls
                if(index > 0) {
                    this.urls.splice(index, 1);
                    this.urls.unshift(initialUrl);
                }
            }
            // Si le src de l'audio n'est pas encore inclus dans la liste d'url
            else {
                this.urls.unshift(initialUrl);
            }
        }

        if(this.isShuffle) {
            this.Shuffle();
        }
        else {
            this.ReLoop();
        }
        

        // Make sure the initial URL is the first song to play of the initial playlist
        if(initialUrl !== this.playlist[0]) {
            if(initialUrl !== undefined) {
                let index = this.playlist.indexOf(initialUrl);
                this.playlist.splice(index, 1);
                this.playlist.unshift(initialUrl);            
            }
                
            $(this.audio).prop("src", this.playlist[0])    
        }
    }





    #OnTimeupdate() {
        if(isNaN(this.audio.duration)) {
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

        this.clone.pause();
        $(this.clone).stop();
    }





    #OnResume() {
        if(this.clone === null) {
            return;
        }

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
        this.targetVolume = this.audio.volume;
        this.clone.play();
        $(this.clone).animate({volume: this.targetVolume}, fadeTime)
    }





    #Next() {
        if(this.urls.length === 0) {
            return;
        }

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
        this.clone = $(this.audio).clone()[0];
        let nextUrl = this.playlist[0];

        $(this.clone)
            .prop("volume", 0)
            .prop("src", nextUrl);
        this.audio.parentNode.appendChild(this.clone);

        let cloneData = {
            "audio": this.clone,
            "urls": this.urls,
            "playlist": this.playlist,
            "isLoop": this.isLoop,
            "isShuffle": this.isShuffle,
            "fadeTime": this.fadeTime
        }

        return new CleanLoop(cloneData);
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