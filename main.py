import json
import os
from random import randint
from time import sleep

PORT = 8080

#Initialise HTTP server
def start_server():
    os.system("start cmd /c python3 server_handler.py")

#Take data and aggregate it into a single file - data.json
def data_handler():
    data = ""
    with open('data/data.json') as file:
        data = json.load(file)

        print(data[0][2])
        data[0][2] = f"{randint(1, 100)}"
        print(data[0][2])

        
    with open('data/data.json', 'w') as file:
        json.dump(data, file, indent=4)
        
    

start_server()
data_handler()



