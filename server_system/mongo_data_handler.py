import mongo_helper
from time import sleep, time
from random import randint
import json

id_register_time = 10
data_store_time = 60

mongo_helper.initialise_server_connection()
#collection = mongo_helper.get_collection("Client-Data")


#Create new ID
def generate_new_id() -> int | None:
    collection = mongo_helper.get_collection(mongo_helper.client_id_collection_name)
    
    if collection == None:
        print(f"Failed to get reference to collection. ID not created")
        return None
    
    registered_ids = []
    
    #Get all of the registered IDs from the registered ID collection.
    result = collection.find(
        {},
        {"_id": 0, "client_id": 1}
    )

    for entry in list(result):
        registered_ids.append(entry.get("client_id"))

    #Create a new, non-duplicate ID.
    while True:
        new_id = f"{randint(0, 99999999):08d}"
        if new_id not in registered_ids:
            break
    
    mongo_helper.register_id(new_id)
    print("new ID registered")
    return new_id

#Update client document with a new "last-update" time and "total_updates" counter.
#This function assumes that the ID is already in the list.
#There should be no situation were there is an unregistered client.
def update_client_data(client_data) -> None:
    collection = mongo_helper.get_collection(mongo_helper.client_id_collection_name)
    if collection == None:
        print(f"Failed to get reference to collection. ID not created")
        return None
    
    client_data = mongo_helper.sanitise_client_data(client_data)
    
    client_id = client_data.get("client_id")
    
    try:
        collection.update_one(
            {"client_id": client_id},
            {
                "$set": {"last_update": int(time())},
                "$inc": {"total_updates" : 1}
            })
    except:
        print(f"Failed to update client {client_id}")


    #Add the new client data to the data collection
    collection = mongo_helper.get_collection(mongo_helper.client_data_collection_name)
    if collection == None:
        print(f"Failed to get reference to data collection. no data deleted")
        return None
    

    #mongo_helper.debug_client_data(client_data)
    
    try:
        collection.update_one(
            {"client_id": client_id},
            {
                "$inc": {"total_updates" : 1},
                "$set": {
                    "last_update": int(time()),

                    "device_name": client_data.get("device_name"),

                    "battery_charge": client_data.get("battery_charge"),
                    "battery_status": client_data.get("battery_status"),

                    "disk_space_used": client_data.get("disk_space_used"),
                    "total_disk_space": client_data.get("total_disk_space"),

                    "fan_speed": client_data.get("fan_speed"),

                    "gpu_load": client_data.get("gpu_load"),
                    "gpu_temp": client_data.get("gpu_temp"),

                    "ram_load": client_data.get("ram_load"),
                    "total_ram_space": client_data.get("total_ram_space"),

                    "cpu_load": client_data.get("cpu_load"),
                    "cpu_temp": client_data.get("cpu_temp")
                }

            })
    except:
        print(f"Failed to update client {client_id}")


#Remove clients and their data based on how old their last update is. 
def clear_client_data() -> None:
    collection = mongo_helper.get_collection(mongo_helper.client_id_collection_name)
    if collection == None:
        print(f"Failed to get reference to ID collection. no data deleted")
        return None
    
    removed_ids = []
    
    #Get all of registered IDs and update times.
    result = collection.find(
        {},
        {"_id": 0, "client_id": 1, "last_update": 1}
    )

    #Remove clients if the last update is older than the lease time.
    for entry in result:
        if entry.get("last_update") < int(time()) - id_register_time:
            entry_id = entry.get("client_id")
            removed_ids.append(entry_id)
            collection.delete_one({"client_id": entry_id})
            print(f"Deleting the ID of client {entry_id} from the registry collection")
            

    #Remove all the client data associated with the removed IDs.
    collection = mongo_helper.get_collection(mongo_helper.client_data_collection_name)
    if collection == None:
        print(f"Failed to get reference to data collection. no data deleted")
        return None
    
    #Get all client data and update times.
    result = collection.find(
        {},
        {"_id": 0, "client_id": 1, "last_update": 1}
    )

    #Remove data if the last update is older than the store time.
    for entry in result:
        if entry.get("last_update") < int(time()) - id_register_time:
            entry_id = entry.get("client_id")
            removed_ids.append(entry_id)
            collection.delete_one({"client_id": entry_id})
            print(f"Removed the data of {entry_id} from the data collection")


#Get client data from MongoDB, assemble a master JSON file, and return it.
def fetch_client_data() -> json:
    print("Fetching data")
    collection = mongo_helper.get_collection(mongo_helper.client_data_collection_name)
    if collection == None:
        print(f"Failed to get reference to data collection. no data fetched")
        return None
    
    data = []
    result = collection.find(
        {},
        {"_id": 0}
    )
    for client_data in result:
        data.append(client_data)
    data = json.dumps(data)
    print(data)
    return data


    
