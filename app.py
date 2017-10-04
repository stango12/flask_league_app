#TODO: PUT CDR STAT INTO FULLITEMS.JSON
from flask import Flask, render_template
import json

app = Flask(__name__)

@app.route("/")
def main():
	return render_template('itemBuilder.html')

# @app.route("/about")
# def homepage():
# 	return render_template('about.html')

@app.route('/itemInfo/<name_item>')
def get_info(name_item):
	name_item = name_item.replace("%20", " ")
	with open('fullItemsWithCDR.json', 'r') as f:
		read_data = f.read()
	items_data = json.loads(read_data)
	for key in items_data:
		item = items_data[key]
		if item.get("name") == name_item:
			return json.dumps(items_data[key]['stats'])
	return

if __name__ == "__main__":
	app.run()
