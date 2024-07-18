export default function InitCardsView() {
    console.log("test");
    
    $("form").on("submit", function(e) {
        e.preventDefault();
        let formdata = new FormData(this);
        console.log(formdata);
    })
}