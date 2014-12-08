Ressource={
getColor:function(i){
	var colors=[
	"037","059","06b","07e","08f","29f","5af","7bf","acf","cdf",
	"076","098","0ba","0ed","0fe","2fe","5fe","7fe","afe","cff",
	"270","290","2b0","3e0","3f0","5f2","7f5","9f7","bfa","cfc",
	"570","790","9b0","be0","cf0","cf2","df5","df7","efa","efc",
	"740","960","b70","e90","fa0","fb2","fc5","fc7","fda","fec",
	"710","910","b10","e10","f20","f42","f65","f87","faa","fcc",
	"703","904","b05","e06","f07","f29","f5a","f7b","fac","fcd",
	"607","909","b0c","d0e","f0f","f2f","f5f","f7f","faf","fcf",
	"307","409","40b","50e","60f","82f","95f","a7f","caf","dcf",
	"333","555","666","777","888","999","aaa","bbc","ddd","eee"];
	return "#"+colors[i%colors.length];
},
btn_style:'font-size:1.3em;text-decoration:none;border:1px solid #CCC;border-radius:3px;',
table:function(type){return {
	struct:"/v1/ressource",
//	query :"/v1/ressource/",
//	param :{conj:["&"],name:["documentation_associée"],oper:["!"],data:['']},
	only:{
		carte    :['id','type','date','cote','has_doc','has_bdd','has_geo','has_photo','url'],
		carte_ext:['id','type','date','cote','has_doc','has_bdd','has_geo','has_photo','url','communes_secondaires'],
		}[type],
	table :{
		'id'       :{title:"&nbsp;",format:function(val,row,t,c){return $("<button/>",{title:$.map(row,function(a,b){return (a&&a!="0"&&t[b])?(t[b].desc || t[b].name || b)+" :\n\t"+a+'\n':''}).join('')}).html('&#9432;').click(function(){alert(this.title)})}},
		'url'      :{format:function(val,row){if( val)return $('<a/>',{style:Ressource.btn_style,title:"Afficher les vues depuis un autre site web",target:'_blank',href:val}).html('&#8689;')}},
		'has_doc'  :{format:function(val,row){if(+val)return $('<a/>',{style:Ressource.btn_style,title:"Afficher les documents associés"           ,target:'_blank',href:'/Fiche/'+row['id']+'?full'})                                                                .click(function(){window.open(this.href,'fiche' ,'location=0,top=0,left=0');return false;}).html('&#9636;')}},
		'has_bdd'  :{format:function(val,row){if(+val)return $('<a/>',{style:Ressource.btn_style,title:"Chercher dans la base de donnée associée"  ,target:'_blank',href:'/Page/Sources/Recherche%20avanc%C3%A9e.html?full#'+row['id']})                              .click(function(){window.open(this.href,'source','location=0,top=0,left=0');return false;}).html('&#8981;')}},
		'has_geo'  :{format:function(val,row){if(+val)return $('<a/>',{style:Ressource.btn_style,title:"Géolocaliser les vues"                     ,target:'_blank',href:'/Page/Accès cartographique.html?full#'+row['id'],css:{color:Ressource.getColor(row['id'])}}).click(function(){window.open(this.href,'map'   ,'location=0,top=0,left=0');return false;}).html('&#9873;')}},
		'has_photo':{format:function(val,row){if(+val)return $('<a/>',{style:Ressource.btn_style,title:"Visualiser les vues"                       ,target:'_blank',href:'/html/diapo.html?full#'+row['id']})                                                         .click(function(){window.open(this.href,'diapo' ,'location=0,top=0,left=0');return false;}).html('&#9654;')}},
	},
	tfoot:!type,
	pagination:type?99:20,
}}
};
/*
Ressource.showFiles=function(key){
	$('#ajaxModal').modal('show');
	$('#ajaxModal').find('.modal-title').html('Documents associés au document n° '+key+'');
	$.getJSON('/file/get/fiche/'+key,function(a){
		$('#ajaxModal').find('.modal-body' ).html('<dl class="dl-horizontal"><dt><u>Fichier</u></dt><dd><u>Informations</u></dd>'+a.map(function(f){
			var pow=Math.floor(((+f.size).toString(2).length-1)/10);
			return '<dt><a href="/'+f.path+'">'+f.name+'</a></dt><dd>Taille : '+(f.size>>(10*pow))+' '+['octets','Ko','Mo','Go'][pow]+' , Date : '+(new Date(f.date*1000)).toLocaleString()+'</dd>'}
		)+'</dl>');
	});
}
*/
