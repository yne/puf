# Restable

# Using a `data-struct` attribute

<form class="form-inline" onsubmit="$('#rt1').restable('query','/v1/ressource/',$('#qb_ex4').querybuilder('get'));return false;">
<div class="querybuilder" id="qb_ex4" data-url="/v1/ressource"></div>
<input type="button" onclick="$('#qb_ex4').querybuilder('add')" value="+"></input>
<input type="submit"></input>
</form>
<table class="restable" id="rt1" data-struct="/v1/ressource"></table>

# Using a `data-query` attribute

```
<table class="restable" id="rt1" data-struct="/v1/ressource" data-query='{"conj":["&"],"name":["ressource.num_dep"],"oper":["="],"data":["31"]}'></table>
```
