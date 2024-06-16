<?php
    function getRandomString($length = 15) {
        $characters = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
        $charLength = strlen($characters);
        $result = "";

        for($i = 0; $i < $length; $i++) {
            $result .= $characters[random_int(0, $charLength - 1)];
        }

        return $result;
    }
?>