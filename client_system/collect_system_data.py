import psutil
import json
from time import time

#Client device data collector class. New data collector for new client ID.
class DataCollector:
    def __init__(self, client_id):
        self.client_id = client_id

    def get_id(self):
        return self.client_id
    
    #Get device uptime data
    def get_uptime_data(self):
        try:
            system_boot_time = psutil.boot_time
            system_uptime = time() - system_boot_time
            return system_uptime
        except:
            return "Can't retrieve system uptime"

    #
    #Get RAM data.
    #
    def get_ram_load_data(self):
        try:
            ram = psutil.virtual_memory()
            return ram.used
        except:
            return "Can't retrieve RAM load data"

    def get_ram_total_data(self):
        try:
            ram = psutil.virtual_memory()
            return ram.total
        except:
            return "Can't retrieve RAM total data"

    def get_cpu_load_data(self): #Temperature remains unhandled.
        try:
            cpu_load = psutil.cpu_percent(interval=1)
            return cpu_load
        except:
            return "Can't get CPU data"

    #
    #Get storage data.
    #
    def get_storage_used_data(self): 
        try:
            disk = psutil.disk_usage("/")
            return disk.used
        except:
            return "Can't get storage used data"
        
    def get_storage_total_data(self): 
        try:
            disk = psutil.disk_usage("/")
            return disk.total
        except:
            return "Can't get storage total data"

    def get_data(self):
        data = {
            "client_id": self.client_id,
            "device_name": self.client_id,
            "uptime": self.get_uptime_data(),
            "battery_charge": "Battery Charge",
            "battery_status": "Battery Status",
            "disk_space_used": self.get_storage_used_data(),
            "total_disk_space": self.get_storage_total_data(),
            "fan_speed": "Fan Speed",
            "gpu_load": "GPU Load",
            "gpu_temp": "GPU Temp",
            "ram_load": self.get_ram_load_data(),
            "total_ram_space": self.get_ram_total_data(),
            "cpu_load": self.get_cpu_load_data(),   
            "cpu_temp": "CPU Temp"
        }

        data = json.dumps(data)
        return data
    

