function submitForm(event,form){
	var arg = {};
	$.map($(form).serializeArray(),function(n){arg[n.name] = n.value;});
	return $.ajax('/'+$(form).data('table'),{type:"PUT",data:JSON.stringify(arg),
	username:"admin",password:"zeus"})
	.success(console.log).error(function(x,c,t){console.warn(t)});
}
function collumns2form(collumns){
	var types={
		TINYINT  :{type:'number',min:0,max:255},
		SMALLINT :{type:'number',min:-32768,max:32767},
		INT      :{type:'number',min:-2147483648,max:2147483647},
		BIGINT   :{type:'number'},
		FLOAT    :{type:'text',pattern:'[-+]?[0-9]*\.?[0-9]*'},
		DOUBLE   :{type:'text',pattern:'[-+]?[0-9]*\.?[0-9]*'},
		BIT      :{type:'checkbox'},
		DATE     :{type:'date'},
		DATETIME :{type:'datetime'},
		TIMESTAMP:{type:'number'},
		TIME     :{type:'time'},
		CHAR     :{type:'text'},
		VARCHAR  :{type:'text'},
		TEXT     :{type:'textarea'},
	};
	return (collumns||[]).map(function(col){
		var el=types[col.Type.match(/\w+/)[0].toUpperCase()];
		el.maxlength=(col.Type.match(/\d+/)||[''])[0];
		$.extend(el,{name:col.Field,id:el.name+Date.now(),title:col.Comment,value:0});
		if(col.Null=='NO' && el.type!='checkbox')el.required='required';//avoid forced check
		
		var label=col.Field.replace(/([A-Z])/g,function(a,b){return ' '+a.toLowerCase();})//camel style spacing
		var tag=(el.maxlength>255)||(el.type=='textarea')?'textarea':'input';
		
		return '<div class="form-group" '+(col.Extra?'hidden':'')+'>'//extra => A_I => id => user hide
			+'<label for="'+el.id+'">'+label+'</label>'
			+'<'+tag+' '+$.map(el,function(v,n){return n+'="'+v+'"';}).join(' ')+' class="form-control"></'+tag+'></div>';
	});
}
function display(table){
	$.ajax('/'+table,{type:'option'}).success(function(json){
		$('#out').html(collumns2form(json).join('')+'<input type="submit"/>').data({table:table});
	})
}
display('ressource')