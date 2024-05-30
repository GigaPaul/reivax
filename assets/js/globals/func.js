export function Wait(ms)
{
    return new Promise(resolve => setTimeout(resolve, ms));
}





export function SecondsToMinutes(time) {
    time = parseFloat(time);

    let minutes = Math.floor(time / 60);
    let seconds = Math.floor(time - minutes * 60) + '';

    if(seconds.length < 2) {
        seconds = "0" + seconds;
    }

    let result = `${minutes}:${seconds}`;

    return result;
}





export function PlayAudio(audioElt, volume, fadetime)
{
    audioElt.play();
    $(audioElt).animate({volume: volume}, fadetime)
}





export function PauseAudio(audioElt, fadetime)
{
    if(!audioElt.paused)
    {
        $(audioElt).animate({volume: 0}, fadetime, function()
        {
            audioElt.pause();
            audioElt.currentTime = 0;
        })
    }
}





export function IsImage(filename)
{
    let image = ["jpg", "png"];
    let extension = filename.substr( (filename.lastIndexOf(".") + 1) );
    return image.includes(extension);
}





export function IsVideo(filename)
{
    let video = ["mp4"];
    let extension = filename.substr( (filename.lastIndexOf(".") + 1) );
    return video.includes(extension);
}