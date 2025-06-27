<?php

if(!isset($_GET["id"]) || !ctype_digit($_GET["id"])) {
    header("Location: index.php");
}

include("$_SERVER[DOCUMENT_ROOT]/views/shared/header.php");
?>


<body>
    <output id="LandscapeOutput"></output>
    <output id="AmbienceOutput"></output>
    <section>
        <output id="PlaylistOutput"></output>
        <button id="PlaylistToggle" class="hidden">Toggle Current</button>
        <p id="PlaylistCurrentSongName"></p>
    </section>

    <div class="bg-black text-white p-4">Test Tailwind</div>
</body>

<script type="module" src="/scripts/output/adventureMain.js"></script>

<?php
include("$_SERVER[DOCUMENT_ROOT]/views/shared/footer.php");
?>