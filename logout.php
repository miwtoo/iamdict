<?
	session_start();

	// delete cookie
	unset($_COOKIE["user_id"]);
	setcookie('user_id', '', time() - 3600);

	// clear session
	unset($_SESSION["user_id"]);
	session_destroy();

	// go to index.php
	header("location: index.php");
?>