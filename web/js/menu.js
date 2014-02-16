var Menu={
	brand:{
		Architerre:"/",
	},
	left :{
		Page:{
			Modelespace:{
				Présentation:"/presentation",
				Biographie:"/bibliographie",
				Lien:"/liens",
			},
			Architerre:{
				Présentation:"/projet",
			},
		},
		Recherche:{
			Ressources:"/recherche/ressources",
			Sources:"/recherche/sources",
		},
//		Search:'<form class="navbar-form"><input type="search" class="form-control" placeholder="Search"></form>'
	},
	right:{
		Contact:"/contact",
	}
}

function menu2bootstrap(menu){
	function entry2bootstrap(entry,name,pos,rec){
		if(entry.constructor==String){
			if(entry[0]=='<')return '<li>'+entry+'</li>';//custom html tag
			return '<li><a href="'+entry+'">'+name+'</a></li>';
		}
		if(entry.constructor==Object){
			if(rec>0)return (pos?'<li class="divider"></li>':'')+//divider
				'<li class="dropdown-header">'+name+'</li>'+//section name
				entries2bootstrap(entry,1+rec);//sub-entries
			return '<li class="dropdown">'+
				'<a href="#" class="dropdown-toggle" data-toggle="dropdown">'+name+' <b class="caret"></b></a>'+
				'<ul class="dropdown-menu">'+entries2bootstrap(entry,1+rec)+'</ul></li>';
		}
	}
	function entries2bootstrap(entries,rec){
		var html='',i=0,rec=rec||0;
		for(var m in entries)html+=entry2bootstrap(entries[m],m,i++,rec);
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