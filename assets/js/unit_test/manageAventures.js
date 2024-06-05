const OUTPUT = $("#outputAventures")[0];
console.log(OUTPUT);

InitAventures();

function InitAventures() {
    let send = {
        type: "selectAll",
        for: "aventures"
    };


    $.post("controller.php", send, function(data)
    {
        let result = jQuery.parseJSON(data);

        $(result).each(function() {
            let container = document.createElement("div");
            $(container).addClass("col-3");
            OUTPUT.appendChild(container);

            let card = document.createElement("article");
            $(card).addClass("card");
            // $(card).css("width", "18rem");
            container.appendChild(card);

            let image = document.createElement("img");
            $(image).prop("src", this.background);
            $(image).addClass("card-img-top");
            card.appendChild(image);
            
            let body = document.createElement("div");
            $(body).addClass("card-body");
            card.appendChild(body);

            let title = document.createElement("h5");
            $(title).text(this.name);
            $(title).addClass("card-title");
            body.appendChild(title);

            // let desc = document.createElement("p");
            // $(desc).text(this.description);
            // body.appendChild(desc);
        });
    });
}