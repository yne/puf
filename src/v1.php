<?php

/* DB utilities */
function DB_ini(){
	$path_parts = pathinfo(__FILE__);
	$file=$path_parts['dirname'].'/'.$path_parts['filename'].'.ini';
	if(!file_exists($file))throw new Exception("$file is missing");
	$ini = parse_ini_file($file, true);
	if(!isset($ini['db']))throw new Exception("missing [db] section");
	return $ini['db'];
}
function DB_getConf($param){
	$ini_db = DB_ini();
	return $ini_db[$param];
}
function DB_json($sql,$p=array(),$i=2){
	$ini_db = DB_ini();
	$pdo=new PDO($ini_db['type'].":dbname=".$ini_db['base'],$ini_db['user'],isset($ini_db['pass'])?$ini_db['pass']:NULL,
		array(PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8"));
	$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
	$sth=$pdo->prepare($sql);
	for($bp=0;$bp+$i<count($p);$bp++)
		$sth->bindParam($bp+1,$p[$bp+$i], PDO::PARAM_STR);
	if(strpos($sql,"SELECT ")===0 || strpos($sql,"SHOW ")===0){
		$sth->execute();
		return json_encode($sth->fetchAll(PDO::FETCH_ASSOC));
	}
	//protected requests
	if(isset($ini['user'])){
		if(!isset($_SERVER['PHP_AUTH_USER']))
			ask_login("No credential");
		if(!isset($ini['user'][$_SERVER['PHP_AUTH_USER']]))
			ask_login("Bad credential");
		if($ini['user'][$_SERVER['PHP_AUTH_USER']] != md5($_SERVER['PHP_AUTH_PW']))
			ask_login("Bad password");
	}
	$sth->execute();
	return $pdo->lastInsertId();
}
function ask_login($msg){
	header('WWW-Authenticate: Basic realm="BackOffice"');
	header('HTTP/1.0 401 Unauthorized');
	return($msg);
}
function showHelp(){
	$path_parts = pathinfo(__FILE__);
	$file=$path_parts['dirname'].'/'.$path_parts['filename'].'.md';
	
	$api_ref = file_get_contents($file);
	return <<<PAGE
<!DOCTYPE html>
<html>
	<body>
		<pre id="api">$api_ref</pre>
		<script src="//cdnjs.cloudflare.com/ajax/libs/marked/0.3.2/marked.min.js"></script>
		<script>document.body.innerHTML=marked(api.innerHTML)</script>
		<script src="http://ajax.googleapis.com/ajax/libs/jquery/2.0.3/jquery.min.js"></script>
	</body>
</html>
PAGE;
}
function sane($str){
	return $str;
}
function get_join($a,$b,&$sql,&$tables){
	if($a==$b)return;
	if((($a=='proprietaire')&&($b=='parcelleunitefiscale'))
	|| (($b=='proprietaire')&&($a=='parcelleunitefiscale'))){
		array_push($tables,'parcelleproprietaire');
		$sql.= ' AND `'.$b.'`.`id` = `parcelleproprietaire`.`id_'.$b.'` AND `parcelleproprietaire`.`id_'.$a.'` = `'.$a.'`.`id` ';
	}elseif(($a=='parcelleunitefiscale') && ($b=='parcelleunitereelle')){
		$sql.= ' AND `'.$a.'`.`id` = `'.$b.'`.`id_'.$a.'` ';
	}else{
		$sql.= ' AND `'.$b.'`.`id` = `'.$a.'`.`id_'.$b.'` ';//add the JOIN
	}
}
/* controller part */
function get_default(){
	header("Access-Control-Allow-Origin: *");
	$p=func_get_args();
	$i=func_num_args();
	if($i==1)return print(showHelp());
	if($i==2 && $p[1]=="")return print(DB_json('SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = "'.DB_getConf('base').'"'));
	if($i==2 && $p[1]!="")return print(DB_json("SHOW FULL COLUMNS FROM $p[1]"));
	if($i==3 && $p[2]==""){
		$lo=array('&'=>'AND','|'=>'OR');//logical op
		$co=array('='=>'=','!'=>'!=','~'=>'LIKE','<'=>'<','>'=>'>',':'=>'IN');//compare op
		
		$tables=explode('-',$p[1]);
		$sql=count($_GET)?"WHERE ":"";
		for($i=0;$i<count($_GET['data']);$i++){
			//get and sanitize input
			$conj=$lo[isset($_GET['conj'])&&isset($_GET['conj'][$i])?$_GET['conj'][$i]:key($lo)];
			$oper=$co[isset($_GET['oper'])&&isset($_GET['oper'][$i])?$_GET['oper'][$i]:key($co)];
			$name=sane($_GET['name'][$i]);
			$data=sane($_GET['data'][$i]);
			//post treatement
			if($oper=='LIKE' && strrchr($data ,'%')==FALSE)$data="%$data%";//add wildcards on LIKE requests if no % found
			if($oper=='IN'  )$data="('".implode("','",explode(",",$data) ) ."')";//split IN values
			else $data="\"$data\"";
			//append to the global query
			$sql.= ($i?$conj:'')." `".str_replace('.','`.`',$name)."` $oper $data \n";
			if(strpos($name,'.')){//external table
				$ext=explode('.',$name);
				array_push($tables,$ext[0]);//add to the FROM
				get_join($ext[0],$tables[0],$sql,$tables);
			}
		}
		return print(/**/DB_json('SELECT '.$tables[0].'.* FROM '.implode(array_unique($tables),',').' '.$sql));
	}
	if($i==3 && ctype_digit($p[2]))return print(DB_json("SELECT * FROM `$p[1]` WHERE id = \"$p[2]\""));
	if($i==3 && is_string  ($p[2]))return print(DB_json("SELECT COUNT(*) AS rows,$p[2] FROM `$p[1]` GROUP BY $p[2]"));
	if($i==4)return print(DB_json("SELECT * FROM $p[1] WHERE $p[2] = \"".str_replace('&#47;','/',$p[3])."\""));
	return print('{"error":"no such route, see /'.$p[0].' for a list of all routes"}');
}

function postDefault(){
	return print("{}");
}
