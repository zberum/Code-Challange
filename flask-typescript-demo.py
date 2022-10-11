import os
from flask import Flask, render_template, jsonify,json, request

app = Flask(__name__)


@app.route('/')
def index():
    return render_template('index.html')

# return all players data
@app.route('/players')
def player():
    SITE_ROOT = os.path.realpath(os.path.dirname(__file__))
    json_url = os.path.join(SITE_ROOT, "static/data", "soccer_small.json")
    data = json.load(open(json_url, encoding="utf8"))
    return data

# get specific player data by it's name
@app.route('/player')
def getPlayer():
    name = request.args.get('name', default="")
    return_data = ''
    SITE_ROOT = os.path.realpath(os.path.dirname(__file__))
    json_url = os.path.join(SITE_ROOT, "static/data", "soccer_small.json")
    data = json.load(open(json_url, encoding="utf8"))
    for i in data:
        if name == i['Name']:
            return_data = i
    
    if return_data == '':
        return_data = "No match found"
    else :
        return_data = return_data

    return return_data

# get list of countries with the name of player playing for that country
@app.route('/countries')
def getCountries():
    return_data = {}
    SITE_ROOT = os.path.realpath(os.path.dirname(__file__))
    json_url = os.path.join(SITE_ROOT, "static/data", "soccer_small.json")
    data = json.load(open(json_url, encoding="utf8"))
    for i in data:
        return_data[i['Name']] = i['Nationality']

    return jsonify(return_data) 

# get list of clubs and players playing the clubs
@app.route('/clubs')
def getClubs():
    return_data = {}
    SITE_ROOT = os.path.realpath(os.path.dirname(__file__))
    json_url = os.path.join(SITE_ROOT, "static/data", "soccer_small.json")
    data = json.load(open(json_url, encoding="utf8"))
    for i in data:
        return_data[i['Name']] = i['Club']

    return jsonify(return_data) 

# return some attributes of the players
@app.route('/attributes')
def getAttributes():
    return_data = {}
    SITE_ROOT = os.path.realpath(os.path.dirname(__file__))
    json_url = os.path.join(SITE_ROOT, "static/data", "soccer_small.json")
    data = json.load(open(json_url, encoding="utf8"))
    for i in data:
        return_data[i['Name']] = { "Height" : i["Height"], "Weight" : i["Weight"], "Preffered_Foot" : i["Preffered_Foot"] }

    return jsonify(return_data) 


if __name__ == '__main__':
    app.run(debug=True)
