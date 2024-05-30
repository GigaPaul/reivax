import * as GLOBALS from "../globals/const.js";
import * as FUNC from "../globals/func.js";
import { LANDSCAPE_OUTPUT } from "./../index.js";





export default function InitLandscape() {
    let send = {
        type: "retrieve",
        for: "landscape"
    }


    $.post("controller.php", send, function(data)
    {
        let result = jQuery.parseJSON(data);


        $(result).each(function() {

            if(!FUNC.IsImage(this) && !FUNC.IsVideo(this)) {
                return;
            }

            let container = document.createElement("div");
            LANDSCAPE_OUTPUT.appendChild(container);
            $(container).addClass("col-2 mb-3");


            let button = document.createElement("button");
            container.appendChild(button);
            $(button).addClass("background__button");
            $(button).data("url", this);

            // Image
            if(FUNC.IsImage(this)) {
                $(button).data("type", "image");
                $(button).css("background-image", `url(${GLOBALS.LANDSCAPE_PATH + this})`)
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
                $(source).prop("src", GLOBALS.LANDSCAPE_PATH + this);
                $(source).prop("type", "video/mp4");
            }

            $(button).on("click", ChangeLandscape);
        })

        console.log("Module Landscape initialisé.")
    });
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