<?
	/*
	 *
	 *	IamDict API
	 *  Author apichai_kub@hotmail.com
	 *
	 */

	session_start();

	date_default_timezone_set("Asia/Bangkok"); // set timezone

	// include connect.php
	include("config/connect.php");

	$arr = array(
			"cols" => array(
						array("id"=>"","label"=>"date","type"=>"string"),
						array("id"=>"","label"=>"add new words","type"=>"number"),
						array("id"=>"","role"=>"tooltip","type"=>"string","p"=>array("html"=>true))
					  ),
			"rows" => array()
	);

	$db -> select("select * from word where user_id = ".$user_id." ORDER BY created DESC");
	$res = $db -> getResult();

	// switch to access sql
	switch($_GET["access"])
	{
		// word of this week
		case "word_of_this_week":

			function conv_int ( $int ) {
				if( $int < 10 )
				{
					$int = (int)"0".$int;
				}
				return $int;
			}

			function get_maxDay( $month ) {

				$day;

				switch( $month ) {
					case 1:
						$day = 31;
					break;
					case 2:
						$day = 28;
					break;
					case 3:
						$day = 31;
					break;
					case 4:
						$day = 30;
					break;
					case 5:
						$day = 31;
					break;
					case 6:
						$day = 30;
					break;
					case 7:
						$day = 31;
					break;
					case 8:
						$day = 31;
					break;
					case 9:
						$day = 30;
					break;
					case 10:
						$day = 31;
					break;
					case 11:
						$day = 30;
					break;
					case 12:
						$day = 31;
					break;
				}

				return $day;
			}

			$date_N = date("N"); // date("N")
			$date_j = date("j"); // date("j")
			$date_n = date("n");
			$date_m = date("m");
			$date_Y = date("Y");

			$r = $date_j - ($date_N - 1); // result count day backvart

			$count_tmp; // count day backvart
			$month_number;
			$maxDay;
			$minDay;
			$currentDay;

			while($r < 1) {
				$r++;
				$count_tmp++;
			}

			if($count_tmp)
			{
				$month_number = date($date_n - 1);
				$maxDay = get_maxDay( $month_number );
				$minDay = $maxDay - ($count_tmp - 1);
				$currentDay = $minDay;
			}

			for($j=0;$j<$date_N;$j++)
			{
				if($count_tmp && $currentDay <= $maxDay)
				{
					$check_date = conv_int($currentDay).'-'.conv_int($month_number).'-'.$date_Y;
					$currentDay++;
				}
				else
				{
					$check_date = conv_int($r).'-'.$date_m.'-'.$date_Y;
					$r++;
				}

				$status = false; // if have words has been true
				$words = array();
				$count_of_word = 0;

				for($i=0;$i<count($res);$i++)
				{
					$timestamp_of_word = $res[$i]["created"];
					$date_of_word = date('d-m-Y', $timestamp_of_word);

					//echo $date_of_word." : ".$check_date."<br />";

					if( $date_of_word == $check_date )
					{
						$db -> select("select * from translate where word_id = ".$res[$i]["word_id"]."");
						$res_ = $db -> getResult();

						$words[] = array("word"=>$res[$i]["word"], "translate"=>$res_[0]["translate"]);

						$count_of_word++;
						$status = true;
					}
				}

				$string = date("j",strtotime($check_date))." ".date("l",strtotime($check_date));
				$topic = $string." (".$count_of_word.") ";
				$list = $words;

				if(!$status)
				{
					//$arr["rows"][] = array("c" => array(array("v"=>$string),array("v"=>"0")));
					$arr["rows"][] = array("c" => array(array("v"=>$string),array("v"=>"0"),array("v"=>html($topic,$list))));
				}
				else
				{
					//$arr["rows"][] = array("c" => array(array("v"=>$string),array("v"=>$count_of_word)));
					$arr["rows"][] = array("c" => array(array("v"=>$string),array("v"=>$count_of_word),array("v"=>html($topic,$list))));
				}

			}

			echo json_encode($arr);
		break;
		// word of this month
		case "word_of_this_month":

			$count = date("d");
			$d = date("d");
			$m = date("m");
			$y = date("Y");

			for($j=0;$j<$count;$j++)
			{
				$status = false; // if have words has been true
				$words = array();
				$count_of_word = 0;

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
					$timestamp_of_word = $res[$i]["created"];
					$date_of_word = date('d-m-Y', $timestamp_of_word);

					if( $date_of_word == $check_date )
					{
						$db -> select("select * from translate where word_id = ".$res[$i]["word_id"]."");
						$res_ = $db -> getResult();

						$words[] = array("word"=>$res[$i]["word"], "translate"=>$res_[0]["translate"]);

						$count_of_word++;
						$status = true;
					}
				}

				if(($j+1) == $count) {
					$string = date("j",strtotime($check_date))." ".date("F",strtotime($check_date));
				} else {
					$string = date("j",strtotime($check_date));
				}

				$topic = $string." (".$count_of_word.") ";
				$list = $words;

				if(!$status)
				{
					$arr["rows"][] = array("c" => array(array("v"=>$string),array("v"=>"0"),array("v"=>html($topic,$list))));
				}
				else
				{
					$arr["rows"][] = array("c" => array(array("v"=>$string),array("v"=>$count_of_word),array("v"=>html($topic,$list))));
				}
			}

			echo json_encode($arr);
		break;
		// word of this year
		case "word_of_this_year":

			$count = date("n"); // date("N")
			$d = date("d"); // date("d")
			$m = date("n");
			$y = date("Y");

			for($j=0;$j<$count;$j++)
			{
				$status = false; // if have words has been true
				$words = array();
				$count_of_word = 0;

				$check_date = ($j+1).'-'.$y; // 4-2014

				for($i=0;$i<count($res);$i++)
				{
					$date_of_word = date('n-Y', $res[$i]["created"]);

					if( $date_of_word == $check_date )
					{
						$db -> select("select * from translate where word_id = ".$res[$i]["word_id"]."");
						$res_ = $db -> getResult();

						$words[] = array("word"=>$res[$i]["word"], "translate"=>$res_[0]["translate"]);

						$count_of_word++;
						$status = true;
					}
				}

				$string = date("F",strtotime($d."-".($j+1)."-".$y));
				$topic = $string." (".$count_of_word.") ";
				$list = $words;

				if(!$status)
				{
					$arr["rows"][] = array("c" => array(array("v"=>$string),array("v"=>"0"),array("v"=>html($topic,$list))));
				}
				else
				{
					$arr["rows"][] = array("c" => array(array("v"=>$string),array("v"=>$count_of_word),array("v"=>html($topic,$list))));
				}
			}

			echo json_encode($arr);
		break;
		// defalut
		default:;
	} // end switch

	function html ( $topic, $list ) {

		$html_list = '';

		if(count($list) == 0)
		{
			$html_list .= '<li style="list-style: none;">-</li>';
		}
		else
		{
			for($i=0;$i<count($list);$i++)
			{
				$html_list .= '<li style="list-style: none;">'.$list[$i]["word"].' - '.$list[$i]["translate"].'</li>';
			}
		}


		$html = '';
		$html .= '<div style="padding: 5px 10px 5px 10px;float: left;">';
		$html .= 	'<strong>'.$topic.'</strong>';
		$html .= 	'<ul style="padding: 0;margin: 5px 0 0 0;max-height: 400px;overflow: auto;">';
		$html .= 		$html_list;
		$html .= 	'</ul>';
		$html .= '</div>';

		return $html;
	}
?>
