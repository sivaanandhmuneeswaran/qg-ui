
var custom_keyword_arr = [];
$(document).ready(function(){
  openNav();
  $("#addbtn").hide();
  $("#resetbtn").hide();
  var input_para = $("#textarea1").data('val');
  var custom_keyword = "";
  var span_id = 1;
  var custom_input_para = [];
  var para ="";
  custom_keyword += '<span id="s'+span_id.toString()+'">';
  var input_para_arr = input_para.split(" ");
  for(var i=0; i < input_para_arr.length ; i++){
    if(input_para_arr[i] == "<br>"){
        custom_keyword += "</span>"
        custom_keyword += "<br><br> ";
        custom_input_para.push(para);
        para = "";
        span_id = span_id+1;
        custom_keyword += '<span id="s'+span_id.toString()+'">';
    }
    else{
        custom_keyword += '<button  type="button" class="custom_keyword_btn" >'+input_para_arr[i]+'</button> ';
        para += input_para_arr[i] + " ";
    }
  }

  custom_keyword += "<span>"
  $("#textarea1").html(custom_keyword);
  span_id = span_id - 1;
  for(var i=0; i<span_id;i++){
    var sid = "#s"+(i+1).toString();
    $(sid).attr('data-val',custom_input_para[i]);
  }
  $(".custom_keyword").find(":button.custom_keyword_btn").click(function(){
    $(".material_btn.reset").show();
    $(".custom_keyword").find(":button").attr("disabled","true");
    $(this).addClass("custom-btn-clicked");
    $(this).next().removeAttr("disabled");
    $(".material_btn.add").show();
  });








  var display_para = JSON.parse($(".display_para_np").data('val'));
  display_para = display_para.replace(/\uffe8O_ANS/gi, '');
  var myRegexp = /([\\\\!@#$%^&*\.\'\-\(\)\/<>;\":\?\{\}\[\]+=,a-zA-Z0-9])*([0-9]+)\u00b7([\\\\!@#$%^&*\.\'\-\(\)\/<>;\":\?\{\}\[\]+=,a-zA-Z0-9]+)\uffe8B_ANS(\s([\\\\!@#$%^&*\.\'\-\(\)\/<>;\":\?\{\}\[\]+=,a-zA-Z0-9]+)\uffe8I_ANS)*/gi;
  match = myRegexp.exec(display_para);
  var matched_arr = [];
  var replace_arr= [];
  var index_arr = [];
  while (match != null) {
    var matched = match[0];
    matched_arr.push(matched);
    var i = matched.split("\u00b7")[0];
    var value = matched.split("\u00b7")[1];
    var value_bio_removed = value.replace(/(\uffe8B_ANS|\uffe8I_ANS)/gi,"")
    index_arr.push(i);
    replace_arr.push(value_bio_removed);
    match = myRegexp.exec(display_para);
  }
  for(var i = 0; i<matched_arr.length ; i++){
    var display_value = '<li><button  type="button" class="btn btn-outline-success np"  data-val="'+index_arr[i]+'">'+replace_arr[i]+'</button></li>';
    display_para = display_para.replace(matched_arr[i],display_value);
  }
  $(".display_para_np").html(display_para);

  var display_para = JSON.parse($(".display_para_ner").data('val'));
  display_para = display_para.replace(/\uffe8O_ANS/gi, '');
  var myRegexp = /([\\\\!@#$%^&*\.\'\-\(\)\/<>;\":\?\{\}\[\]+=,a-zA-Z0-9])*([0-9]+)\u00b7([\\\\!@#$%^&*\.\'\-\(\)\/<>;\":\?\{\}\[\]+=,a-zA-Z0-9]+)\uffe8B_ANS(\s([\\\\!@#$%^&*\.\'\-\(\)\/<>;\":\?\{\}\[\]+=,a-zA-Z0-9]+)\uffe8I_ANS)*/gi;
  match = myRegexp.exec(display_para);
  var matched_arr = [];
  var replace_arr= [];
  var index_arr = [];
  while (match != null) {
    var matched = match[0];
    matched_arr.push(matched);
    var i = matched.split("\u00b7")[0];
    var value = matched.split("\u00b7")[1];
    var value_bio_removed = value.replace(/(\uffe8B_ANS|\uffe8I_ANS)/gi,"")
    index_arr.push(i);
    replace_arr.push(value_bio_removed);
    match = myRegexp.exec(display_para);
  }
  for(var i = 0; i<matched_arr.length ; i++){
    var display_value = '<li><button  type="button" class="btn btn-outline-warning ner"  data-val="'+index_arr[i]+'">'+replace_arr[i]+'</button></li>';
    display_para = display_para.replace(matched_arr[i],display_value);
  }
  $(".display_para_ner").html(display_para);
  update_np_selected();
  update_ner_selected();
  update_custom_selected();
  $("#selectable1").selectable({
    stop: function(){
      $(".ui-selected.np:button").toggleClass("btn-outline-success btn-outline-secondary");
      update_np_selected();
    }
  });
  $("#selectable2").selectable({
    stop: function(){
      $(".ui-selected.ner:button").toggleClass("btn-outline-warning btn-outline-secondary");
      update_ner_selected();
    }
  });
  document.getElementById("defaultOpen").click();
  $(".keyword_button_np").find(":button").click(function(){
    $(this).toggleClass("btn-outline-success btn-outline-secondary");
    update_np_selected();
  });
  $(".keyword_button_ner").find(":button").click(function(){
    $(this).toggleClass("btn-outline-warning btn-outline-secondary");
    update_ner_selected();
  });
  $("#proceedBtn").click(function(){
    var npKeywordArr=[];
    var nerKeywordArr=[];
    // $.each($(".custom-keyword-btn").closest($("span")),function(){
    //   if($(this).data('val')){
    //     custom_keyword_arr.push($(this).data('val'));
    //   }
    //
    // });
    $.each($(".btn.btn-outline-success.np"),function(){
      npKeywordArr.push(parseInt($(this).data('val')));
    });
    $.each($(".btn.btn-outline-warning.ner"),function(){
      nerKeywordArr.push(parseInt($(this).data('val')));
    });
    var np_input = $("<input>")
               .attr("type", "hidden")
               .attr("name", "np_data").val(JSON.stringify(npKeywordArr));

    var ner_input = $("<input>")
              .attr("type", "hidden")
              .attr("name", "ner_data").val(JSON.stringify(nerKeywordArr));
    var custom_input = $("<input>")
              .attr("type", "hidden")
              .attr("name", "custom_input").val(JSON.stringify(custom_keyword_arr));
   $('#keyword_form').append(np_input);
   $('#keyword_form').append(ner_input);
   $('#keyword_form').append(custom_input);
  });
  function update_np_selected(){
    var count = $(".btn.btn-outline-success.np").length;
    var txt = "Selected: " + count.toString();
    $(".np_selected").text(txt);
  }
  function update_ner_selected(){
    var count = $(".btn.btn-outline-warning.ner").length;
    var txt = "Selected: " + count.toString();
    $(".ner_selected").text(txt);
  }

});
function update_custom_selected(){
  var count = $(".custom_keyword_btn_added").length;
  var txt = "Selected: " + count.toString();
  $(".custom_selected").text(txt);
}
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

function add_keyword(event){
  var btn = event.target;
  var keyword_arr = [];
  var para_arr = [];
  var first = true;
  var s_id = "#" + $(".custom-btn-clicked").closest("span").attr('id');
  $(s_id).find(".custom_keyword_btn").each(function(){
    if($(this).hasClass("custom-btn-clicked") && first){
      para_arr.push(($(this).text()+ "\uffe8B_ANS"));
      first = false;
    }
    else if($(this).hasClass("custom-btn-clicked") && !first){
      para_arr.push(($(this).text()+ "\uffe8I_ANS"));
    }
    else{
      var btn_text = $(this).text().split(" ");
      for(var i=0; i<btn_text.length;i++){
        para_arr.push((btn_text[i]+ "\uffe8O_ANS"));
      }


    }
  })
  var res = para_arr.join(" ");
  custom_keyword_arr.push(res);
  $(".custom-btn-clicked").each(function(){
    keyword_arr.push($(this).text());
  })
  var keyword_text = keyword_arr.join(" ");
  var new_btn = '<button  type="button" class="custom_keyword_btn custom_keyword_btn_added" >'+keyword_text+'</button> ';
  $(".custom-btn-clicked:first").before(new_btn);
  $(".custom-btn-clicked").each(function(){
    $(this).remove();
  })
  $(".material_btn.add").hide();
  $(".material_btn.reset").hide();
  $(".custom_keyword").find('button:not(".custom_keyword_btn_added")').removeAttr("disabled");
  update_custom_selected();
  console.log(custom_keyword_arr);
}

function reset_keyword(event){
  var btn = event.target
  $(".custom-btn-clicked").each(function(){
    $(this).removeClass("custom-btn-clicked");
  })

  $(".custom_keyword").find('button:not(".custom_keyword_btn_added")').removeAttr("disabled");
  $(".material_btn.add").hide();
  $(".material_btn.reset").hide();
}
function fireWalkthrough(){
  var tour1 = new Trip([
    { sel : $(".tablink.np"), content : "This tab contains all noun phrases", position : "e" },
    { sel : $(".btn.btn-outline-success.np:first"), content : "Click to deselect(all are selected initially)", position : "e" },
    { sel : $(".np_total"), content : "total number of noun phrases", position : "e" },
    { sel : $(".np_selected"), content : "total number of noun phrases selected as pivotal answers", position : "e" },
    { sel : $(".tablink.ner"), content : "This tab contains all named entities", position : "n" },
    { sel : $(".btn.btn-outline-warning.ner:first"), content : "Click to deselect(all are selected initially)", position : "e" },
    { sel : $(".ner_total"), content : "total number of named entities", position : "e" },
    { sel : $(".ner_selected"), content : "total number of named entities selected as pivotal answers", position : "e" },
    { sel : $(".tablink.custom"), content : "Select custom answers from this tab", position : "n" },
    { sel : $(".custom_keyword_btn:first"), content : "Click to select", position : "e" },
    { sel : $(".material_btn.add"), content : "Click to add the selected answer", position : "e" },
    { sel : $(".material_btn.reset"), content : "Click to reset the selected answer", position : "e" },
    { sel : $(".custom_selected"), content : "total number of custom answers selected as pivotal answers", position : "e" },
    { sel : $("#proceedBtn"), content : "Click to proceed to the next step", position : "w" }
  ], {
    showNavigation : true,
    showCloseBox : true,
    delay : -1,
    onTripChange : function(i, tripData) {
        if(i==4){
          document.getElementById("ner_tab").click();
        }
        if(i==8){
          document.getElementById("custom_tab").click();
        }
        if(i==9){
          $(".material_btn.add").show();
          $(".material_btn.reset").show();
        }
      },
    onEnd : function(i, tripData){
      document.getElementById("defaultOpen").click();
      $(".material_btn.add").hide();
      $(".material_btn.reset").hide();
    },
    onTripStop : function(i, tripData){
      document.getElementById("defaultOpen").click();
      $(".material_btn.add").hide();
      $(".material_btn.reset").hide();
    }
  });
  tour1.start();
}
