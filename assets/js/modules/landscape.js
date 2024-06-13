import * as FUNC from "../globals/func.js";
import { LANDSCAPE_OUTPUT } from "./../globals/elements.js";





export class Landscape {

    constructor(obj = null) {
        if(obj !== null) {
            this.Copy(obj);
        }
        else {
            this.id_landscape = null;
            this.name = "";
            this.url = "";
        }
        
        this.element;
    }





    Copy(obj) {
        this.id_landscape = obj.id_landscape;
        this.name = obj.name;
        this.url = obj.url;
    }





    Load() {
        if(!FUNC.IsImage(this.url) && !FUNC.IsVideo(this.url)) {
            return;
        }

        let container = document.createElement("div");
        $(container).addClass("col-2 mb-3");
        this.element = container;


        let button = document.createElement("button");
        container.appendChild(button);
        $(button).addClass("background__button");
        $(button).data("url", this.url);

        // Image
        if(FUNC.IsImage(this.url)) {
            $(button).data("type", "image");
            $(button).css("background-image", `url(${this.url})`)
        }
        // Video
        else {
            $(button).data("type", "video");

            let video = document.createElement("video");
            button.appendChild(video);
            $(video)
                .prop("muted", true)
                .prop("loop", true)
                .prop("disablePictureInPicture", true);

            let source = document.createElement("source");
            video.appendChild(source);
            $(source).prop("src", this.url);
            $(source).prop("type", "video/mp4");
        }

        $(button).on("click", ChangeLandscape);
    }





    CreateFormCard(isSelected = false) {
        let article = document.createElement("article");
        $(article).addClass("col-3 mb-2 fade show adventureForm__landscape");


        let checkbox = document.createElement("input");
        $(checkbox)
            .prop("type", "checkbox")
            .addClass("d-none")
            .prop("name", "landscapes[]")
            .prop("checked", isSelected)
            .val(this.id_landscape);
        article.appendChild(checkbox);

        $(article).on("click", function() {
            $(checkbox)
                .prop("checked", !$(checkbox).prop("checked"))
                .trigger("input");
        })


        let card = document.createElement("div");
        $(card).addClass("card adventureForm__card")
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
        $(title).addClass("m-0 text-truncate user-select-none");
        $(title).text(this.name);
        body.appendChild(title);

        return article;
    }
}





// Event to change background on servers
function ChangeLandscape()
{
    let landscape = $(this).data("url");
    let fileType = $(this).data("type");

    if($(this).hasClass("active"))
    {
        $(this).removeClass("active");
        landscape = null;
        fileType = null;
    }
    else
    {
        $(LANDSCAPE_OUTPUT).find(".background__button").removeClass("active");
        $(this).addClass("active");
    }

    let send = {
        type: "update",
        for: "background",
        background_url: landscape,
        fileType: fileType
    };

    $.post("controller.php", send);
}