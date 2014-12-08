<?php

function get_default(){
	$p=func_get_args();
	$thumbWidth=isset($p[2])?$p[2]:128;
	
	$web='/stockage/modelespace/web';
	$pic='/public/photo/';
	$folder=substr($p[1],0,strlen($p[1])-6);
	$name='/'.$p[1].'.JPG';

	$full=$pic.$folder.$name;
	$thumb_dir='/.thumb'.$thumbWidth;
	$thumb=$pic.$folder.$thumb_dir.$name;
	//return print($web.$thumb);
	
	if(!file_exists($web.$thumb)){
		$img = imagecreatefromjpeg($web.$full);
		$width = imagesx( $img );
		$height = imagesy( $img );
		$new_width = $thumbWidth;
		$new_height = floor( $height * ( $thumbWidth / $width ) );
		$tmp_img = imagecreatetruecolor( $new_width, $new_height );
		imagecopyresized( $tmp_img, $img, 0, 0, 0, 0, $new_width, $new_height, $width, $height );
		
		if(!file_exists(dirname($web.$thumb)))
			mkdir(dirname($web.$thumb));

		if(!imagejpeg($tmp_img, $web.$thumb))
			return print('');
	}
	
	header("Content-Type: image/jpeg");
	return print(file_get_contents($web.$thumb));
}
