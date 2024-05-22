const XHTTP = new XMLHttpRequest();

const AMBIENCE_MAX_VOLUME = 0.1;
const AMBIENCE_FADE_TIME = 5000;
const AMBIENCE_URL = "./assets/audio/ambiance/";

const LANDSCAPE_TRANSITION_TIME = 1000;
const LANDSCAPE_PATH = "./assets/landscapes/";
const LANDSCAPE_OUTPUT = $("#landscapeOutput")[0];

const MUSIC_MAX_VOLUME = 0.05;
const MUSIC_FADE_TIME = 3000;
const MUSIC_URL = "./assets/audio/musics/";
const MUSIC_AUDIOS = $("#musicAudios");

const SOUND_MAX_VOLUME = 0.1;
const SOUND_URL = "./assets/audio/sounds/";


let CURRENT_MUSIC = null;

$(MUSIC_AUDIOS).children().each(function() {
    $(this).prop("volume", 0);
    $(this).on("timeupdate", FadeTransition);    
})


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
                PlayAudio(this)
            }            
        }
        // Si une autre ambiance est jouée, la mettre sur pause
        else
        {
            PauseAudio(this);
        }
    })
}





function PlayAudio(audioElt)
{
    audioElt.play();
    $(audioElt).animate({volume: AMBIENCE_MAX_VOLUME}, AMBIENCE_FADE_TIME)
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
    $(article).addClass("sounds__article card w-max-content shadow mb-4");
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
    $(audio).addClass("sounds__audio fadeout_audio");
    $(audio).prop("volume", 0);
    $(audio).on("timeupdate", PlaylistNext)

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
    $(inputFrequency).addClass("form-range");
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

    let frequency = parseInt($(parent).find(".sounds__frequency input").val()) * 1000;

    if(frequency > 0)
    {
        Wait(frequency).then(() => { 
            PlayAudio(this, SOUND_MAX_VOLUME, 1000)
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

    if(audio.paused)
    {
        let order = $(playlist).data("order");
        let url = $(playlistLi[order]).data("url");
        $(audio).prop("src", SOUND_URL + url);

        PlayAudio(audio, SOUND_MAX_VOLUME, 1000)
    }
    else
    {
        $(audio).animate({volume: 0}, 1000, function()
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
            
            let folderContainer = document.createElement("div");
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
                folderContainer.appendChild(categoryContainer);
                $(categoryContainer).data("url", `${folder.name}/${category.name}/`);
                $(categoryContainer).addClass("music__type");

                let categoryTitle = document.createElement("h4");
                categoryContainer.appendChild(categoryTitle);
                $(categoryTitle).addClass("text-capitalize");
                $(categoryTitle).text(category.name);

                let songControls = document.createElement("div");
                categoryContainer.appendChild(songControls);

                let toggleButton = document.createElement("button");
                songControls.appendChild(toggleButton);
                $(toggleButton).text("Toggle");
                $(toggleButton).addClass("music__toggle btn btn-primary");

                
                let playlist = document.createElement("ul");
                categoryContainer.appendChild(playlist);
                $(playlist).addClass("music__playlist d-none");

                $(category.children).each(function()
                {
                    let song = this;

                    let li = document.createElement("li");
                    $(li).data("url", song);
                    playlist.appendChild(li);
                });

            
                let music = new Playlist(categoryContainer);

                $(toggleButton).on("click", function() {
                    if(CURRENT_MUSIC === music) {
                        music.stop();                      
                    }
                    // If this is not the current music
                    else {
                        music.start();
                    }
                });                    

            });
        });

        console.log("Module Music initialisé.")
    });
}





class Playlist {
    constructor(article, isShuffled = true)
    {
        let that = this;
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

        if(this.isShuffled)
        {
            let length = this.songs.length;
            let randomIndex = Math.floor(Math.random() * length);
            this.play(this.songs[randomIndex]);
        }
        else
        {
            this.play(this.songs[0]);
        }
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
        $(pausedAudio).animate({volume: MUSIC_MAX_VOLUME}, MUSIC_FADE_TIME);
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

    let buffer = MUSIC_FADE_TIME / 1000;

    if(this.currentTime <= this.duration - buffer)
    {
        return;
    }    
        
    CURRENT_MUSIC.next();
}