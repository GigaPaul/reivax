<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reivax</title>
    <link rel="stylesheet" href="./assets/styles/bootstrap.min.css">
    <link href="./assets/fontawesome/css/fontawesome.min.css" rel="stylesheet" />
    <link href="./assets/fontawesome/css/solid.min.css" rel="stylesheet" />
    <link rel="stylesheet" href="./assets/styles/main.css">
</head>
<body class="text-bg-dark">

    <header class="navbar navbar-expand-lg bg-dark border-bottom border-body d-none d-md-block" data-bs-theme="dark">
        <div class="container">
            <a href="index.php" class="navbar-brand">Reivax</a>

            <nav class="navbar-collapse collapse show">
                <ul class="d-flex navbar-nav me-auto mb-2 mb-lg-0" id="headerNavbar">
                    <li class="nav-item">
                        <button type="button" id="addLandscapeButton" class="btn-link nav-link" data-bs-toggle="modal" data-bs-target="#landscapeForm">Décors</button>
                    </li>

                    <li class="nav-item">
                        <button type="button" id="addAmbienceButton" class="btn-link nav-link" data-bs-toggle="modal" data-bs-target="#ambienceForm">Ambiances</button>
                    </li>

                    <li class="nav-item">
                        <button type="button" id="addSoundFamilyButton" class="btn-link nav-link" data-bs-toggle="modal" data-bs-target="#soundForm">Sons</button>
                    </li>

                    <li class="nav-item">
                        <button type="button" id="addPlaylistButton" class="btn-link nav-link" data-bs-toggle="modal" data-bs-target="#playlistForm">Musiques</button>
                    </li>
                </ul>
            </nav>
        </div>

    </header>



    <?php
    include "./forms.php";
    ?>