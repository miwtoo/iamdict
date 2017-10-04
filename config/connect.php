<?
	session_start();

	class Database 
	{
		
		// localhost
		private $db_host = "localhost";
		private $db_user = "root";
		private $db_pass = "root";
		private $db_name = "iamdict";

		// hosting
		/*private $db_host = "localhost";
		private $db_user = "iamdictc_db";
		private $db_pass = "xfiQpD4e";
		private $db_name = "iamdictc_db";*/

		private $con = false;
		private $result = array();

		public function connect ()
		{
			$condb = mysql_connect($this->db_host, $this->db_user, $this->db_pass);
			$seldb = mysql_select_db($this->db_name);
			mysql_query("SET NAMES UTF8");

			if($condb)
			{
				$this->con = true;
				return true;
			}
			else
			{
				return false;
			}
		}

		public function select ( $sql )
		{
			$query = mysql_query($sql);
			// $this->myQuery = $sql; // Pass back the SQL
			if($query)
			{
				// If the query returns >= 1 assign the number of rows to numResults
				$this->numResults = mysql_num_rows($query);
				// Loop through the query results by the number of rows returned
				for($i = 0; $i < $this->numResults; $i++){
				$r = mysql_fetch_array($query);
				$key = array_keys($r);
				for($x = 0; $x < count($key); $x++){
					// Sanitizes keys so only alphavalues are allowed
					if(!is_int($key[$x])){
						if(mysql_num_rows($query) >= 1){
							$this->result[$i][$key[$x]] = $r[$key[$x]];
						}else{
							$this->result = null;
						}
					}
				}
			}
				return true; // Query was successful
			}else{
				array_push($this->result,mysql_error());
				return false; // No rows where returned
			}
		}

		public function insert ( $sql )
		{
			$query = mysql_query( $sql );
			if($query)
			{
				 return true;
			}
			else
			{
				return false;
			}
		}

		public function query($sql)
		{
			if($query = mysql_query($sql)){
				array_push($this->result,mysql_affected_rows());
				return true;
			}else{
				array_push($this->result,mysql_error());
				return false;
			}
		}

		public function getResult ()
		{
			$val = $this->result;
			$this->result = array();
			return $val;
		}
	}

	// database
	$db = new Database();
	$db -> connect();

	// public variables
    //$user_id = 1;
		$user_id;

    // set $user_id variavle is public
    if ( isset($_COOKIE["user_id"]) )
    {
        $user_id = $_COOKIE["user_id"];
    }
    else if ( isset($_SESSION["user_id"]) )
    {
        $user_id = $_SESSION["user_id"];
    }
?>
