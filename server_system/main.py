
import os
from random import randint
from time import sleep

import receive_data


PORT = 8080

#Initialise HTTP server
def start_server():
    os.system("start cmd /k python3 server_system/server_handler.py")


start_server()

while True:
    receive_data.data_handler()
    sleep(1)

        
    




