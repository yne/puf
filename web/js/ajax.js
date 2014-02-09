var DB=function(type,table,opt){
	(opt=opt||{}).type=type;
	return $.ajax('/'+table,opt);
}
//utilities
DB.space=function(title){
	return title.replace(/_/g,' ')
		.replace(/([A-Z])([A-Z])([a-z])|([a-z])([A-Z])/g,'$1$4 $2$3$5')//camel style spacing
		.toLowerCase();
}
DB.toInput=function(col){
	var el=DB.Type[col.Type.match(/\w+/)[0].toUpperCase()];
	el.maxlength=(col.Type.match(/\d+/)||[''])[0];
	$.extend(el,{name:col.Field,id:el.name+Date.now(),title:col.Comment});
	//if(col.Null=='NO' && el.type!='checkbox')el.required='required';//avoid forced checkbox
	
	var tag=(el.maxlength>255)||(el.type=='textarea')?'textarea':'input';
	return '<div class="form-group" '+(col.Extra?'hidden':'')+'>'//extra => A_I => id => user hide
		+'<label for="'+el.id+'">'+DB.space(col.Field)+'</label>'
		+'<'+tag+' '
		+$.map(el,function(v,n){return n+'="'+v+'"';}).join(' ')+' class="form-control"></'+tag+'></div>';
};

DB.Type={
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

//Requests
DB.toList=function(json){
	var args=this;
	$(args.target).html(
		'<table class="table '+(args.table_class||'')+'">'
			+'<thead><tr>'+(json.length?Object.keys(json[0]).map(function(a){
				return '<th>'+DB.space(a)+'</th>'}).join(''):'<td>empty</td>')+'</tr>'
			+'</thead><tbody>'
			+json.map(function(row){return "<tr>"+$.map(row,function(val,col){
					return '<td>'+(args.cell?args.cell(args,val,col):row[col])+'</td>';
				}).join('')+'</tr>';}).join('')
		+'</tbody</table>');
};

DB.toForm=function(json){
	var args=this;
	$(args.target).html('<form data-type="'+args.table+'" onsubmit="DB.send(this);return false;">'
		+json.map(DB.toInput).join('')
		+'<div class="form-group">'
		+'<input type="reset"  class="btn btn-default"/>'
		+'<input type="submit" class="btn btn-primary pull-right"/>'
		+'</div></form>');
	//if id provided : load it values into the form
	if(args.id!=undefined)DB('get',args.table+'/'+args.id).success(function(json){
		for(var attr in json[0])
			$(args.target+" [name='"+attr+"']").val(json[0][attr]);
	});
};

DB.send=function(form){
	var arg = {};
	$.map($(form).serializeArray(),function(n){arg[n.name] = n.value;});
	$.ajax('/'+form.dataset.type,{type:"put",data:JSON.stringify(arg)})
		.success(console.log).error(function(x,c,t){console.warn(t)});
};