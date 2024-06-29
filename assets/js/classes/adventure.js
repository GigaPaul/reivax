import { Ambience } from "../modules/ambience.js";
import { Playlist } from "../modules/playlist.js";
import { Landscape } from "../modules/landscape.js";
import { SoundFamily } from "../modules/sound.js";



import * as FUNC from '../globals/func.js';





export class Adventure {

    constructor(obj = null) {

        this.ambiences = [];
        this.landscapes = [];
        this.playlists = [];
        this.soundFamilies = [];

        if(obj !== null) {
            this.Copy(obj);
        }
        else {
            this.id_aventure = null;
            this.name = "";
            this.background = "";
            this.description = "";
        }
    }

    Copy(obj) {
        this.id_aventure = obj.id_aventure;
        this.name = obj.name;
        this.background = obj.background;
        this.description = obj.description;

        let that = this;

        this.ambiences = [];
        $(obj.ambiences).each(function() {
            let ambience = new Ambience(this);
            that.ambiences.push(ambience);
        });

        this.landscapes = [];
        $(obj.landscapes).each(function() {
            let landscape = new Landscape(this);
            that.landscapes.push(landscape);
        });

        this.playlists = [];
        $(obj.playlists).each(function() {
            let playlist = new Playlist(this);
            that.playlists.push(playlist);
        });

        this.soundFamilies = [];
        $(obj.soundfamilies).each(function() {
            let family = new SoundFamily(this);
            that.soundFamilies.push(family);
        });
    }


    
    // =========== GET ===========
    GetLandscapeIndex(landscape) {
        let index = -1;

        for(let i = 0; i < this.landscapes.length; i++) {
            let thisLandscape = this.landscapes[i]
            if(thisLandscape.id_landscape === landscape.id_landscape) {
                index = i;
                break;
            }
        }

        return index;
    }





    GetAmbienceIndex(ambience) {
        let index = -1;

        for(let i = 0; i < this.ambiences.length; i++) {
            let thisAmbience = this.ambiences[i]
            if(thisAmbience.id_ambience === ambience.id_ambience) {
                index = i;
                break;
            }
        }

        return index;
    }





    GetSoundIndex(sound) {
        let index = -1;

        for(let i = 0; i < this.soundFamilies.length; i++) {
            let thisSoundFamily = this.soundFamilies[i]
            if(thisSoundFamily.id_soundFamily === sound.id_soundFamily) {
                index = i;
                break;
            }
        }

        return index;
    }





    GetMusicIndex(playlist) {
        let index = -1;

        for(let i = 0; i < this.playlists.length; i++) {
            let thisPlaylist = this.playlists[i]
            if(thisPlaylist.id_playlist === playlist.id_playlist) {
                index = i;
                break;
            }
        }

        return index;
    }










    // =========== BOOL ===========
    IsUsingLandscape(landscape) {
        let isUsed = false;

        for(let i = 0; i < this.landscapes.length; i++) {
            let thisLandscape = this.landscapes[i]
            if(thisLandscape.id_landscape === landscape.id_landscape) {
                isUsed = true;
                break;
            }
        }

        return isUsed;
    }





    IsUsingAmbience(ambience) {
        let isUsed = false;

        for(let i = 0; i < this.ambiences.length; i++) {
            let thisAmbience = this.ambiences[i]
            if(thisAmbience.id_ambience === ambience.id_ambience) {
                isUsed = true;
                break;
            }
        }

        return isUsed;
    }





    IsUsingSound(sound) {
        let isUsed = false;

        for(let i = 0; i < this.soundFamilies.length; i++) {
            let thisSoundFamily = this.soundFamilies[i]
            if(thisSoundFamily.id_soundFamily === sound.id_soundFamily) {
                isUsed = true;
                break;
            }
        }

        return isUsed;
    }





    IsUsingMusic(playlist) {
        let isUsed = false;

        for(let i = 0; i < this.playlists.length; i++) {
            let thisPlaylist = this.playlists[i]
            if(thisPlaylist.id_playlist === playlist.id_playlist) {
                isUsed = true;
                break;
            }
        }

        return isUsed;
    }










    // =========== ADD ===========
    AddLandscape(landscape) {
        let isUsed = this.IsUsingLandscape(landscape)

        if(isUsed) {
            return;
        }

        this.landscapes.push(landscape);
    }





    AddAmbience(ambience) {
        let isUsed = this.IsUsingAmbience(ambience)

        if(isUsed) {
            return;
        }

        this.ambiences.push(ambience);
    }





    AddSound(sound) {
        let isUsed = this.IsUsingSound(sound)

        if(isUsed) {
            return;
        }

        this.soundFamilies.push(sound);
    }





    AddMusic(playlist) {
        let isUsed = this.IsUsingMusic(playlist)

        if(isUsed) {
            return;
        }

        this.playlists.push(playlist);
    }










    // =========== REMOVE ===========
    RemoveLandscape(landscape) {
        let index = this.GetLandscapeIndex(landscape);

        if(index === -1) {
            return;
        }

        this.landscapes.splice(index, 1);
    }





    RemoveAmbience(ambience) {
        let index = this.GetAmbienceIndex(ambience);

        if(index === -1) {
            return;
        }

        this.ambiences.splice(index, 1);
    }





    RemoveSound(sound) {
        let index = this.GetSoundIndex(sound);

        if(index === -1) {
            return;
        }

        this.soundFamilies.splice(index, 1);
    }





    RemoveMusic(playlist) {
        let index = this.GetMusicIndex(playlist);

        if(index === -1) {
            return;
        }

        this.playlists.splice(index, 1);
    }
    









    // =========== CONTROLLER ===========
    async Fetch(id_aventure = this.id_aventure) {
        if(id_aventure === undefined) {
            console.log("La récupération d'aventure a échoué, aucune ID n'était présente.")
            return;
        }

        if(id_aventure !== this.id_aventure) {
            this.id_aventure = id_aventure;
        }

        let send = {
            type: "load",
            for: "aventure",
            id_aventure: this.id_aventure
        };
    
        let that = this;
        await $.post("controller.php", send, function(data) {
            let queriedAdventure = jQuery.parseJSON(data);
            that.Copy(queriedAdventure);
        });
    }



    async Push() {
        let send = {
            type: "update",
            for: "adventure",
            adventure: this
        };

        if(this.id_aventure === null) {
            send.type = "insert";
        }

        let that = this;

        await $.post("controller.php", send, function(data) {
            try {
                if (send.type === "insert") {
                    that.id_aventure = data;
                }

            } catch(error) {
                console.log("Erreur détectée");
                console.log(data);
            }
        })
    }










    // =========== ADVENTURE PAGE ===========
    LoadAmbiences(parent) {
        $(this.ambiences).each(function() {
            // let ambience = new Ambience(this);
            this.Load();
            parent.appendChild(this.element);
        });
    }




    LoadLandscapes(parent) {
        $(this.landscapes).each(function() {
            // let landscape = new Landscape(this);
            this.Load();
            parent.appendChild(this.element);
        });
    }




    LoadPlaylists(parent) {
        $(this.playlists).each(function() {
            // let playlist = new Playlist(this);
            this.Load();
            parent.appendChild(this.element);
        });
    }




    LoadSounds(parent) {
        $(this.soundFamilies).each(function() {
            // let soundFamily = new SoundFamily(this);
            this.Load();
            parent.appendChild(this.element);
        });
    }
}