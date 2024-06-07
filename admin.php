<?php
    include "./header.php";
?>

<!-- Modal -->
<form class="modal fade" id="formModal" tabindex="-1" aria-labelledby="formModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-xl w-max-content">
        <div class="modal-content text-dark">
            <div class="modal-body d-flex">
                
                <input type="text" name="" id="" placeholder="Nom de l'aventure">
                <textarea name="" id="" placeholder="Description"></textarea>

            </div>
        </div>
    </div>
</form>



<section class="container">
    <h1 class="text-center">Aventures</h1>

    <div>
        <div id="adventureList" class="row">

            <div class="col-4">
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