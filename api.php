<?
	/*
	 *
	 *	IamDict API
	 *  Author apichai_kub@hotmail.com
	 *
	 */

	session_start();

	// include connect.php
	include("config/connect.php");

	// library function
	include("php/lib_func.php");
	
	// json
	$json = array("status_id" => "1","status_message" => "OK");

	// function return true
	function return_data( $json ) {
		echo json_encode( $json );
	}

	// function return false;
	function error() {
		echo json_encode(array("status_id" => "0","status_message" => "error",));
	}

	// check get data have to access
	if( ! $_GET["access"] )
	{
		error();
		return false;
	}
	else
	{
		$order = array("\\"); // order to remove out for string
		$sql = str_replace($order, "", $_GET["sql"]); // string sql

		// switch to access sql
		switch($_GET["access"])
		{
			// select
			case 'select':
				if( ! $db -> select( $sql ) )
				{
					error();
					return false;
				}
				else
				{
					$res = $db -> getResult();

					for($i=0;$i<count($res);$i++)
					{
						$json["data"][] = $res[$i];
					}

					return_data( $json );
					return true;
				}
 			break;
 			// insert
			case 'insert':

				if( ! $db -> insert( $sql ) )
				{
					error();
					return false;
				}
				else
				{	
					$json["status_message"] = "save data succsee.";

					return_data( $json );
					return true;
				}

			break;
			// update
			case 'update':
				
			break;
			// delete
			case 'delete':
				
			break;
			// save word
			case 'save_word':
				
				$time = time();

				// check data get
				if( ! $_GET["data"] )
				{
					error();
					return false;
				}
				else
				{
					// get data
					$json_data = json_decode( stripslashes($_GET["data"]), true );
					
					// variables
					$word = update_string($json_data["word"]);
					$word = strtolower($word);

					// temp
					$word_id;

					// check if data is null
					if(
						!$word ||
						strlen($word) == 0 ||
						count( $json_data["translate"] ) == 0

					)
					{
						error();
						return false;
					}
					else
					{
						// save data to database
						$query = $db -> insert("INSERT INTO word(word,user_id,created,update_data) VALUES('".strtolower($word)."','".$user_id."','".$time."', '".$time."')");

						if( ! $query )
						{
							error();
							return false;
						}
						else
						{
							// get word_id
							$db -> select("SELECT word_id FROM word WHERE user_id = '".$user_id."' AND created = '".$time."'");
							$res = $db -> getResult();
							$word_id = $res[0]["word_id"];

							// save translate
							$count = count($json_data["translate"]);
							for( $i=0; $i < $count; $i++ )
							{
								$translate = update_string($json_data["translate"][$i]);
								
								$query = $db -> insert("INSERT INTO translate(word_id,translate) VALUES('".$word_id."','".$translate."')");

								if( ! $query )
								{
									error();
									return false;
								}
							}

							// save sentence
							$count = count($json_data["sentence"]);
							for( $i=0; $i < $count; $i++ )
							{
								$sentence = update_string($json_data["sentence"][$i]);

								if( trim($sentence) == "" )
								{
									
								}
								else
								{
									$query = $db -> insert("INSERT INTO sentence(word_id,sentence) VALUES('".$word_id."','".$sentence."')");

									if( ! $query )
									{
										error();
										return false;
									}
								}
							}
						}
					}

					$json["data"] = array(
						"word_id" => $word_id
					);

					return_data( $json );
					return true;

				} // end if

			break;
			// edit word
			case 'edit_word':
				
				if( ! $_GET["data"] )
				{
					error();
					return false;	
				}
				else
				{
					// get data json
					$data = json_decode( stripslashes($_GET["data"]), true );
					
					$word = update_string( $data["word"] );
					
					if(
						! $data["word_id"] ||
						! $word ||
						strlen($word) == 0 ||
						count( $data["translate"] ) == 0
						

					)
					{
						error();
						return false;	
					}
					else
					{
						// edit word
						$db -> query("UPDATE word SET word = '".$word."' WHERE word_id = '".$data["word_id"]."'");
						
						// delete translate
						$db -> query("DELETE FROM translate WHERE word_id = '".$data["word_id"]."'");
						// save translate
						$count = count($data["translate"]);
						for( $i=0; $i < $count; $i++ )
						{
							$translate = update_string($data["translate"][$i]);
							
							$query = $db -> insert("INSERT INTO translate(word_id,translate) VALUES('".$data["word_id"]."','".$translate."')");
						}
						
						// delete sentence
						$db -> query("DELETE FROM sentence WHERE word_id = '".$data["word_id"]."'");
						// save sentence
						$count = count($data["sentence"]);
						for( $i=0; $i < $count; $i++ )
						{
							$sentence = update_string($data["sentence"][$i]);

							if( trim($sentence) == "" )
							{}
							else
							{
								$query = $db -> insert("INSERT INTO sentence(word_id,sentence) VALUES('".$data["word_id"]."','".$sentence."')");
							}
						}
					}
					
					return_data( $json );
					return true;
				}
				
			break;
			// delete_word
			case 'delete_word':

				$word_id = $_GET["word_id"];

				$db -> query("DELETE FROM word WHERE word_id = '".$word_id."'");
				$db -> query("DELETE FROM translate WHERE word_id = '".$word_id."'");
				$db -> query("DELETE FROM sentence WHERE word_id = '".$word_id."'");

				echo "true";

			break;
			// get my dictionary
			case 'my_dict':
				
				if( ! $_GET["user_id"] )
				{
					error();
					return false;
				}
				else
				{	
					$uid = $_GET["user_id"];
					$json_data = array();

					$db -> select("SELECT * FROM word WHERE user_id = '".$uid."' ORDER BY word ASC");
                	$res = $db -> getResult();

                	for( $i=0; $i < count($res); $i++ )
                	{
                		$db -> select("SELECT * FROM translate WHERE word_id = '".$res[$i]["word_id"]."' ORDER BY auto_id ASC");
                    	$res_ = $db -> getResult();
                    	$translate = array();

                    	for( $j=0; $j < count($res_); $j++ )
                    	{
                    		$translate[] = 	$res_[$j]["translate"];
                    	}

                    	$db -> select("SELECT * FROM sentence WHERE word_id = '".$res[$i]["word_id"]."' ORDER BY auto_id ASC");
                    	$res_ = $db -> getResult();
                    	$sentence = array();

                    	for( $j=0; $j < count($res_); $j++ )
                    	{
                    		$sentence[] = 	$res_[$j]["sentence"];
                    	}

                		$json_data[] = array(
                			"word_id" => $res[$i]["word_id"],
                			"word" => $res[$i]["word"],
                			"type" => $res[$i]["type"],
                			"translate" => $translate,
                			"sentence" => $sentence,
                			"created" => $res[$i]["created"],
                			"update" => $res[$i]["update_data"]
                		);	
                	}

                	$json["data"] = $json_data;
                	return_data($json);
					return true;
				}

			break;
			// get news word
			case 'data_game':

				$db -> select("SELECT * FROM word WHERE user_id = '".$user_id."' ORDER BY created DESC LIMIT 20");
            	$res = $db -> getResult();

            	for( $i=0; $i < count($res); $i++ )
            	{
            		$db -> select("SELECT * FROM translate WHERE word_id = '".$res[$i]["word_id"]."' ORDER BY auto_id ASC");
                	$res_ = $db -> getResult();
                	$translate = array();

                	for( $j=0; $j < count($res_); $j++ )
                	{
                		$translate[] = 	$res_[$j]["translate"];
                	}

                	$db -> select("SELECT * FROM sentence WHERE word_id = '".$res[$i]["word_id"]."' ORDER BY auto_id ASC");
                	$res_ = $db -> getResult();
                	$sentence = array();

                	for( $j=0; $j < count($res_); $j++ )
                	{
                		$sentence[] = 	$res_[$j]["sentence"];
                	}

            		$json_data[] = array(
            			"word_id" => $res[$i]["word_id"],
            			"word" => $res[$i]["word"],
            			"type" => $res[$i]["type"],
            			"translate" => $translate,
            			"sentence" => $sentence,
            			"created" => $res[$i]["created"],
            			"update" => $res[$i]["update_data"]
            		);	
            	}

            	$json["data"] = $json_data;
            	return_data($json);
				return true;

			break;
			case 'check_word':
				
				if( ! $_GET["text"] )
				{
					error();
					return false;	
				}
				else
				{
					$word = $_GET["text"];
					
					$db -> select("SELECT * FROM word WHERE word = '".$word."' AND user_id = '".$user_id."'");
					$res = $db -> getResult();
					
					$json["count_word"] = count($res);
					
                	return_data($json);
					return true;
				}
				
			break;
			// new word
			case 'new_word': // words of today
				
				if( ! $_GET["user_id"] )
				{
					error();
					return false;
				}
				else
				{
					$uid = $_GET["user_id"];
					$json_data = array();

					$limit_time = (60 * 60) * 24 * 1; // 1 day
					$day = time() - $limit_time;

					$db -> select("SELECT * FROM word WHERE user_id = '".$uid."' AND created > '".$day."' ORDER BY word_id DESC");
                	$res = $db -> getResult();

                	for( $i=0; $i < count($res); $i++ )
                	{
                		if( isToday( $res[$i]['created'] ) )
                		{
                			$db -> select("SELECT * FROM translate WHERE word_id = '".$res[$i]["word_id"]."'");
	                    	$res_ = $db -> getResult();
	                    	$translate = array();

	                    	for( $j=0; $j < count($res_); $j++ )
	                    	{
	                    		$translate[] = 	$res_[$j]["translate"];
	                    	}

	                    	$db -> select("SELECT * FROM sentence WHERE word_id = '".$res[$i]["word_id"]."'");
	                    	$res_ = $db -> getResult();
	                    	$sentence = array();

	                    	for( $j=0; $j < count($res_); $j++ )
	                    	{
	                    		$sentence[] = 	$res_[$j]["sentence"];
	                    	}

	                		$json_data[] = array(
	                			"word_id" => $res[$i]["word_id"],
	                			"word" => $res[$i]["word"],
	                			"type" => $res[$i]["type"],
	                			"translate" => $translate,
	                			"sentence" => $sentence,
	                			"created" => $res[$i]["created"],
	                			"update" => $res[$i]["update_data"]
	                		);	
                		}
                	}

                	$json["data"] = $json_data;
                	return_data($json);
					return true;
				}
			break;
			case 'new_word_of_this_month':
				$db -> select("select * from word where user_id = ".$_GET["user_id"]." ORDER BY created DESC");
				$res = $db -> getResult();
			
				$count = date("d");
				$d = date("d");
				$m = date("m");
				$y = date("Y");
			
				for($j=0;$j<$count;$j++)
				{		
					if($j < 9)
					{
						$check_date = "0".($j+1).'-'.$m.'-'.$y;
					}
					else
					{
						$check_date = ($j+1).'-'.$m.'-'.$y;
					}
			
					for($i=0;$i<count($res);$i++)
					{
						$date_of_word = date('d-m-Y', (int)$res[$i]["created"]);
						
						if( $date_of_word == $check_date )
						{
							$db -> select("select * from translate where word_id = ".$res[$i]["word_id"]."");
							$res_ = $db -> getResult();
							$translate = array();
							
							for( $k=0; $k < count($res_); $k++ )
	                    	{
	                    		$translate[] = 	$res_[$k]["translate"];
	                    	}
							
							$db -> select("SELECT * FROM sentence WHERE word_id = '".$res[$i]["word_id"]."'");
	                    	$res_ = $db -> getResult();
	                    	$sentence = array();

	                    	for( $k=0; $k < count($res_); $k++ )
	                    	{
	                    		$sentence[] = 	$res_[$k]["sentence"];
	                    	}
							
							$json_data[] = array(
	                			"word_id" => $res[$i]["word_id"],
	                			"word" => $res[$i]["word"],
	                			"type" => $res[$i]["type"],
	                			"translate" => $translate,
								"sentence" => $sentence,
	                			"created" => $res[$i]["created"],
	                			"update" => $res[$i]["update_data"]
	                		);
						}
					}
				}
				
				$json["data"] = $json_data;
				return_data($json);
				return true;
			break;
			// check username, form register
			case 'check_username':

				$username = $_POST["username"];

				$db -> select("SELECT * FROM user_info WHERE user_name = '".$username."'");

				if( count($db->getResult()) == 1)
				{
					echo "false";
				}
				else
				{
					echo "true";
				}

			break;
			// send email forget password
			case 'sendEmail':

				$email = $_POST["email"];

				$db -> select("SELECT * FROM user_info WHERE email = '".$email."'");
				$res 			= $db -> getResult();

				if(count($res) == 0)
				{
					// email wrong not found
					// Not found this email was not register.
					echo "failed";
				}
				else
				{

					$MailTo 		= $email;
					$MailFrom 		= "contact@iamdict.com";
					$MailSubject 	= 'Forget password iamdict.com';
					
					for($i=0;$i<count($res);$i++)
						$MailMessage .=  "Username : ".$res[$i]["user_name"]."\r\nPassword : ".$res[$i]["password"]."\r\n"."Date register : ".$res[$i]["date"]."\r\n\n";

					$Headers 		= "Content-type: text/html; charset=utf-8\r\n";
					$Headers 		= "From: ".$MailFrom."\r\n";

					mail($MailTo, $MailSubject , $MailMessage, $Headers);

					echo "success";
				}
			break;
			// defalut
			default:
				error();
				return false;

		} // end switch
	} // end if
?>