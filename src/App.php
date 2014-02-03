<?php

require_once('DB.php');

class App{
	private $def_val = array(
		'ajax_dir' => 'ajax',
		'page_dir' => 'page',
		'controller' => "default",
		'method' => "default",
		'base' => '../src',
	);
	function __construct($opt=array()){
		$this->ajax = isset($_SERVER['HTTP_X_REQUESTED_WITH']);
		$this->meth = strtolower($_SERVER['REQUEST_METHOD']);
		$this->url  = parse_url($_SERVER['REQUEST_URI']);
		$this->path = array_values(array_filter(explode('/',$this->url['path'])));
		$this->val  = (object)array_merge($this->def_val,$opt);
		$this->Path = array_merge($this->path,array($this->val->controller,$this->val->method));
	}
	function run(){
		$this->findController();
		$this->findMethod();
		
		$m=$this->handler;
		$rep=$m($this->path,$this->loadParam(),$this->url);
		
		if($this->ajax && ($rep[0]=='{' || $rep[0]=='['))
			header('Content-type: text/json');//; charset=utf-8
		else
			header('Content-type: text/html');
		echo $rep;
	}

	private function loadParam(){
		if(isset($this->url['query']) && strlen($this->url['query'])>1
		  && (($this->url['query'][0]=='{')||($this->url['query'][0]=='[')))
			return json_decode(urldecode($this->url['query']));
		if($this->meth=='post')
			return $_POST;
		if($this->meth=='get')
			return $_GET;
		if($this->meth=='put')
			return json_decode(file_get_contents('php://input'));
	}
	private function findController(){
		$ext='.php';
		$dir=$this->val->base.'/'.($this->ajax?$this->val->ajax_dir:$this->val->page_dir).'/';
		if(@include($dir.$this->Path[0]        .$ext))return;//load given controller (or default if none provided)
		if(@include($dir.$this->val->controller.$ext))return;//else, fallback to the default controller
		throw new Exception($dir.$this->Path[0].$ext.': controller not found');
	}
	private function findMethod(){
		if(function_exists($this->handler=$this->meth.ucfirst($this->Path[1])))return;
		if(function_exists($this->handler=$this->meth.ucfirst($this->val->method )))return;
		throw new Exception('method '.$this->handler.' not found');
	}
}