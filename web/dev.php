<?php

try{
	require_once('../src/App.php');
	$app=new App();
	$app->run();
}catch(Exception $e){
	if(http_response_code()!=200)
		echo($e->getMessage());
	else
		header('HTTP/1.0 500 '.$e->getMessage());
}