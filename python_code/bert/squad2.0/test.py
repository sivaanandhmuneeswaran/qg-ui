import json
with open('test_data.json', "r", encoding='utf-8') as reader:
    input_data = json.load(reader)["data"][0]
print(input_data)
