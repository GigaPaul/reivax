<?php

class Folder
{
    public string $name;
    public $children = array();

    function __construct(string $name)
    {
        $this->name = $name;
    }
}

$type = $_POST["type"];

switch($type)
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
?>