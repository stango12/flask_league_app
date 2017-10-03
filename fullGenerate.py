import json
import requests

f = open('itemJSON.json', 'r')
f2 = open('fullItems.json', 'w')
fullList = {}
plan_text = f.read()
items_json = json.loads(plan_text)
data = items_json['data']

for key in data:
	r = requests.get('https://na1.api.riotgames.com/lol/static-data/v3/items/' + key + '?locale=en_US&tags=into&api_key=RGAPI-69248987-c58e-445e-8f9c-21a209f539bb')
	item = json.loads(r.text)
	if 'into' in item:
		continue
	else:
		fullList[key] = data[key]
		print key

json.dump(fullList, f2)
f.close()
f2.close()