+function ($) {
//	'use strict';
	// QUERYBUILDER CLASS UTILTIES
	// ========================
	function obj2att(obj){return $.map(obj,function(a,b){return b+'="'+a+'"'}).join(' ')}
	function obj2opt(obj,grp){return $.map(obj,function(a,b){
			if(a.constructor==String)return $('<option value="'+(grp?grp+'.'+b:b)+'" title="'+b+'">').html(a)
			if(a.constructor==Object)return $('<optgroup label="'+b+'">').html(obj2opt(a,b))
	})}
	function formgrp(tag,attr,html,val){return $('<div class="form-group">').append($('<'+tag+' '+attr+' class="form-control">').html(html)[val?'val':'last'](val));}
	function newLine(all,conj,name,oper,data){
		return $('<div class="row">').append([
			formgrp('select','name="conj[]"',obj2opt(this.options.lo),conj),
			formgrp('select','name="name[]"',obj2opt(this.collumns)  ,name),
			formgrp('select','name="oper[]"',obj2opt(this.options.co),oper),
			formgrp('input' ,'name="data[]"','',data),
			formgrp('button',obj2att({type:"button",onclick:"$(this).closest('.row').remove();",title:"retirer","class":"btn  btn-default"}),'&times;')
		]);
	}
	// QUERYBUILDER CLASS DEFINITION
	// ==========================

	function QueryBuilder(element, options) {
		this.$element = $(element)
		this.collumns = {};
		this.options = $.extend({}, QueryBuilder.DEFAULTS, options)
		//initial query
		if(this.options.url)this.build();
	}
	
	QueryBuilder.DEFAULTS = {
		alias:{},//may come from localStorage
		usehash:false,
		lo:{'&':"et",'|':"ou"},//logical op
		co:{"~":"&#8776;","=":"=","!":"&ne;","<":"&lt;",">":"&gt;",":":"parmis",},//compare op
	}
	
	QueryBuilder.prototype.add = function () {
		this.$element.find('.row:first').clone().appendTo(this.$element);
	}
	QueryBuilder.prototype.build = function (customurl) {
		if(customurl)this.options.url=customurl;
		this.$element.html('loading database struct ...');
		var urls=this.options.url.split(' ')
		var n=0;
		urls.forEach(function(url){
			$.ajax({
				url:url,
				dataType: "json",
				context:this,
				success:function(json){
					var grplabel=url.match(/\w+$/);
					this.collumns[grplabel]={};//colname:alias
					(json||[]).forEach(function(a){
						try{JSON.parse(a.Comment||'{}');}catch(e){alert(a.Comment+'\n'+e)}
						this.collumns[grplabel][a.Field]=(JSON.parse(a.Comment||'{}').name||a.Field);
					},this);
					if(++n==urls.length){//if all struct are loaded
						this.$element.html(newLine.call(this));
						this.$element.trigger($.Event('ready.bs.querybuilder'));
					}
				}
			})
		},this)
	}
	QueryBuilder.prototype.get = function (cb) {
		//return $(this.$element).closest('form').serialize();//TODO : invert form<->div.querybuilder
		return {
			conj:$(this.$element).find('[name="conj[]"]').toArray().map(function(a){return a.value}),
			name:$(this.$element).find('[name="name[]"]').toArray().map(function(a){return a.value}),
			oper:$(this.$element).find('[name="oper[]"]').toArray().map(function(a){return a.value}),
			data:$(this.$element).find('[name="data[]"]').toArray().map(function(a){return a.value}),
		};
	}
	QueryBuilder.prototype.set = function (params) {
		params=JSON.parse(params);
		this.$element.html('');
		for(var i=0;i<params.conj.length;i++)
			this.$element.append(newLine.apply(this,[null,params.conj[i],params.name[i],params.oper[i],params.data[i]]));
	}
	// QUERYBUILDER PLUGIN DEFINITION
	// ===========================

	$.fn.querybuilder = function (option) {
		var args=arguments;
		var ret=undefined;
		var each = this.each(function () {
			var $this   = $(this)
			var data    = $this.data('bs.querybuilder')
			var options = typeof option == 'object' && option
			if (!data) $this.data('bs.querybuilder', (data = new QueryBuilder(this, options)))
			if (typeof option == 'string')ret = data[option].apply(data,Array.prototype.slice.call(args,1))
		});
		return ret||each;
	}

	// QUERYBUILDER DATA-API
	// ==================

	$(window).on('load', function () {
		$('<style>.querybuilder .row:first-child>*:first-child{visibility: hidden;}'+
		'.querybuilder .row:first-child .btn{display: none;}</style>').appendTo("head");

		$('.querybuilder').each(function () {
			var $this = $(this)
			$this.querybuilder($this.data())
		})
	});
	
}(jQuery);
