

$(document).ready(function (){

  openNav();

  var words=null;
  $("#textarea1").text("");
  function textchange(){
    if(this.value){
      var words = this.value.match(/\S+/g).length;
      if (words >= 100 && words <= 3000)
      {
        $("#WordCount > font").attr("color","blue");
        $("#proceedBtn").removeAttr("disabled");
        $("#proceedBtn").removeAttr("title");
      }
      else {
        $("#WordCount > font").attr("color","red");
        $("#proceedBtn").attr("disabled",true);
        $("#proceedBtn").attr("title","Word count must be between 100-3000 to proceed");
      }
      $("#WordCount > font").text(words);
    }
    else{
      var words = 0;
      if (words >= 100 && words <= 3000)
      {
        $("#WordCount > font").attr("color","blue");
        $("#proceedBtn").removeAttr("disabled");
        $("#proceedBtn").removeAttr("title");
      }
      else {
        $("#WordCount > font").attr("color","red");
        $("#proceedBtn").attr("disabled",true);
        $("#proceedBtn").attr("title","Word count must be between 100-3000 to proceed");
      }
      $("#WordCount > font").text(words);
    }

  }
  $("#textarea1").bind('input propertychange',textchange);

});
function openNav() {
  document.getElementById("Sidebar").style.width = "250px";
  document.getElementById("main").style.marginRight = "250px";
  $(".openbtn").css("visibility",'hidden');
}

function closeNav() {
  document.getElementById("Sidebar").style.width = "0";
  document.getElementById("main").style.marginRight= "0";
  $(".openbtn").css("visibility",'visible');
}
function fireWalkthrough(){
  var tour1 = new Trip([
    { sel : $("#textarea1"), content : "Copy any paragraph and paste in the text area", position : "n" },
    { sel : $("#WordCount"), content : "Check the word count", position : "n" },
    { sel : $("#proceedBtn"), content : "Click to proceed to the next step", position : "w" }
  ], {
    showNavigation : true,
    showCloseBox : true,
    delay : -1,
    onTripChange : function(i, tripData) {
      console.log(tripData);
  }
  });
  tour1.start();
}
