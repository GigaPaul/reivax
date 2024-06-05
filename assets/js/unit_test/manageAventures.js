const OUTPUT = $("#outputAventures")[0];
console.log(OUTPUT);

InitAventures();

function InitAventures() {
    let send = {
        type: "aventure"
    }


    $.post("retriever.php", send, function(data)
    {
        let result = jQuery.parseJSON(data);


        $(result).each(function() {
            let path = `./aventures/${this}/`;
            let backgroundUrl = `${path}/background.jpg`;

            $.getJSON(`${path}/infos.json`, function( data ) {
                let card = document.createElement("article");
                $(card).addClass("card");
                $(card).css("width", "18rem");
                OUTPUT.appendChild(card);

                let image = document.createElement("img");
                $(image).prop("src", backgroundUrl);
                $(image).addClass("card-img-top");
                card.appendChild(image);
                
                let body = document.createElement("div");
                $(body).addClass("card-body");
                card.appendChild(body);

                let title = document.createElement("h5");
                $(title).text(data.name);
                $(title).addClass("card-title");
                body.appendChild(title);
            });


        });
    });
}