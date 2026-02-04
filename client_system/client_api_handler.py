from flask import Flask
from collect_system_data import DataCollector
import requests
from time import sleep

class APIHandler():
    def __init__(self):
        self.bouncer_url = "http://localhost:8081/api/bouncer"
        self.data_url = "http://localhost:8081/api/data"
        self.id = None
        self.collector = self.create_new_collector()

    def create_new_collector(self):
        while True:
            new_id = self.get_new_id()
            if new_id != None:
                break

            print("Error getting new ID from server")
            sleep(3)
        self.id = new_id
        return DataCollector(new_id)
    
    #Get ID.
   
    #Request a new ID from the server.
    def get_new_id(self) -> int | None:
        new_id = None
        new_id = requests.get(self.bouncer_url).text

        try:
            return new_id
        except:
            return None    

    #Try send data to the server.
    def send_data(self) -> None:
        data = self.collector.get_data()
        try:
            response = requests.post(self.data_url, json=data)
            print(response)
        except:
            print("Connection Error")
            return None
        
print("Creating new API handler")
handler = APIHandler()
print(f"API handler created successfully -> {handler.id}")

while True:
    handler.send_data()

    sleep(1)


