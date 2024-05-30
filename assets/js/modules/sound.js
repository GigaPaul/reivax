import * as GLOBALS from "../globals/const.js";
import * as FUNC from "../globals/func.js";





export default function InitSounds()
{
    let container = $(".sounds__container");
    $(container).each(function()
    {
        let btn = document.createElement("button");
        $(btn).addClass("btn btn-primary w-100 mb-3")
        let name = $(this).data("name");
        $(btn).text(name);
        $(btn).on("click", CreateSound);
        $(this).append(btn);
    })
    
    console.log("Module Sound initialisé.")
}





// DELETE
function DeleteSound()
{
    let parent = $(this).parents(".sounds__article");
    let audio = $(parent).find("audio")[0];
    let speedMs = 500;

    $(parent).animate({height: 0}, speedMs)
    $(audio).animate({volume: 0}, speedMs, function()
    {
        $(parent).remove();
    })
}





function CreateSound()
{
    let name = $(this).text();
    let playlistLi = $(this).siblings(".sounds__playlist").children("li");

    let article = document.createElement("article");
    $(article).addClass("sounds__article card w-max-content shadow mb-4 mt-0");
    $(article).css("margin", "auto");
    $("#activeSounds").append(article);

    let header = document.createElement("div");
    $(header).addClass("card-header");
    $(article).append(header);

    let title = document.createElement("h3");
    $(title).text(name);
    $(title).addClass("text-center m-0");
    $(header).append(title);

    let body = document.createElement("div");
    $(body).addClass("card-body");
    $(article).append(body);

    let container = document.createElement("div");
    $(container).addClass("sounds__activeContainer d-flex align-items-center");
    $(body).append(container);


    let audio = document.createElement("audio");
    $(audio).addClass("sounds__audio fadeout_audio")
        .prop("volume", 0)
        .attr("data-volume", "sons")
        .on("timeupdate", PlaylistNext);

    $(container).append(audio);



    // PLAYLIST
    let playlist = document.createElement("ul");
    $(playlist).addClass("sounds__activePlaylist d-none");
    $(playlist).data("order", 0);
    $(container).append(playlist);

    $(playlistLi).each(function()
    {
        let li = document.createElement("li");
        let url = $(this).data("url");
        $(li).data("url", url);
        $(playlist).append(li);
    })

    let play = document.createElement("button");
    $(play).html(`<i class="fa-solid fa-play"></i>`);
    $(play).addClass("sounds__play btn btn-success me-3");
    $(play).on("click", HandlePlaylistPlay);
    $(container).append(play);



    // FREQUENCY
    let frequency = document.createElement("div");
    $(frequency).addClass("sounds__frequency d-flex align-items-center me-3");
    $(container).append(frequency);

    let labelFrequency = document.createElement("label");
    $(labelFrequency).text("Fréquence");
    $(labelFrequency).addClass("me-2")
    $(frequency).append(labelFrequency);


    let inputFrequency = document.createElement("input");
    $(inputFrequency).addClass("form-control-range");
    $(inputFrequency).css("width", "100px")
    $(inputFrequency).prop("type", "range");
    $(inputFrequency).prop("min", "0");
    $(inputFrequency).prop("max", "30");
    $(inputFrequency).prop("value", "0");
    $(inputFrequency).addClass("me-2")
    $(frequency).append(inputFrequency);

    let outputFrequency = document.createElement("output");
    $(outputFrequency).text($(inputFrequency).val());
    $(inputFrequency).on("input", function()
    {
        $(outputFrequency).text($(this).val());
    })
    $(frequency).append(outputFrequency);



    // LOOP
    let loop = document.createElement("div");
    $(container).append(loop);
    $(loop).addClass("me-3");

    let loopLabel = document.createElement("label");
    $(loopLabel).text("Loop")
    $(loopLabel).addClass("me-2");
    $(loop).append(loopLabel);

    let loopInput = document.createElement("input");
    $(loopInput).addClass("form-check-input");
    $(loopInput).prop("type", "checkbox");
    $(loopInput).prop("name", "soundIsLooping");
    $(loopInput).prop("checked", true);
    $(loop).append(loopInput);

    let remove = document.createElement("button");
    $(remove).addClass("sounds__delete btn btn-danger");
    $(remove).html(`<i class="fa-solid fa-stop">`);
    $(remove).on("click", DeleteSound);
    $(container).append(remove);
}


// PLAYLIST NEXT
function PlaylistNext()
{
    let buffer = 0.2;

    if(isNaN(this.duration))
    {
        return;
    }

    if(this.currentTime <= this.duration - buffer)
    {
        return;
    }

    let parent = $(this).parents(".sounds__article");
    let playlist = $(parent).find(".sounds__activePlaylist")
    let playlistLi = $(playlist).children("li");

    let current = parseInt(playlist.data("order"));
    let last = parseInt($(playlistLi).length - 1);

    if(current == last)
    {
        let isLooping = $(parent).find(`[name="soundIsLooping"]`).val()

        if(!isLooping)
        {
            return;
        }
        
        current = 0;
    }
    else
    {
        current++;
    }

    playlist.data("order", current);
    let url = $(playlistLi[current]).data("url");
    $(this).prop("src", GLOBALS.SOUND_URL + url);

    // Conversion en ms
    let frequency = parseInt($(parent).find(".sounds__frequency input").val()) * 1000;

    if(frequency > 0)
    {
        let volume = $("#SonsVolume").val() / 100;
        FUNC.Wait(frequency).then(() => { 
            FUNC.PlayAudio(this, volume, GLOBALS.SOUND_FADE_TIME)
        });        
    }
    else
    {
        $(this).prop("currentTime", 0);
        this.play();
    }
}





// HANDLE PLAYLIST PLAY
function HandlePlaylistPlay()
{
    let parent = $(this).parents(".sounds__article");
    let audio = $(parent).find("audio")[0];
    let playlist = $(parent).find(".sounds__activePlaylist")
    let playlistLi = $(playlist).children("li");
    let icon = $(this).children("i");

    $(icon).toggleClass("fa-play fa-pause");
    $(this).toggleClass("btn-warning btn-success");

    if(audio.paused)
    {
        let order = $(playlist).data("order");
        let url = $(playlistLi[order]).data("url");
        $(audio).prop("src", GLOBALS.SOUND_URL + url);
        let volume = $("#SonsVolume").val() / 100;
        FUNC.PlayAudio(audio, volume, GLOBALS.SOUND_FADE_TIME)
    }
    else
    {
        $(audio).animate({volume: 0}, GLOBALS.SOUND_FADE_TIME, function()
        {
            audio.pause();
            $(audio).prop("currentTime", 0);
        })
    }
}