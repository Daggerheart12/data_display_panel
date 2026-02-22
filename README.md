# System Data Display Panel
## Overview:
This system is intended to be used on local networks for the purpose of displaying basic systems data on a single device.
The server collects system data from client devices on the network, and displays a browser GUI with a locally hosted HTTP request handler.

### Server System:
The server uses a python backend for client data handling and HTTP request handling.
The browser is provided with HTML and CSS and Javascript to display the interface and update it with provided data.
A JSON file is prepared in the backend and polled by the frontend to provide client data to be displayed.

The server hosts a couple of API endpoints:
- /data
- /bouncer

Bouncer hands out an ID.

Data receives data POSTed to it.

### Client System:
The client runs a python script that collects system data such as CPU, GPU, and RAM load, disk usage, etc., and formats it into JSON. The client will request an ID on initialisation, and continuously POST data to the server /data endpoint every few seconds.

The addresses for the server API endpoints are hard coded, and the data collector is full of functions returning valid data or default values in a format anticipated by the server.


#### Data Collector Classes:
When initialised, the client APIHandler will call "collect_system_data" (WIP) to determine which data collector it should be using. For obvious reasons each OS needs a different method for collecting the same data, so to make everything nice and neat each OS is catered for by a unique data collector class designed for that OS.

##### Windows:
The windows data collector uses PyHardwareMonitor ([link!](https://github.com/snip3rnick/PyHardwareMonitor)), an extension of the LibreHardwareMonitor projected to collect CPU and GPU temperature and load data from harware sensors. It is unreliable, and requires administrator privaleges to access some sensor data, but I'm sure as shit not going to figure out how to do it myself.

As of this commit, only Intel CPUs and NVIDIA GPUs will be supported, because I don't have additional hardware to test on. This should be easily fixed by adding additional Harware/sensor targets in the class initialiser. Run this version of test.py to see how to get the names of targets.

All other data collection functions use PSUTIL, and are identical to the functions in the Linux data collector.

##### Linux:
Not done yet. Should be a lot more simple than the Windows solution.

## Testing The Code - A Step-By-Step Guide:
If you are looking to help test out this code - thanks!
This section goes how to run the code, and what you can do to test it at this stage.

### Code Download:
1. Check the commit message. It will explicitly state if the project is functional or broken. If the most recent commit is functional, download that. If not, testing on a recent functional commit will still be helpful.

2. If you intend to run the code on a Windows OS, you need to install [PawnIO](https://pawnio.eu/) - a kernal driver used by LibreHardwareMonitor to get hardware data. If you don't want to install it, fair enough. I don't know what will happen without it being installed, but it would presumable prevent PyHardwareMonitor from getting data from its hardware targets.

- I haven't tested downloading PawnIO from their site. I installed PawnIO during the installation process of the latest release of [LibreHardwareMonitor](https://github.com/LibreHardwareMonitor/LibreHardwareMonitor).

### Running The Code:
Keep in mind before you start:
There is some funniness going on with running the server in particular.
Sometimes, after running the server and visiting the browser I get 404s. I think this has something to do with the way the HTTP request handler works, but I haven't got around to that yet. Opening the whole code base in VSC and running the server from there solves this issue for reasons I don't understand yet.


1. Find *main.py* and *client.py*. These are your server and client.
2. Run *main.py*. Note the terminal output. It runs two multi-threaded processes - an HTTP request handler (localhost:8080) and an API endpoint (localhost:8081).
3. Open "http://localhost:8080" in the browser of your choice. It will work on Chromium browsers, and I don't expect funny business from any other major browsers.
3. Run *client.py* with Administrator privaleges. Go through the initialisation process. Your server is listening on all network interfaces on port 8081. Specify one, or leave it to the default - "127.0.0.1:8081" - your loopback address. You have the option of supplying a custom device name, or defaulting to the name of your device.
4. Go back to the browser. Within a few seconds, your client should appear. If the UI doesn't appear or is frozen, refresh, clear browser cache.

### Improving Windows Functionality:
I need help improving and testing the "WindowsDataCollector" class in *windows_data_collector.py*. Specifically, look at *get_cpu_and_gpu_data()* and *get_device_data()*.

Straight out of the gate, you might find "No Data" popping up in your client terminal for you CPU and GPU data fields. This has two causes:
1. You are not running the client with Administrator privaleges.
2. You are using unhandled systems.

Run *test.py* with Administrator privaleges. This will print out all the CPU and GPU hardware found in the device, and all of the sensors associated with these systems.

*Imagine Uncle Sam pointing at you here*: I want ***YOU*** to find the average load and temperature sensors for your specific system, and add them to the list of possible hardware targets in the initialiser of the data collector class. Restarting your client, you should be able to collect data from your new hardware targets, yay! If not, I might not be as good at programming than I thought :(

The system is a little unreliable. My load targets sometimes return "0.0" instead of a realistic number, but "0.0" is still a value I can work with. This is a PyHardwareMonitor issue, and is known. Edit the data collector script to initialise the class and you can run it on its own. Call the data collector function repeatedly, and you will see it get the intended value. *Test.py* and *LibreHardwareMonitor* are good for finding what values should be.

