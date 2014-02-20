Ressource={
edit:function(){
	var args=this;
	$('#Modal').modal('show');
	$('#ModalDrop')[0].onload=Ressource.file;
	DB('option',bd_table).success(
		DB.toForm.bind({table:bd_table,target:'#Modal .modal-body',id:args.id,
		submit:function(event){
			$form=$(event.target);
			var id=$form.find('[name=nocommune]').val()*10000+$form.find('[name=date]').val()*1;
			$form.find('[name=id]').val(id);
		},
		success:function(id){
			Alert('success',(args.id?'Updated':'Created')+(id?' : <a href="#&id='+id+'">'+id+'</a>':''));
			if(args.id)DB('get',bd_table+'/'+args.id).success(function(rows){//modified : ask for the new version
				DB.toRow($('tr[name='+rows[0].id+']'),rows[0],{cell:Ressource.cell,list:JSON.parse(localStorage.list)})});
			$('#Modal').modal('hide');
			$('#ModalDrop')[0].onload=undefined;
	}}));
},
list:function(){
	return DB.toList.bind({target:'#results_list',cell:Ressource.cell,table:bd_table,table_class:'table-condensed'})
},
cell:function(args,val,type,row){
	function btn(ico,oc){return $('<button type="button" class="btn btn-default btn-xs"><span class="glyphicon glyphicon-'+ico+'"></span></button>');}
	function txt(a,b){return a?('<span class="name">'+b+'</span><span class="value">'+a+'</span>'):null}
	if(type=='id')
		return $('<div class="btn-group" style="display:flex">')
			.append(btn('trash').on('click',function(){
				DB('delete',args.table+"/"+val).success((function(){
					return $(this).closest('tr').fadeOut(500);
				}).bind(this))
			}).attr({title:"supprimer "+val}))
			.append(btn('pencil').on('click',Ressource.edit.bind({id:val})).attr({"data-toggle":"tooltip"})
				.tooltip({container:'body',placement:'right',title:$.map(row,txt).join('<br/>'),html:true}));
	if(type=='href' && val)
		return $('<a target="blank" title="'+val+'" href="'+val+'">').html('<span class="glyphicon glyphicon-new-window"></span>');
	if(['fichedev','bdd','photo'].indexOf(type)>=0)
		return val*1?'&#10004;':'&#10008;';
	return $('<span>').attr({'title':val}).html(val);
},
file:function(modalDrop){
	function log(txt){$('#log').append(txt).append('<br/>');}
	function arr2obj(cols,entrie){for(var i in entrie)this[cols[i]]=entrie[i];}
	var entries=DB.parseCSV(this.result);
	if(!entries.length)return Alert('info','fichier vide');
	var cols=$(modalDrop).find('form').hide().find('[name]').map(function(a){return this.name});
	if($(modalDrop).find('.progress').size()==0)$(modalDrop).find('.modal-body').append('<div class="progress progress-striped active"><div class="progress-bar"></div></div><pre id="log"></pre>');
	log('Import : '+ entries.length +' entr�es');
	$('.progress').addClass('progress-striped active');
	entries.forEach(function(entry,i){
		$('.progress-bar').css({width:(i/entries.length)*100+'%'});
		DB('put',bd_table,{async:false/*inb4 lost my job etc..*/,data:JSON.stringify(new arr2obj(cols,entry))}).success(console.log);
		$('.progress-bar').css({width:((i+1)/entries.length)*100+'%'});
	});
	$('.progress').removeClass('progress-striped active');
	log('Import ok');
}
};