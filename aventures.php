<?php
    include "./header.php";
?>

<div class="container">
    <ouput id="outputAventures" class="row"></ouput>



    <!-- AMBIENCE -->
    <article id="ambienceSelector" class="mb-5">
            <h2 class="text-center">Ambiance</h2>
            <output id="ambienceOutput" class="d-flex justify-content-center"></output>
    </article>



    <!-- MUSIC -->
    <article class="mb-5">
        <h2 class="text-center">Musique</h2>

        <output id="musicOutput"></output>

        <div id="musicAudios">
            <audio data-volume="musique" preload="metadata" src=""></audio>
            <audio data-volume="musique" preload="metadata" src=""></audio>
        </div>
    </article>
</div>



</body>
<script src="assets/js/src/jquery.js" type="module"></script>
<script src="assets/js/src/bootstrap.min.js" type="module"></script>
<script src="assets/js/unit_test/manageAventures.js" type="module"></script>
</html>