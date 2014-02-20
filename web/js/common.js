$(function(){
	//avoid hidden content on floating menu
	if($('.navbar-fixed-top').size())$('body').css('padding-top','50px');
	$('#menu').fadeOut(0).html(menu2bootstrap(Menu)).fadeIn();
	$("#menu a:not([href^='#'])").click(function(event){
		$(this).closest('.open').removeClass('open');
		window.history.pushState($(this).text(),$(this).text(),this.href);
		window.onpathchange(location.pathname);
		event.preventDefault();
		return false;
	});
});

(window.onpathchange=function(newpath){
	var url='/html/'+(newpath.substr(1).replace(/\//g,'_')||'home')+'.html';
	$('#page').fadeOut(250,function(){$(this).load(url,function(){$(this).slideDown()});});
})(location.pathname);//trigger on page load

Alert=function(type,msg){ /* info,success,warning,danger */
	//console.log(type,msg);
	$("#Alert").removeClass().addClass("alert fade in alert-"+type)
		.html(msg).slideDown(400).delay(4000).slideUp(400);
}

$(document).ajaxError(function(e,jq,opt,error){
	Alert('danger',error);
	console.warn(this,arguments);
});