import { Ambience } from "./ambience.js";
import { Playlist } from "./music.js";
import { Landscape } from "./landscape.js";
import { SoundFamily } from "./sound.js";





export class Adventure {
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




    Copy(obj) {
        this.id_aventure = obj.id_aventure;
        this.name = obj.name;
        this.background = obj.background;

        this.ambiences = obj.ambiences;
        this.landscapes = obj.landscapes;
        this.playlists = obj.playlists;
        this.soundFamilies = obj.soundfamilies;
    }




    LoadAmbiences(parent) {
        $(this.ambiences).each(function() {
            let ambience = new Ambience(this);
            ambience.Load();
            parent.appendChild(ambience.element);
        });
    }




    LoadLandscapes(parent) {
        $(this.landscapes).each(function() {
            let landscape = new Landscape(this);
            landscape.Load();
            parent.appendChild(landscape.element);
        });
    }




    LoadPlaylists(parent) {
        $(this.playlists).each(function() {
            let playlist = new Playlist(this);
            playlist.Load();
            parent.appendChild(playlist.element);
        });
    }




    LoadSounds(parent) {
        $(this.soundFamilies).each(function() {
            let soundFamily = new SoundFamily(this);
            soundFamily.Load();
            parent.appendChild(soundFamily.element);
        });
    }





    CreateCard() {
        let article = document.createElement("article");
        $(article).addClass("col-4 mb-3");
    
        let card = document.createElement("div");
        $(card).addClass("card");
        article.appendChild(card);
    
        let frame = document.createElement("div");
        $(frame)
            .css("height", "130px")
            .css("background-image", `url(${this.background})`)
            .css("background-size", "cover")
            .css("background-position", "center")
            .addClass("card-img-top");
        card.appendChild(frame);
    
        let body = document.createElement("div");
        $(body).addClass("card-body");
        card.appendChild(body);
    
        let title = document.createElement("h5");
        $(title).addClass("card-title");
        $(title).text(this.name);
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
        btnContainer.appendChild(editBtn);

        let that = this;

        $(loadBtn).on("click", function() {
            window.location.href = `index.php?id_aventure=${that.id_aventure}`;
        })

        return article;
    }
}