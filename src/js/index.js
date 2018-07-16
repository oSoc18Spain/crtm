var SM;
var GM;
var G;
var UX_UI;

	function init(){
		
		G = new Geo();
		G.follow();
		
		SM = new StationMap();
		SM.init();
		
		GM = new GMaps();
		GM.init();
		
		UX_UI = new UI();
		
		
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

  function showHideResultScreen(elem){
    
    console.log(elem.id)

    var resultsnav = document.getElementById('results-nav')
    var searchbar = document.getElementById('sbox')
    var resultpage = document.getElementById('results-page')

    if(elem.id.startsWith("result-row")){
      results.style.display = "none"
      searchbar.style.display = "none"
      resultpage.style['z-index'] = 1  
    }
    else if(elem.id == "hide-result-page-button"){
      resultpage.style['z-index'] = -1
      searchbar.style.display = ""
      results.style.display = ""
    }
  }
