var Map={
	map:null,
	//markers handling
	markers:{dep:[],com:[],res:[]},
	removeMarker:function(marker){
		if(marker.getMap()){
			marker.setMap(null);
			if(marker.data.shape){
				marker.data.shape.setMap(null)
			}
		}
	},
	removeAllMarkers:function(type){
		Map.markers[type].forEach(Map.removeMarker);
		Map.markers[type]=[];
	},
	showAllMarkers:function(type){
		Map.markers[type].forEach(function(marker){
			if(!marker.getMap())marker.setMap(Map.map);
			if(marker.data.shape && !marker.data.shape.getMap())marker.data.shape.setMap(Map.map);
		});
	},
	
	//utilities
	stringToCoords:function(str,noisy){
		var m=str.match(/,/g);
		if(m && m.length==2)//bad point use
			str=str.replace(/,/g,'.');
		var coord=str.split(/[\s,;]/);
		coord[0]*=1+(noisy?Math.random()/ 1800:0);//x
		coord[1]*=1+(noisy?Math.random()/36000:0);//y
		return new google.maps.LatLng(Math.max(coord[1],coord[0]),Math.min(coord[1],coord[0]))
	},
	
	//place stuff
	placeMarker:function(type,coords,attr){
		var marker = new google.maps.Marker($.extend({
			position:coords.constructor==String?Map.stringToCoords(coords,attr.rand):coords,
			icon: attr.icon||'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7',
			data:attr.data||{},
		},attr));
		
		var tooltip_show=(function(ev){
			$('#tooltip').show().html(this.data.title);
			//for(var attr in ev)if(ev[attr] instanceof MouseEvent)return;//poly have a MouseEvent, Marker don't
			if(ev.latLng){
				var topRight=Map.map.getProjection().fromLatLngToPoint(Map.map.getBounds().getNorthEast ());
				var bottomLeft=Map.map.getProjection().fromLatLngToPoint(Map.map.getBounds().getSouthWest());
				var scale=Math.pow(2,Map.map.getZoom());
				var worldPoint=Map.map.getProjection().fromLatLngToPoint(marker.getPosition());
				var x=(worldPoint.x-bottomLeft.x)*scale;
				var y=(worldPoint.y-topRight.y)*scale;
				tooltip_atXY(x,y);
				//var xy=Map.map.getProjection().fromLatLngToPoint(ev.latLng);
				//tooltip_atXY(xy.x/256*$(document).width(),xy.y/256*$(document).height());
			}
			return false;
		}).bind(marker);
		var tooltip_atXY=(function(cx,cy){
			
			var ttw=$('#tooltip').width(),tth=$('#tooltip').height();
			$('#tooltip').css({
				left:(cx+32+ttw<$(document).width() ?cx+16:cx-16-ttw)+'px',
				top :(cy+32+tth<$(document).height()?cy+16:cy-16-tth)+'px',
			});
		})
		var tooltip_move=(function(ev){
			for(var attr in ev)
				if(ev[attr] instanceof MouseEvent)
					return tooltip_atXY(ev[attr].clientX,ev[attr].clientY);
		}).bind(marker);
		var tooltip_hide=(function(ev){
			$('#tooltip').hide();
		}).bind(marker);
		
		if(attr.onclick)
			google.maps.event.addListener(marker, 'click',attr.onclick);
		if(attr.onclick && attr.data.shape)
			google.maps.event.addListener(attr.data.shape, 'click',attr.onclick.bind(marker));
		if(attr.data.title && attr.icon){
			google.maps.event.addListener(marker, 'mouseover',tooltip_show);
			google.maps.event.addListener(marker, 'mouseout' ,tooltip_hide);
		}
		if(attr.data.shape && !attr.icon && attr.data.title){
			google.maps.event.addListener(attr.data.shape, 'mouseover',tooltip_show);
			google.maps.event.addListener(attr.data.shape, 'mousemove',tooltip_move);
			google.maps.event.addListener(attr.data.shape, 'mouseout' ,tooltip_hide);
		}
		marker.setMap(Map.map);
		Map.markers[type].push(marker);
	},
	placeShape2:function(type,coord,style){
		console.log(coord)
		var paths=coord.map(function(a){return new google.maps.LatLng(a[1],a[0])})
		var shape = new google.maps.Polygon($.extend({},Map.pref.shapeOptions,style,{paths:paths}));
		shape.setMap(Map.map);
		return shape;
	},
	placeShape:function(type,coord,style){
		var paths=[];
		for(var i=0;i<coord.length;i+=2)paths.push(new google.maps.LatLng(coord[i+0],coord[i+1]))
		var shape = new google.maps.Polygon($.extend({},Map.pref.shapeOptions,style,{paths:paths}));
		shape.setMap(Map.map);
		return shape;
	},
	
	//core (init + 3 show)
	init:function(){
		Map.map = new google.maps.Map(map_canvas);
		Map.map.setOptions(Map.pref.options);
		//in for the search
		if(location.hash && location.hash.length>1){
			var hash=location.hash.slice(1);
			
			if(isNaN(hash))//search hash type
				return Map.showCommunes(JSON.parse(hash));
			else{//number hash type
				if(hash.length==2)return Map.showCommunes({conj:['&'],name:['num_dep'],oper:['='],data:[hash]});
				if(hash.length==5)return Map.showPlan('nocommune/'+hash);
				if(hash.length==9)return Map.showPlan('ressource/'+hash);
			}
		}
		//no hash => here for the browse
		Map.showDepartement();
	},
	
	showDepartement:function(query){
		function clickDepartement(){
			//move to the departement
			Map.map.setZoom(10);
			Map.map.setCenter(Map.stringToCoords(this.data.coord));
			//hide/show markers part
			Map.showAllMarkers('dep');//(re)show all departement
			Map.removeMarker(this);//hide the clicked departement marker
			Map.removeAllMarkers('com');//remove any previously shown communes
			Map.removeAllMarkers('res');//remove any previously shown ressources
			//hide the info panel
			infopanel.hidden=true;
			//show departement ressources
			Map.showCommunes({conj:['&','|'],name:['num_dep','communes_secondaires'],oper:['=','~'],data:[this.data.num,' '+this.data.num]})
		}
		Map.removeAllMarkers('dep');//(re)hide all departement
		
		$('#infotip').show().html('Récuperation des departements peuplés');
		$.getJSON("/v1/ressource/num_dep",function(deps){
		var dep_in = deps.map(function(d){return d['num_dep']}).join(',');
			$('#infotip').show().html('Récuperation des contours');
			$.getJSON(Map.pref.sql_url+"SELECT * FROM 1W0c-_mWv21M_D5ZE77tJbj-gQ_q5M_PUOY1UA4df WHERE dep IN ("+dep_in+")",function(json){
				deps.forEach(function(dep){
					var num_dep=+dep['num_dep'];
					var info=$.grep(json.rows,function(d){return d[0]==num_dep})[0];
					if(!info)return console.warn("can't get info for dep#"+num_dep);
					
					Map.placeMarker('dep',info[1],{
						icon:Map.icon.getIcon(Map.icon.LABEL,{width:64,height:48,top:0.5,label:info[2],sub:dep.rows+" doc."}),
						onclick:clickDepartement,
						data:{
							num:info[0],
							coord:info[1],
							shape:Map.placeShape('dep',info[3].split(','),Map.pref.getShapeOptions_dep(dep)),
						},
					})
					$('#infotip').html('OK').hide();
				})
			})
		})
	},
	
	showCommunes:function(query){
		function groupRessources(ressources){
			var grouped={};//ressource grouped by code_commune
			function push(ndep,ncom,name,res){
				if(!ncom || !ndep)return console.warn('missing ncom/ndep on ressource:'+res.id);
				
				if(!grouped[ndep])grouped[ndep]={};
				if(!grouped[ndep][ncom])grouped[ndep][ncom]={list:[],plan:0,href:0,photo:0,geo:0};
				grouped[ndep][ncom].plan += (res.type == "plan");
				grouped[ndep][ncom].href += (res['url'] != "");
				grouped[ndep][ncom].photo+= +res['has_photo'];
				grouped[ndep][ncom].geo  += +res['has_geo'];
				if(name && !grouped[ndep][ncom].name)grouped[ndep][ncom].name = name;
				grouped[ndep][ncom].list.push(res);
				return grouped[ndep][ncom];
			}
			
			//premiere passe : communes interne
			ressources.forEach(function(res){
				var group=push(res['num_dep'],res['code_commune'],res['nom_commune'],res);
			});
			
			//deuxieme passe : communes externes
			ressources.filter(function(res){return res['communes_secondaires']}).forEach(function(res){
				(res['communes_secondaires'].match(/ \d+\[.*?\]/g)).forEach(function(info){
					var num=info.match(/\d+/)[0];
					var name=(info.match(/\[.*?\]/)||[''])[0].slice(1,-1);
					push(num.slice(0,-3),num,name,res);
				},this);
			});
			
			return grouped;
		}

		function clickCommunes(){
			var data=this.data;
			//show ressources in table
			infopanel.hidden=false;
			$('#nom_com').html(data.name);
			$('#nom_dep').html(data.id);
			
			var intern=data.list.filter(function(res){return res['code_commune']==data.id})
			$('#intern').toggle(intern.length>0);
			$('#intern').restable('show',intern);
			
			var extern=data.list.filter(function(res){return res['code_commune']!=data.id})
			$('#secondaire').toggle(extern.length>0);
			$('#extern').restable('show',extern);
			
			Map.removeAllMarkers('res');//remove any previously shown ressources
			Map.showAllMarkers('com');//(re)show all communes
			if(this.data.geo){//no geolocalised ressource to zoom on
				Map.removeMarker(this);//hide the clicked commune marker
				Map.showPlan('nocommune/'+this.data.id,this.data.coord);//show the plan
			}
		}
		
		$('#infotip').html('Récuperations de la liste des communes').show();
		$.getJSON("/v1/ressource/",query).success(function(ress){
			var res_by_dep=groupRessources(ress);
			$('#infotip').html('Récuperations des contours des communes').show();
			$.getJSON(Map.pref.sql_url+"SELECT * FROM 1RdiME73tRiVPfrsT03LnqgkvAo8LpfLj6XJiX3DN WHERE dep in ("+Object.keys(res_by_dep).join(',')+')',function(json){
				for(var ndep in res_by_dep){//passe en revue tout les dep
					for(var ncom in res_by_dep[ndep]){//passe en revue toute les communes (groupement de ressource) de ce dep
						var info=$.grep(json.rows,function(line){return +line[1]==ncom})[0]//search for the good shape using ncom
						if(!info || !info[4]){console.warn('no info/shape found for #'+ncom);continue;}
						
						var res_com=res_by_dep[ndep][ncom];
						res_com.id=info[1];//ncom;
						res_com.name=info[2];
						res_com.coord=info[3];
						res_com.title=Map.pref.getTitle_com(res_com);
						res_com.shape=Map.placeShape('dep',info[4].split(/[, ]/),Map.pref.getShapeOptions_com(res_com));
						
						Map.placeMarker('com',res_com.coord,{data:res_com,onclick:clickCommunes});
					}
				}
				$('#infotip').html('').hide();
			})
		});
	},
	
	showPlan:function(query,zoomto){
		$('#infotip').show().html('Récuperation des plans');
		return $.getJSON('/v1/plan/'+query).success(function(plans){
			if(!plans.length)return console.log("0 plan");
			var center;
			plans.forEach(function(plan){
				if(!center)center=plan.coord;
				Map.placeMarker('res',Map.stringToCoords(plan.coord),{
					data:{
						id:plan.id,
						shape:Map.placeShape2('res',plan['bounds'].split(' ').map(function(a){return a.split(',')}),Map.pref.getShapeOptions_res(Ressource.getColor(plan.ressource))),
						title:'Ressource n° '+plan.ressource+' ; Plan n° '+(+plan.id.substr(-4))+'\n'+plan.legend+' \n'+plan.comment,
					},
					icon:Map.icon.getIcon(Map.icon.FLAG,{width:32,height:32,left:0,top:1,color:Ressource.getColor(plan.ressource),label:+plan.id.slice(-4)}),
					onclick:function(){
						window.open('/html/diapo.html#'+this.data.id,'diapo/'+this.data.id,'location=0,top=0,left=0');
					}
				});
			});
			//zoom on the commune
			Map.map.setZoom(12);
			Map.map.setCenter(Map.stringToCoords(zoomto || center));
			$('#infotip').html('OK').hide();
		});
	},
}
