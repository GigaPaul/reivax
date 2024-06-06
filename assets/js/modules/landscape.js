import * as FUNC from "../globals/func.js";
import { LANDSCAPE_OUTPUT } from "./../index.js";





export class Landscape {
    constructor(obj) {
        this.name = obj.name;
        this.url = obj.url;
        this.element;
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