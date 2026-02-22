from time import time
from platform import node as device_name, system
from subprocess import check_output
from sys import exit as quit_application
from linux_data_collector import initialise_collector as init_linux_collector
from windows_data_collector import WindowsDataCollector

supported_gpu_types = [
"NVIDIA",
"VMware"
]

def get_GPU_type(os :str) -> str:
	if os == "Linux":
		try:
			output = str(check_output("lspci | grep -i vga", shell = True)).split()
			
			for text in output:
				if text in supported_gpu_types:
					return text		#GPU type.
		except:
			print(f"Couldn't find a supported GPU in the following output:\n{output}")
			quit_application()

	if os == "Windows":
		try:
			output = check_output("wmic path win32_VideoController get name", shell = True).decode("utf-8").split()

			for text in output:
				if text in supported_gpu_types:
					return text		#GPU type.
		except:
			print(f"Couldn't find a supported GPU in the following output:\n{output}")
			quit_application()

	print(f"{os} is an unsupported operating system - collect_system_data.py")
	quit_application()


def initialise_new_collector(os: str, id: int, gpu: str):
	match os:
		case "Linux":
			return init_linux_collector(id, gpu)
			


#Determine which type of data collector needs to be used.
#Avoid loads of switch statements by defining a new class for every supported OS.
def get_new_collector(id :int, debug_mode :bool= False, name :str= False):
	#system_os = system()
	#gpu = get_GPU_type(system_os)
	

	#print(f"Initialising data collector for {system_os}")
	return WindowsDataCollector(id, debug= debug_mode, device_name= name)



