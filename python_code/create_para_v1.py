from itertools import islice
import re
import sys
import json
import os
import spacy
spacy_nlp = spacy.load('en_core_web_sm')
file_name = json.loads(sys.stdin.readlines()[0])
doc = spacy_nlp(file_name)
tokens = [token.text for token in doc]
input = " ".join(tokens)

split_txt = re.split('\s*',input)
i=0
count = 0
res=''
res_sen = []
flag = 0
temp_i=[0]
while(i<len(split_txt)):
    if(count>199):
        if((i+100) < len(split_txt)):
            j_range = i+100
        else:
            j_range = len(split_txt)-1
        for j in range(i,j_range):
            r = re.search(r'.*\.',split_txt[j])
            if(r):
                res = res + split_txt[j]
                res_sen.append(res)
                res=''
                count = 0
                temp_i[0]=j
                flag = 1
                break
            else:
                res = res + split_txt[j] + ' '
                count += 1
    else:
        res = res + split_txt[i] + ' '
        count += 1
    if(flag==1):
        i=temp_i[0]
        flag=0
    i+=1

if (res):
    res_sen.append(res)
res_file = '\n'.join(res_sen)

# data = json.dumps(res_file,ensure_ascii=False)
print(res_file)
sys.stdout.flush()
# res_file_name = os.path.dirname(os.path.dirname(os.path.abspath(__file__))) + '/qg_para/inp_para.txt'
# with(open(res_file_name,'w')) as f:
#    f.write(res_file.lower())
