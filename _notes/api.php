<?
	session_start();

  /*
   *  Kidwadee API
   *  Coded apichai_kub@hotmail.com
   *  Version 0.1
   *  Descripting: erverting return json datatype 
   */
 
  // Connect database
  include("php/config/connect.php");
  
  // function json_pretty
  include("inc/php/function_lib/json_pretty.php");
  
  function not_data() {
	return '{"status_id": "0", "status_message": "not data"}';
  }
  
  function toHTML( $val ) {
	//$val = htmlspecialchars( $val );
	//$val = addslashes( $val );
  	return $val;
  }
  
  /* 
   *  check access 
   */
  switch($_GET["access"]) {
    /* insert api */
	case "insert" :
	  
	  // check type
	  switch($_GET["type"]) {
		case "post" : 
			
			$json = json_decode( stripslashes($_GET["json"]) );
			//$user_id = $_SESSION["user_id"];
			$user_id = 6;
			$time = time();
			$res;
			$post_id;
			
			$db -> insert("insert into posts(user_id, post_type, category, created) values('".$user_id."', '1', '1', '".$time."')");
			$db -> select("select * from posts where user_id = '".$user_id."' AND created = '".$time."'");
			$res = $db -> getResult();
			$post_id = $res[0]["post_id"];
			
			foreach($json as $obj) {
				$db -> insert("insert into posts_data(post_id, media_type, source, title, description) values('".$post_id."', '".$obj -> media_type."', '".$obj -> source."', '".toHTML($obj -> title)."', '".toHTML($obj -> description)."')");
			}
						
			// return
			echo '{"status_id": "1", "status_message": "OK", "data": {"post_id": "'.$post_id.'"}}';
			
		break;
		case "comment" : 
		
		  $post_id = $_GET["post_id"];
		  $user_id = 6;
		  $message = $_GET["message"];
		  $created = time();
		  
		  // check variable is nothing
		  if(
		  !$post_id || $post_id == "" ||
		  !$user_id || $user_id == "" ||
		  !$message || $message == ""
		  )
		  {
			  
			echo '{"status_id": "0", "status_message": "check your parameter"}';
			
		  } else {
			
			// insert comment to table
			$sql = mysql_query("INSERT INTO comments(post_id, user_id, message, created) VALUES('".$post_id."', '".$user_id."', '".$message."', '".$created."')");
			
			if($sql) {
				
			  $sql_ = mysql_query("SELECT comment_id FROM comments WHERE post_id = '".$post_id."' AND user_id = '".$user_id."' AND created = '".$created."'");
			  $rows = mysql_fetch_array($sql_);
				
				   $json = '{"status_id": "1", "status_message": "OK", "data": { "comment_id": "'.$rows['comment_id'].'" }}';
			  echo $json;
			}			  
		  }
		
		break;
		case "like_post" : 
			
			$post_id = $_GET["post_id"];
			$user_id = 6;
			$created = time();
			
			if(!$post_id)
			{
				echo '{"status_id": "0", "status_message": "check your parameter"}';		
			}
			else
			{
				
				$db -> select("SELECT like_id FROM like_post WHERE post_id = '".$post_id."' AND user_id = '".$user_id."'");	
				$res = $db -> getResult();
				
				if(count($res) > 0)
				{
					$query = $db -> query("DELETE FROM like_post WHERE post_id = '".$post_id."' AND user_id = '".$user_id."'");
					
					if(!$query)
						echo '{"status_id": "0", "status_message": "'.mysql_error().'"}';
					else
						echo '{"status_id": "1", "status_message": "unlike", "data": {"like_id": "'.$res[0]["like_id"].'"}}';	
				}
				else
				{
					$insert = $db -> insert("INSERT INTO like_post(post_id, user_id, created) VALUES('".$post_id."', '".$user_id."', '".$created."')");
					
					if(!$insert)
					{
						echo '{"status_id": "0", "status_message": "'.mysql_error().'"}';
					}
					else
					{
						$db -> select("SELECT like_id FROM like_post WHERE post_id = '".$post_id."' AND user_id = '".$user_id."'");	
						$res = $db -> getResult();
						
						echo '{"status_id": "1", "status_message": "liked", "data": {"like_id": "'.$res[0]["like_id"].'"}}';	
					}
				}
			}
			
		break;
	  }
	  
	break;
	
	/* get api */
	case "get" :
	
	  switch($_GET["type"]) {
	    case "posts_data" :
			
			// api.php?access=get&type=posts_data&post_id=1
			
			$post_id = $_GET["post_id"];

			$db -> select("SELECT * FROM posts WHERE post_id = '".$post_id."'");
			$res_posts = $db -> getResult();
		
			$db -> select("SELECT * FROM posts_data WHERE post_id = '".$post_id."' ORDER BY auto_id ASC");
			$res_postsData = $db -> getResult();
			
			$db -> select("SELECT * FROM user_info WHERE user_id = '".$res_posts[0]["user_id"]."'");
			$res_user = $db -> getResult();
			
			$db -> select("SELECT * FROM like_post WHERE post_id = '".$post_id."'");
			$likes_count = count( $db -> getResult() );
			
			$json = array(
		  		"status_id" => "1",
				"status_message" => "OK",
				"author_id" => $res_posts[0]["user_id"],
				"author_name" => $res_user[0]["first_name"]." ".$res_user[0]["last_name"],
				"created" => $res_posts[0]["created"],
				"likes_count" => $likes_count,
				"data" => array()
		  	);
			
			for($i=0; $i < count($res_postsData); $i++)
			{
				$json["data"][] = array(
					"post_id" => $res_postsData[$i]["post_id"],
					"media_type" => $res_postsData[$i]["media_type"],
					"source" => $res_postsData[$i]["source"],
					"title" => $res_postsData[$i]["title"],
					"description" => $res_postsData[$i]["description"],
				);
			}
			
			if(count($json["data"]) == 0) 
			{
				echo not_data();
			}
			else
			{
				echo json_pretty(json_encode($json), false);
			}
		
		break;
		case "comment" :
		  
		  $json = array(
		  		"status_id" => "1",
				"status_message" => "OK",
				"data" => array()
		  );
		  
		  $post_id = $_GET["post_id"];
		  
		  $sql = mysql_query("SELECT * FROM comments WHERE post_id = '".$post_id."' ORDER BY comment_id DESC");
		  
		  while($rows = mysql_fetch_array($sql)) {
		    
			$sql_ = mysql_query("SELECT first_name, last_name FROM user_info WHERE user_id = '".$rows['user_id']."'");
			$rows_ = mysql_fetch_array($sql_);
			
		    $json["data"][] = array (  
			  "comment_id" => $rows["comment_id"],
			  "post_id" => $rows["post_id"],
			  "author_id" => $rows["user_id"],
			  "author_name" => $rows_["first_name"]." ".$rows_["last_name"],
			  "message" => $rows["message"],
			  "created" => $rows["created"]
			);
					  
		  }
		  
		  if(count($json["data"]) == 0) {
			  
		  	echo not_data();
			
		  } else {
			
			echo json_pretty(json_encode($json), false);
			  
		  }
		  
		break;  
	  }
	
	break;  
  }
   
?>