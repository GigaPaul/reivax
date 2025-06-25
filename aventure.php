<?php

if(!isset($_GET["id"]) || !ctype_digit($_GET["id"])) {
    header("Location: index.php");
}

// $aventure_id = intval($_GET["id"]);

// $fileContents = file_get_contents("$_SERVER[DOCUMENT_ROOT]/json/adventures.json");
// $decoded = json_decode($fileContents, true);

// var_dump($decoded);

include("$_SERVER[DOCUMENT_ROOT]/views/shared/header.php");
?>


<body>
    <output id="LandscapeOutput"></output>
    <output id="AmbienceOutput"></output>
    <output id="PlaylistOutput"></output>
</body>

<script type="module" src="/scripts/output/adventureMain.js"></script>

<?php
include("$_SERVER[DOCUMENT_ROOT]/views/shared/footer.php");
?>