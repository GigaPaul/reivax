<?php
    include "./header.php";
?>












<!-- Modal -->
<form class="modal fade" id="editAdventureForm" tabindex="-1" aria-labelledby="editAdventureFormLabel" aria-hidden="true">
<!-- <form class="modal fade show d-block" id="editAdventureForm" tabindex="-1" aria-labelledby="editAdventureFormLabel" aria-hidden="true"> -->
    <div class="modal-dialog modal-xl">
        <div class="modal-content text-dark">
            <div class="modal-body">
                
                <div class="mb-2">
                    <input type="text" name="name" id="" placeholder="Nom de l'aventure" class="form-control mb-1">
                    <input class="form-control mb-1" type="file" id="backgroundInput" name="background">

                    <textarea name="description" id="description" placeholder="Description" class="form-control"></textarea>                    
                </div>


                <!-- LANDSCAPES -->
                <div class="accordion mb-2" id="accordionExample">
                    <div class="accordion-item">
                        <h2 class="accordion-header">
                            <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse"
                                data-bs-target="#collapseLandscapes" aria-expanded="true" aria-controls="collapseLandscapes">
                                Décors
                            </button>
                        </h2>
                        <div id="collapseLandscapes" class="accordion-collapse collapse" data-bs-parent="#accordionExample">
                            <div class="accordion-body">

                                <section class="row">
                                    <div class="input-group mb-3">
                                        <span class="input-group-text"><i class="fa-solid fa-magnifying-glass"></i></span>
                                        <input id="searchLandscape" type="search" name="search_landscape" placeholder="Rechercher un décor" class="form-control" aria-describedby="basic-addon1">
                                        <button id="resetLandscape" class="btn btn-outline-secondary resetSearch" type="button"><i class="fa-solid fa-rotate"></i></button>
                                    </div>
                                </section>


                                <output id="formOutputLandscapes" class="w-100"></output>
                            </div>
                        </div>
                    </div>


                    <!-- AMBIANCES -->
                    <div class="accordion-item">
                        <h2 class="accordion-header">
                            <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse"
                                data-bs-target="#collapseAmbiances" aria-expanded="false" aria-controls="collapseAmbiances">
                                Ambiances
                            </button>
                        </h2>
                        <div id="collapseAmbiances" class="accordion-collapse collapse" data-bs-parent="#accordionExample">
                            <div class="accordion-body">

                                <section class="row">
                                    <div class="input-group mb-3">
                                        <span class="input-group-text"><i class="fa-solid fa-magnifying-glass"></i></span>
                                        <input id="searchAmbience" type="search" name="search_ambience" placeholder="Rechercher une ambiance" class="form-control" aria-describedby="basic-addon1">
                                        <button id="resetAmbience" class="btn btn-outline-secondary resetSearch" type="button"><i class="fa-solid fa-rotate"></i></button>
                                    </div>
                                </section>

                                <output id="formOutputAmbiences" class="w-100"></output>
                            </div>
                        </div>
                    </div>


                    <!-- SONS -->
                    <div class="accordion-item">
                        <h2 class="accordion-header">
                            <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse"
                                data-bs-target="#collapseSons" aria-expanded="false" aria-controls="collapseSons">
                                Sons
                            </button>
                        </h2>
                        <div id="collapseSons" class="accordion-collapse collapse" data-bs-parent="#accordionExample">
                            <div class="accordion-body">

                                <section class="row">
                                    <div class="input-group mb-3">
                                        <span class="input-group-text"><i class="fa-solid fa-magnifying-glass"></i></span>
                                        <input id="searchSon" type="search" name="search_son" placeholder="Rechercher un son" class="form-control" aria-describedby="basic-addon1">
                                        <button id="resetSon" class="btn btn-outline-secondary resetSearch" type="button"><i class="fa-solid fa-rotate"></i></button>
                                    </div>
                                </section>

                                <output id="formOutputSounds" class="w-100"></output>
                            </div>
                        </div>
                    </div>


                    <!-- MUSIQUES -->
                    <div class="accordion-item">
                        <h2 class="accordion-header">
                            <button class="accordion-button" type="button" data-bs-toggle="collapse"
                                data-bs-target="#collapseMusiques" aria-expanded="false" aria-controls="collapseMusiques">
                                Musiques
                            </button>
                        </h2>
                        <div id="collapseMusiques" class="accordion-collapse collapse show" data-bs-parent="#accordionExample">
                            <div class="accordion-body">
                                <section class="row">
                                    <div class="input-group mb-3">
                                        <span class="input-group-text"><i class="fa-solid fa-magnifying-glass"></i></span>
                                        <input id="searchPlaylist" type="search" name="search_playlist" placeholder="Rechercher une musique" class="form-control" aria-describedby="basic-addon1">
                                        <button id="resetPlaylist" class="btn btn-outline-secondary resetSearch" type="button"><i class="fa-solid fa-rotate"></i></button>
                                    </div>
                                </section>

                                <output id="formOutputMusics" class="w-100"></output>
                            </div>
                        </div>
                    </div>
                </div>

                <div>
                    <button type="submit" class="btn btn-success">Enregistrer</button>
                </div>
            </div>
        </div>
    </div>
</form>



<section class="container">
    <h1 class="text-center">Aventures</h1>

    <div>
        <div id="adventureList" class="row">

            <div class="col-4 mb-3">
                <button class="btn btn-outline-light w-100 h-100" data-bs-toggle="modal" data-bs-target="#editAdventureForm">
                    <i class="fa-solid fa-plus fs-1"></i>
                </button>
            </div>
        </div>        
    </div>


</section>

</body>
<script src="assets/js/src/jquery.js" type="module"></script>
<script src="assets/js/src/bootstrap.min.js" type="module"></script>
<script src="assets/js/unit_test/admin.js" type="module"></script>
</html>