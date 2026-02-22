from HardwareMonitor.Hardware import Computer

computer = Computer()  # settings can not be passed as constructor argument (following below)
computer.IsMotherboardEnabled = False
computer.IsControllerEnabled = False
computer.IsCpuEnabled = True
computer.IsGpuEnabled = True
computer.IsBatteryEnabled = False
computer.IsMemoryEnabled = False
computer.IsNetworkEnabled = False
computer.IsStorageEnabled = False


desired_hardware = [
"Total Memory",
"NVIDIA",
"Intel "
]

def read():
    computer.Open()

    for hardware in computer.Hardware:
        #if not any(hardware_name_word in hardware.Name for hardware_name_word in desired_hardware):
        #    continue

        print(f"Hardware: {hardware.Name}, {hardware.HardwareType}")
        for subhardware  in hardware.SubHardware:
            print(f"\tSubhardware: {subhardware.Name}")
            for sensor in subhardware.Sensors:
                print(f"\t\tSensor: {sensor.Name}, {sensor.SensorType}, value: {sensor.Value}")
        for sensor in hardware.Sensors:
                print(f"\tSensor: {sensor.Name}, {sensor.SensorType}, value: {sensor.Value}")

    computer.Close()

for i in range(1):
    read()