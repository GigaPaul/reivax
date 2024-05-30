import * as GLOBALS from "../globals/const.js";





export default function InitVolume() {
    $(".MuteVolumeBtn").on("click", MuteEvent);
    $(".volume__range").on("input", VolumeEvent);
    $("#GeneralVolume").on("input", GeneralVolumeEvent);

    let generalVolumeVal = GLOBALS.GENERAL_VOLUME * 100;
    $("#GeneralVolume").val(generalVolumeVal);
    $("#AmbianceVolume").val(GLOBALS.AMBIENCE_REL_VOL * generalVolumeVal).trigger("input");
    $("#SonsVolume").val(GLOBALS.SOUND_REL_VOL * generalVolumeVal).trigger("input");
    $("#MusicVolume").val(GLOBALS.MUSIC_REL_VOL * generalVolumeVal).trigger("input");
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