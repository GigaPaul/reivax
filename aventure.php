<?php
    include "./header.php";

    if(!isset($_GET["id_aventure"])) {
        header("Location: index.php");
    }
?>


<!-- Button trigger modal -->
<div class="fixed-bottom mb-3 ms-3 w-max-content">
    <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#volumeModal">
        <i class="fa-solid fa-volume-high"></i>
    </button>        
</div>



<!-- Modal -->
<div class="modal fade" id="volumeModal" tabindex="-1" aria-labelledby="volumeModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-lg w-max-content">
        <div class="modal-content text-dark">
            <div class="modal-body d-flex">
                <!-- Général -->
                <article data-tag="general" class="d-flex justify-content-center flex-column me-5">
    
                    <h3 class="mb-3">
                        <label for="GeneralVolume">Général</label>
                    </h3>
    
                    <div class="mb-3">
                        <input type="range" name="" id="GeneralVolume" class="volume__range d-block m-auto" value="100">
                        <input type="hidden" name="RelativeValue" value="100">
                    </div>
    
    
                    <div>
                        <button id="GeneralMute" class="MuteVolumeBtn d-block m-auto btn btn-link">
                            <i class="fa-solid fa-volume-low"></i>
                        </button>
                    </div>
    
                </article>
    
    
    
                <!-- Ambiance -->
                <article data-tag="ambiance" class="d-flex justify-content-center flex-column me-5">
                    <h3 class="mb-3">
                        <label for="AmbianceVolume">Ambiance</label>
                    </h3>
    
                    <div class="mb-3">
                        <input type="range" name="" id="AmbianceVolume" class="volume__range d-block m-auto">
                        <input type="hidden" name="RelativeValue">
                    </div>
    
    
                    <div>
                        <button class="MuteVolumeBtn d-block m-auto btn btn-link">
                            <i class="fa-solid fa-volume-low"></i>
                        </button>
                    </div>
                </article>
                
    
    
                <!-- Sons -->
                <article data-tag="sons" class="d-flex justify-content-center flex-column me-5">
                    <h3 class="mb-3">
                        <label for="SonsVolume">Sons</label>
                    </h3>
    
                    <div class="mb-3">
                        <input type="range" name="" id="SonsVolume" class="volume__range d-block m-auto">
                        <input type="hidden" name="RelativeValue">
                    </div>
    
    
                    <div>
                        <button class="MuteVolumeBtn d-block m-auto btn btn-link">
                            <i class="fa-solid fa-volume-low"></i>
                        </button>
                    </div>
                </article>
    
    
    
                <!-- Musique -->
                <article data-tag="musique" class="d-flex justify-content-center flex-column">
                    <h3 class="mb-3">
                        <label for="MusicVolume">Musiques</label>
                    </h3>
    
                    <div class="mb-3">
                        <input type="range" name="" id="MusicVolume" class="volume__range d-block m-auto">
                        <input type="hidden" name="RelativeValue">
                    </div>
    
    
                    <div>
                        <button class="MuteVolumeBtn d-block m-auto btn btn-link">
                            <i class="fa-solid fa-volume-low"></i>
                        </button>
                    </div>
                </article>
            </div>
        </div>
    </div>
</div>



<div class="container position-relative">


    <section>
        <div>
            <h1 class="text-center">Reivax</h1>
            <p class="text-center">
                <a href="display.html" target="_blank" class="text-center">Ouvrir le display</a>
            </p>
            
        </div>


        <article class="mb-5">
            <h2 class="text-center">Landscapes</h2>
            <div class="row" id="landscapeOutput"></div>
        </article>





        <article id="ambienceSelector" class="mb-5">
            <h2 class="text-center">Ambiance</h2>
            <output id="ambienceOutput" class="d-flex justify-content-center"></output>
        </article>





        <article class="mb-5">
            <div class="container">
                <div class="row">
                    <h2 class="text-center">Sons</h2>
                    <div class="col-6">
                        <output id="soundOutput" class="row"></output>
                    </div>
        
                    <output id="activeSounds" class="col-6 d-flex flex-column"></output>                        
                </div>
            </div>


        </article>

    




        <article class="mb-5">
            <h2 class="text-center">Musique</h2>

            <output id="musicOutput" class="row"></output>

            <div id="musicAudios">
                <audio data-volume="musique" preload="metadata" src=""></audio>
                <audio data-volume="musique" preload="metadata" src=""></audio>
            </div>
        </article>
    </section>
</div>


<?php
    include "./footer.php";
?>