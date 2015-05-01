<?php
function dir2ul($path,$title){
	if(!is_dir($path))return "<a href=\"/page/".utf8_encode($path)."\"><span>".utf8_encode(pathinfo($title, PATHINFO_FILENAME))."</span></a>";
	$html="";
	foreach(preg_grep('/^([^.])/', scandir($path)) as $file)
		$html.='<li>'.dir2ul($path.'/'.$file,$file).'</li>';
	return '<span>'.utf8_encode($title).'</span><ul>'.$html.'</ul>';
}
function prety_ls($path,$type){
	$html='<thead><tr><th>Titre</th><th>Size (KB)</th>
	<th>Created</th>
	<th>Midified</th>
	<th>Accessed</th></tr></thead>';
	foreach(preg_grep('/^([^.])/', scandir($path)) as $file)
		$html.='<tr>
			<td><a href="/'.($type.'/'.$path.'/'.$file).'">'.$file.'</a></td>
			<td>'.(filesize ($path.'/'.$file)>>10).'</td>
			<td>'.(date("Y/m/d H:i:s.",filectime($path.'/'.$file))).'</td>
			<td>'.(date("Y/m/d H:i:s.",filemtime($path.'/'.$file))).'</td>
			<td>'.(date("Y/m/d H:i:s.",fileatime($path.'/'.$file))).'</td>
		</tr>';
	return '<table border="1" width="100%">'.$html.'</table>';
}
function get_default(){
	$p=func_get_args();
	$i=func_num_args();
	if($p[0]==''){$p[0]="page";$p[1]="Home.html";}
	$file='./'.preg_replace('/\\.+/','.',implode('/',array_slice($p,1)));//avoid path escaping
	if(!@chdir($p[0].'s') || !file_exists(utf8_decode($file)))
		die('"'.$p[0].'s'.'>'.$file.'" : No such file or directory');
	$menu=dir2ul('.','');
	$header=isset($_GET['full'])?'':<<<EOT
		<div class="header">
			<div class="container">
				<a href="/"><div id="titlebar" class="container hidden-xs">
					<div class="pull-left">
					<h1 class="text-left">GraphComp<small>
						<br>A changer ...</small></h1>
					</div>
				</div></a>
				<div class="navmenu">{$menu}</div>
			</div>
		</div>
EOT;
	$ext=pathinfo($file,PATHINFO_EXTENSION);
	$content=is_dir($file)?prety_ls($file,$p[0]):file_get_contents(utf8_decode($file));
	$footer=isset($_GET['full'])?'':<<<EOT
		<div class="footer hidden-xs">
			<div class="container">
				<div class="row">
					<div class="col-sm-3">Logo.gif</div>
					<div class="col-sm-5">Address</div>
					<div class="col-sm-4">Contact</div>
				</div>
			</div>
		</div>
EOT;
		echo <<< EOT
<!DOCTYPE html>
<html>
	<head>
		<title>GraphComp</title>
		<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">
		<link rel="stylesheet" href="//maxcdn.bootstrapcdn.com/bootstrap/3.2.0/css/bootstrap.min.css">
		<link rel="stylesheet" href="/css/style.css">
		<link rel="stylesheet" href="/css/menu.css">
		<link rel="icon" href="/img/favicon.ico" />
	</head>
	<body>
{$header}
		<div class="content" data-type="{$ext}">
{$content}
		</div>
{$footer}
		<script src="//cdnjs.cloudflare.com/ajax/libs/marked/0.3.2/marked.min.js"></script>
		<script>//search for a .md content tag and parse it
			var md=document.querySelector('[data-type="md"]');
			if(md)md.innerHTML='<div class="container justifier"><div class="row">'+marked(md.innerHTML)+'</div></div>';
		</script>
		<script src="//ajax.googleapis.com/ajax/libs/jquery/2.0.3/jquery.min.js"></script>
		<script src="/js/queryBuilder.js"></script>
		<script src="/js/restable.js"></script>
		<link rel="stylesheet" href="/css/restable.css">
	</body>
</html>
EOT;
}