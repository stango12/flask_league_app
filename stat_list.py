import json

list_stats = []
f = open('fullItems.json', 'r')
f2 = open('fullItemsWithCDR.json', 'w')

plan_text = f.read()
data = json.loads(plan_text)
for key in data:
	item = data[key]
	desc = item.get("description")
	if not desc:
		continue
	index = desc.find("Cooldown Reduction")
	if index != -1:
		cdr = desc[index-4:index-2]
		item.get("stats")["CoolDownReduction"] = cdr
		print item.get("name")
		print item.get("stats")

json.dump(data, f2)

f.close()
f2.close()
