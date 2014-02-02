function menu2bootstrap(menu){
	function entry2bootstrap(entry,name,pos){
		if(entry==null)
			return (pos?'<li class="divider"></li>':'')+'<li class="dropdown-header">'+name+'</li>';
		if(entry.constructor==String){
			if(entry[0]=='<')return '<li>'+entry+'</li>';
			return '<li><a href="'+entry+'">'+name+'</a></li>';
		}
		if(entry.constructor==Object)
			return '<li class="dropdown">'+
				'<a href="#" class="dropdown-toggle" data-toggle="dropdown">'+name+' <b class="caret"></b></a>'+
				'<ul class="dropdown-menu">'+entries2bootstrap(entry)+'</ul></li>';
	}
	function entries2bootstrap(entries){
		var html='',i=0;
		for(var m in entries)html+=entry2bootstrap(entries[m],m,i++);
		return html;
	}
	var brand=menu.brand?Object.keys(menu.brand)[0]:'';
	var left =entries2bootstrap(menu.left );
	var right=entries2bootstrap(menu.right);
	//navbar-right
	return '<nav class="navbar navbar-inverse navbar-fixed-top">'+
		'<div class="container">'+
			'<div class="navbar-header">'+
				'<button type="button" class="navbar-toggle" data-toggle="collapse" data-target=".navbar-collapse">'+
				'<span class="icon-bar"></span><span class="icon-bar"></span><span class="icon-bar"></span></button>'+
				(brand?'<a class="navbar-brand" href="'+menu.brand[brand]+'">'+brand+'</a>':'')+
			'</div>'+
			'<div class="collapse navbar-collapse">'+
				(left ?'<ul class="nav navbar-nav navbar-left ">'+left +'</ul>':'')+
				(right?'<ul class="nav navbar-nav navbar-right">'+right+'</ul>':'')+
			'</div>'+
		'</div>'+
	'</nav>';
}