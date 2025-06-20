<div id="popupContainer" class="position-fixed bottom-0 start-50 pb-2" style="z-index: 99999; transform: translateX(-50%)"></div>

<!-- FORM LANDSCAPE -->
<form class="modal fade modal-form" id="landscapeForm">
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content text-dark">
            <div class="modal-header">
                <h5 class="modal-title text-center w-100">Ajout d'un décor</h5>
            </div>
            <div class="modal-body">
                <input type="hidden" name="type" value="upload">
                <input type="hidden" name="for" value="file">

                <input type="text" name="name" class="form-control mb-1" placeholder="Nom du décor" required autocomplete="off">
                <input type="file" name="url" class="form-control mb-1" accept="image/png, image/jpeg, video/mp4" required>
                <input type="submit" value="Enregistrer" class="btn btn-success d-block m-auto">
            </div>
        </div>
    </div>
</form>

<!-- FORM AMBIENCE -->
<form class="modal fade modal-form" id="ambienceForm">
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content text-dark">
            <div class="modal-header">
                <h5 class="modal-title text-center w-100">Ajout d'une ambiance</h5>
            </div>
            <div class="modal-body">
                <input type="hidden" name="type" value="upload">
                <input type="hidden" name="for" value="file">

                <input type="text" name="name" class="form-control mb-1" placeholder="Nom de l'ambiance" required autocomplete="off">
                <input type="file" name="url" class="form-control mb-1" accept="audio/*" required>
                <input type="submit" value="Enregistrer" class="btn btn-success d-block m-auto">
            </div>
        </div>
    </div>
</form>

<!-- FORM SOUND -->
<form class="modal fade modal-form" id="soundForm">
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content text-dark">
            <div class="modal-header">
                <h5 class="modal-title text-center w-100">Ajout de sons</h5>
            </div>
            <div class="modal-body">
                <input type="hidden" name="type" value="upload">
                <input type="hidden" name="for" value="file">

                <input type="text" name="name" class="form-control mb-1" placeholder="Nom de la famille de sons" autocomplete="off" required>
                <input type="number" name="frequency" placeholder="Temps entre chaque son (ms)" class="form-control mb-1" min="500">
                <input type="file" name="url[]" class="form-control mb-1" accept="audio/*" multiple required>

                <div class="form-check mb-1">
                    <input id="soundIsLoopCheckbox" type="checkbox" name="is_loop" class="form-check-input" checked>
                    <label for="soundIsLoopCheckbox" class="form-check-label user-select-none">Boucle</label>
                </div>

                <input type="submit" value="Enregistrer" class="btn btn-success d-block m-auto">
            </div>
        </div>
    </div>
</form>

<!-- FORM MUSIC -->
<form class="modal fade modal-form" id="playlistForm">
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content text-dark">
            <div class="modal-header">
                <h5 class="modal-title text-center w-100">Ajout d'une playlist</h5>
            </div>
            <div class="modal-body">
                <input type="hidden" name="type" value="upload">
                <input type="hidden" name="for" value="file">

                <input type="text" name="name" class="form-control mb-1" placeholder="Nom de la famille de sons" autocomplete="off" required>
                <input type="file" name="url[]" class="form-control mb-1" accept="audio/*" multiple required>

                <output class="w-100 mb-1"></output>

                <div class="form-check mb-1">
                    <input id="soundIsShuffledCheckbox" type="checkbox" name="isShuffled" class="form-check-input" checked>
                    <label for="soundIsShuffledCheckbox" class="form-check-label user-select-none">Shuffled</label>
                </div>

                <input type="submit" value="Enregistrer" class="btn btn-success d-block m-auto">
            </div>
        </div>
    </div>
</form>


<!-- Modal -->
<form class="modal fade modal-form" id="editAdventureForm" tabindex="-1" aria-labelledby="editAdventureFormLabel" aria-hidden="true">
<!-- <form class="modal fade show d-block" id="editAdventureForm" tabindex="-1" aria-labelledby="editAdventureFormLabel" aria-hidden="true"> -->
    <input type="hidden" name="id_aventure">
    <div class="modal-dialog modal-xl">
        <div class="modal-content text-dark">
            <div class="modal-body">
                
                <div class="mb-2">
                    <input type="text" name="name" required autocomplete="off" placeholder="Nom de l'aventure" class="form-control form-control-lg mb-1">
                    <input class="form-control mb-1" type="file" id="backgroundInput" accept="image/png, image/jpeg" name="background">

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
                                        <input id="searchLandscape" type="search" name="search_landscape" autocomplete="off" placeholder="Rechercher un décor" class="form-control" aria-describedby="basic-addon1">
                                        <button id="resetLandscape" class="btn btn-outline-secondary resetSearch" type="button"><i class="fa-solid fa-rotate"></i></button>
                                    </div>
                                </section>


                                <!-- <output id="formOutputLandscapesSearchResults" class="row d-none"></output> -->
                                <output id="formOutputLandscapes" class="row"></output>
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
                                        <input id="searchAmbience" type="search" name="search_ambience" autocomplete="off" placeholder="Rechercher une ambiance" class="form-control" aria-describedby="basic-addon1">
                                        <button id="resetAmbience" class="btn btn-outline-secondary resetSearch" type="button"><i class="fa-solid fa-rotate"></i></button>
                                    </div>
                                </section>

                                <output id="formOutputAmbiences" class="row"></output>
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
                                        <input id="searchSon" type="search" name="search_son" autocomplete="off" placeholder="Rechercher un son" class="form-control" aria-describedby="basic-addon1">
                                        <button id="resetSon" class="btn btn-outline-secondary resetSearch" type="button"><i class="fa-solid fa-rotate"></i></button>
                                    </div>
                                </section>

                                <output id="formOutputSounds" class="row"></output>
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
                                        <input id="searchPlaylist" type="search" name="search_playlist" autocomplete="off" placeholder="Rechercher une musique" class="form-control" aria-describedby="basic-addon1">
                                        <button id="resetPlaylist" class="btn btn-outline-secondary resetSearch" type="button"><i class="fa-solid fa-rotate"></i></button>
                                    </div>
                                </section>

                                <output id="formOutputMusics" class="row"></output>
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