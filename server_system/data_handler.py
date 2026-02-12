from random import randint
import time
import json

device_ids = {}


def handle_new_data(client_data) -> None:
    data = None
    try:
        data = json.loads(client_data)
    except:
        add_to_log(f"Can't format client data to JSON - {get_time()}")
        return
    
    client_id = None

    try:
        client_id = data["client_id"]
    except:
        add_to_log("Can't retrive client ID from provided data")
        return

    if client_id == None:
        add_to_log("Client data has a null ID")
        return
    
    if client_id not in device_ids:
        add_to_log(f"Added client {client_id} to list at {get_time()}")
    device_ids[client_id] = int(time.time())

    #Remove old IDs from the dictionary.
    purge_old_clients()

    #Filter through existing data. Replace existing data with new provided data.
    updated_data = update_existing_data(data)

    with open("server_system/data/data.json", "w") as file:
        file.write(json.dumps(updated_data, indent = 4))
    

#Remove old clients from the client dictionary to save space on the screen.
def purge_old_clients():
    for client in device_ids.keys():
        if int(time.time()) - device_ids[client] > 10: #If this client entry hasn't been updated in 5 seconds.
            del device_ids[client]
            add_to_log(f"Purged client {client} from client list at {get_time()}")



#Remove old data and add new data.
def update_existing_data(new_data):
    existing_data_string = get_existing_data(0)
    existing_data_json = get_existing_data(1)
    replacement_data :list= []    
    new_data_used :bool= False

    if existing_data_string != None:
        for i in range(len(existing_data_string)):
            client_id = existing_data_string[i].get("client_id")
            
            #If this client is in the client list, add this data to the new data string.
            if client_id == new_data.get("client_id"):
                new_data_used = True
                replacement_data.append(new_data)
            elif client_id in device_ids.keys():
                replacement_data.append(existing_data_string[i])
    
    
    #The client supplying this data is new, append the data to the end.
    if not new_data_used:
        print("Appended to end")
        replacement_data.append(new_data)

    return replacement_data
    
    print(["Replacement data ->", replacement_data, "\nFrom these clients ->", device_ids])


#Return a string of the current local time.
def get_time() -> str:
    current_time = time.localtime()
    current_time = f"{current_time.tm_hour}:{current_time.tm_min}:{current_time.tm_sec}"
    return current_time

#Read data from file.
def get_existing_data(mode) -> str | None:
    try:
        with open("server_system/data/data.json", "r") as file:
            if mode == 0:
                return json.loads(file.read())

            if mode == 1:
                return file.read()
    except:
        return None

#All devices need to be identified so their data can be recorded,
#and updated. Cut process after 100 trys.
def generate_new_id() -> int | None:
    for i in range(100):
        new_id = f"{randint(0, 99999999):08d}"
        
        if not check_id(new_id):
            return new_id
    return None

#The data handler needs to know whether to replace existing JSON data,
#or add new stuff.
def check_id(client_id) -> bool | None:
    if client_id == None:
        return None

    if (client_id in device_ids):
        return True
    return False

#Verify client ID.
def verify_id(client_data) -> int | None:
    client_id = int(client_data[0])
    

#Enter data into the server log.
def add_to_log(text):
    with open("server_system/server_log/log.txt", "a") as log:
        log.write(str(text) + "\n") 

