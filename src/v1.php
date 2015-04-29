<?php
function defaultBase(){
	return "modelespace";//set your default base name here (can be read from a file)
}
function DB_json($sql,$p=array(),$i=2){
	$public = preg_match("/^(SELECT|SHOW) /",$sql);
	if(!$public && (!isset($_SERVER['PHP_AUTH_USER']) || !isset($_SERVER['PHP_AUTH_PW']))){
		header('WWW-Authenticate: Basic realm="BackOffice"');
		header('HTTP/1.0 401 Unauthorized');
		return "Missing credentials";
	}
	try {
		$pdo=new PDO('mysql:dbname='.defaultBase(),
			isset($_SERVER['PHP_AUTH_USER'])?$_SERVER['PHP_AUTH_USER']:"anonymous",//httpd name otherwise (www-data)
			isset($_SERVER['PHP_AUTH_PW'  ])?$_SERVER['PHP_AUTH_PW'  ]:NULL,
			array(PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8"));
		
		$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
		$sth=$pdo->prepare($sql);
		for($bp=0;$bp+$i<count($p);$bp++)
			$sth->bindParam($bp+1,$p[$bp+$i], PDO::PARAM_STR);
		$sth->execute();
	}catch(PDOException $e) {
		switch($e->getCode()){
			case 1044:
			case 1045:
				unset($_SERVER['PHP_AUTH_USER']);
				return DB_json($sql,$p,$i);//autenthification failed => re ask
			default:return $e->getMessage();
		}
	}
	return $public?json_encode($sth->fetchAll(PDO::FETCH_ASSOC)):$pdo->lastInsertId();
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
		<script>document.body.innerHTML=marked(document.getElementById('api').innerHTML)</script>
		<script src="http://ajax.googleapis.com/ajax/libs/jquery/2.0.3/jquery.min.js"></script>
	</body>
</html>
PAGE;
}
function colexist($table,$col){
	return strlen(DB_json('SELECT * FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = "'.defaultBase().'" AND TABLE_NAME = "'.$table.'" AND COLUMN_NAME = "'.$col.'"'))>2;
}
function param2where(){
	$lo=array('&'=>'AND','|'=>'OR');//logical op
	$co=array('='=>'=','!'=>'!=','~'=>'LIKE','<'=>'<','>'=>'>',':'=>'IN');//compare op
	if(!isset($_GET['data']))return "";
	$where=count($_GET)?"WHERE ":"";
	for($d=0;$d<count($_GET['data']);$d++){
		//get and sanitize input
		$conj=$lo[isset($_GET['conj'])&&isset($_GET['conj'][$d])?$_GET['conj'][$d]:key($lo)];
		$oper=$co[isset($_GET['oper'])&&isset($_GET['oper'][$d])?$_GET['oper'][$d]:key($co)];
		$name=sane($_GET['name'][$d]);
		$data=sane($_GET['data'][$d]);
		//post treatement
		if($oper=='LIKE' && strrchr($data ,'%')==FALSE)$data="%$data%";//add wildcards on LIKE requests if no % found
		if($oper=='IN'  )$data="('".implode("','",explode(",",$data) ) ."')";//split IN values
		else $data="\"$data\"";
		//append to the global query
		$where.= ($d?$conj:'')." `".str_replace('.','`.`',$name)."` $oper $data \n";
	}
	return $where;
}
function sane($str){
	return preg_replace('/["\\\\]/','',$str);
}
function addQuotes($str){return '"'.sane($str).'"';}

/* controller part */
function do_join($t){
	for($j=1,$join=array();$j<count($t);$j++){//auto join
		if(colexist($t[$j-1],'id_'.$t[$j]))array_push($join,$t[$j  ].'.id = '.$t[$j-1].'.id_'.$t[$j  ]);
		if(colexist($t[$j],'id_'.$t[$j-1]))array_push($join,$t[$j-1].'.id = '.$t[$j  ].'.id_'.$t[$j-1]);
	}
	return implode(" AND ",$join);
}

function get_default(){
	header("Access-Control-Allow-Origin: *");
	$p=func_get_args();
	$i=func_num_args();
	$tables=explode('-',$p[1]);
	$join=do_join($tables);
	//v1
	if($i==1)return print(showHelp());
	//v1/
	if($i==2 && $p[1]=="")return print(DB_json('SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = "'.defaultBase().'"'));
	//v1/table
	if($i==2 && $p[1]!="")return print(DB_json("SHOW FULL COLUMNS FROM $tables[0]"));
	//v1/table/123 => v1/table/table.id/123
	if($i==3 && ctype_digit($p[2])){$i=4;$p[3]=$p[2];$p[2]=$tables[count($tables)-1].'.id';}
	//v1/table/col
	if($i==3 && $p[2]!="")return print(DB_json("SELECT COUNT(*) AS rows,$p[2] FROM `$tables[0]` GROUP BY $p[2]"));
	//v1/table/
	if($i==3 && $p[2]==""){$where=param2where();}
	//v1/table/col/val
	if($i==4){$where=$p[2].' = "'.str_replace('&#47;','/',$p[3]).'"';};
	//v1/table/col/val/etc...
	if($i>=5)return print(showHelp());
	return print(DB_json("SELECT $tables[0].* FROM ".implode(array_unique($tables),',').
		(strlen($where.$join)?' WHERE ':'').$where.
		(strlen(       $join)?' AND   ':'').$join));
}

function post_default(){
	$p=func_get_args();// v1,table,id/attr,....
	$i=func_num_args();
	//v1/{table}
	//REPLACE INTO table (a,b,c) VALUES (1,2,3) ON DUPLICATE KEY UPDATE
	if($i==2 && $p[1]!="")return print(DB_json("REPLACE INTO $p[1] (".implode(array_keys(array_filter($_POST)),',').") VALUES (".implode(array_map("addQuotes",array_values(array_filter($_POST))),',').")"));
	//v1/{table}/
	if($i==3 && ctype_digit($p[2])){$i=4;$p[3]=$p[2];$p[2]='id';}
	//v1/{table}/{col}/{value}
	$set=array();foreach($_POST as $k=>$v)array_push($set,$k."=".addQuotes($v));
	if($i==4)return print(DB_json("UPDATE $p[1] SET ".implode($set,",")." WHERE $p[1].$p[2]=$p[3]"));
	//others
	print(showHelp());
}
