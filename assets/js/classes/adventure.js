import { Ambience } from "../modules/ambience.js";
import { Playlist } from "../modules/music.js";
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


    
    RemoveLandscape(landscape) {
        let index = this.GetLandscapeIndex(landscape);

        if(index === -1) {
            return;
        }

        this.landscapes.splice(index, 1);
    }



    AddLandscape(landscape) {
        let isUsed = this.IsUsingLandscape(landscape)

        if(isUsed) {
            return;
        }

        this.landscapes.push(landscape);
    }



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



    Push() {
        let send = {
            type: "push",
            for: "aventure",
            aventure: this
        };
    
        $.post("controller.php", send);
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