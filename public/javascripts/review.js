
$(document).ready(function (){
  openNav();
  var words_count=$("#textarea1").text().match(/\S+/g).length;
  var flag;
  if($("#textarea1").text().match(/([^\\\\\s!@#$%^&*\.\'\-\(\)\/<>;\":\?\{\}\[\]+=,a-zA-Z0-9])/gi)){
    flag=true;
    $("#proceedBtn").attr("disabled",true);
  }
    if (words_count >= 100 && words_count <= 3000)
    {
      $("#WordCount > font").attr("color","blue");
      if(!flag){
        $("#proceedBtn").removeAttr("disabled");
        $("#proceedBtn").removeAttr("title");
      }

    }
    else {
      $("#WordCount > font").attr("color","red");
      $("#proceedBtn").attr("disabled",true);
      $("#proceedBtn").attr("title","Word count must be between 100-3000 to proceed");
    }

  // alert($("#textarea1").text());

  $("#WordCount > font").text(words_count);
  $("#textarea1").on("keyup",$.debounce(500,textChange));
  $("#textarea1").on("click",$.debounce(500,textChange));
  function textChange(){
    // console.log("called");
    // var div_content = $(".txtarea").html().replace(/<br>/gi,'\n');
    // div_content = $(div_content).text();
    // var dat = div_content.replace(/([^>])([^\\\\\s!@#$%^&*\.\'\-\(\)\/<>;\":\?\{\}\[\]+=,a-zA-Z0-9])([^<])/gi, ('$1'+'<span class="atsign">$2<button type="button" onclick="deleteSpan(event)" title="Delete" class="reviewDeleteBtn"><i class="w3-small fa fa-trash"></i></button></span>'+'$3'));
    // dat = dat.replace(/\n/gi,"<br>");
    // $("#textarea1").html(dat);
    // console.log(dat);

    if($(this).text().trim().length != 0){
      console.log("in");
      var words = $(this).text().match(/\S+/g).length;
      var flag1;
      if($("#textarea1").text().match(/([^\\\\\s!@#$%^&*\.\'\-\(\)\/<>;\":\?\{\}\[\]+=,a-zA-Z0-9])/gi)){
        flag1=true;
        $("#proceedBtn").attr("disabled",true);
      }
      else{
        $("#proceedBtn").removeAttr("disabled");
        flag1=false;
      }
      if (words >= 100 && words <= 3000)
      {
        $("#WordCount > font").attr("color","blue");
        if(!flag1){
          $("#proceedBtn").removeAttr("disabled");
          $("#proceedBtn").removeAttr("title");
        }

      }
      else {
        $("#WordCount > font").attr("color","red");
        $("#proceedBtn").attr("disabled",true);
        $("#proceedBtn").attr("title","Word count must be between 100-3000 to proceed");
      }
      $("#WordCount > font").text(words);
    }
    else{
        $("#WordCount > font").attr("color","red");
        $("#proceedBtn").attr("disabled",true);
        $("#proceedBtn").attr("title","Word count must be between 100-3000 to proceed");
      $("#WordCount > font").text(0);
    }
  }
  $("#proceedBtn").click(function(){
    var input = $("<input>")
               .attr("type", "hidden")
               .attr("name", "para").val($("#textarea1").text());
   $('#review_form').append(input);
  });


});
function deleteSpan(event){
  var btn = event.target;
  $(btn).closest("span").remove();
}
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

function preventBackspace(e) {
    var evt = e || window.event;
    if (evt) {
        var keyCode = evt.charCode || evt.keyCode;
        if (keyCode === 8) {
            if (evt.preventDefault) {
                evt.preventDefault();
            } else {
                evt.returnValue = false;
            }
        }
    }
}
function fireWalkthrough(){
  var tour1 = new Trip([
    { sel : $(".atsign:first"), content : "Remove non English characters", position : "n" },
    { sel : $(".urlsign:first"), content : "Remove the url if irrelevant", position : "n" },
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
