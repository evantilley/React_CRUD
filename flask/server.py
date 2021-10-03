from flask import Flask
from flask import render_template
from flask import Response, request, jsonify

import json
import time

import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore
from flask_cors import CORS



# Use a service account
cred = credentials.Certificate('key.json')
firebase_admin.initialize_app(cred)

db = firestore.client()

app = Flask(__name__)

CORS(app)


#initial route called when page loaded via GET request
@app.route('/')
def hello():
    docs = db.collection(u'items').stream()
    items = []
    for doc in docs:
        data = doc.to_dict()
        data['id'] = doc.id
        items.append(data)
    #notice that we're not using the render_template function here,
    #instead the server is just acting as a raw API and returning the info we need
    return jsonify(items)

#add item route
@app.route('/add_item', methods = ['GET', 'POST'])
def add_item():
    json_data = request.get_json()
    item = json_data['item']
    collection_ref = db.collection(u'items')
    doc_ref = collection_ref.document()
    #timestamp
    time_added = time.time()
    item_to_add = {'value': item, 'timestamp': time_added}
    doc_ref.set(item_to_add)
    total_count = len(collection_ref.get())
    #doc_ref.id is the last id
    item_to_return = {'value': item, 'count': total_count, 'id': doc_ref.id, 'timestamp': time_added}
    return jsonify(item_to_return)

#update route
@app.route('/update_item', methods = ['GET', 'POST'])
def update_item():
    json_data = request.get_json()
    id_to_update = json_data['id']
    new_value = json_data['new_value']
    #update item in collection
    db.collection('items').document(f'{id_to_update}').update({u'value': new_value})
    return json_data

#delete route
@app.route('/delete_item', methods = ['GET', 'POST'])
def delete_item():
    json_data = request.get_json()
    id_to_delete = json_data['id']
    #delete item from collection
    db.collection('items').document(f'{id_to_delete}').delete()
    item_to_return = {'id': id_to_delete}
    return jsonify(item_to_return)


if __name__ == "__main__":
    app.run(debug=True, port=6001)