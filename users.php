<?
	// connect database
	include("config/connect.php");

	$db -> select("SELECT * FROM user_info ORDER BY user_id DESC");
	$res = $db -> getResult();
?>
<!DOCTYPE HTML>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<title>Users registered</title>

<style>
html {
	font-family: "Palatino Linotype", /* Windows */ "URW Palladio L", /* Unix+FontConfig (ugly!) */ "palladio l", /* Unix+X+FreeType */ palatino, /* MacOS */ "book antiqua", /* Win95 */ /* Fallback options */ times, /* Unix+X, MacOS */ serif;
}
</style>

</head>

<body>

<h3>Users joined (<?=count($res);?>)</h3>
<table border="1" cellspacing="0" cellpadding="0" width="100%" style="text-align: center;">
	<tr style="font-weight: bold;">
		<td>User ID</td>
		<td>Username</td>
		<td>Email</td>
		<td>Joined</td>
	</tr>
	<? for( $i=0; $i < count($res); $i++ ) {?>
	<tr>
		<td><?=$res[$i]["user_id"];?></td>
		<td><?=$res[$i]["user_name"];?></td>
		<td><?=$res[$i]["email"];?></td>
		<td><?=$res[$i]["date"];?></td>
	</tr>
	<? }?>
</table

</body>
</html>
