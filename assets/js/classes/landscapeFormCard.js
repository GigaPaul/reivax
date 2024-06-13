import * as FUNC from '../globals/func.js';





export class LandscapeFormCard {
    constructor(landscape, adventure) {
        this.landscape = landscape;
        this.adventure = adventure;
    }

    Create() {
        let that = this;

        let article = document.createElement("article");
        $(article).addClass("col-3 mb-2 fade show adventureForm__landscape");

        let isActive = this.adventure.IsUsingLandscape(this.landscape);

        let checkbox = document.createElement("input");
        $(checkbox)
            .prop("type", "checkbox")
            .addClass("d-none")
            .prop("name", "landscapes[]")
            .prop("checked", isActive)
            .val(this.landscape.id_landscape);
        article.appendChild(checkbox);

        $(checkbox).on("input", function() {
            if(checkbox.checked) {
                that.adventure.AddLandscape(that.landscape);
            }
            else {
                that.adventure.RemoveLandscape(that.landscape);
            }
        });

        $(article).on("click", function() {
            $(checkbox)
                .prop("checked", !$(checkbox).prop("checked"))
                .trigger("input");
        })


        let card = document.createElement("div");
        $(card).addClass("card adventureForm__card")
        article.appendChild(card);

        let frame = document.createElement("div");
        $(frame)
            .addClass("overflow-hidden")
            .css("height", "135px");
        card.appendChild(frame);

        // Video
        if(FUNC.IsVideo(this.landscape.url)) {
            let video = document.createElement("video");
            $(video)
                .addClass("card-img-top")
                .prop("disablepictureinpicture", true)
                .prop("src", this.landscape.url);
            frame.appendChild(video);
        }
        // Image
        else {
            let img = document.createElement("img");
            $(img)
                .prop("src", this.landscape.url)
                .addClass("card-img-top");
            frame.appendChild(img);
        }

        let body = document.createElement("div");
        $(body).addClass("card-body");
        card.appendChild(body);

        let title = document.createElement("p");
        $(title).addClass("m-0 text-truncate user-select-none");
        $(title).text(this.landscape.name);
        body.appendChild(title);

        return article;
    }
}