<?php

$q = "PREFIX tran: <http://www.semanticweb.org/edna/ontologies/2018/transportAccessibility#> select * where {
?class rdf:type tran:TrainStop . ?class geo:lat ?lat . ?class geo:long ?long
}";

$url = "http://oasis.summerofcode.oeg-upm.net/sparql?query=".urlencode($q)."&format=json";

var_dump(json_decode(file_get_contents($url), true));

?>
