from pymongo import MongoClient
from pymongo.errors import ConnectionFailure
from pymongo.collection import Collection
from time import sleep, time

#Net start MongoDB

mongo_client = None
database_name = "LAN-Monitor-DB"
client_id_collection_name = "Registered-IDs"
client_data_collection_name = "Client-Data"
database = None

#Start system. Use global references - this function is called elsewhere.
def initialise_server_connection() -> MongoClient:
    global mongo_client
    global database
    while True: 
        try:
            mongo_client = MongoClient("mongodb://localhost:27017/", serverSelectionTimeoutMS=1000)
            database = mongo_client[database_name]
            print("Client successfully initialised")
            break
        except ConnectionFailure:
            print("Failed to initialise client - server connection failure")
            sleep(1)
    return mongo_client

#Ping the server. Ensure connectivity.
def test_server_connectivity() -> bool:
    try:
        #Verify connection to the server.
        mongo_client.admin.command("ping")
    except ConnectionFailure:
        print("Server connection failure")
        return False
    
    #Verify connection to the database.
    if database_name in mongo_client.list_database_names():
        return True
    else:
        print("Database connection failure")
        return False

#Get a collection from the database.
def get_collection(collection_name : str) -> Collection | None:
    if collection_name in database.list_collection_names():
        return database[collection_name]
    else:
        print(f"Collection \"{collection_name}\" doesn't exist")
        return None

#Register a new ID, and add it to the relevant collection.
def register_id(new_id) -> None:
    collection = get_collection(client_id_collection_name)

    if collection == None:
        print(f"Failed to get reference to collection. ID not registered")
        return
        
    collection.insert_one(
        {
            "client_id": new_id, 
            "registration_time": int(time()), 
            "last_update": int(time()),
            "total_updates": 0
        })
    

    collection = get_collection(client_data_collection_name)

    if collection == None:
        print(f"Failed to get reference to collection. Placeholder data not created")
        return
    
    collection.insert_one(
        {   "client_id": new_id,
            "registration_time": int(time()),
            "last_update": int(time()),
            "battery_charge": 0,
            "battery_status": False,

            "disk_space_used": 0,
            "total_disk_space": 0,

           "fan_speed": 0,

            "gpu_load": 0,
            "gpu_temp": 0,

            "cpu_load": 0,
            "cpu_temp": 0,

            "ram_load": 0,
            "total_ram_space": 0
        })
    

    