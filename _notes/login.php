<?
	session_start();

	// connect database
	include("php/config/connect.php");
	
	$fb_id = $_POST['fb_id'];
	$first_name = $_POST['first_name'];
	$last_name = $_POST['last_name'];
	$email = $_POST['email'];
	
	$_SESSION["user_id"] = get_user_id( $fb_id );
	
	// query for check user is member
	$sql = mysql_query('SELECT user_fb_id FROM user_info WHERE user_fb_id = "'.$fb_id.'"');
	
	// if user is member
	if(mysql_num_rows($sql) > 0) {
		
		echo '{"code": 200, "message": "User is member", "user_id": '.get_user_id( $fb_id ).'}';
		
	} else {
		$sql = mysql_query('INSERT INTO user_info(user_fb_id, first_name, last_name, email) VALUES("'.$fb_id.'", "'.$first_name.'", "'.$last_name.'", "'.$email.'")');		
		echo '{"code": 100, "message": "Register vai facebook success", "user_id": '.get_user_id( $fb_id ).'}';
	}
	
	function get_user_id ( $fb_id ) {
		$sql  = mysql_query("SELECT * FROM user_info WHERE user_fb_id = '$fb_id'");
		$rows = mysql_fetch_array($sql);
		
		return $rows["user_id"];
	}
?>