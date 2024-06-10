import { Ambience } from "./ambience.js";
import { Playlist } from "./music.js";
import { Landscape } from "./landscape.js";
import { SoundFamily } from "./sound.js";
import * as FUNC from './../globals/func.js';





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
        this.description = obj.description;

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
        $(article).on("click", function() {
            that.LoadForm();
        })
        //

        btnContainer.appendChild(editBtn);

        $(loadBtn).on("click", function() {
            window.location.href = `index.php?id_aventure=${that.id_aventure}`;
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

        let nameInput = $(form).find("input[name='name']")[0];
        $(nameInput).val(this.name);

        let descInput = $(form).find("textarea[name='description']")[0];
        $(descInput).val(this.description);





        // LANDSCAPES
        // If there are no landscapes
        if(this.landscapes.length === 0) {
            let div = document.createElement("div");

            let text = document.createElement("p");
            $(text)
                .addClass("text-center user-select-none opacity-25 m-0")
                .text("Cette aventure ne contient encore aucun décor. Faites une recherche pour en rajouter.");
            div.appendChild(text);

            $("#formOutputLandscapes")[0].appendChild(div);
        }
        // If there are landscapes
        else {
            let section = document.createElement("section");
            $(section).addClass("row");
            $("#formOutputLandscapes")[0].appendChild(section);

            $(this.landscapes).each(function() {
                let article = document.createElement("article");
                $(article).addClass("col-3 mb-2 fade show adventureForm__landscape");

                section.appendChild(article);


                let checkbox = document.createElement("input");
                $(checkbox)
                    .prop("type", "checkbox")
                    .addClass("d-none")
                    .prop("checked", true)
                    .prop("name", "landscapes[]")
                    .val(this.id_landscape);
                article.appendChild(checkbox);

                $(article).on("click", function() {
                    $(checkbox).prop("checked", !$(checkbox).prop("checked"));
                })


                let card = document.createElement("div");
                $(card).addClass("card activable adventureForm__card active")
                article.appendChild(card);

                let frame = document.createElement("div");
                $(frame)
                    .addClass("overflow-hidden")
                    .css("height", "135px");
                card.appendChild(frame);

                // Video
                if(FUNC.IsVideo(this.url)) {
                    let video = document.createElement("video");
                    $(video)
                        .addClass("card-img-top")
                        .prop("disablepictureinpicture", true)
                        .prop("src", this.url);
                    frame.appendChild(video);
                }
                // Image
                else {
                    let img = document.createElement("img");
                    $(img)
                        .prop("src", this.url)
                        .addClass("card-img-top");
                    frame.appendChild(img);
                }

                let body = document.createElement("div");
                $(body).addClass("card-body");
                card.appendChild(body);

                let title = document.createElement("p");
                $(title).addClass("m-0 text-truncate");
                $(title).text(this.name);
                body.appendChild(title);
            });
        }





        // AMBIENCES
        // If there are no ambiences
        if(this.ambiences.length === 0) {
            let div = document.createElement("div");

            let text = document.createElement("p");
            $(text)
                .addClass("text-center user-select-none opacity-25 m-0")
                .text("Cette aventure ne contient encore aucune ambiance. Faites une recherche pour en rajouter.");
            div.appendChild(text);

            $("#formOutputAmbiences")[0].appendChild(div);
        }
        // If there are ambiences
        else {
            let section = document.createElement("section");
            $(section).addClass("row");
            $("#formOutputAmbiences")[0].appendChild(section);
            
            $(this.ambiences).each(function() {

                let article = document.createElement("article");
                $(article).addClass("col-2 mb-2");
                section.appendChild(article);

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
            });

        }





        // SOUNDS
        // If there are no sounds
        if(this.soundFamilies.length === 0) {
            let div = document.createElement("div");

            let text = document.createElement("p");
            $(text)
                .addClass("text-center user-select-none opacity-25 m-0")
                .text("Cette aventure ne contient encore aucun son. Faites une recherche pour en rajouter.");
            div.appendChild(text);

            $("#formOutputSounds")[0].appendChild(div);
        }
        // If there are sounds
        else {
            let section = document.createElement("section");
            $(section).addClass("row");
            $("#formOutputSounds")[0].appendChild(section);
            
            $(this.soundFamilies).each(function() {
                let article = document.createElement("article");
                $(article).addClass("col-2 mb-2");
                section.appendChild(article);

                let checkbox = document.createElement("input");
                $(checkbox)
                    .prop("type", "checkbox")
                    .prop("name", "soundFamilies[]")
                    .prop("value", this.id_soundfamily)
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
            });

        }





        // MUSICS
        // If there are no musics
        if(this.playlists.length === 0) {
            let div = document.createElement("div");

            let text = document.createElement("p");
            $(text)
                .addClass("text-center user-select-none opacity-25 m-0")
                .text("Cette aventure ne contient encore aucune musique. Faites une recherche pour en rajouter.");
            div.appendChild(text);

            $("#formOutputMusics")[0].appendChild(div);
        }
        // If there are musics
        else {
            let section = document.createElement("section");
            $(section).addClass("row");
            $("#formOutputMusics")[0].appendChild(section);
            
            $(this.playlists).each(function() {
                let article = document.createElement("article");
                $(article).addClass("")
            });
        }
        console.log(this);
    }
}