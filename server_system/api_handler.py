from flask import Flask, request
import requests
import json 

#from data_handler import *
from mongo_data_handler import *


app = Flask(__name__)

#Give new and re-connecting client devices a new ID.
@app.route("/api/bouncer", methods=["GET"])
def return_new_device_id() -> int | None:
    return generate_new_id()

#Receive client data from devices with valid IDs.
@app.route("/api/data", methods=["POST"])
def receive_client_data():
    new_data = request.get_json()    

    if new_data == None:
        return "Bad Request", 400
    
    #handle_new_data(new_data)
    print("Updating data")
    update_client_data(json.loads(new_data))
    return "Data received", 200

#Fetch data from MongoDB for the front end.
#This is polled regularly, and will be used trigger database updates.
@app.route("/api/data", methods=["GET"])
def return_client_data():
    print("Clearing data")
    clear_client_data()
    data = fetch_client_data()
    return data


#Start API.
def start_api_endpoint():
    app.run(host="0.0.0.0", port=8081)
