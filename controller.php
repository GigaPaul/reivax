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
}

?>