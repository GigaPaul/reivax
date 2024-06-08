<?php
    include "./header.php";
?>












<!-- Modal -->
<form class="modal fade" id="formModal" tabindex="-1" aria-labelledby="formModalLabel" aria-hidden="true">
<!-- <form class="modal fade show d-block" id="formModal" tabindex="-1" aria-labelledby="formModalLabel" aria-hidden="true"> -->
    <div class="modal-dialog modal-xl">
        <div class="modal-content text-dark">
            <div class="modal-body">
                
                <div class="mb-2">
                    <input type="text" name="name" id="" placeholder="Nom de l'aventure" class="form-control mb-1">
                    <input class="form-control mb-1" type="file" id="backgroundInput" name="background">

                    <textarea name="" id="description" placeholder="Description" class="form-control"></textarea>                    
                </div>


                <div class="accordion" id="accordionExample">
                    <div class="accordion-item">
                        <h2 class="accordion-header">
                            <button class="accordion-button" type="button" data-bs-toggle="collapse"
                                data-bs-target="#collapseLandscapes" aria-expanded="true" aria-controls="collapseLandscapes">
                                Décors
                            </button>
                        </h2>
                        <div id="collapseLandscapes" class="accordion-collapse collapse show" data-bs-parent="#accordionExample">
                            <div class="accordion-body">

                                <section class="row">
                                    <div class="input-group mb-3">
                                        <span class="input-group-text" id="basic-addon1"><i class="fa-solid fa-magnifying-glass"></i></span>
                                        <input type="search" name="" id="" placeholder="Rechercher un décor" class="form-control" aria-describedby="basic-addon1">
                                    </div>
                                </section>



                                <section class="row">
                                    <!-- Card landscape -->
                                    <article class="col-3">
                                        <div class="card fade show adventureForm__card">

                                            <div style="height:135px" class="overflow-hidden">
                                                <video src="./assets/landscapes/100_Goblin-Ambush.mp4" 
                                                    class="card-img-top"
                                                    disablePictureInPicture></video>
                                            </div>
                                            
                                            <div class="card-body">
                                                <p class="m-0 text-truncate">Embuscade des Gobelins</p>
                                            </div>
                                        </div>
                                    </article>
                                    <!--  -->                                        
                                </section>
                            </div>
                        </div>
                    </div>


                    <div class="accordion-item">
                        <h2 class="accordion-header">
                            <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse"
                                data-bs-target="#collapseAmbiances" aria-expanded="false" aria-controls="collapseAmbiances">
                                Ambiances
                            </button>
                        </h2>
                        <div id="collapseAmbiances" class="accordion-collapse collapse" data-bs-parent="#accordionExample">
                            <div class="accordion-body">

                            </div>
                        </div>
                    </div>


                    <div class="accordion-item">
                        <h2 class="accordion-header">
                            <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse"
                                data-bs-target="#collapseSons" aria-expanded="false" aria-controls="collapseSons">
                                Sons
                            </button>
                        </h2>
                        <div id="collapseSons" class="accordion-collapse collapse" data-bs-parent="#accordionExample">
                            <div class="accordion-body">

                            </div>
                        </div>
                    </div>


                    <div class="accordion-item">
                        <h2 class="accordion-header">
                            <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse"
                                data-bs-target="#collapseMusiques" aria-expanded="false" aria-controls="collapseMusiques">
                                Musiques
                            </button>
                        </h2>
                        <div id="collapseMusiques" class="accordion-collapse collapse" data-bs-parent="#accordionExample">
                            <div class="accordion-body">

                            </div>
                        </div>
                    </div>
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
                <button class="btn btn-outline-light w-100 h-100" data-bs-toggle="modal" data-bs-target="#formModal">
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