function getQuery(attr_query){
	var query=typeof(attr_query)=='string'?JSON.parse(attr_query):attr_query;
	if($('#dep').val()!=''){
		query.name.push('num_dep');
		query.data.push($('#dep').val());
	}
	return query;
}
function tab_map(btn,ev){
	ev.preventDefault();
	ev.stopPropagation();
	location.href='/Page/Acc%C3%A8s%20cartographique.html#'+JSON.stringify(getQuery($(btn).closest('[data-req]').data('req')));
}
function tab_search(a,ev){
	if(!a)return $('#results').hide();
	ev.preventDefault();
	$('#results').show()
		.restable(Ressource.table())
		.restable('query','/v1/ressource/',getQuery(a.dataset['req']))
}
document.body.onload=(function(){
	//load the departement list
	$.getJSON('/v1/ressource/num_dep',function(rows){rows.sort(function(a,b){return +a.num_dep>+b.num_dep}).forEach(function(row){
		$('#dep').append($('<option>',{title:row.rows,value:row.num_dep}).html(row.num_dep))
	})})
})
