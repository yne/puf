var DB={}
//utilities
DB.space=function(title){
	return title.replace(/_/g,' ')
		.replace(/([A-Z])([A-Z])([a-z])|([a-z])([A-Z])/g,'$1$4 $2$3$5')//camel style spacing
		.toLowerCase();
}
DB.cols2html=function(collumns){//TODO : process one row
	return collumns.map(function(col){
		var el=DB.Type[col.Type.match(/\w+/)[0].toUpperCase()];
		el.maxlength=(col.Type.match(/\d+/)||[''])[0];
		$.extend(el,{name:col.Field,id:el.name+Date.now(),title:col.Comment/*,value:0*/});
		//if(col.Null=='NO' && el.type!='checkbox')el.required='required';//avoid forced checkbox
		
		var tag=(el.maxlength>255)||(el.type=='textarea')?'textarea':'input';
		return '<div class="form-group" '+(col.Extra?'hidden':'')+'>'//extra => A_I => id => user hide
			+'<label for="'+el.id+'">'+DB.space(col.Field)+'</label>'
			+'<'+tag+' '
			+$.map(el,function(v,n){return n+'="'+v+'"';}).join(' ')+' class="form-control"></'+tag+'></div>';
	});
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
DB.list=function(table,target,opt){
	opt=opt||{};
	$.ajax('/'+table,{type:'get',cache:false}).success(function(json){
		$(target).html(
			'<table class="table '+(opt.table_class||'')+'">'
			+'<tr>'+(json.length?Object.keys(json[0]).map(function(a){return '<th>'+DB.space(a)+'</th>'}).join(''):'<td>empty</td>')+'</tr>'
			+json.map(function(row){
				var html="";
				for(var col in row)
					html+='<td>'+(opt.cell?opt.cell(row[col],col,table):row[col])+'</td>';
				return '<tr>'+html+'</tr>';
			}).join('')
			+'</table>');
	});
};
DB.get=function(table,id){
	return $.ajax('/'+table+'/'+id,{type:'get'});
};
DB.remove=function(table,id){
	return $.ajax('/'+table+'/'+id,{type:'delete'}).always(function(json,status){alert(status)});
};

DB.form=function(table,target,id){
	$.ajax('/'+table,{type:'option'}).success(function(json){
		$(target).html('<form data-type="'+table+'" onsubmit="DB.send(this);return false;">'
			+DB.cols2html(json).join('')+'<input type="submit"/></form>');
		if(id!=undefined)DB.get(table,id).success(function(json){
			for(var attr in json[0])
				$(target+" [name='"+attr+"']").val(json[0][attr]);
		});
	});
};

DB.send=function(form){
	var arg = {};
	$.map($(form).serializeArray(),function(n){arg[n.name] = n.value;});
	$.ajax('/'+form.dataset.type,{type:"put",data:JSON.stringify(arg)})
		.success(console.log).error(function(x,c,t){console.warn(t)});
};