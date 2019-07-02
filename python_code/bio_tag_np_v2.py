from pycorenlp import StanfordCoreNLP
import sys
import os
import json
import re
nlp = StanfordCoreNLP('http://localhost:9000')
# file_name = 'test1.txt'
# input = open(file_name).read().splitlines()
file_name = json.loads(sys.stdin.readlines()[0])
input = file_name.splitlines()

i = 0
ans_index=1
res_sentence_arr_disp = []
pos_tags = ['NN','NNP','NNS','NNPS','CD','JJ']
res_sentence_disp = ''
while (i<len(input)):
    input[i] = input[i].lower()
    res = nlp.annotate(input[i],
                   properties={
                       'annotators': 'pos',
                       'outputFormat': 'json',
                       'timeout': 1000000,
                   })


    for k in range(0,len(res["sentences"])):
        tokens = res["sentences"][k]['tokens']
        b_flag = False
        for token in tokens:
            w = str(token['word'])
            w_pos = str(token['pos'])
            if w_pos not in pos_tags:
                res_sentence_disp += w + u"\uffe8O_ANS "
                b_flag = False
            else:
                if(b_flag):
                    res_sentence_disp += w + u"\uffe8I_ANS "
                else:
                    res_sentence_disp += str(ans_index) + "\u00b7" + w + u"\uffe8B_ANS "
                    ans_index = ans_index + 1
                    b_flag = True
    res_sentence_disp += "\n\n\n"

    i = i+1
#
i = 0
ans_index=1
res_sentence_arr = []
count_arr=[0,0]
pos_tags = ['NN','NNP','NNS','NNPS','CD','JJ']
while (i<len(input)):
    input[i] = input[i].lower()
    res = nlp.annotate(input[i],
                   properties={
                       'annotators': 'pos',
                       'outputFormat': 'json',
                       'timeout': 1000000,
                   })
    flag = 0
    t_flag = 0
    words_pos = []
    index_arr = []
    count  = 0
    token_count =0
    count_arr[1] = 0
    for k in range(0,len(res["sentences"])):
        tokens = res["sentences"][k]['tokens']
        count_pos_token = 0
        token_count += len(tokens)
        for token in tokens:
            w = str(token['word'])
            w_pos = str(token['pos'])

            if w_pos not in pos_tags:
                count_pos_token = count_pos_token+1
            words_pos.append((w,w_pos))
        count_arr[1] += count_pos_token
    count_arr[0] = token_count - count_arr[1]
    count = count_arr[0]
    if(count == 0):
        i=i+1
        continue
    else:

        while(len(index_arr) < count ):
            res_sentence = ''
            res_ans=''
            original_sentence = ''
            t_flag = 0
            for j in range(0,len(words_pos)):
                w = words_pos[j][0]
                original_sentence += w + ' '
                ner = words_pos[j][1]
                #print(w+'\t'+ner)
                if t_flag == 1:
                    res_sentence += w + u"\uffe8O_ANS "
                else:
                    if ner not in pos_tags:
                        res_sentence += w + u"\uffe8O_ANS "
                        flag = 0
                    else:
                        if flag == 0 and (j not in index_arr):
                            index_arr.append(j)
                            res_sentence += w + u"\uffe8B_ANS "
                            res_ans += w
                            flag = 1
                            if(j!=(len(words_pos)-1)):
                                if (words_pos[j+1][1] not in pos_tags):
                                    t_flag = 1
                            else:
                                t_flag = 1
                        elif flag == 1 and (j not in index_arr) :
                            index_arr.append(j)
                            res_sentence += w + u"\uffe8I_ANS "
                            if(j!=(len(words_pos)-1)):
                                if (words_pos[j+1][1] not in pos_tags):
                                    t_flag = 1
                            else:
                                t_flag = 1
                            res_ans += ' ' + w
                        else:
                            res_sentence += w + u"\uffe8O_ANS "
            res_sentence_arr.append({'index':ans_index,'original_sentence':original_sentence,'tagged_sentence':res_sentence,'answer':res_ans})
            ans_index=ans_index+1
    i = i+1
res_sentence_arr_disp.append({'disp_para':res_sentence_disp,'backend_data':res_sentence_arr})
data = json.dumps(res_sentence_arr_disp,ensure_ascii=False)
print(data)
