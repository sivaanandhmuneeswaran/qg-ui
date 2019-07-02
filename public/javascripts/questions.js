var quesPairData = {};
var quesPair = null;

$(document).ready(function(){
  // console.log(window.ourdata);
  openNav();

  $.each($(".rowQues"), function(){
    if($(this).data('filtered')){
      $(this).hide();
      $(this).addClass("filtered");
    }

  })

  document.getElementById("defaultOpen").click();
  // quesPair = null;
  quesPairData.groupedQuesPair = null;
  quesPairData.filtered_questions = null;
  quesPairData.filtered_questions = $("#filtered_questions_tbl").DataTable({
    "lengthMenu": [  [10, 25, 50, -1], [10, 25, 50, "All"] ],
    "bSort": false,
    "bFilter": false,
    "bInfo" : false,
    "bLengthChange": false,
  });
  quesPair = $("#quesPair").DataTable({
    "lengthMenu": [  [10, 25, 50, -1], [10, 25, 50, "All"] ],
    "bSort": false,
    "bInfo" : false,
    "bLengthChange": false,
  });
  quesPairData.groupedQuesPair = $("#groupedPair").DataTable({
    "lengthMenu": [  [10, 25, 50, -1], [10, 25, 50, "All"] ],
    "bSort": false,
    "bFilter": false,
    "bInfo" : false,
    "bLengthChange": false,
  });



  checkDatatable();
  getColor();
  $(".quesPairLength").text("Number of Question Ideas: " + $("tr.visible").length);
  $(".span:button").click(function(){
    if($(this).text() === "Edit question"){
      $(this).parent().find(".ques").attr("readonly",false);
      $(this).parent().find(".origQuestion").css("visibility",'visible');
    }
  });
})

function openTab(evt, tabName) {
  var i, tabcontent, tablinks;
  tabcontent = document.getElementsByClassName("tabcontent");
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }
  tablinks = document.getElementsByClassName("tablink");
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(" active", "");
  }
  document.getElementById(tabName).style.display = "block";
  evt.currentTarget.className += " active";
}
function view(event){
  var btn = event.target;
  var origSentence = $(btn).parent().parent().data('val').tagged_sentence;
  var taggedSentence = origSentence.replace(/\uffe8O_ANS/gi, '');
  taggedSentence = taggedSentence.replace(/([\\\\!@#$%^&*\.\'\-\(\)\/<>;\":\?\{\}\[\]+=,a-zA-Z0-9]+)(\uffe8B_ANS|\uffe8I_ANS)/gi, '<span style="color:white;background-color:green">$1</span>');
  $(btn).parent().parent().find(".modal-body").html(taggedSentence);
}
function viewAnsLog(event){
  var btn = event.target;
  var questionPair = $(btn).parent().parent().parent().parent().find("span").data('val');
  var html = "";
  html = html + "<div>Original Answer : " + questionPair.answer + "</div><br>"
  if(questionPair.editedAns){
    html = html+`
      <table width="100%" style="table-layout:fixed;">
        <tr>
          <th width="50%">Edited Answer</th>
          <th width="50%">Timestamp</th>
        </tr>
    `;
    for(var i = 0; i < questionPair.editedAns.length; i++)
    {
      html = html + "<tr><td width=\"50%\" style=\"word-wrap:break-word;\">" + questionPair.editedAns[i].editedAns + "</td><td width=\"50%\" style=\"word-wrap:break-word;\">" + questionPair.editedAns[i].timestamp + "</td></tr>";
    }
    html = html + "</table>";
  }
  else {
    html = html + "<h6>No changes made to answer</h6>";
  }
  var id = "#ansLog" + questionPair.index.toString();
  $(id).find(".modal-body").html(html);
}
function handleEditBtn(event){
  var ans = event.target;
  $(ans).attr("readonly",false);
  $(ans).removeClass("answerPair");
  $(ans).addClass("answerSelect");
}

function handleSaveBtn(event){
  var ans = event.target;
  $(ans).attr("readonly",true);
  $(ans).removeClass("answerSelect");
  $(ans).addClass("answerPair");

  var questionPair = $(ans).parents("span").data('val');
  var sameFlag = false;
  var editedAns = $(ans).val();
  if(questionPair.editedAns){
    var editedAnsArr = questionPair.editedAns.map(({ editedAns }) => editedAns);
    if ($.inArray(editedAns, editedAnsArr) >= 0) {
      sameFlag = true;
    }
  }
  if(editedAns === questionPair.answer){
    sameFlag = true;
  }
  if(!sameFlag){
    if(questionPair.editedAns)
    {

        questionPair.editedAns.push({timestamp:new Date(),editedAns:editedAns});
    }
    else{
        questionPair.editedAns = [];
        questionPair.editedAns.push({timestamp:new Date(),editedAns:editedAns});
    }
    var id = "#span" + questionPair.index.toString();
    $(id).data('val',questionPair);
  }

}

function handleDeleteBtn(event){
  var btn = event.target;
  // $.fn.dataTable.ext.search.pop();
  quesPair.row($(btn).parents('tr'))
      .remove()
      .draw(false);
  $(".quesPairLength").text("Number of Question Ideas: " + $("tr.visible").length);
}

function handleEditQuesBtn(event){
  var td = event.target;
  $(td).attr("contentEditable",true);
  $(td).addClass("questionSelect");
  $(td).focus();
}

function handleSaveQuesBtn(event){
  var td = event.target;
  $(td).attr("contentEditable",false);
  $(td).removeClass("questionSelect");
  var index = $(td).parent().index() - 1;
  var sameFlag = false;
  var questionPair = $(td).parents("span").data('val');
  var origQuestion = questionPair.question[index];
  var editedQues = $(td).text();
  if(origQuestion === editedQues){
    sameFlag = true;
  }
  if(questionPair.editedQues){
    var editedQuesArr = questionPair.editedQues.map(({ editedQues }) => editedQues);
    if ($.inArray(editedQues, editedQuesArr) >= 0) {
      sameFlag = true;
    }
  }
  if(!sameFlag){
    if(questionPair.editedQues)
    {
        questionPair.editedQues.push({timestamp:new Date(),editedQues:editedQues});


    }
    else{
        questionPair.editedQues = [];
        questionPair.editedQues.push({timestamp:new Date(),editedQues:editedQues});
    }
    var id = "#span" + questionPair.index.toString();
    $(id).data('val',questionPair);
  }

}


function viewQuesLog(event){
  var btn = event.target;
  var questionPair = $(btn).parents("span").data('val');
  var html = "";
  if(questionPair.editedQues){
    html = html+`
      <table width="100%" style="table-layout:fixed;">
        <tr>
          <th width="50%">Edited Question</th>
          <th width="50%">Timestamp</th>
        </tr>
    `;
    for(var i = 0; i < questionPair.editedQues.length; i++)
    {
      html = html + "<tr><td width=\"50%\" style=\"word-wrap:break-word;\">" + questionPair.editedQues[i].editedQues + "</td><td width=\"50%\" style=\"word-wrap:break-word;\">" + questionPair.editedQues[i].timestamp + "</td></tr>";
    }
    html = html + "</table>";
  }
  else {
    html = html + "<h6>No changes made to question</h6>";
  }
  var id = "#quesLog" + questionPair.index.toString();
  $(id).find(".modal-body").html(html);
}
function exportJSON(event) {
  var btn = event.target;
  var res = [];
  var id = 1;
  quesPair.column(0).nodes().to$().each(function() {
     var questionAnsPair = $(this).find('.spanData').data('val');
     delete questionAnsPair.tagged_sentence;
     delete questionAnsPair.attention_heatmap;
     questionAnsPair.index = id;
     id = id + 1;
     res.push(questionAnsPair);
 });

  var a = document.createElement("a");
  var file = new Blob([JSON.stringify(res)], {type: 'text/plain'});
  a.href = URL.createObjectURL(file);
  a.download = "question.json";
  a.click();
}

function handleGroupDeleteBtn(event){
  var btn = event.target;
  quesPairData.groupedQuesPair.row($(btn).parents('tr'))
      .remove()
      .draw(false);
}

function viewGroupedQuestion(event){
  var btn = event.target;
  var questionPair = $(btn).closest("span").data('val');
  var i_index = $(btn).data('i_index');
  var ques = [];
  var confidence = [];
  var color_arr = [];
  for(var i=0; i<questionPair.length; i++){
    var td_id = "#ansTd" + i_index.toString() + i.toString();
    var color = $(td_id).find("textarea").css("border-color");
    for(var j=0; j<questionPair[i].question.length ;j++){
      if(!questionPair[i].is_impossible[j]){
        ques.push(questionPair[i].question[j]);
        confidence.push(questionPair[i].score[j]);
        color_arr.push(color);
      }
    }
  }

  var html = "";
    html = html+`
      <table width="100%" style="table-layout:fixed;">
        <tr>
          <th width="80%">Question</th>
          <th width="20%">Confidence</th>
        </tr>
    `;
    for(var i = 0; i < ques.length; i++)
    {
      html = html + "<tr><td width=\"80%\" style=\"word-wrap:break-word;border:none;border-left: 6px solid;border-color:"+color_arr[i] +"\">" + ques[i] + "</td><td width=\"20%\" style=\"word-wrap:break-word;\">" + parseFloat(confidence[i]).toFixed(5) + "</td></tr>";
    }
    html = html + "</table>";
  var id = "#viewGroupQues" + i_index.toString();
  $(id).find(".modal-body").html(html);
}

function handleViewPairSource(event){
  var btn = event.target;
  var questionPair = $(btn).closest("span").data('val');
  var j_index =  $(btn).parent().data('j_index');

  var origSentence = questionPair[j_index].tagged_sentence;
  var taggedSentence = origSentence.replace(/\uffe8O_ANS/gi, '');
  taggedSentence = taggedSentence.replace(/([\\\\!@#$%^&*\.\'\-\(\)\/<>;\":\?\{\}\[\]+=,a-zA-Z0-9]+)(\uffe8B_ANS|\uffe8I_ANS)/gi, '<span style="color:white;background-color:green">$1</span>');
  var id = "#viewGroupAns" + questionPair[j_index].index.toString();
  $(id).find(".modal-body").html(taggedSentence);
}



function handleShowHeatmapBtn(event){
  var btn = event.target;
  var questionPair = $(btn).parents("span").data('val');
  // var index = $(btn).index('.showHeatMapBtn');
  var index = $(btn).closest('.ques').find('.showHeatMapBtn').index(btn);


  var html = "";
  var data = questionPair.attention_heatmap[index];
  data = data.replace(/\"/g,"");
  data = "data:image/png;base64," + data;
  html += "<img  src=\"" + data + "\" /img>";
  var id = "#heatmap" + questionPair.index.toString() + index.toString();
  $(id).find(".modal-body").html(html);

}
function zoomin(event){
  var btn = event.target;
  var img = $(btn).parent().parent().parent().find("img");
  var currWidth = $(img).width();
  if(currWidth == 4500) return false;
   else{
      $(img).width((currWidth + 100) + "px");
  }
}
function zoomout(event){
  var btn = event.target;
  var img = $(btn).parent().parent().parent().find("img");
  var currWidth = $(img).width();
  if(currWidth == 100) return false;
   else{
      $(img).width((currWidth - 100) + "px");
  }
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

function exportTXT(event) {
  var btn = event.target;
  var res = [];
  var id = 1;
  var result_txt = "";
  quesPair.column(0).nodes().to$().each(function() {
     var txt = "";
     txt = txt + "Question Pair : " + id.toString() + "\n";
     var questionAnsPair = $(this).find('.spanData').data('val');
     delete questionAnsPair.tagged_sentence;
     txt= txt + "Paragraph" + "\n";
     txt= txt + questionAnsPair.original_sentence + "\n\n";
     txt= txt + "Questions" + "\n";
     for(var i=0 ; i < questionAnsPair.question.length ; i++){
       txt = txt + (i+1).toString() + ". " + questionAnsPair.question[i] + "\n";
     }
     txt = txt + "\n";
     txt = txt + "Answer" + "\n";
     txt = txt + questionAnsPair.answer + "\n\n";
     if(questionAnsPair.editedQues){
       txt= txt + "Edited Questions" + "\n";
       for(var i=0 ; i < questionAnsPair.editedQues.length ; i++){
         txt = txt + (i+1).toString() + ". " + questionAnsPair.editedQues[i].editedQues + "\n";
       }
       txt = txt + "\n";
     }
     if(questionAnsPair.editedAns){
       txt= txt + "Edited Answers" + "\n";
       for(var i=0 ; i < questionAnsPair.editedAns.length ; i++){
         txt = txt + (i+1).toString() + ". " + questionAnsPair.editedAns[i].editedAns + "\n";
       }
       txt = txt + "\n";
     }
     txt = txt + "\n\n\n";
     id = id + 1;
     result_txt = result_txt + txt;

 });
  var a = document.createElement("a");
  var file = new Blob([result_txt], {type: 'text/plain'});
  a.href = URL.createObjectURL(file);
  a.download = "question_answer.txt";
  a.click();
}

function restoreQues(event){
  var btn = event.target;
  $.fn.dataTable.ext.search.pop();
  quesPair.draw(false);
  i_index = $(btn).parent().data('i_index') + 1;
  j_index = $(btn).parent().data('j_index');
  var span_id = "#span" + i_index.toString();

  var row = quesPair.rows().nodes().to$().find(span_id).find(".rowQues").eq(j_index);
  console.log($(row))
  $(row).show();
  // console.log($(row));
  $(row).removeClass("filtered");
  // console.log($(row))
  quesPairData.filtered_questions.row($(btn).parents('tr'))
      .remove()
      .draw(false);
  quesPair.draw();
  checkDatatable();
}

function viewParaFiltered(event){
  var btn = event.target;

  var i_index = $(btn).parent().data('i_index');
  var j_index = $(btn).parent().data('j_index');
  var modal_id = "#para-modal" + i_index.toString() + j_index.toString();
  var origSentence = $(btn).parent().parent().data('val');
  var taggedSentence = origSentence.replace(/\uffe8O_ANS/gi, '');
  taggedSentence = taggedSentence.replace(/([\\\\!@#$%^&*\.\'\-\(\)\/<>;\":\?\{\}\[\]+=,a-zA-Z0-9]+)(\uffe8B_ANS|\uffe8I_ANS)/gi, '<span style="color:white;background-color:green">$1</span>');
  $(modal_id).find(".modal-body").html(taggedSentence);
}
var i=0;
function checkDatatable(){
  quesPair.column(0).nodes().to$().each(function() {
    $.each($(".confidence_filtered",quesPair.rows().nodes()),function(){
      $(this).parent().hide();
    })
    var bool_arr = [false,false,false,false];
    $.each($("tr.rowQues",this),function(index){
      if($(this).hasClass("filtered")){
        bool_arr[index] = true;
      }
    })
    $.each($("td.confidence_td",this),function(index){
      if($(this).hasClass("confidence_filtered")){
        bool_arr[index] = true;
      }
    })
    var true_count = bool_arr.filter(x => x).length;
    console.log(true_count)
    if(true_count == 5){
      $(this).closest("tr").hide();
      $(this).closest("tr").removeClass("visible");
    }
    else{
      if(!$(this).closest("tr").hasClass("filtered")){
        $(this).closest("tr").show();
        $(this).closest("tr").addClass("visible");
      }
      else {
        $(this).closest("tr").hide();
        $(this).closest("tr").removeClass("visible");
      }

    }

 });
 // $.fn.dataTable.ext.search.pop();
   $.fn.dataTable.ext.search.push(
       function( settings, data, dataIndex) {
         if(settings.nTable.id == "quesPair")
         {

          return $(quesPair.row(dataIndex).node()).hasClass('visible')
         }
       }
   );
   quesPair.draw(false);




}

function getColor(){
  $.each($(".td_ans"),function(){

    Colors = {};
    Colors.names = {
        aqua: "#00ffff",
        azure: "#f0ffff",
        blue: "#0000ff",
        brown: "#a52a2a",
        cyan: "#00ffff",
        darkblue: "#00008b",
        darkcyan: "#008b8b",
        darkgrey: "#a9a9a9",
        darkgreen: "#006400",
        darkkhaki: "#bdb76b",
        darkmagenta: "#8b008b",
        darkolivegreen: "#556b2f",
        darkorange: "#ff8c00",
        darkorchid: "#9932cc",
        darkred: "#8b0000",
        darksalmon: "#e9967a",
        darkviolet: "#9400d3",
        fuchsia: "#ff00ff",
        gold: "#ffd700",
        green: "#008000",
        indigo: "#4b0082",
        khaki: "#f0e68c",
        lime: "#00ff00",
        magenta: "#ff00ff",
        maroon: "#800000",
        navy: "#000080",
        olive: "#808000",
        orange: "#ffa500",
        pink: "#ffc0cb",
        purple: "#800080",
        violet: "#800080",
        red: "#ff0000",
        yellow: "#ffff00"
    };
    Colors.random = function() {
        var result;
        var count = 0;
        for (var prop in this.names)
            if (Math.random() < 1/++count)
               result = prop;
        return { name: result, rgb: this.names[result]};
    };
    var color = Colors.random();
    $(this).css("border-color",color.rgb);
  })

}

function updateIntraSlider(value){
  $.each($(".confidence_td",quesPair.rows().nodes()),function(){
    if(parseFloat($(this).text()) >= value){
      if(!($(this).parent().hasClass("filtered"))){
        $(this).parent().show();
      }
      $(this).removeClass("confidence_filtered");
    }
    else{
      $(this).addClass("confidence_filtered");
    }

  })
  $.fn.dataTable.ext.search.pop();
  quesPair.draw(false);
  checkDatatable();
}

function updateInterSlider(value){
  $.each($(".spanData",quesPair.rows().nodes()),function(){
    if(parseFloat($(this).data('val').overall_score) < value){
      $(this).closest("tr").addClass("filtered");
    }
    else{
      $(this).closest("tr").removeClass("filtered");
    }
  })
  $.fn.dataTable.ext.search.pop();
  quesPair.draw(false);
  checkDatatable();
}

function fireWalkthrough(){
  var tour1 = new Trip([
    { sel : $(".tablink.qapair"), content : "This tab contains all generated question answer pair", position : "e" },
    { sel : $("td.ques:first"), content : "Click to edit the question", position : "e" },
    { sel : $(".span.viewQuesBtn:first"), content : "Click to view edited question log", position : "e" },
    { sel : $(".answerPair:first"), content : "Click to edit the answer", position : "e" },
    { sel : $(".span.viewAnsBtn:first"), content : "Click to view edited answer log", position : "e" },
    { sel : $(".span.showHeatMapBtn:first"), content : "Click to view attention weights heatmap", position : "w" },
    { sel : $(".deleteBtn:first"), content : "Click to delete the question answer pair", position : "w" },
    { sel : $(".span.descBtn:first"), content : "Click to view the source paragraph", position : "w" },

    { sel : $(".tablink.ga"), content : "This tab contains questions grouped based on answers", position : "n" },
    { sel : $(".btn.btn-info:first"), content : "Click to view the grouped questions", position : "n" },

    { sel : $(".tablink.fq"), content : "This tab contains BERT filtered questions", position : "n" },
    { sel : $(".material_btn.restore:first"), content : "Click to restore the filtered question", position : "w" },

  ], {
    showNavigation : true,
    showCloseBox : true,
    delay : -1,
    onTripChange : function(i, tripData) {
        if(i==8){
          document.getElementById("grouped_pair_tab").click();
        }
        if(i==10){
          document.getElementById("filtered_questions_tab").click();
        }
        // if(i==9){
        //   $(".material_btn.add").show();
        //   $(".material_btn.reset").show();
        // }
      },
    onEnd : function(i, tripData){
      document.getElementById("defaultOpen").click();
    },
    onTripStop : function(i, tripData){
      document.getElementById("defaultOpen").click();
    }
  });
  tour1.start();
}
