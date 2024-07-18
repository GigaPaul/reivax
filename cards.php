<?php
    include "./header.php";
?>

<form method="post" action="">
    <input type="text" name="name" id="" placeholder="Nom" autocomplete="off" class="form-control">

    <div class="d-flex">
        <input type="number" name="challenge_rating" id="" placeholder="Puissance" autocomplete="off" class="form-control">
        <input type="number" name="size" id="" placeholder="Taille" autocomplete="off" class="form-control">
    </div>
    <div class="d-flex">
        <input type="number" name="strength" id="" placeholder="Force" autocomplete="off" class="form-control">
        <input type="number" name="dexterity" id="" placeholder="Dextérité" autocomplete="off" class="form-control">
        <input type="number" name="constitution" id="" placeholder="Constitution" autocomplete="off" class="form-control">
        <input type="number" name="intelligence" id="" placeholder="Intelligence" autocomplete="off" class="form-control">
        <input type="number" name="wisdom" id="" placeholder="Sagesse" autocomplete="off" class="form-control">
        <input type="number" name="charisma" id="" placeholder="Charisme" autocomplete="off" class="form-control">
    </div>

    <div>
        <input type="number" name="hitpoints" id="" placeholder="Points de vie" autocomplete="off" class="form-control">
        <input type="number" name="armor_class" id="" placeholder="Classe d'armure" autocomplete="off" class="form-control">
        <input type="number" name="speed" id="" placeholder="Vitesse" autocomplete="off" class="form-control">
    </div>
    
    <div>
        <div>
            <input type="text" name="resistances[]" id="" placeholder="Résistance" autocomplete="off" class="form-control">
        </div>
        <div>
            <input type="text" name="immunities[]" id="" placeholder="Immunité" autocomplete="off" class="form-control">
        </div>
        <div>
            <input type="text" name="proficiencies[]" id="" placeholder="Maîtrise" autocomplete="off" class="form-control">
        </div>
    </div>

    <input type="submit" class="btn btn-primary" value="Valider">
</form>

<?php
    include "./footer.php";
?>