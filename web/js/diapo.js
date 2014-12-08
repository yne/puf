var visualizer={
	path:'/public/photo/',
	//info loading
	load:function(id){//string
		var ids=visualizer.split_id(id);
		$('.ressource,.plan,.photo').hide();
		$.getJSON('/v1/photo/',{conj:['&'],name:['id'],oper:['~'],data:[id+'%']},function(photos){
			entries={};
			photos.forEach(function(photo){var e=visualizer.split_id(photo.id).entry;if(!entries[e])entries[e]=[];entries[e].push(photo)});
			list.innerHTML=Object.keys(entries).map(function(entry){
				return '<li class="group"><span class="title">'+(+entry)+'</span><ul>'+(entries[entry].map(function(photo){
					return '<li class="item">\
						<a id="'+photo.id+'" onclick="visualizer.changeTo(this.id);return false;" href="'+visualizer.path+visualizer.split_id(photo.id).res+'/'+photo.id+'.JPG">\
							<img src="/thumb/'+photo.id+'/128">\
							<span class="title">'+(photo.descriptif)+'</span>\
						</a>\
					</li>';
				}).join(''))+'</ul></li>'
			}).join('');
			//trigger a hover
			$('#aside').addClass('hover');
			setTimeout(function(){$('#aside').removeClass('hover');},1500);
			//autoload the first image
			visualizer.changeTo(ids)
		})
	},
	update_info_cache:{},
	update_info:function(type,arg,cb){
		if(visualizer.update_info_cache[type]==arg)return;//same info
		$.getJSON('/v1/'+type+'/'+arg,function(json){
			if(!json.length)
				return $('.'+type).hide();
			$('.'+type).show();
			for(var attr in json[0]){
				$('[data-col="'+type+'.'+attr+'"]').html(json[0][attr]).val(json[0][attr]).attr('title',json[0][attr]);
				if(cb)cb(attr,json[0][attr]);
			}
		})
	},
	changeTo:function(ids){
		if(ids.constructor != Object)ids=visualizer.split_id(ids);
		img.src='/img/visu_loader.gif';
		//allow loading gif to be used as src
		setTimeout(function(){img.src=visualizer.path+ids.res+"/"+visualizer.join_id(ids)+'.JPG';},100);
		
		visualizer.update_info('ressource',ids.res);
		visualizer.update_info('plan'     ,ids.res*1e4 + ids.entry*1);
		visualizer.update_info('photo'    ,ids.res*1e6 + ids.entry*1e2 + ids.sub*1,function(attr,val){
			if(attr!='nord')return;
			visualizer.reset();
		});
		
		$('.selected').removeClass('selected');
		$('#'+visualizer.join_id(ids)).addClass('selected');
	},
	//common API
	reset:function(){
		$('#img').data({scale:0.9,rotate:0,top:0,left:0});
		visualizer.update();
	},
	shift:function(by){
		var all=$('.item').get();
		for(var i=0;i<all.length;i++)
			if($(all[i]).find('a.selected').length)
				return $(all[(i+by+all.length)%all.length]).find('a').click();
	},
	set:function(type,op,val){
		var old=+$('#img').data(type);
		switch(op){
			case '+':$('#img').data(type,old+val);break;
			case '*':$('#img').data(type,old*val);break;
			case '=':$('#img').data(type,val);break;
			default:break;
		}
		visualizer.update();
		return false;
	},
	update:function(note){
		var data=$('#img').data();
		$('#img,.notes').css('transform',[
			'translateX('+data.left*data.scale+'%)',
			'translateY('+data.top *data.scale+'%)',
			'    rotate('+data.rotate+'deg)',//%360
			'     scale('+data.scale +')'
		].join(' '));
		$('#rot_btn').css({transform: "rotate("+(+data.rotate-rot.value-90)+"deg)"}).attr('title','Delta Nord : '+rot.value+'°\nRotation actuelle : '+data.rotate+'°')
	},
	//extend me
	exit:function(){},
	//utilities
	split_id:function(id){
		var res=0,entry=1,sub=1;
		id=id.toString();
		if(id.length>=8) res=id;
		if(id.length>=12)res=id.slice(0,-4),entry=id.slice(-4);
		if(id.length>=14)res=id.slice(0,-6),entry=id.slice(-6,-2),sub=id.slice(-2);
		if(id.length>=16)console.log(id.length,id)//badID
		
		return {res:res,entry:entry,sub:sub};
	},
	join_id:function(id){
		return id.res*1e6 + id.entry*1e2 + id.sub*1;
	},
}
