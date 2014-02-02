﻿<?php
function DB_json($sql){
//	return $sql;

	$file=realpath(dirname(__FILE__))."/conf.ini";
	if(!file_exists($file))throw new Exception("conf.ini is missing");
	$ini = parse_ini_file($file, true);
	if(!isset($ini['db']))throw new Exception("missing [db] section");
	$ini_db = $ini['db'];
	
	$pdo=new PDO($ini_db['type'].":dbname=".$ini_db['base'],$ini_db['user']);
	$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
	$statement=$pdo->prepare($sql);
	if(strpos($sql,"SELECT")===0 || strpos($sql,"SHOW")===0){
		$statement->execute();
		return json_encode($statement->fetchAll(PDO::FETCH_ASSOC));
	}
	//protected requests
	if(isset($ini['user'])){
		if (!isset($_SERVER['PHP_AUTH_USER'])) {
			header('WWW-Authenticate: Basic realm="My Realm"');
			header('HTTP/1.0 401 Unauthorized');
			throw new Exception("no credential on protected zone");
		}
		$username = $_SERVER['PHP_AUTH_USER'];
		if(!isset($ini['user'][$username]))
			throw new Exception("no such user");
		if($ini['user'][$username] != md5($_SERVER['PHP_AUTH_PW']))
			throw new Exception("bad password");
	}

	$statement->execute();
	return $pdo->lastInsertId();
}