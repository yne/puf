<?php
function dir2ul($path,$title){
	if(!is_dir($path))return "<a href=\"/Page/".utf8_encode($path)."\"><span>".utf8_encode(pathinfo($title, PATHINFO_FILENAME))."</span></a>";
	$html="";
	foreach(preg_grep('/^([^.])/', scandir($path)) as $file)
		$html.='<li>'.dir2ul($path.'/'.$file,$file).'</li>';
	return '<span>'.utf8_encode($title).'</span><ul>'.$html.'</ul>';
}
function prety_ls($path,$type){
	$html='<thead><tr><th>Titre</th><th>Taille (Ko)</th>
	<th>Date de création</th>
	<th>Date de modification</th>
	<th>Date de dernière lecture</th></tr></thead>';
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
function get_default($ctrl="Page",$page='Accueil.html'){
	$args=func_get_args();
	$args[1]=$page;
	if($ctrl=='')$ctrl="Page";
	$type=strtolower(str_replace('.','',$ctrl));
	if(!@chdir('public/'.$type))die('No such file or directory');
	$file=implode('/',array_slice($args,1));
?>
<!DOCTYPE html>
<html>
	<head>
		<title>Modelespace &times; Architerre</title>
		<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">
		<link rel="stylesheet" href="//maxcdn.bootstrapcdn.com/bootstrap/3.2.0/css/bootstrap.min.css">
		<link rel="stylesheet" href="/css/style.css">
		<link rel="stylesheet" href="/css/menu.css">
		<link rel="icon" href="/img/favicon.ico" />
	</head>
	<body>
		<?if(!isset($_GET['full'])){?>
		<div class="header">
			<div class="container">
				<a href="/"><div id="titlebar" class="container hidden-xs" style="border-bottom: 1px solid #FFF;">
					<? if(!strstr($file,'Architerre' )){?><div id="logo_modelespace" class="pull-left"><h1 class="text-left">MODELESP<b style="color:#EC710A">∆</b>CE<small><br>Modélisation des espaces pré-industriels</small></h1></div><?}?>
					<? if(!strstr($file,'Modelespace')){?><div id="logo_architerre" class="pull-right"><h1 class="text-right"><b style="color:#EC710A">∆</b>RCHITERRE<small><br>Inventaire des sources fiscales d'Ancien Régime</small></h1></div><?}?>
				</div></a>
				<div class="navmenu"><?=dir2ul('.','');?></div>
			</div>
		</div>
		<?}?>
		<div class="content" data-type="<?=pathinfo($file,PATHINFO_EXTENSION)?>"><?
				if(file_exists(utf8_decode($file))){
					if(is_dir($file))echo prety_ls($file,$type);
					else echo file_get_contents(utf8_decode($file));
				}else{
					echo("No such file or directory");
				}
			?></div>
		<?if(!isset($_GET['full'])){?>
		<div class="footer hidden-xs">
			<div class="container">
				<div class="row">
					<div class="col-sm-3"><a href="/Page/Projets/Modelespace/Liens.html"><img src="/img/logo.gif"></a></div>
					<div class="col-sm-5">
						<address>
						Université de Toulouse 2 - Le Mirail<br>
						Maison de la Recherche<br>
						Laboratoire TRACES - <abbr title="Unité Mixte de Recherche">UMR</abbr> 5608<br>
						5, allées Antonio Machado 31058 TOULOUSE Cedex 9<br>
						</address>
					</div>
					<div class="col-sm-4">
						<p>Tel : 05.61.50.37.23</p>
						<p>Mel : <a href="mailto:florent.hautefeuille@univ-tlse2.fr">florent.hautefeuille@univ-tlse2.fr</a></p>
						<p>API : <a href="/v1">REST v1</a></p>
					</div>
				</div>
			</div>
		</div>
		<?}?>
		<script src="//cdnjs.cloudflare.com/ajax/libs/marked/0.3.2/marked.min.js"></script>
		<script>//search for a .md content tag and parse it
			/*
			var bootrend = new marked.Renderer();
			bootrend.table = function(header, body){
				return '<table class="table"><thead>'+header+'</thead><tbody>'+body+'</tbody></table>';
			};
			*/
			var md=document.querySelector('[data-type="md"]');
			if(md)md.innerHTML='<div class="container justifier"><div class="row">'+marked(md.innerHTML/*,{renderer:bootrend}*/)+'</div></div>';
		</script>
		<script src="//ajax.googleapis.com/ajax/libs/jquery/2.0.3/jquery.min.js"></script>
		<script src="/js/queryBuilder.js"></script>
		<script src="/js/restable.js"></script>
		<link rel="stylesheet" href="/css/restable.css">
	</body>
</html>
<?}?>