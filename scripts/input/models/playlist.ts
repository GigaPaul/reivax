import Song from './song.js';
import Fetchable from './fetchable.js';
import Globals from './../globals.js';

// List of musics that can loop and be shuffled
export default class Playlist extends Fetchable {
    //#region Fields
    Element: HTMLElement | null = null;
    Intro: Song | null = null;
    IsLoop: boolean = true;
    IsShuffled: boolean = true;
    Name: string;
    Outro: Song | null = null;
    PlayedSongs: Song[] = [];
    Songs: Song[] = [];

    TableLabel: string = Globals.PlaylistTableLabel;
    //#endregion

    

    //#region Properties
    get AvailableSongs(): Song[] {
        return this.Songs.filter(i => !this.PlayedSongs.includes(i));
    }

    get CurrentSong(): Song | undefined {
        return this.Songs.find(i => !i.Element.paused);
    }
    //#endregion



    //#region Constructors
    constructor(name: string, isShuffled: boolean = true, isLoop: boolean = true, intro: Song | null = null, outro: Song | null = null) {
        super();
        this.Name = name;
        this.IsShuffled = isShuffled;
        this.IsLoop = isLoop;
        this.Intro = intro;
        this.Outro = outro;

        this.Element = this.CreateElement();
        $(`#${Globals.PlaylistOutputId}`).append(this.Element);
    }
    //#endregion



    //#region Methods
    Start(): void {
        this.PlayNextSong();
    }



    PlayNextSong(): void {
        if(this.Songs.length === 0) {
            return;
        }

        let lastPlayedSong: Song | null = null;

        // End of the loop
        if(this.AvailableSongs.length === 0) {
            if(!this.IsLoop) {
                return;
            }

            // We want to avoid the last played song to be played first in the next loop
            if(this.IsShuffled && this.Songs.length >= 2) {
                lastPlayedSong = this.PlayedSongs[this.PlayedSongs.length - 1];
            }

            this.PlayedSongs = [];
        }

        let nextSongIndex: number = 0;
        const songsToPickFrom: Song[] = [...this.AvailableSongs];

        if(this.IsShuffled) {
            if(lastPlayedSong) {
                // Avoid selecting the song played last in the previous loop as the first song played in the current loop
                songsToPickFrom.splice(songsToPickFrom.indexOf(lastPlayedSong), 1);
            }

            nextSongIndex = Math.floor(Math.random() * songsToPickFrom.length);
        }

        const nextSong: Song = songsToPickFrom[nextSongIndex];

        this.PlayedSongs.push(nextSong);
        nextSong.Play();

        const that = this;
        $(nextSong.Element).on("ended", function() {
            that.PlayNextSong();
            $(this).off("ended");
        })
    }



    Stop(): void {
        this.Songs.forEach(song => {
            song.Stop();
        });
    }



    CreateElement(): HTMLElement {
        const container: HTMLElement = document.createElement("article");

        return container;
    }
    //#endregion
}