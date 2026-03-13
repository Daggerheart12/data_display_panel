import mongo_helper
from time import sleep, time
from random import randint

client_id_collection_name = "Registered-IDs"
client_data_collection_name = "Client-Data"

mongo_helper.initialise_server_connection()
collection = mongo_helper.get_collection("Client-Data")


#Create new ID
def generate_new_id() -> int:
    collection = mongo_helper.get_collection(client_id_collection_name)
    registered_ids = []
    
    #Get all of the registered IDs from the registered ID collection.
    result = collection.find(
        {},
        {"_id": 0, "client_id": 1, "registration_time": 1}
    )

    for entry in list(result):
        registered_ids = entry.get("client_id")

    #Create a new, non-duplicate ID.
    while True:
        new_id = f"{randint(0, 99999999):08d}"
        if new_id not in registered_ids:
            break
    
    return new_id


    

generate_new_id()
