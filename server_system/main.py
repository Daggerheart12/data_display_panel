
import os
from random import randint
from time import sleep

import receive_data


PORT = 8080

#Initialise HTTP server.
def start_server():
    os.system("start cmd /k python3 server_system/server_handler.py")

#Initialise API endpoint.
def start_api_endpoint():
    receive_data.start_api_endpoint()

start_server()
start_api_endpoint()




