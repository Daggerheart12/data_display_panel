from time import time
from platform import node as device_name
from json import dumps as json_dumps
import pynvml
import psutil

###Start of class
####
class LinuxDataCollector:
	def __init__(self, client_id : int, gpu : str) -> None:
		self.client_id = client_id
		self.gpu = gpu
		print(f"Initialising LinuxDataCollector with id {self.client_id} using GPU type {self.gpu}")
 
	###
	### Data collection functions
	###

	#Get device name					--Platform
	def get_device_name(self) -> str: 	
		try:
			name = device_name()
			return str(name)
		except:
			return "Can't retrieve system name"

	#Get device uptime data				--PSUTIL
	def get_uptime_data(self):
		try:
			system_boot_time = psutil.boot_time
			system_uptime = time() - system_boot_time
			return system_uptime
		except:
			return "Can't retrieve system uptime"

	#Get battery data.					--PSUTIL
	def get_battery_data(self):
		try:
			battery = psutil.sensors_battery()
			print(battery.power_plugged)
			
			return [battery.percent, battery.power_plugged]
		except:
			return ["No Data", "No Data"]

	#Get RAM data.						--PSUTIL
	def get_ram_data(self):
		try:
			ram = psutil.virtual_memory()
			return [ram.used, ram.total]
		except:
			return ["No Data", "No Data"]
		
	#Get CPU data.						--PSUTIL
	def get_cpu_data(self):
		try:
			cpu_load = psutil.cpu_percent(interval=1)

			temps = psutil.sensors_temperatures()

			if not temps:
				return [cpu_load, "No Data"]
			
			for name, entries in temps.items():
				return [cpu_load, entries[0].current]
			
		except:
			return ("No Data", "No Data")
		

	#Get storage data.					--PSUTIL
	def get_storage_data(self): 
		try:
			disk = psutil.disk_usage("/")
			return [disk.used, disk.total]
		except:
			return ["No Data", "No Data"]
		

	#Get GPU data.						--PYNVML (NVIDIA)
	def get_gpu_data(self):
		#NVIDIA
		if self.gpu == "NVIDIA":
			try:
				gpus = pynvml.nvmlDeviceGetCount()
				loads = []
				highest_load :float= 0
				highest_load_index :int= 0
				for i in range(gpus):
					handle = pynvml.nvmlDeviceGetHandleByIndex(i)
					load = pynvml.nvmlDeviceGetUtilizationRates(handle)

					loads.append(load)
					if load < highest_load:
						highest_load = load
						highest_load_index = i

				gpu_temp = pynvml.nvmlDeviceGetTemperature(highest_load_index, pynvml.NVML_TEMPERATURE_GPU)

				return [highest_load, gpu_temp]
			except:
				return ["No Data", "No Data"]
		return ["No Data", "No Data"]




	#Get fan data.
	def get_fan_speed(self) -> int:
		pass
		
	def get_data(self):
		gpu_data = self.get_gpu_data()
		cpu_data = self.get_cpu_data()
		storage_data = self.get_storage_data()
		ram_data = self.get_ram_data()
		battery_data = self.get_battery_data()

		print(gpu_data, cpu_data, storage_data, ram_data, battery_data)

		data = {
			"client_id": self.client_id,
			"device_name": self.get_device_name(),
			"uptime": self.get_uptime_data(),
			"battery_charge": battery_data[0],
			"battery_status": battery_data[1],
			"disk_space_used": storage_data[0],
			"total_disk_space": storage_data[1],
			"fan_speed": "Fan Speed",
			"gpu_load": gpu_data[0],
			"gpu_temp": gpu_data[1],
			"ram_load": ram_data[0],
			"total_ram_space": ram_data[1],
			"cpu_load": cpu_data[0],
			"cpu_temp": cpu_data[1]
		}

		data = json_dumps(data)
		return data
####
#####End of class
	
###Initialise and return object.
def initialise_collector(id: int, gpu: str):
	pynvml.nvmlInit()
	return LinuxDataCollector(id, gpu)