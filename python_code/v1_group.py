import json
import numpy as np
from nltk.stem import PorterStemmer
import copy
import sys
ps = PorterStemmer()
# filename = sys.argv[1]
input = json.loads(sys.stdin.readlines()[0])

# with open(filename) as json_file:
#     input = json.load(json_file)


input_copy = copy.deepcopy(input)
res = []

for j in range(0,len(input)):
    inp1 = input[j]
    temp_res = []
    temp_ind_arr = []
    for inp2 in input_copy:
        str1_org = inp1["answer"].split()[0]
        str1 = ps.stem(str1_org)
        str2_org = inp2["answer"]
        str2 = ps.stem(str2_org)
        index2 = input_copy.index(inp2)
        if((str1 in str2)):
            if(inp2["filtered_count"]<5):
                temp_res.append(inp2)
                temp_ind_arr.append(index2)
    for i in sorted(temp_ind_arr, reverse=True):
        del input_copy[i]
    if(temp_res):
        res.append(temp_res)
data = json.dumps(res,ensure_ascii=False)
print(data)
