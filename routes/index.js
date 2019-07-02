var express = require('express');
var router = express.Router();
var fs = require('fs');
var path = require("path");
var spawn = require("child_process").spawn;
var spawnSync= require("child_process").spawnSync;
var exec = require("child_process").exec;
const session = require('express-session');
var async_for = require('node-async-loop');
var request_opennmt = require('request-promise');
npTaggedPara = null
nerTaggedPara = null


router.get('/', function(req, res, next) {
  res.render('index',{});
});

router.post('/', function (req, res, next) {
  var input = req.body.para.toLowerCase();
  var pythonPath = "python3.6 ";
  var codePath = __basedir + "/python_code/create_para_v1.py ";
  var generateParaCommand = pythonPath + codePath ;
  var result = spawn(generateParaCommand,{shell:true,
   encoding: 'utf-8'});
   var new_input="";
  result.stdout.on('data',async function (data){
    new_input = await data.toString().replace(/((([A-Za-z]{3,9}:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-_]*)?\??(?:[\-\+=&;%@\.\w\-_]*)#?(?:[\.\!\/\\\w\-]*))?)/gi, '<span class="urlsign">$1<button type="button" title="Delete" onclick="deleteSpan(event)" class="reviewDeleteBtn"><i class="w3-small fa fa-trash"></i></button></span>');
    new_input = await new_input.replace(/([^\\\\\s!@#$%^&*_\.\'\-\(\)\/<>;\":\?\{\}\[\]+=,a-zA-Z0-9]+)/gi, '<span class="atsign">$1<button type="button" onclick="deleteSpan(event)" title="Delete" class="reviewDeleteBtn"><i class="w3-small fa fa-trash"></i></button></span>');
    new_input = await new_input.replace(/\n/gi, ' <br>');

  });
  result.stdout.on('end', function(){
    res.render('review',{input:new_input});
  });
  result.stdin.write(JSON.stringify(input));
  result.stdin.end();
});

router.post('/keywords', function(req,res,next){
  var input = req.body.para.toLowerCase();
  var tempInp = input.split(" ");
  input = ""
  for(var k=0; k < tempInp.length; k++){
    if(tempInp[k] && tempInp[k] != '\r\n'){
      input = input + tempInp[k] + " ";
    }
  }

  var pythonPath = "python3.6 ";
  var codePath = __basedir + "/python_code/create_para_v1.py ";
  var generateParaCommand = pythonPath + codePath ;
  var generate_para = spawn(generateParaCommand,{shell:true,
   encoding: 'utf-8'});
   var new_input="";
  generate_para.stdout.on('data', function (data){
    new_input = data.toString();
  });
  generate_para.stdout.on('end', function(){
    tagCodePath = __basedir + "/python_code/bio_tag_np_v2.py ";
    generateTaggedParaCommand = pythonPath + tagCodePath;
    var np_data="";
    var result_np = spawn(generateTaggedParaCommand,{shell:true,
     encoding: 'utf-8'});
     result_np.stdout.on('data', function (data){
       np_data += data.toString();
     });
     result_np.stdout.on('end', function (data){
       npPara = JSON.parse(np_data);
       np_disp_para = npPara[0].disp_para;
       npTaggedPara = npPara[0].backend_data;
       tagCodePath_ner = __basedir + "/python_code/ner-v4.py ";
       generateTaggedParaCommand_ner = pythonPath + tagCodePath_ner;
       var ner_data="";
       var result_ner = spawn(generateTaggedParaCommand_ner,{shell:true,
        encoding: 'utf-8'});
        result_ner.stdout.on('data', function (data){
          ner_data += data.toString();
        });
        result_ner.stdout.on('end', function (data){
          new_input = new_input.replace(/\n/gi, ' <br> ');
          nerPara = JSON.parse(ner_data);
          ner_disp_para = nerPara[0].disp_para;
          nerTaggedPara = nerPara[0].backend_data;
          res.render('select_keywords',{np_disp_para:np_disp_para,np_length:npTaggedPara.length,ner_disp_para:ner_disp_para,ner_length:nerTaggedPara.length,input_para:new_input});
        });
        result_ner.stdin.write(JSON.stringify(new_input));
        result_ner.stdin.end();

     });
     result_np.stdin.write(JSON.stringify(new_input));
     result_np.stdin.end();

  });
  generate_para.stdin.write(JSON.stringify(input));
  generate_para.stdin.end();
});

router.post('/questions', async function(request, response,next){
  keywordArr = [];
  npKeywordIndex = JSON.parse(request.body.np_data);
  nerKeywordIndex = JSON.parse(request.body.ner_data);
  custom_input = JSON.parse(request.body.custom_input);

  custom_index = 1

  var re = new RegExp("\uffe8B_ANS", 'g');
  var re_i = new RegExp("\uffe8I_ANS", 'g');
  var re_o = new RegExp("\uffe8O_ANS", 'g');
  for(var i=0; i<custom_input.length; i++){
    var answer_tok = [];
    var tokens = custom_input[i].split(" ")
    for(var j=0; j<tokens.length; j++){
      split_term = tokens[j].split("\uffe8");
      if(split_term[1] != "O_ANS"){
        answer_tok.push(split_term[0]);
      }
    }
    tagged_sentence = custom_input[i];
    answer = answer_tok.join(" ");
    original_sentence = tagged_sentence.replace(re_o,"")
    original_sentence = original_sentence.replace(re,"")
    original_sentence = original_sentence.replace(re_i,"")
    keywordArr.push({'index':custom_index,'original_sentence':original_sentence,'tagged_sentence':tagged_sentence,'answer':answer})
    custom_index = custom_index + 1

  }

  for(var i=0; i<npKeywordIndex.length;i++){
    for(var j=0; j<npTaggedPara.length;j++){
      if(parseInt(npTaggedPara[j].index) === npKeywordIndex[i]){
        keywordArr.push(npTaggedPara[j]);
        break;
      }
    }
  }

  for(var i=0; i<nerKeywordIndex.length;i++){
    for(var j=0; j<nerTaggedPara.length;j++){
      if(parseInt(nerTaggedPara[j].index) === nerKeywordIndex[i]){
        keywordArr.push(nerTaggedPara[j]);
        break;
      }
    }
  }
  for(var i = 0; i < keywordArr.length; i++)
  {
    keywordArr[i].index = i + 1;
  }
  var max_scores = [];
  for(var i=0; i <keywordArr.length; i++){
    var options = {
      method: 'POST',
      url: 'http://0.0.0.0:5000/translator/translate',
      body: [{
        src:keywordArr[i].tagged_sentence,
        id: 1
      }],
      json:true
    }
    await request_opennmt(options, function (error, response, body) {
      keywordArr[i].question = body.tgt;
      keywordArr[i].score = body.pred_score;


      for(var j=0; j<keywordArr[i].score.length; j++){
        keywordArr[i].score[j] = (Math.exp(keywordArr[i].score[j])/(1 + Math.exp(keywordArr[i].score[j]))) * 100;
      }
      keywordArr[i].max =Math.max(...keywordArr[i].score);
      max_scores.push(keywordArr[i].max);
      keywordArr[i].attention_heatmap = body.attention_heatmap;
    });

  }
  min_maxes = Math.min(...max_scores);
  max_maxes = Math.max(...max_scores);
  max_min_maxes = max_maxes - min_maxes;
  for(var i=0; i<keywordArr.length; i++){
    keywordArr[i].overall_score = (keywordArr[i].max - min_maxes)/max_min_maxes;
  }
  var pythonPath = "python3.6 ";
  var bertPath = __basedir + "/python_code/bert/"
  var codePath = bertPath + "predict.py --bert_model bert-base-uncased --model " + bertPath + "output/pytorch_model.bin --do_predict --do_lower_case --max_seq_length 384 --doc_stride 128 --config_file "+bertPath+"output/config.json --output_dir "+ bertPath+"output1 --null_score_diff_threshold -2.6951 --version_2_with_negative";
  var filterCommand = pythonPath + codePath;

  var filtered_result = spawn(filterCommand,{shell:true,
   encoding: 'utf-8'});
   var filteredques="";
  filtered_result.stdout.on('data',function(data){
    filteredques += data.toString();
  });
  filtered_result.stdout.on('end', function(){
    var groupCodePath =  __basedir + "/python_code/v1_group.py ";
    var groupCommand = pythonPath + groupCodePath;
    var group_result = spawn(groupCommand,{shell:true,
     encoding: 'utf-8'});
     var grouped_data = "";
    group_result.stdout.on('data',function(data){
      grouped_data += data.toString();
    });
    group_result.stdout.on('end',function(){
      filtered_questions = JSON.parse(filteredques);
      groupedAnswer = JSON.parse(grouped_data);
      response.render('questions',{generatedQuestion:filtered_questions,groupedAnswer:groupedAnswer});
    });
    group_result.stdin.write(JSON.stringify(JSON.parse(filteredques)));
    group_result.stdin.end();

  });

  filtered_result.stdin.write(JSON.stringify(keywordArr));
  filtered_result.stdin.end();
});


module.exports = router;
