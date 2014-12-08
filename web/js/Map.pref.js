Map.pref={
	//using fusion table (see : developers.google.com/fusiontables/docs/v1/sql-reference#Select)
	//key can be changed at : code.google.com/apis/console/
	sql_url:"https://www.googleapis.com/fusiontables/v1/query?key=AIzaSyCntQpRLDDFDE2xOnOr5pJLzaTdhDGiOoE&sql=",
	shapeOptions:{
		strokeColor: '#000000',
		strokeOpacity: 1,
		strokeWeight: 1,
		fillColor: '#EC710A',
		fillOpacity: 0.75,
	},
	getShapeOptions_com:function(com){
		return {
			fillOpacity:Math.min((com.list.length/10)+0.05,0.75),
			strokeWeight: com.plan/*.geo*/ ? 3:1,
		}
	},
	getShapeOptions_res:function(com_color){
		return {
			fillColor: com_color,
			fillOpacity: 0.25,
		}
	},
	getTitle_com:function(com){
		return com.name+' ('+com.list.length+' doc)\n'+
			(com.plan ?' * '+com.plan +' plans\n'      :'')+
			(com.href ?' * '+com.href +' liens ext.\n' :'')+
			(com.photo?' * '+com.photo+' ressources visualisables\n'     :'')+
			(com.geo  ?' * '+com.geo  +' plans géolocalisés':'');
	},
	getShapeOptions_dep:function(dep){
		return {
			fillOpacity:Math.min(Math.log(dep.rows+10)/10,1),
		}
	},
	options:{
		center:new google.maps.LatLng(43.75, 1.75),
		zoom:7,
		mapTypeId: google.maps.MapTypeId.ROADMAP ,
		panControl: false,
		scaleControl: false,
		streetViewControl: false,
		overviewMapControl: false,
		zoomControl: true,
		zoomControlOptions:{
			style: google.maps.ZoomControlStyle.LARGE,
			position: google.maps.ControlPosition.LEFT_CENTER
		},
		mapTypeControl: true,
		mapTypeControlOptions: {
			style: google.maps.MapTypeControlStyle.DROPDOWN_MENU,
			position: google.maps.ControlPosition.BOTTOM_LEFT
		},
		draggable: true,
		scrollwheel: true,
		disableDoubleClickZoom: true,
		styles:[
			{featureType:"road"                       ,stylers:[{visibility:"on" },{color:"#888888"},{weight:0.25}]},
			{featureType:"road"                       ,stylers:[{visibility:"off"}],elementType:'labels'},
			{featureType:"administrative"             ,stylers:[{visibility:"on" },{color:"#000000"},{weight:2}]},
			{featureType:"administrative"             ,stylers:[{visibility:"off"}],elementType:"labels"},
			{featureType:"administrative.country"     ,stylers:[{visibility:"on" }],elementType:"geometry"},
			{featureType:"administrative.locality"    ,stylers:[{visibility:"on" },{color:"#000000"},{weight:0.5}]},//nom de departement
			{featureType:"poi"                        ,stylers:[{visibility:"off"}]},
		],
	}
}

/*
###########  featureType  ############
administrative
administrative.country
administrative.land_parcel
administrative.locality
administrative.neighborhood
administrative.province
all
landscape
landscape.man_made
landscape.natural
landscape.natural.landcover
landscape.natural.terrain
poi
poi.attraction
poi.business
poi.government
poi.medical
poi.park
poi.place_of_worship
poi.school
poi.sports_complex
road
road.arterial
road.highway
road.highway.controlled_access
road.local
transit
transit.line
transit.station
transit.station.airport
transit.station.bus
transit.station.rail
water
########### elementType ##############
all
geometry
geometry.fill
geometry.stroke
labels
labels.icon
labels.text
labels.text.fill
labels.text.stroke
###########  stylers  ################
color
gamma
hue
invert_lightness
lightness
saturation
visibility
weight
###########################
*/
