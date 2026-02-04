from flask import Flask, request
import requests
import json

from data_handler import *


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
    
    handle_new_data(new_data)
    return "Data received", 200



#Start API.
def start_api_endpoint():
    app.run(port=8081)
