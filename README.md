# System Data Display Panel
### Overview:
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

The addresses for the server API endpoints are hard coded, and the data collector is full of functions returning default values.

