<?php
require_once("./assets/php/func.php");

$type = $_POST["type"];
$for = $_POST["for"];






$config = array(
    'driver' => 'mysql',
    'host' => 'localhost',
    'dbname' => 'dnd_companion',
    'user' => 'root',
    'mdp' => ''
);

$pdo = new PDO($config['driver'].':host='.$config['host'].';dbname='.$config['dbname'].';charset=utf8', $config['user'], $config['mdp']);
$pdo->setAttribute(PDO::ATTR_EMULATE_PREPARES, false);




class Adventure {
    public $id_aventure;
    public $name;
    public $background;
    public $description;

    public $ambiences = array();
    public $landscapes = array();
    public $playlists = array();
    public $soundfamilies = array();

    function __construct($obj) {
        $this->id_aventure = intval($obj->id_aventure);
        $this->name = $obj->name;
        $this->background = $obj->background;
        $this->description = $obj->description;
    }
}


class File {
    public $tmp_name;
    public $name;
    public $pathfile;

    function __construct($tmp_name, $name) {
        $this->tmp_name = $tmp_name;
        $this->name = $name;
    }

    public function Upload() {
        $mime = mime_content_type($this->tmp_name);
        $folder = "";

        if(str_contains($mime, "image/")) {
            $folder .= "images/";
        }
        else if(str_contains($mime, "video/")) {
            $folder .= "videos/";
        }
        else if(str_contains($mime, "audio/")) {
            $folder .= "audios/";
        }
        else {
            return;
        }
     
        $fileExists = true;
        $uploadDir = "assets/upload/";
        $pathfile = "";
        $ext = pathinfo($this->name, PATHINFO_EXTENSION);
        $originalName = explode(".", $this->name)[0];

        // Generate a random unique name
        while($fileExists) {
            $randomString = getRandomString();
            $pathfile = $uploadDir.$folder.$originalName."_".$randomString.".".$ext;
            $fileExists = file_exists($pathfile);
        }

        // Upload the file
        move_uploaded_file($this->tmp_name, $pathfile);

        $this->pathfile = $pathfile;
    }
}




switch($type)
{
    case "insert":
        switch($for) {
            case "adventure":
                $adventure = $_POST["adventure"];

                $data = [
                    $adventure["name"],
                    $adventure["background"],
                    $adventure["description"]
                ];

                $sql = "INSERT INTO aventures (name, background, description) VALUES (?,?,?)";
                $stmt = $pdo->prepare($sql);
                $stmt->execute($data);

                $adventure["id_aventure"] = $pdo->lastInsertId();






                // ==================== LANDSCAPES ====================
                if(array_key_exists("landscapes", $adventure)) {
                    $stmt = $pdo->prepare("INSERT INTO aventures_landscapes (id_aventure, id_landscape) VALUES (?,?)");

                    try {
                        $pdo->beginTransaction();

                        foreach($adventure["landscapes"] as $row) {
                            $data = [
                                $adventure["id_aventure"],
                                $row["id_landscape"]
                            ];

                            $stmt->execute($data);
                        }

                        $pdo->commit();
                     
                    }catch(Exception $e) {
                        $pdo->rollback();
                        throw $e;
                    }
                }




                
                // ==================== AMBIENCES ====================
                if(array_key_exists("ambiences", $adventure)) {
                    $stmt = $pdo->prepare("INSERT INTO aventures_ambiences (id_aventure, id_ambience) VALUES (?,?)");

                    try {
                        $pdo->beginTransaction();

                        foreach($adventure["ambiences"] as $row) {
                            $data = [
                                $adventure["id_aventure"],
                                $row["id_ambience"]
                            ];

                            $stmt->execute($data);
                        }

                        $pdo->commit();
                     
                    }catch(Exception $e) {
                        $pdo->rollback();
                        throw $e;
                    }
                }




                
                // ==================== SOUNDS ====================
                if(array_key_exists("soundFamilies", $adventure)) {
                    $stmt = $pdo->prepare("INSERT INTO aventures_soundfamilies (id_aventure, id_soundfamily) VALUES (?,?)");

                    try {
                        $pdo->beginTransaction();

                        foreach($adventure["soundFamilies"] as $row) {
                            $data = [
                                $adventure["id_aventure"],
                                $row["id_soundFamily"]
                            ];

                            $stmt->execute($data);
                        }

                        $pdo->commit();
                     
                    }catch(Exception $e) {
                        $pdo->rollback();
                        throw $e;
                    }
                }




                
                // ==================== MUSICS ====================
                if(array_key_exists("playlists", $adventure)) {
                    $stmt = $pdo->prepare("INSERT INTO aventures_playlists (id_aventure, id_playlist) VALUES (?,?)");

                    try {
                        $pdo->beginTransaction();

                        foreach($adventure["playlists"] as $row) {
                            $data = [
                                $adventure["id_aventure"],
                                $row["id_playlist"]
                            ];

                            $stmt->execute($data);
                        }

                        $pdo->commit();
                     
                    }catch(Exception $e) {
                        $pdo->rollback();
                        throw $e;
                    }
                }

                // Return the new id_aventure
                echo intval($adventure["id_aventure"]);
                break;





            case "landscape":
                $landscape = $_POST["landscape"];

                $data = [
                    $landscape["name"],
                    $landscape["url"]
                ];

                $sql = "INSERT INTO landscapes (name, url) VALUES (?,?)";
                $stmt = $pdo->prepare($sql);
                $stmt->execute($data);

                $landscape["id_landscape"] = $pdo->lastInsertId();

                echo intval($landscape["id_landscape"]);
                break;

            case "ambience":
                $ambience = $_POST["ambience"];

                $data = [
                    $ambience["name"],
                    $ambience["url"]
                ];

                $sql = "INSERT INTO ambiences (name, url) VALUES (?,?)";
                $stmt = $pdo->prepare($sql);
                $stmt->execute($data);

                $ambience["id_ambience"] = $pdo->lastInsertId();

                echo intval($ambience["id_ambience"]);
                break;

            case "soundFamily":
                $soundFamily = $_POST["soundFamily"];

                $data = [
                    $soundFamily["name"],
                    $soundFamily["frequency"],
                    filter_var($soundFamily["isLoop"], FILTER_VALIDATE_BOOLEAN)
                ];

                $sql = "INSERT INTO soundfamilies (name, frequency, is_loop) VALUES (?,?,?)";
                $stmt = $pdo->prepare($sql);
                $stmt->execute($data);

                $soundFamily["id_soundFamily"] = $pdo->lastInsertId();

                // Sounds
                $stmt = $pdo->prepare("INSERT INTO sounds (id_soundfamily, url) VALUES (?,?)");


                try {
                    $pdo->beginTransaction();

                    foreach($soundFamily["urls"] as $url) {
                        $data = [
                            $soundFamily["id_soundFamily"],
                            $url
                        ];

                        $stmt->execute($data);
                    }

                    $pdo->commit();
                 
                }catch(Exception $e) {
                    $pdo->rollback();
                    throw $e;
                }



                echo intval($soundFamily["id_soundFamily"]);
                break;

            case "playlist":
                $playlist = $_POST["playlist"];

                $data = [
                    $playlist["name"],
                    filter_var($playlist["isShuffled"], FILTER_VALIDATE_BOOLEAN)
                ];

                $sql = "INSERT INTO playlists (name, is_shuffle) VALUES (?,?)";
                $stmt = $pdo->prepare($sql);
                $stmt->execute($data);

                $playlist["id_playlist"] = $pdo->lastInsertId();

                // Musics
                $stmt = $pdo->prepare("INSERT INTO musics (name, url) VALUES (?,?)");


                try {
                    $pdo->beginTransaction();

                    $id_music_index = array();

                    foreach($playlist["musics"] as $music) {
                        $data = [
                            $music["name"],
                            $music["url"]
                        ];

                        $stmt->execute($data);

                        // Junction table
                        $id_music = $pdo->lastInsertId();
                        array_push($id_music_index, $id_music);
                        // $junctionData = [
                        //     $playlist["id_playlist"],
                        //     $id_music
                        // ];

                        // $sql = "INSERT INTO playlists_musics (id_playlist, id_music) VALUES (?,?)";
                        // $stmt = $pdo->prepare($sql);
                        // $stmt->execute($junctionData);
                    }

                    $pdo->commit();

                    // Junction table
                    
                    $stmt = $pdo->prepare("INSERT INTO playlists_musics (id_playlist, id_music) VALUES (?,?)");

                    try {
                        $pdo->beginTransaction();
    
                        foreach($id_music_index as $id_music) {
                            $data = [
                                $playlist["id_playlist"],
                                $id_music
                            ];
    
                            $stmt->execute($data);
                        }
    
                        $pdo->commit();
                        
                    }catch(Exception $e) {
                        $pdo->rollback();
                        throw $e;
                    }
                 
                }catch(Exception $e) {
                    $pdo->rollback();
                    throw $e;
                }
                //



                echo intval($playlist["id_playlist"]);
                break;
        }
        break;



    case "update":
        switch($for)
        {
            case "adventure":
                $adventure = $_POST['adventure'];
                $adventure["id_aventure"] = intval($adventure["id_aventure"]);
                

                // AVENTURE
                $sqlAdventure = "UPDATE aventures SET name = :name, background = :background, description = :description WHERE id_aventure = :id_aventure";
                $queryAdventure = $pdo->prepare($sqlAdventure);
                $queryAdventure->bindValue(':name', $adventure['name'], PDO::PARAM_STR);
                $queryAdventure->bindValue(':background', $adventure['background'], PDO::PARAM_STR);
                $queryAdventure->bindValue(':description', $adventure['description'], PDO::PARAM_STR);
                $queryAdventure->bindValue(':id_aventure', $adventure['id_aventure'], PDO::PARAM_INT);
                $queryAdventure->execute();
                //





                // ==================== LANDSCAPES ====================
                // We select which landscapes are currently linked to this adventure
                $sqlBDDLandscapes = "SELECT id_landscape FROM aventures_landscapes WHERE id_aventure = :id_aventure";
                $queryBDDLandscapes = $pdo->prepare($sqlBDDLandscapes);
                $queryBDDLandscapes->bindValue(':id_aventure', $adventure['id_aventure'], PDO::PARAM_INT);
                $queryBDDLandscapes->execute();
                $BDDLandscapes = $queryBDDLandscapes->fetchALL(PDO::FETCH_COLUMN);
                

                $landscapesToAdd = array();
                $landscapesToDel = array();
                // We formate $landscapesToDel tel que [id_aventure, id_landscape]
                foreach($BDDLandscapes as $row) {
                    $val = [
                        $adventure["id_aventure"],
                        $row
                    ];

                    array_push($landscapesToDel, $val);
                }


                // If the adventure sent by form has landscapes
                if(array_key_exists("landscapes", $adventure)) {
                    // Determine which landscapes to keep or add in the DB
                    foreach($adventure["landscapes"] as $local)
                    {
                        $local["id_landscape"] = intval($local["id_landscape"]);
                        


                        // This landscape is both in local and DB, no need to change anything
                        if(in_array($local["id_landscape"], $BDDLandscapes)) {
                            $val = [
                                $adventure["id_aventure"],
                                $local["id_landscape"]
                            ];

                            // We remove it from the "to delete" array
                            $indexToKeep = array_search($val, $landscapesToDel);
                            array_splice($landscapesToDel, $indexToKeep, 1);
                            continue;
                        }
                        // This landscape is in local but not on the DB, we need to add it to the DB
                        else {
                            // We add it to the "to add" array
                            $aventures_landscapes = [$adventure["id_aventure"], $local["id_landscape"]];
                            array_push($landscapesToAdd, $aventures_landscapes);
                            continue;
                        }
                    }
                }
                


                // If there are landscapes to insert
                if(count($landscapesToAdd) > 0) {
                    $stmt = $pdo->prepare("INSERT INTO aventures_landscapes (id_aventure, id_landscape) VALUES (?,?)");

                    try {
                        $pdo->beginTransaction();

                        foreach($landscapesToAdd as $row) {
                            $stmt->execute($row);
                        }

                        $pdo->commit();
                     
                    }catch(Exception $e) {
                        $pdo->rollback();
                        throw $e;
                    }
                }


                // If there are landscapes to delete
                if(count($landscapesToDel) > 0) {
                    $stmt = $pdo->prepare("DELETE FROM aventures_landscapes WHERE id_aventure = ? AND id_landscape = ?");

                    try {
                        $pdo->beginTransaction();

                        foreach($landscapesToDel as $row) {
                            $stmt->execute($row);
                        }

                        $pdo->commit();
                     
                    }catch(Exception $e) {
                        $pdo->rollback();
                        throw $e;
                    }
                }




                
                // ==================== AMBIENCES ====================
                // We select which ambiences are currently linked to this adventure
                $stmt = $pdo->prepare('SELECT id_ambience FROM aventures_ambiences WHERE id_aventure = ?');
                $stmt->execute([$adventure["id_aventure"]]);
                $BDDAmbiences = $stmt->fetchAll(PDO::FETCH_COLUMN);

                $ambiencesToAdd = array();
                $ambiencesToDel = array();

                // We formate $ambiencesToDel tel que [id_aventure, id_ambience]
                foreach($BDDAmbiences as $row) {
                    $val = [
                        $adventure["id_aventure"],
                        $row
                    ];

                    array_push($ambiencesToDel, $val);
                }

                



                // If the adventure sent by form has ambiences
                if(array_key_exists("ambiences", $adventure)) {
                    // Determine which ambiences to keep or add in the DB
                    foreach($adventure["ambiences"] as $local)
                    {
                        $local["id_ambience"] = intval($local["id_ambience"]);
                        


                        // This ambience is both in local and DB, no need to change anything
                        if(in_array($local["id_ambience"], $BDDAmbiences)) {
                            $val = [
                                $adventure["id_aventure"],
                                $local["id_ambience"]
                            ];

                            // We remove it from the "to delete" array
                            $indexToKeep = array_search($val, $ambiencesToDel);
                            array_splice($ambiencesToDel, $indexToKeep, 1);
                            continue;
                        }
                        // This ambience is in local but not on the DB, we need to add it to the DB
                        else {
                            // We add it to the "to add" array
                            $aventures_ambiences = [$adventure["id_aventure"], $local["id_ambience"]];
                            array_push($ambiencesToAdd, $aventures_ambiences);
                            continue;
                        }
                    }
                }
                


                // If there are ambiences to insert
                if(count($ambiencesToAdd) > 0) {
                    $stmt = $pdo->prepare("INSERT INTO aventures_ambiences (id_aventure, id_ambience) VALUES (?,?)");

                    try {
                        $pdo->beginTransaction();

                        foreach($ambiencesToAdd as $row) {
                            $stmt->execute($row);
                        }

                        $pdo->commit();
                     
                    }catch(Exception $e) {
                        $pdo->rollback();
                        throw $e;
                    }
                }


                // If there are ambiences to delete
                if(count($ambiencesToDel) > 0) {
                    $stmt = $pdo->prepare("DELETE FROM aventures_ambiences WHERE id_aventure = ? AND id_ambience = ?");

                    try {
                        $pdo->beginTransaction();

                        foreach($ambiencesToDel as $row) {
                            $stmt->execute($row);
                        }

                        $pdo->commit();
                     
                    }catch(Exception $e) {
                        $pdo->rollback();
                        throw $e;
                    }
                }



                
                // ==================== SOUNDS ====================
                // We select which sounds are currently linked to this adventure
                $stmt = $pdo->prepare('SELECT id_soundfamily FROM aventures_soundfamilies WHERE id_aventure = ?');
                $stmt->execute([$adventure["id_aventure"]]);
                $BDDSounds = $stmt->fetchAll(PDO::FETCH_COLUMN);

                $soundsToAdd = array();
                $soundsToDel = array();

                // We formate $soundsToDel tel que [id_aventure, id_soundfamily]
                foreach($BDDSounds as $row) {
                    $val = [
                        $adventure["id_aventure"],
                        $row
                    ];

                    array_push($soundsToDel, $val);
                }

                



                // If the adventure sent by form has sounds
                if(array_key_exists("soundFamilies", $adventure)) {
                    // Determine which sounds to keep or add in the DB
                    foreach($adventure["soundFamilies"] as $local)
                    {
                        $local["id_soundFamily"] = intval($local["id_soundFamily"]);
                        


                        // This sound is both in local and DB, no need to change anything
                        if(in_array($local["id_soundFamily"], $BDDSounds)) {
                            $val = [
                                $adventure["id_aventure"],
                                $local["id_soundFamily"]
                            ];

                            // We remove it from the "to delete" array
                            $indexToKeep = array_search($val, $soundsToDel);
                            array_splice($soundsToDel, $indexToKeep, 1);
                            continue;
                        }
                        // This sound is in local but not on the DB, we need to add it to the DB
                        else {
                            // We add it to the "to add" array
                            $aventures_sounds = [$adventure["id_aventure"], $local["id_soundFamily"]];
                            array_push($soundsToAdd, $aventures_sounds);
                            continue;
                        }
                    }
                }
                


                // If there are sounds to insert
                if(count($soundsToAdd) > 0) {
                    $stmt = $pdo->prepare("INSERT INTO aventures_soundfamilies (id_aventure, id_soundfamily) VALUES (?,?)");

                    try {
                        $pdo->beginTransaction();

                        foreach($soundsToAdd as $row) {
                            $stmt->execute($row);
                        }

                        $pdo->commit();
                     
                    }catch(Exception $e) {
                        $pdo->rollback();
                        throw $e;
                    }
                }


                // If there are sounds to delete
                if(count($soundsToDel) > 0) {
                    $stmt = $pdo->prepare("DELETE FROM aventures_soundfamilies WHERE id_aventure = ? AND id_soundfamily = ?");

                    try {
                        $pdo->beginTransaction();

                        foreach($soundsToDel as $row) {
                            $stmt->execute($row);
                        }

                        $pdo->commit();
                     
                    }catch(Exception $e) {
                        $pdo->rollback();
                        throw $e;
                    }
                }




                
                // ==================== MUSICS ====================
                // We select which musics are currently linked to this adventure
                $stmt = $pdo->prepare('SELECT id_playlist FROM aventures_playlists WHERE id_aventure = ?');
                $stmt->execute([$adventure["id_aventure"]]);
                $BDDPlaylists = $stmt->fetchAll(PDO::FETCH_COLUMN);

                $playlistsToAdd = array();
                $playlistsToDel = array();

                // We formate $playlistsToDel tel que [id_aventure, id_playlist]
                foreach($BDDPlaylists as $row) {
                    $val = [
                        $adventure["id_aventure"],
                        $row
                    ];

                    array_push($playlistsToDel, $val);
                }

                



                // If the adventure sent by form has playlists
                if(array_key_exists("playlists", $adventure)) {
                    // Determine which musics to keep or add in the DB
                    foreach($adventure["playlists"] as $local)
                    {
                        $local["id_playlist"] = intval($local["id_playlist"]);
                        


                        // This music is both in local and DB, no need to change anything
                        if(in_array($local["id_playlist"], $BDDPlaylists)) {
                            $val = [
                                $adventure["id_aventure"],
                                $local["id_playlist"]
                            ];

                            // We remove it from the "to delete" array
                            $indexToKeep = array_search($val, $playlistsToDel);
                            array_splice($playlistsToDel, $indexToKeep, 1);
                            continue;
                        }
                        // This music is in local but not on the DB, we need to add it to the DB
                        else {
                            // We add it to the "to add" array
                            $aventures_playlists = [$adventure["id_aventure"], $local["id_playlist"]];
                            array_push($playlistsToAdd, $aventures_playlists);
                            continue;
                        }
                    }
                }
                


                // If there are musics to insert
                if(count($playlistsToAdd) > 0) {
                    $stmt = $pdo->prepare("INSERT INTO aventures_playlists (id_aventure, id_playlist) VALUES (?,?)");

                    try {
                        $pdo->beginTransaction();

                        foreach($playlistsToAdd as $row) {
                            $stmt->execute($row);
                        }

                        $pdo->commit();
                     
                    }catch(Exception $e) {
                        $pdo->rollback();
                        throw $e;
                    }
                }


                // If there are musics to delete
                if(count($playlistsToDel) > 0) {
                    $stmt = $pdo->prepare("DELETE FROM aventures_playlists WHERE id_aventure = ? AND id_playlist = ?");

                    try {
                        $pdo->beginTransaction();

                        foreach($playlistsToDel as $row) {
                            $stmt->execute($row);
                        }

                        $pdo->commit();
                     
                    }catch(Exception $e) {
                        $pdo->rollback();
                        throw $e;
                    }
                }

                break;





            case "landscape":
                $landscape = $_POST["landscape"];

                $data = [
                    $landscape["name"],
                    $landscape["url"],
                    $landscape["id_landscape"]
                ];

                $sql = "UPDATE landscapes SET name=?, url=? WHERE id_landscape=?";
                $stmt = $pdo->prepare($sql);
                $stmt->execute($data);
                break;





            case "background":
                $sql = "UPDATE current_scene SET background_url = :background_url, type = :type";

    
                $query = $pdo->prepare($sql);
                $query->bindValue(':background_url', $_POST['background_url'], PDO::PARAM_STR);
                $query->bindValue(':type', $_POST['fileType'], PDO::PARAM_STR);
                $query->execute();
                break;

            case "ambience":
                $ambience = $_POST["ambience"];

                $data = [
                    $ambience["name"],
                    $ambience["url"],
                    $ambience["id_ambience"]
                ];

                $sql = "UPDATE ambiences SET name=?, url=? WHERE id_ambience=?";
                $stmt = $pdo->prepare($sql);
                $stmt->execute($data);
                break;
        }
        break;

    case "select":
            switch($for)
            {
                case "background":
                    $sql = "SELECT * FROM current_scene LIMIT 1";
    
        
                    $query = $pdo->prepare($sql);
                    $query->execute();
    
                    if($query->errorCode() == '00000')
                    {
                        $query->setFetchMode(PDO::FETCH_ASSOC);
                        $result = $query->fetchALL();

                        echo json_encode($result);
                    }
                    break;
            }
        break;

    case "selectAll":
        switch($for)
        {
            case "aventures":
                $sql = "SELECT * FROM aventures";
    
        
                $query = $pdo->prepare($sql);
                $query->execute();

                if($query->errorCode() == '00000')
                {
                    $query->setFetchMode(PDO::FETCH_ASSOC);
                    $result = $query->fetchALL();

                    echo json_encode($result);
                }
                break;
        }
        break;

    case "load":
        switch($for) {
            case "aventure":
                // ADVENTURE
                $sqlAdventure = "SELECT * FROM aventures WHERE id_aventure = :id_aventure";

                $queryAdventure = $pdo->prepare($sqlAdventure);
                $queryAdventure->bindValue(':id_aventure', $_POST['id_aventure'], PDO::PARAM_INT);
                $queryAdventure->execute();

                if($queryAdventure->errorCode() == '00000')
                {
                    $queryAdventure->setFetchMode(PDO::FETCH_ASSOC);
                    $adventure = $queryAdventure->fetchObject();
                    $result = new Adventure($adventure);
                }
                //





                // AMBIENCES
                $sqlAmbiences = "SELECT ambiences.* FROM aventures_ambiences 
                INNER JOIN ambiences ON ambiences.id_ambience = aventures_ambiences.id_ambience
                WHERE aventures_ambiences.id_aventure = :id_aventure";

                $queryAmbiences = $pdo->prepare($sqlAmbiences);
                $queryAmbiences->bindValue(':id_aventure', $_POST['id_aventure'], PDO::PARAM_INT);
                $queryAmbiences->execute();

                if($queryAmbiences->errorCode() == '00000')
                {
                    $queryAmbiences->setFetchMode(PDO::FETCH_ASSOC);
                    $ambiences = $queryAmbiences->fetchALL();
                }
                //




                // LANDSCAPES
                $sqlLandscapes = "SELECT landscapes.id_landscape, landscapes.name, landscapes.url FROM aventures_landscapes
                INNER JOIN landscapes ON landscapes.id_landscape = aventures_landscapes.id_landscape
                WHERE aventures_landscapes.id_aventure = :id_aventure";

                $queryLandscapes = $pdo->prepare($sqlLandscapes);
                $queryLandscapes->bindValue(':id_aventure', $_POST['id_aventure'], PDO::PARAM_INT);
                $queryLandscapes->execute();

                if($queryLandscapes->errorCode() == '00000')
                {
                    $queryLandscapes->setFetchMode(PDO::FETCH_ASSOC);
                    $landscapes = $queryLandscapes->fetchALL();
                }
                //



                // PLAYLISTS
                $sqlPlaylists = "SELECT playlists.* FROM aventures_playlists 
                INNER JOIN playlists ON playlists.id_playlist = aventures_playlists.id_playlist
                WHERE aventures_playlists.id_aventure = :id_aventure";

                $queryPlaylists = $pdo->prepare($sqlPlaylists);
                $queryPlaylists->bindValue(':id_aventure', $_POST['id_aventure'], PDO::PARAM_INT);
                $queryPlaylists->execute();

                if($queryPlaylists->errorCode() == '00000') {
                    $queryPlaylists->setFetchMode(PDO::FETCH_ASSOC);
                    $playlists = $queryPlaylists->fetchALL();



                    for($i = 0; $i < count($playlists); $i++) {
                        $playlists[$i]["musics"] = array();
                        $playlists[$i]["is_shuffle"] = filter_var($playlists[$i]["is_shuffle"], FILTER_VALIDATE_BOOLEAN);

                        $sqlMusic = "SELECT musics.name, musics.url FROM playlists_musics 
                        INNER JOIN musics ON playlists_musics.id_music = musics.id_music
                        WHERE playlists_musics.id_playlist = :id_playlist";

                        $queryMusic = $pdo->prepare($sqlMusic);
                        $queryMusic->bindValue(':id_playlist', $playlists[$i]["id_playlist"], PDO::PARAM_INT);
                        $queryMusic->execute();

                        if($queryMusic->errorCode() == '00000') {
                            $queryMusic->setFetchMode(PDO::FETCH_ASSOC);
                            $musics = $queryMusic->fetchALL();

                            $playlists[$i]["musics"] = $musics;
                        }
                    }
                }
                //




                // SOUNDS
                $sqlSoundfamilies = "SELECT soundfamilies.id_soundfamily, soundfamilies.name, soundfamilies.frequency, soundfamilies.is_loop FROM aventures_soundfamilies
                INNER JOIN soundfamilies ON soundfamilies.id_soundfamily = aventures_soundfamilies.id_soundfamily
                WHERE aventures_soundfamilies.id_aventure = :id_aventure";

                $querySoundfamilies = $pdo->prepare($sqlSoundfamilies);
                $querySoundfamilies->bindValue(':id_aventure', $_POST['id_aventure'], PDO::PARAM_INT);
                $querySoundfamilies->execute();

                if($querySoundfamilies->errorCode() == '00000')
                {
                    $querySoundfamilies->setFetchMode(PDO::FETCH_ASSOC);
                    $soundfamilies = $querySoundfamilies->fetchALL();



                    for($i = 0; $i < count($soundfamilies); $i++) {
                        $soundfamilies[$i]["sounds"] = array();
                        $soundfamilies[$i]["is_loop"] = filter_var($soundfamilies[$i]["is_loop"], FILTER_VALIDATE_BOOLEAN);

                        $sqlSounds = "SELECT sounds.url FROM sounds 
                        WHERE id_soundfamily = :id_soundfamily";

                        $querySounds = $pdo->prepare($sqlSounds);
                        $querySounds->bindValue(':id_soundfamily', $soundfamilies[$i]["id_soundfamily"], PDO::PARAM_INT);
                        $querySounds->execute();

                        if($querySounds->errorCode() == '00000') {
                            $querySounds->setFetchMode(PDO::FETCH_ASSOC);
                            $sounds = $querySounds->fetchALL();

                            $soundfamilies[$i]["sounds"] = $sounds;
                        }
                    }
                }
                //

                $result->ambiences = $ambiences;
                $result->landscapes = $landscapes;
                $result->playlists = $playlists;
                $result->soundfamilies = $soundfamilies;
                
                echo json_encode($result);
                break;
        }
        break;

    case "upload":
        switch($for) {
            case "file":
                $result = array();

                // If there are multiple files
                if(is_array($_FILES["url"]["tmp_name"])) {
                    $length = count($_FILES["url"]["tmp_name"]);

                    for($i = 0; $i < $length; $i++) {
                        $newFile = new File($_FILES["url"]["tmp_name"][$i], $_FILES["url"]["name"][$i]);
                        $newFile->Upload();
                        

                        array_push($result, $newFile->pathfile);
                    }
                }
                // If there is only one file
                else {
                    $newFile = new File($_FILES["url"]["tmp_name"], $_FILES["url"]["name"]);
                    $newFile->Upload();
                    
                    array_push($result, $newFile->pathfile);
                }

                echo json_encode($result);
                break;
        }
        break;

    case "search":
        
        switch($for) {
            case "landscapes":
                $sql = "SELECT * FROM landscapes WHERE name LIKE :search";

                $query = $pdo->prepare($sql);
                $query->bindValue(':search', "%".$_POST['search']."%", PDO::PARAM_STR);
                $query->execute();

                if($query->errorCode() == '00000')
                {
                    $query->setFetchMode(PDO::FETCH_ASSOC);
                    $result = $query->fetchALL();

                    echo json_encode($result);
                }
                break;



                case "ambiences":
                    $sql = "SELECT * FROM ambiences WHERE name LIKE :search";
    
                    $query = $pdo->prepare($sql);
                    $query->bindValue(':search', "%".$_POST['search']."%", PDO::PARAM_STR);
                    $query->execute();
    
                    if($query->errorCode() == '00000')
                    {
                        $query->setFetchMode(PDO::FETCH_ASSOC);
                        $result = $query->fetchALL();
    
                        echo json_encode($result);
                    }
                    break;



                case "soundFamilies":
                    $sql = "SELECT * FROM soundfamilies WHERE name LIKE :search";
    
                    $query = $pdo->prepare($sql);
                    $query->bindValue(':search', "%".$_POST['search']."%", PDO::PARAM_STR);
                    $query->execute();
    
                    if($query->errorCode() == '00000')
                    {
                        $query->setFetchMode(PDO::FETCH_ASSOC);
                        $result = $query->fetchALL();
    
                        echo json_encode($result);
                    }
                    break;



                case "playlists":
                    $sql = "SELECT * FROM playlists WHERE name LIKE :search";
    
                    $query = $pdo->prepare($sql);
                    $query->bindValue(':search', "%".$_POST['search']."%", PDO::PARAM_STR);
                    $query->execute();
    
                    if($query->errorCode() == '00000')
                    {
                        $query->setFetchMode(PDO::FETCH_ASSOC);
                        $result = $query->fetchALL();
    

                        for($i = 0; $i < count($result); $i++) {
                            $result[$i]["musics"] = array();
                            $result[$i]["is_shuffle"] = filter_var($result[$i]["is_shuffle"], FILTER_VALIDATE_BOOLEAN);
    
                            $sqlMusic = "SELECT musics.url FROM playlists_musics 
                            INNER JOIN musics ON playlists_musics.id_music = musics.id_music
                            WHERE playlists_musics.id_playlist = :id_playlist";
    
                            $queryMusic = $pdo->prepare($sqlMusic);
                            $queryMusic->bindValue(':id_playlist', $result[$i]["id_playlist"], PDO::PARAM_INT);
                            $queryMusic->execute();
    
                            if($queryMusic->errorCode() == '00000') {
                                $queryMusic->setFetchMode(PDO::FETCH_ASSOC);
                                $musics = $queryMusic->fetchALL();
    
                                $result[$i]["musics"] = $musics;
                            }
                        }


                        echo json_encode($result);
                    }
                    break;
        }
        break;
}

?>