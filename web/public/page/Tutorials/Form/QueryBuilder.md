#QueryBuilder

The QueryBuilder.js script, can dynamically generate an HTML form only based on the DB table name that will be requested

## Base (using table:Ressource)

This code demonstrate the mandatory parameters of a querybuilder element :

- `class="querybuilder"` so our `<div>` become a querybuilder element
- `data-url="/v1/ressource"` so the query builder know where to find all the DB info

```
<div class="querybuilder" data-url="/v1/ressource"></div>
```

<div class="querybuilder" data-url="/v1/ressource"></div>

## Retrieve the query

```
<div class="querybuilder" id="qb_ex1" data-url="/v1/ressource"></div>
<button onclick="var query=$('#qb_ex1').querybuilder('get');">Get</button>
```

<div class="querybuilder" id="qb_ex1" data-url="/v1/ressource"></div>

<button onclick="var query=$('#qb_ex1').querybuilder('get');alert(JSON.stringify(query))">Get</button>




## Multiple parameters using an `add` button


```
<div class="querybuilder" id="qb_ex2" data-url="/v1/ressource"></div>
<input type="button" onclick="$('#qb_ex2').querybuilder('add')" value="+"></input>
```

<div class="querybuilder" id="qb_ex2" data-url="/v1/ressource"></div>
<input type="button" onclick="$('#qb_ex2').querybuilder('add')" value="+"></input>



## Integrate in a `form` element

Note : `form` elements are referred as `form_` in the following codes samples but they should be considered as `form` when copy/pasted.

```
<form_ class="form-inline" onsubmit="return false;/* <- to cancel form sending*/">
	<div class="querybuilder" id="qb_ex3" data-url="/v1/ressource"></div>
	<input type="button" onclick="$('#qb_ex3').querybuilder('add')" value="+"></input>
	<input type="submit"></input>
</form_>
```

<form class="form-inline" onsubmit="return false;">
<div class="querybuilder" id="qb_ex3" data-url="/v1/ressource"></div>
<input type="button" onclick="$('#qb_ex3').querybuilder('add')" value="+"></input>
<input type="submit"></input>
</form>

## Display results with a `restable` element


```
<form_ class="form-inline" onsubmit="
	var query=$('#qb_ex4').querybuilder('get');
	$('#rt1').restable('query','/v1/ressource/',query);
	return false;">
	
	<div class="querybuilder" id="qb_ex4" data-url="/v1/ressource"></div>
	<input type="button" onclick="$('#qb_ex4').querybuilder('add')" value="+"></input>
	<input type="submit"></input>
</form_>

<table class="restable" id="rt1" data-struct="/v1/ressource"></table>
```


<form class="form-inline" onsubmit="$('#rt1').restable('query','/v1/ressource/',$('#qb_ex4').querybuilder('get'));return false;">
<div class="querybuilder" id="qb_ex4" data-url="/v1/ressource"></div>
<input type="button" onclick="$('#qb_ex4').querybuilder('add')" value="+"></input>
<input type="submit"></input>
</form>
<table class="restable" id="rt1"></table>


## Next ...

You should now read the restable tutorial to learn how to customize the displayed results.