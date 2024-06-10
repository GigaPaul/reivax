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





    CreateCard() {
        let that = this;

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

        // Open edit form
        $(editBtn).on("click", function() {
            that.LoadForm();
        })
        //

        btnContainer.appendChild(editBtn);

        $(loadBtn).on("click", function() {
            window.location.href = `aventure.php?id_aventure=${that.id_aventure}`;
        })

        return article;
    }


    async LoadForm() {
        let form = $("#editAdventureForm")[0];

        if(form.length === 0) {
            return;
        }


        await this.Fetch(this.id);

        $(form).modal("show");

        let idInput = $(form).find("input[name='id_aventure']")[0];
        $(idInput).val(this.id_aventure);

        let nameInput = $(form).find("input[name='name']")[0];
        $(nameInput).val(this.name);

        let descInput = $(form).find("textarea[name='description']")[0];
        $(descInput).val(this.description);




        // LANDSCAPES
        // If there are no landscapes
        if(this.landscapes.length === 0) {
            let error = "Cette aventure ne contient encore aucun décor. Faites une recherche pour en rajouter.";
            FUNC.CreateError(error, $("#formOutputLandscapes")[0])
        }
        // If there are landscapes
        else {
            $(this.landscapes).each(function() {
                // let thisLandscape = new Landscape(this);
                this.CreateFormCard($("#formOutputLandscapes")[0]);
            })
        }





        // AMBIENCES
        // If there are no ambiences
        if(this.ambiences.length === 0) {
            let error = "Cette aventure ne contient encore aucune ambiance. Faites une recherche pour en rajouter.";
            FUNC.CreateError(error, $("#formOutputAmbiences")[0])
        }
        // If there are ambiences
        else {
            $(this.ambiences).each(function() {
                this.CreateFormCard($("#formOutputAmbiences")[0]);
            });

        }





        // SOUNDS
        // If there are no sounds
        if(this.soundFamilies.length === 0) {
            let error = "Cette aventure ne contient encore aucun son. Faites une recherche pour en rajouter.";
            FUNC.CreateError(error, $("#formOutputSounds")[0])
        }
        // If there are sounds
        else {
            $(this.soundFamilies).each(function() {
                this.CreateFormCard($("#formOutputSounds")[0]);
            });

        }





        // MUSICS
        // If there are no musics
        if(this.playlists.length === 0) {
            let error = "Cette aventure ne contient encore aucune musique. Faites une recherche pour en rajouter.";
            FUNC.CreateError(error, $("#formOutputMusics")[0])
        }
        // If there are musics
        else {
            $(this.playlists).each(function() {

                this.CreateFormCard($("#formOutputMusics")[0]);
            });
        }
    }
}