+function ($) {
	'use strict';
	// RESTABLE CLASS DEFINITION
	// ==========================

	function RESTable(element, options) {
		this.$element = $(element)
		this.options = $.extend({}, RESTable.DEFAULTS, options)
		this.$element.html([$('<thead/>'),$('<tbody/>'),$('<tfoot/>')]);
		//initial query
		if(this.options.query)this.query();
	}
	
	RESTable.DEFAULTS = {
		pagination: 20,
		tfoot:true,
		table:null,
		struct:null,
	}
	
	RESTable.prototype.loadStruct = function (cb) {
		$.getJSON(this.options.struct,(function(struct){
			this.options.table = $.extend(true,{},this.options.table);
			struct.forEach(function(col){
				this.options.table[col.Field] = $.extend(col,JSON.parse(col.Comment||'{}'),this.options.table[col.Field]);// col_spe <- Comment <- table
				if(this.options.only){
					this.options.table[col.Field].hide =this.options.only.indexOf(col.Field)<0;
					this.options.table[col.Field].index=this.options.only.indexOf(col.Field);
				}
			},this);
			this.options.struct=null;//avoid another load
			cb();
		}).bind(this))
	}
	RESTable.prototype.query = function (query_url,query_param) {
		//update options with the new param
		if(query_url){
			if(typeof(query_param)=="string")query_param=JSON.parse(query_param);
			this.options.query=query_url;
			this.options.param=query_param;
		}
		//load table struct (if not yet loaded) and recall once loaded
		if(this.options.struct)
			return this.loadStruct(this.query.bind(this,query_url,query_param));
		//draw the progress bar
		this.$element.find('tbody').html('<tr><td colspan="99">Récuperation ...</td></tr>');
		$.getJSON(this.options.query,this.options.param,this.show.bind(this)).fail(function(xhr){alert(xhr.responseText);});
	}
	RESTable.prototype.show = function (json) {
		this.page=0;
		this.sort=undefined;
		this.json=json;
		//load table struct (if not yet loaded) and recall once loaded
		if(this.options.struct)
			return this.loadStruct(this.show.bind(this,json));
		this.update();
	}
	
	RESTable.prototype.orderBy = function () {
		var col=this.sort;
		if(this.sort)this.json=this.json.sort(function(a,b){return a[col].localeCompare(b[col],'fr',{numeric:true,sensitivity: "base"})});
		if(this.order)this.json.reverse();
		this.page=0;
		this.update();
	}
	RESTable.prototype.update = function (new_param) {
		this.getThead(this.$element.find('thead'));
		this.getTbody(this.$element.find('tbody'));
		if(this.options.tfoot)
			this.getTfoot(this.$element.find('tfoot'));
	}
	RESTable.prototype.getRows = function (raw_rows) {
		if(raw_rows==undefined)return [];
		var out={},ti=this.options.table;
		Object.keys(raw_rows)
			.sort(function(a,b){if(!ti[b]||!ti[a])return 0;return (ti[a].index||0)-(ti[b].index||0)})
			.filter(function(c){return !(ti[c]||{}).hide})
			.forEach(function(c){out[c]=raw_rows[c]});
		return out;
	},
	RESTable.prototype.getThead = function ($thead) {
		var rt=this,setVal=function(){rt.orderBy($.extend(true,rt,$(this).data()))};
		return $thead.html($('<tr/>').append(
			$.map(this.getRows(this.json[0]),(function(val,c){
				var i=this.options.table[c]||{};
				return $('<th/>',{title:i.desc || i.name || c}).html([
					i.title || i.name || c,
					$('<div/>',{'class':"menu"}).html([
						$('<button/>',{title:"Tri descendant"}).html('&#9660;').data({sort:c,order:true }).click(setVal),
						$('<button/>',{title:"Tri ascendant" }).html('&#9650;').data({sort:c,order:false}).click(setVal),
					]),
				])
			}).bind(this))
		));
	}
	RESTable.prototype.getTbody = function ($tbody) {
		if(!this.json.length)return $tbody.html('<tr><td colspan="99">Vide</td></tr>');
		var rt=this;
		var start=this.page*this.options.pagination;
		var end  =this.options.pagination? start   +this.options.pagination:Infinity;
		var $tbody = this.json.slice(start,end).map(function(row){
			return $('<tr>').append($.map(this.getRows(row),function(val,c){
				return $('<td/>',{title:val}).html((rt.options.table[c]||{}).format?rt.options.table[c].format(val,row,rt.options.table,c):val);
			}));
		},this);
		return this.$element.find('tbody').html($tbody);
	}
	RESTable.prototype.getTfoot = function ($tfoot) {
		var rt=this;
		var npage=this.options.pagination?Math.ceil(this.json.length/this.options.pagination):0;
		var opts=$.map(new Array(npage),function(a,i){return $('<option/>',{value:i,selected:rt.page==i}).html(i+1+'/'+npage);});
		var setVal=function(){rt.update($.extend(true,rt,$(this).data()))};
		return $tfoot.html(this.json.length?
			$('<tr/>').html($('<th/>',{colspan:99}).html($('<ul>').html([
				$('<li/>').html(this.json.length<=20?'':
					$.map({'20':20,'50':50,'Tout':0},function(a,b){return $('<button/>').data({options:{pagination:a}}).html(b).click(setVal)})
				),
				$('<li/>').html(npage<=1?'':[
					$('<button/>').html('&#8810;').data('page',0).click(setVal),
					$('<button/>').html('&#60;  ').data('page',Math.max(this.page-1,0)).click(setVal),
					$('<select/>').html(opts).change(function(){rt.update(rt.page=$(this).val())}),
					$('<button/>').html('&#62;  ').data('page',Math.min(this.page+1,npage-1)).click(setVal),
					$('<button/>').html('&#8811;').data('page',npage-1).click(setVal),
				]),
				$('<li/>').html([
					$('<button/>').html('CSV').click(rt.toCSV.bind(rt,',',false)),
					$('<button/>').html('TSV').click(rt.toCSV.bind(rt,'\t',false))
				]),
			])))
		:'');
	}
	RESTable.prototype.toCSV = function (sep,header) {
		sep=sep||';';
		var col=header?Object.keys(this.json[0]).join(sep)+'\n':'';
		var data=this.json.map(function(row){
			return $.map(row,function(a,b){return a.match(/\w*/)[0]}).join(sep)
		}).join('\n');
		location.href="data:text/csv;base64,"+btoa(col+data);
	}
	
	// RESTABLE PLUGIN DEFINITION
	// ===========================
	$.fn.restable = function (option) {
		var args=arguments;
		return this.each(function () {
			var $this   = $(this)
			var data    = $this.data('bs.restable')
			var options = typeof option == 'object' && option
			if (!data) $this.data('bs.restable', (data = new RESTable(this, options)))
			if (typeof option == 'string') data[option].apply(data,Array.prototype.slice.call(args,1))
		})
	}

	// RESTABLE DATA-API
	// ==================

	$(window).on('load', function () {
		$('table[data-query]').each(function () {
			$(this).restable($(this).data())
		});
	});
	
}(jQuery);
