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
	GM.init('map');
		
	UX_UI = new UI();
	UX_UI.checkCookie('disability');
	
	int = setInterval(function(){ if(SM.status == 2){

		 setTimeout(function(){document.getElementById("loading_slide").style.opacity = 0;},1000);
		 setTimeout(function(){document.getElementById("loading_slide").style.display = "none";},2000);
		 
	 clearInterval(int);} }, 500);
		
}
   
  function showHideResults(){
  	var resultsDiv = document.getElementById('results')
  	var resultsButton = document.getElementById('results-button')
    var mapDiv = document.getElementById('map')
  	if (resultsDiv.style.display == "none"){
  		resultsDiv.style.display = "block";
  		resultsButton.style.bottom = (resultsDiv.offsetHeight - resultsButton.offsetHeight / 2).toString() + "px" ;
      mapDiv.style.height = (mapDiv.offsetHeight - resultsDiv.offsetHeight).toString() + "px"
      resultsButton.classList.remove('fa-arrow-up')
      resultsButton.classList.add('fa-arrow-down')
  	}
  	else{
      mapDiv.style.height = (mapDiv.offsetHeight + resultsDiv.offsetHeight).toString() + "px"
  		resultsDiv.style.display = "none";
  		resultsButton.style.bottom = 0;
      resultsButton.classList.remove('fa-arrow-down')
      resultsButton.classList.add('fa-arrow-up')
  	}
  }

  function showHideResultScreen(elm){
    
    console.log(elm.id)

    var results = document.getElementById('results-nav')
    var resultDetail = document.getElementById('general-results-detail')
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
