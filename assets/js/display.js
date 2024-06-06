import {LANDSCAPE_TRANSITION_TIME, LANDSCAPE_PATH} from './globals/const.js';
import * as FUNC from './globals/func.js';

const CURRENTSCENE = {
    background_url: null
};

const INTERVAL = window.setInterval(Update, 1000);





async function Update()
{
    BackgroundUpdate();
}





function BackgroundUpdate()
{
    let send = {
        type: "select",
        for: "background"
    }

    $.post("controller.php", send, function(data)
    {
        let result = jQuery.parseJSON(data)[0];

        if(result.background_url !== CURRENTSCENE.background_url)
        {
            console.log(`Changement du background vers ${result.background_url}`);

            CURRENTSCENE.background_url = result.background_url;

            if(CURRENTSCENE.background_url == "")
            {
                ResetBackground();
            }
            else
            {
                SetBackgroundAs(CURRENTSCENE.background_url);
            }
        }        
    })
}





function SetBackgroundAs(backgroundUrl)
{
    let parent = $(".background__main")[0];
    let newLandscape = document.createElement("div");
    $(newLandscape).css("opacity", 0);
    let path = backgroundUrl;

    // Image
    if(FUNC.IsImage(backgroundUrl)) {
        $(newLandscape).css("background-image", `url("${path}")`);
        $(newLandscape).addClass("background");
    }
    // Video
    else if(FUNC.IsVideo(backgroundUrl)) {
        $(parent).addClass("video__container");

        let video = document.createElement("video");
        newLandscape.appendChild(video);
        $(video)
            .prop("autoplay", true)
            .prop("muted", true)
            .prop("loop", true)
            .prop("disablePictureInPicture", true);
        $(video).addClass("video__player");

        let source = document.createElement("source");
        video.appendChild(source);
        $(source)
            .prop("src", path)
            .prop("type", "video/mp4");
    }

    
    // If there are no active backgrounds
    if($(parent).children().length === 0) {
        parent.appendChild(newLandscape);
        $(newLandscape).animate({opacity: 1}, LANDSCAPE_TRANSITION_TIME);
    }
    // If there is already an active background
    else
    {
        let itemsToDeactivate = $(parent).children();

        // Create new landscape here
        parent.appendChild(newLandscape);
        //

        
        $(newLandscape).animate({opacity: 1}, LANDSCAPE_TRANSITION_TIME, function() {
            // Destroy previous landscape here
            $(itemsToDeactivate).remove();
            //
        });
    }
    //
}





function ResetBackground()
{
    let children = $(".background__main").children();
    $(children).animate({opacity: 0}, LANDSCAPE_TRANSITION_TIME, function() {
        $(this).remove();
    });
}