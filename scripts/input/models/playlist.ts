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
    Name: string = "Unnamed Playlist";
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
        let currentSong: Song | undefined = this.Songs.find(i => i.AudioElement && !i.AudioElement.paused);

        if(currentSong) {
            return currentSong;
        }

        return this.Songs.find(i => i.Element && $(i.Element).find(`input[name='${Globals.SongCheckboxInputName}']:checked`)[0]);
    }
    //#endregion



    //#region Constructors
    constructor(id: number | null = null) {
        super(id);

        this.Joints.push(Globals.SongTableLabel);
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
        if(nextSong.AudioElement) {
            $(nextSong.AudioElement).on("ended", function() {
                that.PlayNextSong();
                $(this).off("ended");
            })            
        }
    }



    Play(): void {
        if(this.CurrentSong) {
            this.CurrentSong.Play();
        }
        else {
            this.Start();
        }
    }



    Stop(): void {
        this.Songs.forEach(song => {
            song.Stop();
        });
    }



    Toggle(): void {
        let isPaused = !this.CurrentSong;

        if(!isPaused && this.CurrentSong?.AudioElement) {
            isPaused = $(this.CurrentSong.AudioElement).prop("paused");
        }
        
        console.log(this.CurrentSong);
        if(isPaused) {
            this.Play();
        }
        else {
            this.Stop();
        }
    }



    CreateElement(): HTMLElement {
        const that = this;
        const container: HTMLElement = document.createElement("article");
        for(let i = 0; i < this.Songs.length; i++) {
            const song: Song = this.Songs[i];
            song.CreateElement();

            if(!song.Element) {
                continue;
            }

            container.appendChild(song.Element);
        }

        const button: HTMLButtonElement = document.createElement("button");
        $(button).text(`Toggle ${this.Name}`).on("click", () => {
            that.Toggle();
        })
        container.appendChild(button);

        return container;
    }
    
    
    
    async Load(object: any): Promise<void> {
        await super.Load(object);
        const that = this;

        for(const joint of this.Joints) {
            if(object.hasOwnProperty(joint)) {
                const jointObjectArray: any[] = (object as any)[joint];

                for(const jointObject of jointObjectArray) {
                    switch(joint) {
                        case Globals.SongTableLabel:
                            const newSong: Song = new Song(jointObject.id)
                            await newSong.Fetch();
                            that.Songs.push(newSong);
                            break;
                    }
                }
            }
        }

        
        this.Element = this.CreateElement();
        $(`#${Globals.PlaylistOutputId}`).append(this.Element);
    }
    //#endregion
}