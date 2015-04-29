<?php
function dir2ul($path,$title){
	if(!is_dir($path))return '<a href="'.str_replace('/./','/','/Page/'.utf8_encode($path)).'"><span>'.utf8_encode(preg_replace('/^\d+\./','',pathinfo($title, PATHINFO_FILENAME)))."</span></a>";
	$html="";
	foreach(preg_grep('/^([^.])/', scandir($path)) as $file)
		$html.='<li>'.dir2ul($path.'/'.$file,$file).'</li>';
	return '<span>'.utf8_encode(preg_replace('/^\d+\./','',$title)).'</span><ul>'.$html.'</ul>';
}
function prety_ls($path,$type){
	$html='<thead><tr><th>Titre</th><th>Size (KB)</th>
	<th>Created</th>
	<th>Midified</th>
	<th>Accessed</th></tr></thead>';
	foreach(preg_grep('/^([^.])/', scandir($path)) as $file)
		$html.='<tr>
			<td><a href="/public/'.($type.'/'.$path.'/'.$file).'">'.$file.'</a></td>
			<td>'.(filesize ($path.'/'.$file)>>10).'</td>
			<td>'.(date("Y/m/d H:i:s.",filectime($path.'/'.$file))).'</td>
			<td>'.(date("Y/m/d H:i:s.",filemtime($path.'/'.$file))).'</td>
			<td>'.(date("Y/m/d H:i:s.",fileatime($path.'/'.$file))).'</td>
		</tr>';
	return '<table border="1" width="100%">'.$html.'</table>';
}
function get_default($ctrl="Page",$page='Home.html'){
	$args=func_get_args();
	$args[1]=$page;
	if($ctrl=='')$ctrl="Page";
	$type=strtolower(str_replace('.','',$ctrl));
	$file=implode('/',array_slice($args,1));
	if(!@chdir('public/'.$type) || !file_exists(utf8_decode($file)))
		die($file.' : No such file or directory');

	$menu=dir2ul('.','');
	$header=isset($_GET['full'])?'':<<<EOT
		<div class="header">
			<div class="container">
				<a href="/"><div id="titlebar" class="container hidden-xs">
					<div class="pull-left">
					<h1 class="text-left">SITENAME<small>
						<br>Site subtitle</small></h1>
					</div>
				</div></a>
				<div class="navmenu">{$menu}</div>
			</div>
		</div>
EOT;
	$ext=pathinfo($file,PATHINFO_EXTENSION);
	$content=is_dir($file)?prety_ls($file,$type):file_get_contents(utf8_decode($file));
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
		<title>My Website</title>
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
			if(md)md.innerHTML='<div class="container justifier">'+marked(md.innerHTML)+'</div>';
		</script>
		<script src="//ajax.googleapis.com/ajax/libs/jquery/2.0.3/jquery.min.js"></script>
		<script src="/js/queryBuilder.js"></script>
		<script src="/js/restable.js"></script>
		<link rel="stylesheet" href="/css/restable.css">
	</body>
</html>
EOT;
}