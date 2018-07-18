<?php

$q = 'PREFIX tran: <http://transacc.linkeddata.es/def/core#> 
PREFIX gtfs: <http://vocab.gtfs.org/terms#>
PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>

DELETE {
   
   ?ind tran:state ?state .
   ?ind tran:dateLastAnnot ?dla

}

INSERT {
   
   ?ind tran:state "seats fixed" .
   ?ind tran:spaceWheelchair "false"^^xsd:boolean .
   ?ind tran:dateLastAnnot "07-19-2018"^^xsd:date}
   
}

WHERE{ 

   ?ind gtfs:stopId "par_6_1946" 

}';

$url = "https://oasis.summerofcode.oeg-upm.net/virtuoso/sparql";

$postdata = http_build_query(
    array(
        'format' => 'json',
        'query' => $q
    )
);

$opts = array('http' =>
    array(
        'method'  => 'POST',
        'header'  => 'Content-type: application/x-www-form-urlencoded',
        'content' => $postdata
    )
);

$context  = stream_context_create($opts);

var_dump(json_decode(file_get_contents($url, false, $context), true));

?>
