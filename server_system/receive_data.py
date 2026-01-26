from random import randint
import json

#Take data and aggregate it into a single file - data.json
def data_handler():
    data = ""   
    with open('server_system/data/data.json') as file:
        data = json.load(file)

        data[0]["battery_charge"] = randint(1, 100)
        data[0]["disk_space_used"] = randint(1, 1000)
        data[0]["total_disk_space"] = randint(data[0]["disk_space_used"], 1000)
        data[0]["fan_speed"] = randint(1000, 8000)
        data[0]["gpu_load"] = randint(1, 100)
        data[0]["gpu_temp"] = randint(35, 100)
        data[0]["ram_load"] = randint(1, 100)
        data[0]["total_ram_space"] = randint(data[0]["ram_load"], 100)
        data[0]["cpu_load"] = randint(1, 100)
        data[0]["cpu_temp"] = randint(35, 100)

        print(data)
        
    with open('server_system/data/data.json', 'w') as file:
        json.dump(data, file, indent=4)


    