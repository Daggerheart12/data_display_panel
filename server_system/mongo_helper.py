from pymongo import MongoClient
from pymongo.errors import ConnectionFailure
from pymongo.collection import Collection
from time import sleep

#Net start MongoDB

mongo_client = None
database_name = "LAN-Monitor-DB"
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


    