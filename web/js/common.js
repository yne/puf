﻿$(function(){
	//avoid hidden content on floating menu
//	if($('.navbar-fixed-top'))$('body').css('padding-top','50px');
	$('#menu').fadeOut(0).html(menu2bootstrap(Menu)).fadeIn();
	$("#menu a:not([href^='#'])").click(function(event){
		$(this).closest('.open').removeClass('open');
		window.history.pushState($(this).text(),$(this).text(),this.href);
		event.preventDefault();
		return false;
	});
	
	var old_pathname="@";
	setInterval(function(){if(old_pathname===location.pathname)return;
		$('#page').fadeOut(0);
		$.get('/html/'+(location.pathname.substr(1).replace(/\//g,'_')||'home')+'.html',function(a){
			$('#page').html(a).fadeIn();
		});
		old_pathname=location.pathname;
	},200);
});