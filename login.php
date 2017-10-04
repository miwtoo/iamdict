<?
	session_start();

	// inculde connect.php
    include("config/connect.php");

    // logging
    if( $_POST['username'] && $_POST['password'] )
    {
        $username = $_POST['username'];
        $password = $_POST['password'];

        $db -> select("SELECT * FROM user_info WHERE user_name = '".$username."' AND password = '".$password."' ");
        $res = $db -> getResult();

        if( count($res) == 1 )
        {   
            // login success

            $uid = $res[0]['user_id'];
            
            // remember me
            if( $_POST["loggin"] == "on" )
            {
                // set cookie
                $sec = (3600 * 24) * 365; // time storage for 4 years
                setcookie("user_id", $uid, time() + $sec);
            }
            else
            {
                // set sesstion
                $_SESSION["user_id"] = $uid;
            }

            $_SESSION["welcome"] = true;

            // login success
            // go to index.php
            header("location: index.php");
        }
        else
        {
            // login failed
        	// go ti index.php and alert failed
            header("location: index.php?login=failed");
        }
    }
    else
    {
        // variables is null
    	// go to index.php
    	header("location: index.php?login=failed");
    }
?>