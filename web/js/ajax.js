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
		$('<table class="table">').addClass(args.table_class)
			.append($('<thead>').append($('<tr>').append(json.length==0?'<td>empty</td>':
				Object.keys(json[0]).map(function(a){return $('<th>'+DB.space(a)+'</th>')}))))
			.append($('<tbody>').append(
				json.map(function(row){return $("<tr>").append($.map(row,function(val,col){
					return $('<td>').append(args.cell?args.cell(args,val,col):row[col]);
				}))})
			))
	)
};

DB.toForm=function(json){
	var args=this;
	var $form=$('<form>'
		+json.map(DB.toInput).join('')
		+'<div class="form-group">'
		+'<input type="reset"  class="btn btn-default"/>'
		+'<input type="submit" class="btn btn-primary pull-right"/>'
		+'</div></form>');
	//args.submit
	$form.on('submit',function(event){
		var arg = {};
		$.map($(this).serializeArray(),function(n){arg[n.name] = n.value;});
		$.ajax('/'+args.table,{type:"put",data:JSON.stringify(arg)}).success(args.success);
		event.preventDefault();
		return 0;
	});
	$(args.target).html($form);
	//if id provided : load it values into the form
	if(args.id!=undefined)DB('get',args.table+'/'+args.id).success(function(json){
		for(var attr in json[0])
			$(args.target+" [name='"+attr+"']").val(json[0][attr]);
	});
};

DB.toFind=function(json){
	var args=this;
	function obj2att(obj){return $.map(obj,function(a,b){return b+'="'+a+'"'}).join(' ')}
	function obj2opt(obj){return $.map(obj,function(a,b){return '<option value="'+b+'">'+a+'</option>'}).join('')}
	function formgrp(tag,attr,html){return '<div class="form-group"><'+tag+' '+attr+' class="form-control">'+html+'</'+tag+'></div>';}
	var collumns={};
	json.forEach(function(a){collumns[a.Field]=DB.space(a.Field);})
	
	return $(args.target).html('<div class="row">'
		+formgrp('select','',obj2opt({AND:"et",OR:"ou"}))
		+formgrp('select','',obj2opt(collumns))
		+formgrp('select','',obj2opt({"LIKE":"&#8776;","=":"=","!=":"&ne;","<":"&lt;",">":"&gt;",}))
		+formgrp('input' ,'','')
		+formgrp('button',obj2att({type:"button",onclick:"$(this).closest('.row').remove();","class":"btn  btn-default"}),'<span class="glyphicon glyphicon-trash"></span>')
	+'</row>');
};
DB.toFind.seralize=function($row){
	return $($row).map(function(){
		return $(this).find('select,input').map(function(){
			var d=this.nodeName=='INPUT'?"'":"";
			return d+$(this).val()+d;
		}).toArray()
	}).toArray();
}