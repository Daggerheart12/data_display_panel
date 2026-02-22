'''
Because Microsoft doesn't want to give me access to sensor data, Windows systems are handled by getting 
data from the Libre Hardware Monitor library with PyHardwareMonitor. https://github.com/snip3rnick/PyHardwareMonitor
'''
from sys import exit as quit_application

try:
	from platform import node as platform_name
	from json import dumps as json_dumps
	from HardwareMonitor.Hardware import Computer 	#PyHardwareMonitor

	from psutil import virtual_memory as psutil_memory
	from psutil import disk_usage as psutil_disk
	from psutil import sensors_battery as psutil_battery
except ImportError as error:
	print("Failed to import a module:")
	print(error)
	quit_application()

###
#### PyHardwareMonitor config
computer = Computer()  # settings can not be passed as constructor argument (following below)
computer.IsMotherboardEnabled = False
computer.IsControllerEnabled = False
computer.IsCpuEnabled = True
computer.IsGpuEnabled = True
computer.IsBatteryEnabled = False
computer.IsMemoryEnabled = True
computer.IsNetworkEnabled = False
computer.IsStorageEnabled = False
#### PyHardwareMonitor config
###



class WindowsDataCollector():
	def __init__(self, id :int, debug :bool= False, device_name :str= None):
		self.client_id = id
		self.debug_mode = debug
		self.device_name = device_name

		#Hardware sensor targets
		#Add new lists with the following content: ["Type (see existing)", "Harware Name", "Sensor Name"]
		self.cpu_temp_targets = [
			["c_temp", "Intel ", "Core Average"]	#Space after name to avoid needing to handle Intel graphics systems
		]

		self.cpu_load_targets = [
			["c_load", "Intel ", "CPU Total"]
		]

		self.gpu_temp_targets = [
			["g_temp", "NVIDIA", "GPU Core"]
		]

		self.gpu_load_targets = [
			["g_load", "NVIDIA", "Test"]
		]

		self.hardware_targets = self.merge_target_dictionaries()

	###
	#### Initialisation functions
	###

	### Merge all of the hardware target options into a single list
	def merge_target_dictionaries(self) -> dict[str, str]:
		hardware_targets = []
		
		for target in self.cpu_temp_targets:
			hardware_targets.append(target)

		for target in self.cpu_load_targets:
			hardware_targets.append(target)

		for target in self.gpu_temp_targets:
			hardware_targets.append(target)

		for target in self.gpu_load_targets:
			hardware_targets.append(target)

		self.print_if_debug(f"Configured hardware targets - {hardware_targets}")
		return hardware_targets

	###
	#### Data collecting functions
	###

	### Get device name	from Platform
	def get_device_name(self) -> str: 	
		if self.device_name != None:
			return self.device_name
		
		try:
			return platform_name()
		except:
			return "No Data"
	
	### Get RAM data from PSUTIL
	def get_ram_data(self):
		try:
			ram = psutil_memory()
			return [ram.used, ram.total]
		except:
			return ["No Data", "No Data"]

	### Get battery data from PSUTIL
	def get_battery_data(self):
		try:
			battery = psutil_battery()
			print(battery.power_plugged)
			
			return [battery.percent, battery.power_plugged]
		except:
			return ["No Data", "No Data"]

	### Get storage data from PSUTIL
	def get_storage_data(self): 
		try:
			disk = psutil_disk("/")
			return [disk.used, disk.total]
		except:
			return ["No Data", "No Data"]

	###	Get hardware data from LibreHardwareMonitor -> [cpu temp, load, gpu temp, load]
	def get_cpu_and_gpu_data(self) -> list[str, str, str, str]:
		targets = self.hardware_targets
		target_data :list[str, str, str, str]= []
		cpu_temp :str= ""
		cpu_load :str= ""
		gpu_temp :str= ""
		gpu_load :str= ""

		computer.Open()
		sensor_value = None

		### Itterate through all selected hardware elements
		for hardware in computer.Hardware:
			valid_hardware_target :bool= False
			valid_sensor_targets :list[list[str, str]]= []

			for index in range(len(targets)):
				hardware_target_name = targets[index][1]

				if hardware_target_name in hardware.Name:
					valid_hardware_target = True
					valid_sensor_targets.append([targets[index][0], targets[index][2]])
			
			#If this is a valid hardware target, find the sensor target
			if not valid_hardware_target:						
				continue
				

			# Loop through hardware sensors to find target sensors
			try:
				for sensor in hardware.Sensors:
					#print(sensor.Name)
					for target in valid_sensor_targets:
						#print(f"\t{target[1]}")
						if sensor.Name == target[1]:
							sensor_value = str(sensor.Value)
							#print(f"\t\tFound target {target[1]}")

							
							match target[0]:
								case "c_temp":
									if cpu_temp == "": 
										cpu_temp = sensor_value
									continue
								case "c_load":
									if cpu_load == "":
										cpu_load = sensor_value
									continue
								case "g_temp":
									if gpu_temp == "":
										gpu_temp = sensor_value
									continue
								case "g_load":
									if gpu_load == "":
										gpu_load = sensor_value
									continue
								case "":							#Default	
									self.print_if_debug(f"Unknown sensor value type - {sensor_value} - windows_data_collector.py 132")
			except:
				self.print_if_debug(f"Failed to read the sensors of {hardware.Name}")

		target_data = [self.s_h_data(cpu_temp), self.s_h_data(cpu_load), self.s_h_data(gpu_temp), self.s_h_data(gpu_load)]
		computer.Close()
		return target_data
	
	### Call hardware collecting functions and return data in JSON format
	def get_device_data(self) -> str: 	#JSON
		hardware_monitor_data = self.get_cpu_and_gpu_data()
		ram_data = self.get_ram_data()
		storage_data = self.get_storage_data()
		battery_data = self.get_battery_data()

		data = {
		"client_id": self.client_id,
		"device_name": self.get_device_name(),
		"uptime": "No Data",
		"battery_charge": battery_data[0],
		"battery_status": battery_data[1],
		"disk_space_used": storage_data[0],
		"total_disk_space": storage_data[1],
		"fan_speed": "Fan Speed",
		"gpu_load": hardware_monitor_data[3],
		"gpu_temp": hardware_monitor_data[2],
		"ram_load": ram_data[0],
		"total_ram_space": ram_data[1],
		"cpu_load": hardware_monitor_data[1],
		"cpu_temp": hardware_monitor_data[0]
		}
	
		data = json_dumps(data)
		self.print_if_debug(data)
		return data

	###
	#### Helper functions
	###

	### Sanitise hardware sensor data
	def s_h_data(self, data :str):
		if data == "":
			data = "No Data"

		return data

	### Define a message, and print it to the terminal if the APIHandler is in debug mode
	def print_if_debug(self, message :str) -> None:
		if self.debug_mode == True:
			print(message)
