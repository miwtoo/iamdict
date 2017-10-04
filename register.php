<?
	sleep(3);

	// inculde connect.php
    include("config/connect.php");

	$username 		= 	trim($_POST["username"]);
	$password 		= 	trim($_POST["password"]);
	$email    		= 	trim($_POST["email"]);
	$birthday_day 	= 	$_POST["birthday_day"];
	$birthday_month = 	$_POST["birthday_month"];
	$birthday_year 	= 	$_POST["birthday_year"];
	$birthday 		= 	$birthday_year."-".$birthday_month."-".$birthday_day;
	$gender   		= 	$_POST["gender"];
	$date 			=   date("Y-m-d");

	// check variables
	if  (
		!$username 			|| $username 		== "" ||
		!$password 			|| $password 		== "" ||
		!$email    			|| $email 			== "" ||
		!$birthday_day 		|| $birthday_day 	== "" ||
		!$birthday_month 	|| $birthday_month 	== "" ||
		!$birthday_year 	|| $birthday_year 	== "" ||
		!$gender			|| $gender 			== ""
		)
	{
		// failed
		echo "register has been failed. please enter detail on your form.";
	}
	else
	{
		// check username has already been taken
		$db -> select("SELECT * FROM user_info WHERE user_name = '".$username."'");

		if( count($db->getResult()) == 1 )
		{
			// username has already been taken
			echo "register has been failed. username has already been taken";
		}
		else
		{
			// call function register
			$register = register( $username, $password, $email, $birthday, $gender, $date, $db );

			// if register
			if( !$register )
			{
				// register has been failed
				echo "register has been failed";
			}
			else
			{
				// register has been successful
				header("location: http://www.iamdict.com/index.php?register=success&username=".$username."");
			}
		}
	}

	function register( $username, $password, $email, $birthday, $gender, $date, $db ) {
		// string sql
		$sql = "INSERT INTO user_info (
									   user_name, 
									   password, 
									   email, 
									   birthday, 
									   gender,
									   date
									  ) 
								VALUES(
									   '".$username."',
									   '".$password."',
									   '".$email."',
									   '".$birthday."',
									   '".$gender."',
									   '".$date."'
									  );";

		// insert		
		$insert = $db -> insert($sql);

		if( ! $insert )
		{
			// register has been failed
			return false;
		}
		else
		{
			// register has been successful
			return true;
		}
	}
?>