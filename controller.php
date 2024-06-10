<?php
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




switch($type)
{
    case "update":
        switch($for)
        {
            case "background":
                $sql = "UPDATE current_scene SET background_url = :background_url, type = :type";

    
                $query = $pdo->prepare($sql);
                $query->bindValue(':background_url', $_POST['background_url'], PDO::PARAM_STR);
                $query->bindValue(':type', $_POST['fileType'], PDO::PARAM_STR);
                $query->execute();
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



                    for($i = 0; $i < count($result); $i++) {
                        $result[$i]["id_aventure"] = intval($result[$i]["id_aventure"]);
                    }
                    

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
                $sqlAmbiences = "SELECT ambiences.name, ambiences.url FROM aventures_ambiences 
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
                        $playlists[$i]["id_playlist"] = intval($playlists[$i]["id_playlist"]);
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

                // $sqlSoundfamilies = "SELECT sounds.name, sounds.frequency, sounds.is_loop, sounds.url FROM aventures_sounds
                // INNER JOIN sounds ON sounds.id_sound = aventures_sounds.id_sound
                // WHERE aventures_sounds.id_aventure = :id_aventure";

                $querySoundfamilies = $pdo->prepare($sqlSoundfamilies);
                $querySoundfamilies->bindValue(':id_aventure', $_POST['id_aventure'], PDO::PARAM_INT);
                $querySoundfamilies->execute();

                if($querySoundfamilies->errorCode() == '00000')
                {
                    $querySoundfamilies->setFetchMode(PDO::FETCH_ASSOC);
                    $soundfamilies = $querySoundfamilies->fetchALL();



                    for($i = 0; $i < count($soundfamilies); $i++) {
                        $soundfamilies[$i]["sounds"] = array();
                        $soundfamilies[$i]["id_soundfamily"] = intval($soundfamilies[$i]["id_soundfamily"]);
                        $soundfamilies[$i]["frequency"] = intval($soundfamilies[$i]["frequency"]);
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

                // $result = array();
                // $result["ambiences"] = $ambiences;
                // $result["landscapes"] = $landscapes;
                // $result["playlists"] = $playlists;
                // $result["soundfamilies"] = $soundfamilies;

                $result->ambiences = $ambiences;
                $result->landscapes = $landscapes;
                $result->playlists = $playlists;
                $result->soundfamilies = $soundfamilies;
                
                echo json_encode($result);
                break;
        }
}

?>