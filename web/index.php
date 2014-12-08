<?php

error_reporting(E_ALL);
ini_set('display_errors', '1');

try{
	$url=parse_url($_SERVER['REQUEST_URI']);
	$args=explode('/',substr(urldecode($url['path']),1));

	if(file_exists("../src/$args[0].php"))
		require_once("../src/$args[0].php");
	else
		require_once("../src/Page.php");

	if(@function_exists("get_".$args[1]))
		call_user_func_array("get_".$args[1],$args);
	else
		call_user_func_array("get_default",$args);
}catch(Exception $e){
		header('HTTP/1.0 500');
		echo $e->getMessage();
}
?>