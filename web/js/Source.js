Source={};
Source.table=function(type){return {
	struct:"/v1/parcelleunitefiscale",
//	query :"/v1/parcelleunitefiscale/",
//	param :{conj:["&"],name:["documentation_associée"],oper:["!"],data:['']},
//	only:{},
	table :{
		'id'                 :{format:function(val,row,t,c){return $("<button/>",{title:$.map(row,function(a,b){return (a&&a!="0"&&t[b])?(t[b].desc || t[b].name || b)+" :\n\t"+a+'\n':''}).join('')}).html('&#9432;').click(function(){alert(this.title)})},title:"&nbsp;"},
		'choixDuProprietaire':{format:function(val,row,t,c){return $("<a/>",{title:val}).html(val).click(function(){
			$.getJSON('/v1/proprietaire/',{name:['parcelleunitefiscale.id'],data:[row['id']]},function(e){
				alert(e.map(function(p,i){return '\n=== PROPRIETAIRE #'+(i+1)+' === \n'+$.map(p,function(a,b){return (a&&a!="0")?''+b+" : "+a+'\n':''}).join('')}).join('').replace(/ /g,'\u00A0'))
			})
		})}},
		'polyparcelle'       :{format:function(val,row,t,c){return $("<a/>",{title:"Informations complémentaires"}).html(val).click(function(){
			$.getJSON('/v1/parcelleunitereelle/',{name:['parcelleunitefiscale.id'],data:[row['id']]},function(e){
				alert(e.map(function(p,i){return '\n=== PARCELLE #'+(i+1)+' === \n'+$.map(p,function(a,b){return (a&&a!="0")?''+b+" : "+a+'\n':''}).join('')}).join('').replace(/ /g,'\u00A0'))
			})
		})}},
	}
}};

