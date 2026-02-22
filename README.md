# System Data Display Panel
## Overview:
This system is intended to be used on local networks for the purpose of displaying basic systems data on a single device.
The server collects system data from client devices on the network, and displays a browser GUI with a locally hosted HTTP request handler.

## Server System:
The server uses a python backend for client data handling and HTTP request handling.
The browser is provided with HTML and CSS and Javascript to display the interface and update it with provided data.
A JSON file is prepared in the backend and polled by the frontend to provide client data to be displayed.

The server hosts a couple of API endpoints:
- /data
- /bouncer

Bouncer hands out an ID.

Data receives data POSTed to it.

## Client System:
The client runs a python script that collects system data such as CPU, GPU, and RAM load, disk usage, etc., and formats it into JSON. The client will request an ID on initialisation, and continuously POST data to the server /data endpoint every few seconds.

The addresses for the server API endpoints are hard coded, and the data collector is full of functions returning valid data or default values in a format anticipated by the server.


### Data Collector Classes:
When initialised, the client APIHandler will call "collect_system_data" (WIP) to determine which data collector it should be using. For obvious reasons each OS needs a different method for collecting the same data, so to make everything nice and neat each OS is catered for by a unique data collector class designed for that OS.

#### Windows:
The windows data collector uses PyHardwareMonitor ([text](https://github.com/snip3rnick/PyHardwareMonitor)), an extension of the LibreHardwareMonitor projected to collect CPU and GPU temperature and load data from harware sensors. It is unreliable, and requires administrator privaleges to access some sensor data, but I'm sure as shit not going to figure out how to do it myself.

As of this commit, only Intel CPUs and NVIDIA GPUs will be supported, because I don't have additional hardware to test on. This should be easily fixed by adding additional Harware/sensor targets in the class initialiser. Run this version of test.py to see how to get the names of targets.

All other data collection functions use PSUTIL, and are identical to the functions in the Linux data collector.

#### inux:
Not done yet. Should be a lot more simple than the Windows solution.

