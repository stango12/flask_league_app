import json

f = open('fullItems.json', 'r')
f2 = open('names.txt', 'w')
fullList = {}
plan_text = f.read()
data = json.loads(plan_text)

for key in data:
	item = data[key]
	if "name" in item:
		f2.write(item["name"] + "\n")
	else:
		f2.write(key)

f.close()
f2.close()