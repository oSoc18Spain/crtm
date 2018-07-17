var SM;
var GM;
var G;

	function init(){
		
		G = new Geo();
		G.follow();
		
		SM = new StationMap();
		SM.init();
		
		initmap();
		
	}
   
  function showHideResults(){
  	var resultsDiv = document.getElementById('results')
  	var resultsButton = document.getElementById('results-button')
    var mapDiv = document.getElementById('map')
  	if (resultsDiv.style.display == "none"){
  		resultsDiv.style.display = "block";
  		resultsButton.style.bottom = (resultsDiv.offsetHeight - resultsButton.offsetHeight / 2).toString() + "px" ;
      mapDiv.style.height = (mapDiv.offsetHeight - resultsDiv.offsetHeight).toString() + "px"
      resultsButton.parentNode.classList.remove('dropup')
  	}
  	else{
      resultsButton.parentNode.classList.add('dropup')
      mapDiv.style.height = (mapDiv.offsetHeight + resultsDiv.offsetHeight).toString() + "px"
  		resultsDiv.style.display = "none";
  		resultsButton.style.bottom = 0;
  	}
  }

  function showHideResultScreen(elm){
    
    console.log(elm.id)

    var results = document.getElementById('results-nav')
    var resultDetail = document.getElementById('results-detail')
    var searchbar = document.getElementById('sbox')
    var resultheader = document.getElementById('results-header')

    var map = document.getElementById('map')

    if(elm.id.startsWith("result-row")){
      results.style.display = "none"
      searchbar.style.display = "none"
      resultDetail.style.display = ""
      resultheader.style.display = ""
    }
    else if(elm.id == "hide-result-page-button"){
      resultheader.style.display = "none"
      searchbar.style.display = ""
      results.style.display = ""      
    }
  }
