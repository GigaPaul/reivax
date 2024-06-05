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
        
    case "retrieve":
        switch($for)
        {
            case "music":
                $folderIndex = glob("./assets/audio/musics/*");

                $result = array();
                foreach($folderIndex as $folder)
                {
                    $folderName = basename($folder);
                    $folderClass = new Folder($folderName);

                    $categoryIndex = glob("./assets/audio/musics/$folderName/*");
                    
                    // $categoryArray = array();
                    foreach($categoryIndex as $category)
                    {
                        $categoryName = basename($category);
                        $categoryClass = new Folder($categoryName);

                        $musicIndex = glob("./assets/audio/musics/$folderName/$categoryName/*");
                        
                        $musicArray = array();
                        foreach($musicIndex as $music)
                        {
                            // array_push($musicArray, basename($music));
                            array_push($categoryClass->children, basename($music));
                        }
                        array_push($folderClass->children, $categoryClass);
                        // $categoryArray[$categoryName] = $musicArray;
                    }

                    array_push($result, $folderClass);
                    // $result[$folderName] = $categoryArray;
                }

                echo json_encode($result);

                break;





            case "landscape":
                $landscapeIndex = glob("./assets/landscapes/*");
                $result = array();
                
                foreach($landscapeIndex as $landscape) {
                    array_push($result, basename($landscape));
                }



                echo json_encode($result);
                break;





            case "aventure":
                $aventureIndex = glob("./aventures/*");
                $result = array();
                
                foreach($aventureIndex as $aventure) {
                    array_push($result, basename($aventure));
                }



                echo json_encode($result);
                break;
        }
}

?>