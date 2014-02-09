<?php

// OPTION:/res
function optionDefault($p,$param,$url){
	if(count($p)==1)return DB_json("SHOW FULL COLUMNS FROM $p[0]");
}
// PUT:/res,{attr:val,attr2:val2...}
function putDefault($p,$param,$url){
	if(isset($param->id) && $param->id=='')
		return DB_json("INSERT INTO $p[0] (".implode(",",array_keys((array)$param)).") VALUES ('".implode("','",array_values((array)$param))."')");
	$set=array();
	foreach ($param as $key => $value)
		array_push($set,"$key='$value'");
	return DB_json("UPDATE $p[0] SET ".implode(',',$set)." WHERE id = $param->id");
}
// PATCH:/res/id/attr/val
function patchDefault($p,$param,$url){
	if(count($p)==4)return DB_json("UPDATE $p[0] SET $p[2] = '$p[3]' WHERE id = $p[1]");
}
// GET:/res[/attr:id[/val]]
function getDefault($p,$param,$url){
	if(count($p)==1)return DB_json("SELECT * FROM $p[0]");
	if(count($p)==2)
		if(is_numeric($p[1])) return DB_json("SELECT * FROM $p[0] WHERE id = $p[1]");
		else return DB_json("SELECT COUNT(*) AS rows,$p[1] FROM $p[0] GROUP BY $p[1]");
	if(count($p)==3)return DB_json("SELECT * FROM $p[0] WHERE $p[1] = '$p[2]'");
}
// DELETE:/res[/attr='id']/val
function deleteDefault($p,$param,$url){
	if(count($p)==2)return DB_json("DELETE FROM $p[0] WHERE id = $p[1]");
	if(count($p)==3)return DB_json("DELETE FROM $p[0] WHERE $p[1] = '$p[2]'");
}
//HEAD
function searchDefault($p,$param,$url){
	return '{"cool":"yes"}';
}

//POST
