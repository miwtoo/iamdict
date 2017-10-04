<?
	/*
	 *
	 *	IamDict PHP library function
	 *  Author apichai_kub@hotmail.com
	 *
	 */
	 	date_default_timezone_set("Asia/Bangkok"); // set timezone

	function update_string( $string ) {
		$string = trim($string);
		$string = str_replace("'", "\'",$string);
		return $string;
	}

	function isToday( $timestamp_of_word ) {

		$patt = 'd-m-Y';
		$today = date($patt, time());
		$date_of_word = date($patt, $timestamp_of_word);

		if( $date_of_word == $today )
			return true;
		else
			return false;
	}

	function get_nameMonth( $number ) {
	    $month;
	    switch ( $number ) {
	        case 1:
	            $month = 'January';
	            break;
	        case 2:
	            $month = 'February';
	            break;
	        case 3:
	            $month = 'March';
	            break;
	        case 4:
	            $month = 'April';
	            break;
	        case 5:
	            $month = 'May';
	            break;
	        case 6:
	            $month = 'June';
	            break;
	        case 7:
	            $month = 'July';
	            break;
	        case 8:
	            $month = 'August';
	            break;
	        case 9:
	            $month = 'September';
	            break;
	        case 10:
	            $month = 'October';
	            break;
	        case 11:
	            $month = 'November';
	            break;
	        case 12:
	            $month = 'December';
	            break;
	    }
	    return $month;
	}
?>
