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
		+'<label class="ucf" for="'+el.id+'">'+DB.space(col.Field)+'</label>'
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
localStorage.list=localStorage.list||'{"hidden_col":[],"label":{}}';
DB.list_th_btn=[
	['sort-by-attributes',function(){
		var name=$(this).closest('th').attr('name');
		var $tbody=$(this).closest('table').find('tbody');
		$tbody.html($tbody.find('tr').get().sort(function(a,b){
			return(+$(a).find('[name="'+name+'"]').text().localeCompare($(b).find('[name="'+name+'"]').text(),"fr",{numeric:true,sensitivity: "base"}));
		}));
	}],
	['sort-by-attributes-alt',function(){
		var name=$(this).closest('th').attr('name');
		var $tbody=$(this).closest('table').find('tbody');
		$tbody.html($tbody.find('tr').get().sort(function(a,b){
			return(-$(a).find('[name="'+name+'"]').text().localeCompare($(b).find('[name="'+name+'"]').text(),"fr",{numeric:true,sensitivity: "base"}));
		}))
	}],
	[],
	['eye-close',function(){
		var name=$(this).closest('th').attr('name');
		$(this).closest('table').find('th[name="'+name+'"],td[name="'+name+'"]').hide();
		var list=JSON.parse(localStorage.list);
		list.hidden_col.push(name);
		localStorage.list=JSON.stringify(list);
	}],
	['pencil',function(){
		var $th=$(this).closest('th')
		var name=$th.attr('name');
		var $label=$th.find('a');
		var list=JSON.parse(localStorage.list);
		list.label[name]=prompt("New label for "+name,$label.text());
		localStorage.list=JSON.stringify(list);
		$label.html(list.label[name]||DB.space(name));
	}],
];
DB.list_menu_btn=[
	['eye-open',function(){
		$(this).closest('table').find('th[name],td[name]').show();
		var list=JSON.parse(localStorage.list);
		list.hidden_col=[];
		localStorage.list=JSON.stringify(list);
	}],
	['floppy-disk',function(){
		var line_sep="\n",col_sep=";";
		return location.href="data:text/csv;base64," + btoa($(this).closest('table').find('tbody tr').get().map(function(tr){
			return $(tr).find('td').get().map(function(td){
				return unescape($(td).attr('value')).replace(new RegExp(col_sep,'g'),'');
			}).join(col_sep);
		}).join(line_sep));
	}],
];

DB.toList=function(json){
	function li(arg){return arg.length?$('<li><a><span class="glyphicon glyphicon-'+arg[0]+'"></span></a></li>').on('click',arg[1]):'<br/>';}
	var args=this;
	var list=JSON.parse(localStorage.list);
	$(args.target).html(
		$('<table class="table">').addClass(args.table_class)
			.append($('<thead>').append($('<tr class="active">').append(json.length==0?"<th>empty :'( </th>":
				Object.keys(json[0]).map(function(col,i){
					return $($('<th name="'+col+'">').toggle(list.hidden_col.indexOf(col)<0).append(
						$('<div class="btn-group">')
						.append($('<a title="'+col+'" class="ucf" data-toggle="dropdown">').html(i?(list.label[col]||DB.space(col)):'<button type="button" class="btn btn-default btn-xs"><span class="glyphicon glyphicon-cog"></span></button>'))
						.append($('<ul class="dropdown-menu">').append(DB[i?'list_th_btn':'list_menu_btn'].map(li)))
					))}))))
			.append($('<tbody>').append(
				json.map(function(row){return $("<tr>").append($.map(row,function(val,col){
					$cell=$('<td class="td-overflow" name="'+col+'" value="'+escape(row[col])+'">').append(args.cell?args.cell(args,val,col):row[col]).toggle(list.hidden_col.indexOf(col)<0);
					return $cell;
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
	$form.on('submit',function(event){
		var col = {};
		$.map($(this).serializeArray(),function(n){col[n.name] = n.value;});
		$.ajax('/'+args.table,{type:"put",data:JSON.stringify(col)}).success(args.success);
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

DB.toSearchForm=function(json){
	var args=this;
	var collumns={};
	var list=JSON.parse(localStorage.list);
	if( json )$(args.target).data('json',json);//save for commings json-missing requests
	else json=$(args.target).data('json');
	(json||[]).forEach(function(a){collumns[a.Field]=(list.label[a.Field]||DB.space(a.Field));});
	
	function obj2att(obj){return $.map(obj,function(a,b){return b+'="'+a+'"'}).join(' ')}
	function obj2opt(obj){return $.map(obj,function(a,b){return $('<option class="ucf" value="'+b+'">').html(a)})}
	function formgrp(tag,attr,html,val){return $('<div class="form-group">').append($('<'+tag+' '+attr+' class="form-control">').html(html)[val?'val':'last'](val));}
	function newLine(all,j,cal,op,val){return $('<div class="row">').append([
			formgrp('select','',obj2opt({'&':"et",'|':"ou"}),j),
			formgrp('select','',obj2opt(collumns),cal),
			formgrp('select','',obj2opt({"~":"&#8776;","=":"=","!":"&ne;","<":"&lt;",">":"&gt;",}),op),
			formgrp('input' ,'','',val),
			formgrp('button',obj2att({type:"button",onclick:"$(this).closest('.row').remove();","class":"btn  btn-default"}),'<span class="glyphicon glyphicon-trash"></span>')
		]);
	}
	function param2lines(params){
		var exp="([&|])(\\w+)([~=!<>])([^&|]*)";
		return params.slice(1).match(new RegExp(exp,'g')).map(function(a){
			return newLine.apply(this,a.match(new RegExp(exp)));
		});
	}
	
	if(args.hash.length>1){
		$(args.target).html(param2lines(args.hash));
	}else{
		$(args.target).html(newLine());
	}
};
DB.form2param=function($row){
	return $($row).map(function(){
		return $(this).find('select,input').map(function(){
			return $(this).val();
		}).toArray()
	}).toArray();
}