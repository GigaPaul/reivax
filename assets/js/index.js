const XHTTP = new XMLHttpRequest();

const GENERAL_VOLUME = 1;
const AMBIENCE_REL_VOL = 0.75;
const SOUND_REL_VOL = 0.15;
const MUSIC_REL_VOL = 0.3;


// const AMBIENCE_MAX_VOLUME = 0.1;
const AMBIENCE_FADE_TIME = 5000;
const AMBIENCE_URL = "./assets/audio/ambiance/";

const LANDSCAPE_TRANSITION_TIME = 1000;
const LANDSCAPE_PATH = "./assets/landscapes/";
const LANDSCAPE_OUTPUT = $("#landscapeOutput")[0];

// const MUSIC_MAX_VOLUME = 0.05;
const MUSIC_FADE_TIME = 3000;
const MUSIC_URL = "./assets/audio/musics/";
const MUSIC_AUDIOS = $("#musicAudios");

// const SOUND_MAX_VOLUME = 0.1;
const SOUND_FADE_TIME = 1000;
const SOUND_URL = "./assets/audio/sounds/";


let CURRENT_MUSIC = null;

$(MUSIC_AUDIOS).children().each(function() {
    $(this).prop("volume", 0);
    $(this).on("timeupdate", FadeTransition);    
    $(this).on("loadedmetadata", InitAudioPlay)
})


InitVolume();
InitLandscape();
InitAmbience();
InitSounds();
InitMusic();





function Wait(ms)
{
    return new Promise(resolve => setTimeout(resolve, ms));
}

function IsImage(filename)
{
    let image = ["jpg", "png"];
    let extension = filename.substr( (filename.lastIndexOf(".") + 1) );
    return image.includes(extension);
}

function IsVideo(filename)
{
    let video = ["mp4"];
    let extension = filename.substr( (filename.lastIndexOf(".") + 1) );
    return video.includes(extension);
}


function SecondsToMinutes(time) {
    time = parseFloat(time);

    let minutes = Math.floor(time / 60);
    let seconds = Math.floor(time - minutes * 60) + '';

    if(seconds.length < 2) {
        seconds = "0" + seconds;
    }

    let result = `${minutes}:${seconds}`;

    return result;
}


















//============================================================================================\\
//========================================== BACKGROUND ======================================\\
//============================================================================================\\
function InitLandscape() {
    let send = {
        type: "retrieve",
        for: "landscape"
    }


    $.post("controller.php", send, function(data)
    {
        let result = jQuery.parseJSON(data);


        $(result).each(function() {

            if(!IsImage(this) && !IsVideo(this)) {
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
            if(IsImage(this)) {
                $(button).data("type", "image");
                $(button).css("background-image", `url(${LANDSCAPE_PATH + this})`)
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
                $(source).prop("src", LANDSCAPE_PATH + this);
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










//============================================================================================\\
//========================================== AMBIENCE ========================================\\
//============================================================================================\\
// AMBIENCE INIT
// Create an audio element for each button
function InitAmbience()
{
    $(".ambience_art").each(function()
    {
        let btn = $(this).find("button")
        let url = btn.data("url");

        let audio = document.createElement("audio");
        $(audio)
            .prop("src", AMBIENCE_URL + url)
            .attr("data-volume", "ambiance")
            .prop("loop", true)
            .prop("volume", 0)
            .prop("id", `ambience_${url}`);
        this.appendChild(audio);



        btn.on("click", function()
        {
            // Si le bouton est cliqué alors que le son n'était pas joué
            if(audio.paused)
            {
                if(!$(this).hasClass("active"))
                {
                    $(".ambience_btns").find("button").removeClass("active");
                    $(this).addClass("active");
                }

                SetAmbienceAs(audio);
            }
            // Si le bouton est cliqué alors que le son est en train d'être joué
            else
            {
                $(btn).removeClass("active");
                ResetAmbience();
            }
        });
    })

    console.log("Module Ambience initialisé.")
}





function ResetAmbience()
{
    let audioIndex = $("#ambienceSelector").find("audio");

    $(audioIndex).each(function()
    {
        PauseAudio(this);
    })
}





function SetAmbienceAs(element)
{

    let audioIndex = $("#ambienceSelector").find("audio");

    // Jouer l'ambiance sélectionnée et mettre en pause les autres
    $(audioIndex).each(function()
    {
        // Jouer l'ambiance concernée
        if(this == element)
        {
            if(this.paused)
            {
                let volume = $("#AmbianceVolume").val() / 100;
                PlayAudio(this, volume, AMBIENCE_FADE_TIME);
            }            
        }
        // Si une autre ambiance est jouée, la mettre sur pause
        else
        {
            PauseAudio(this);
        }
    })
}





function PlayAudio(audioElt, volume, fadetime)
{
    audioElt.play();
    $(audioElt).animate({volume: volume}, fadetime)
}


function PauseAudio(audioElt)
{
    if(!audioElt.paused)
    {
        $(audioElt).animate({volume: 0}, AMBIENCE_FADE_TIME, function()
        {
            audioElt.pause();
            audioElt.currentTime = 0;
        })
    }
}










//============================================================================================\\
//============================================ SOUNDS ========================================\\
//============================================================================================\\
function InitSounds()
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
    $(this).prop("src", SOUND_URL + url);

    // Conversion en ms
    let frequency = parseInt($(parent).find(".sounds__frequency input").val()) * 1000;

    if(frequency > 0)
    {
        let volume = $("#SonsVolume").val() / 100;
        Wait(frequency).then(() => { 
            PlayAudio(this, volume, SOUND_FADE_TIME)
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
        $(audio).prop("src", SOUND_URL + url);
        let volume = $("#SonsVolume").val() / 100;
        PlayAudio(audio, volume, SOUND_FADE_TIME)
    }
    else
    {
        $(audio).animate({volume: 0}, SOUND_FADE_TIME, function()
        {
            audio.pause();
            $(audio).prop("currentTime", 0);
        })
    }
}










//============================================================================================\\
//============================================ MUSICS ========================================\\
//============================================================================================\\
function InitMusic(){
    let send = {
        type: "retrieve",
        for: "music"
    }


    $.post("controller.php", send, function(data)
    {
        let result = jQuery.parseJSON(data);
        let container = document.createElement("div");
        let output = $("#musicOutput")[0];
        output.appendChild(container);
        

        $(result).each(function()
        {
            let folder = this;
            
            let folderContainer = document.createElement("article");
            let folderTitle = document.createElement("h3");
            $(folderTitle).addClass("text-capitalize");
            $(folderTitle).text(folder.name);
            folderContainer.appendChild(folderTitle);
            
            container.appendChild(folderContainer);

            $(folder.children).each(function()
            {
                let category = this;

                if(category.children.length === 0) {
                    return;
                }
                
                let categoryContainer = document.createElement("article");
                $(categoryContainer).data("url", `${folder.name}/${category.name}/`);
                $(categoryContainer).addClass("card w-max-content");
                // $(categoryContainer).addClass("music__type");
                folderContainer.appendChild(categoryContainer);


                // HEADER
                let categoryHeader = document.createElement("div");
                $(categoryHeader).addClass("card-header");
                categoryContainer.appendChild(categoryHeader);

                let categoryTitle = document.createElement("h4");
                $(categoryTitle).addClass("text-capitalize m-0");
                $(categoryTitle).text(category.name);
                categoryHeader.appendChild(categoryTitle);


                // BODY
                let categoryBody = document.createElement("div");
                $(categoryBody).addClass("card-body d-flex");
                categoryContainer.appendChild(categoryBody);

                let songControls = document.createElement("div");
                $(songControls).addClass("d-flex flex-column justify-content-between me-3");
                categoryBody.appendChild(songControls);

                // TOGGLE BUTTON
                let toggleButton = document.createElement("button");
                $(toggleButton).addClass("music__toggle btn btn-success mb-1");
                songControls.appendChild(toggleButton);

                let toggleIcon = document.createElement("i");
                $(toggleIcon).addClass("fa-solid fa-play");
                toggleButton.appendChild(toggleIcon);

                // SHUFFLE BUTTON
                let shuffleButton = document.createElement("button");
                $(shuffleButton).addClass("music__shuffle btn");
                songControls.appendChild(shuffleButton);

                let shuffleIcon = document.createElement("i");
                $(shuffleIcon).addClass("fa-solid fa-shuffle");
                shuffleButton.appendChild(shuffleIcon);


                // CURRENT SONG
                let currentSong = document.createElement("div");
                categoryBody.appendChild(currentSong);

                let songTitle = document.createElement("h5");
                $(songTitle).text(category.children[0]);
                $(songTitle).addClass("music__songTitle");
                currentSong.appendChild(songTitle);

                let progressBarContainer = document.createElement("div");
                $(progressBarContainer).addClass("progressbar");
                currentSong.appendChild(progressBarContainer);

                let progressbar = document.createElement("input");
                $(progressbar)
                    .prop("type", "range")
                    .val("0")
                    .prop("min", "0")
                    .prop("max", "100")
                    .prop("step", "any")
                    .addClass("w-100");
                progressBarContainer.appendChild(progressbar);

                let timestamps = document.createElement("div");
                $(timestamps).addClass("timestamp d-flex justify-content-between");
                progressBarContainer.appendChild(timestamps);

                let timestampCurrent = document.createElement("p");
                $(timestampCurrent).addClass("timestamp__current m-0");
                timestamps.appendChild(timestampCurrent);

                let timestampEnd = document.createElement("p");
                $(timestampEnd).addClass("timestamp__end m-0");
                timestamps.appendChild(timestampEnd);


                
                // HIDDEN PLAYLIST
                let playlist = document.createElement("ul");
                categoryBody.appendChild(playlist);
                $(playlist).addClass("music__playlist d-none");

                $(category.children).each(function()
                {
                    let song = this;

                    let li = document.createElement("li");
                    $(li).data("url", song);
                    playlist.appendChild(li);
                });

            
                let music = new Playlist(categoryContainer);

                if(music.isShuffled) {
                    $(shuffleButton).addClass("btn-info");
                }
                else {
                    $(shuffleButton).addClass("btn-outline-info");
                }



                // EVENTS
                // Toggle
                $(toggleButton).on("click", function() {
                    let icon = $(this).children("i");
                    if(CURRENT_MUSIC === music) {
                        music.stop();
                        $(this).addClass("btn-success").removeClass("btn-danger");
                        $(icon).addClass("fa-play").removeClass("fa-stop");
                    }
                    // If this is not the current music
                    else {
                        music.start();
                        $(this).addClass("btn-danger").removeClass("btn-success");
                        $(icon).addClass("fa-stop").removeClass("fa-play");
                    }
                });

                // Shuffle
                $(shuffleButton).on("click", function() {
                    music.isShuffled = !music.isShuffled;

                    if(music.isShuffled) {
                        $(this).addClass("btn-info").removeClass("btn-outline-info");
                    }
                    else {
                        $(this).addClass("btn-outline-info").removeClass("btn-info");
                    }
                })

            });
        });

        console.log("Module Music initialisé.")
    });
}





class Playlist {
    constructor(article, isShuffled = true)
    {
        let that = this;
        this.element = article;
        this.url = MUSIC_URL + $(article).data("url");
        this.index = 0;
        this.songs = [];
        this.playedSongs = [];
        this.isShuffled = isShuffled;

        let list = $(article).find(".music__playlist").children("li");
        $(list).each(function()
        {
            that.songs.push($(this).data("url"));
        })
    }





    static isMusicPlaying()
    {
        let isPlaying = false;

        $(MUSIC_AUDIOS).children().each(function() {
            if(!this.paused)
            {
                isPlaying = true;
                // Break the each function
                return false;
            } 
        })

        return isPlaying
    }





    getNextSong()
    {
        // Si la playlist est en mode shuffle et doit choisir une musique aléatoire à chaque fois
        if(this.isShuffled)
        {
            let remainingSongs = []

            // Si toutes les musiques ont été jouées
            if(this.songs.length === this.playedSongs.length)
            {
                this.playedSongs = [];
                remainingSongs = [...this.songs];

                // On retire la musique qui est actuellement jouée pour ne pas répéter deux fois la même musique
                remainingSongs.splice(this.index, 1);
            }
            // S'il reste encore des musiques à jouer
            else
            {
                let that = this;

                remainingSongs = [...this.songs].filter(function(item)
                {
                    return !that.playedSongs.includes(item);
                })
                
            }

            let length = remainingSongs.length;
            let randomIndex = Math.floor(Math.random() * length);

            return remainingSongs[randomIndex];
        }
        // Si la musique est en mode normal et choisit la musique suivante à chaque fois
        else
        {
            let nextIndex = this.index + 1;

            // Si la dernière musique vient d'être jouée
            if(nextIndex === this.songs.length)
            {
                nextIndex = 0;
            }
            
            return this.songs[nextIndex];
        }
    }




    start()
    {
        CURRENT_MUSIC = this;
        let songPlayed = this.songs[0];

        if(this.isShuffled)
        {
            let length = this.songs.length;
            let randomIndex = Math.floor(Math.random() * length);
            songPlayed = this.songs[randomIndex];
        }

        this.play(songPlayed);
    }



    static pause(){
        let playingAudio = $(MUSIC_AUDIOS).children(".active")[0] ?? $(MUSIC_AUDIOS).children()[0];
        
        $(playingAudio).removeClass("active");


        if(!playingAudio.paused)
        {
            $(playingAudio).animate({volume: 0}, MUSIC_FADE_TIME, function()
            {
                playingAudio.pause();
                playingAudio.currentTime = 0;
            });
        }
    }




    stop()
    {
        this.index = 0;
        this.playedSongs = [];
        Playlist.pause();
        CURRENT_MUSIC = null;
    }




    next()
    {
        let nextSong = this.getNextSong();
        this.play(nextSong);
    }





    play(songName)
    {
        this.index = this.songs.indexOf(songName);
        this.playedSongs.push(songName);

        let playingAudio = $(MUSIC_AUDIOS).children(".active")[0] ?? $(MUSIC_AUDIOS).children()[0];
        let pausedAudio = $(MUSIC_AUDIOS).children().filter(function() { return this !== playingAudio})[0];


        if(Playlist.isMusicPlaying()){
            Playlist.pause();
        }
        
        $(pausedAudio).addClass("active");
        $(pausedAudio).prop("src", this.url+songName);
        

        pausedAudio.play();
        let volume = $("#MusicVolume").val() / 100;
        $(pausedAudio).animate({volume: volume}, MUSIC_FADE_TIME);
        
        let title = $(this.element).find(".music__songTitle");
        $(title).text(songName);

        console.log(`${songName} en cours d'écoute.`);
    }
}





function FadeTransition() {
    if(CURRENT_MUSIC === null)
    {
        return;
    }

    if(this.paused)
    {
        return;
    }

    if(isNaN(this.duration))
    {
        return;
    }

    if(!$(this).hasClass("active"))
    {
        return;
    }

    // Update timestamp from modals
    let timestamp = $(CURRENT_MUSIC.element).find(".timestamp__current");
    timestamp.text(SecondsToMinutes(this.currentTime));

    let range = $(CURRENT_MUSIC.element).find(".progressbar input[type='range']");
    let relativeVal = (this.currentTime / this.duration) * 100;
    $(range).val(relativeVal);
    //

    let buffer = MUSIC_FADE_TIME / 1000;

    if(this.currentTime <= this.duration - buffer)
    {
        return;
    }    
        
    CURRENT_MUSIC.next();
}



function InitAudioPlay() {
    let timestampEnd = $(CURRENT_MUSIC.element).find(".timestamp__end");
    $(timestampEnd).text(SecondsToMinutes(this.duration));
}








// VOLUME, à retravailler
function InitVolume() {
    $(".MuteVolumeBtn").on("click", MuteEvent);
    $(".volume__range").on("input", VolumeEvent);
    $("#GeneralVolume").on("input", GeneralVolumeEvent);

    let generalVolumeVal = GENERAL_VOLUME * 100;
    $("#GeneralVolume").val(generalVolumeVal);
    $("#AmbianceVolume").val(AMBIENCE_REL_VOL * generalVolumeVal).trigger("input");
    $("#SonsVolume").val(SOUND_REL_VOL * generalVolumeVal).trigger("input");
    $("#MusicVolume").val(MUSIC_REL_VOL * generalVolumeVal).trigger("input");
}


function MuteEvent() {
    if($(this)[0] === $("#GeneralMute")[0]) {
        let that = this;

        $(".MuteVolumeBtn").each(function() {
            if(that === this) {
                return;
            }

            if($(that).hasClass("muted") === $(this).hasClass("muted")) {
                $(this).click();
            }
        })
    }

    ToggleMuteOn(this);
}

function ToggleMuteOn(element) {
    // Si le son n'est pas mute
    if(!$(element).hasClass("muted")) {
        MuteVolumeOn(element);
    }
    // Si le son est mute
    else {
        UnMuteVolumeOn(element)
    }
}


function MuteVolumeOn(element) {
    let icon = $(element).children()[0];
    let range = $(element).parent().parent().find("input")[0];

    $(icon).addClass("fa-volume-xmark text-secondary");
    $(icon).removeClass("fa-volume-low");
    $(element).addClass("muted");
    $(range).prop("disabled", true);

    let dataVolume = GetDataTag(element);
    let audios = $(`audio[data-volume="${dataVolume}"]`);
    (audios).prop("muted", true);
}


function UnMuteVolumeOn(element) {
    let icon = $(element).children()[0];
    let range = $(element).parent().parent().find("input")[0];

    $(icon).removeClass("fa-volume-xmark text-secondary");
    $(icon).addClass("fa-volume-low");
    $(element).removeClass("muted");
    $(range).prop("disabled", false);

    let dataVolume = GetDataTag(element);
    let audios = $(`audio[data-volume="${dataVolume}"]`);
    $(audios).prop("muted", false);
}


function VolumeEvent() {
    if($(this)[0] === $("#GeneralVolume")[0]) {
        return;
    }


    let currentValue = parseInt($(this).val());
    let maxValue = parseInt($("#GeneralVolume").val());
    let relativeValue = $(this).siblings("input[name='RelativeValue']");
    let newRelativeVal = (currentValue / maxValue) * 100;
    
    

    if(currentValue > maxValue) {
        $("#GeneralVolume").val(currentValue).trigger("input");
        $(relativeValue).val(100);
    }

    if(newRelativeVal > 100) {
        newRelativeVal = 100;
    }
    
    $(relativeValue).val(newRelativeVal);
    ManageAudioVolume(this);
}

function GeneralVolumeEvent() {
    let ranges = $(".volume__range").not("#GeneralVolume");
    let maxValue = parseInt($(this).val());

    $(ranges).each(function() {
        let relativeValue = parseInt($(this).siblings("input[name='RelativeValue']").val());
        let percent = relativeValue / 100;
        $(this).val(maxValue * percent);
        ManageAudioVolume(this);
    });
}

function ManageAudioVolume(rangeInput) {
    let dataVolume = GetDataTag(rangeInput);
    let audios = $(`audio[data-volume="${dataVolume}"]`);
    let normalizedValue = parseInt($(rangeInput).val()) / 100;



    $(audios).each(function() {
        $(this).prop("volume", normalizedValue);
    })
}

function GetDataTag(element) {
    let article = $(element).closest("[data-tag]");
    return $(article).data("tag");
}
//