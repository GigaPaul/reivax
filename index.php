<?php
    include "./header.php";
?>


<!-- Button trigger modal -->
<div class="sticky-top pt-5 ps-5">
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



<div class="container">
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
                        <div class="row">
                            <div class="sounds__container col-3" data-name="Pluie" >
                                <ul class="sounds__playlist d-none">
                                    <li data-url="RainLightLoop.ogg"></li>
                                </ul>
                            </div>

                            <div class="sounds__container col-3" data-name="Pic vert" >
                                <ul class="sounds__playlist d-none">
                                    <li data-url="AMB_Drustvar_WoodPecker_FlavorKit_01.ogg"></li>
                                    <li data-url="AMB_Drustvar_WoodPecker_FlavorKit_02.ogg"></li>
                                    <li data-url="AMB_Drustvar_WoodPecker_FlavorKit_03.ogg"></li>
                                    <li data-url="AMB_Drustvar_WoodPecker_FlavorKit_04.ogg"></li>
                                    <li data-url="AMB_Drustvar_WoodPecker_FlavorKit_05.ogg"></li>
                                </ul>
                            </div>

                            <div class="sounds__container col-3" data-name="Loup" >
                                <ul class="sounds__playlist d-none">
                                    <li data-url="fx_fw_wolfhowl_dry_01.ogg"></li>
                                    <li data-url="fx_fw_wolfhowl_dry_02.ogg"></li>
                                    <li data-url="fx_fw_wolfhowl_dry_03.ogg"></li>
                                    <li data-url="fx_fw_wolfhowl_dry_04.ogg"></li>
                                    <li data-url="fx_fw_wolfhowl_dry_05.ogg"></li>
                                    <li data-url="fx_fw_wolfhowl_dry_06.ogg"></li>
                                    <li data-url="fx_fw_wolfhowl_dry_07.ogg"></li>
                                </ul>
                            </div>

                            <div class="sounds__container col-3" data-name="Chouette" >
                                <ul class="sounds__playlist d-none">
                                    <li data-url="FX_Owl01.ogg"></li>
                                    <li data-url="FX_Owl02.ogg"></li>
                                    <li data-url="FX_Owl03.ogg"></li>
                                    <li data-url="FX_Owl04.ogg"></li>
                                    <li data-url="FX_Owl05.ogg"></li>
                                </ul>
                            </div>

                            <div class="sounds__container col-3" data-name="Feu de camp" >
                                <ul class="sounds__playlist d-none">
                                    <li data-url="FX_PA_Fire_Small_Loop.ogg"></li>
                                </ul>
                            </div>

                            <div class="sounds__container col-3" data-name="Criquets" >
                                <ul class="sounds__playlist d-none">
                                    <li data-url="AMB_Drustvar_Crickets_Loop_FlavorKit_01.ogg"></li>
                                    <li data-url="AMB_Drustvar_Crickets_Loop_FlavorKit_02.ogg"></li>
                                    <li data-url="AMB_Drustvar_Crickets_Loop_FlavorKit_03.ogg"></li>
                                </ul>
                            </div>

                            <div class="sounds__container col-3" data-name="Chariot" >
                                <ul class="sounds__playlist d-none">
                                    <li data-url="GilneasStageCoach_WheelsOS_01.ogg"></li>
                                    <li data-url="GilneasStageCoach_WheelsOS_02.ogg"></li>
                                    <li data-url="GilneasStageCoach_WheelsOS_03.ogg"></li>
                                    <li data-url="GilneasStageCoach_WheelsOS_04.ogg"></li>
                                    <li data-url="GilneasStageCoach_WheelsOS_05.ogg"></li>
                                </ul>
                            </div>

                            <div class="sounds__container col-3" data-name="Bataille" >
                                <ul class="sounds__playlist d-none">
                                    <li data-url="AMB_shadowmoonironhordebattle_loop.ogg"></li>
                                </ul>
                            </div>

                            <div class="sounds__container col-3" data-name="Cloche" >
                                <ul class="sounds__playlist d-none">
                                    <li data-url="FX_DarkmoonFaire_Bell.ogg"></li>
                                </ul>
                            </div>
                        </div>
                
                    </div>
        
                    <output id="activeSounds" class="col-6 d-flex flex-column"></output>                        
                </div>
            </div>


        </article>

    




        <article class="mb-5">
            <h2 class="text-center">Musique</h2>

            <output id="musicOutput"></output>

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