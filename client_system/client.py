from collect_system_data import DataCollector
from sys import exit as quit_application
import requests
from time import sleep

###
#### Start of class
class APIHandler():
    def __init__(self, ip :str, debug :bool):
        self.debug_mode = debug

        self.bouncer_url = self.create_bouncer_url(ip)
        self.data_url = self.create_data_url(ip)
        self.id = self.get_new_id()
        self.collector = self.create_new_collector()
    

    ###
    ### Initialisation functions
    ###

    def create_bouncer_url(self, ip):
        return f"http://{ip}/api/bouncer"
    
    def create_data_url(self, ip):
        return f"http://{ip}/api/data"
    
    #Request a new ID from the server.
    #Request an ID until one is given, or the set number of attempts runs out.
    #Return the ID for self.id.
    def get_new_id(self) -> int | None:
        max_attempts :int= 10
        attempt_counter :int= 0

        while True:
            if attempt_counter > max_attempts:
                break
            else:
                attempt_counter += 1

            try:
                new_id =  requests.get(self.bouncer_url).text
                self.print_if_debug(f"New ID created for client - {new_id}")
                return new_id
            except:
                self.print_if_debug(f"Unable to get new ID from {self.bouncer_url}")
                sleep(1)

        #The maximum number of allowed attempts have been made - quit the application.
        self.print_if_debug(f"Maximum attempts exceded - quitting application")
        quit_application()

    #Initialise a DataCollector, and return it for self.collector.
    def create_new_collector(self):
        return DataCollector(self.id)


    ###
    ### Data handler
    ###

    #Send data to the server.
    def send_data(self) -> None:
        data = self.collector.get_data()
        try:
            response = requests.post(self.data_url, json=data)
            self.print_if_debug(f"Successful data transfer - server message: {response}")
        except:
            self.print_if_debug(f"Unable to send data to server at {self.data_url}")
            return None


    ###
    ###Helper functions
    ###

    #Define a message, and print it to the terminal if the APIHandler is in debug mode.
    def print_if_debug(self, message :str) -> None:
        if self.debug_mode == True:
            print(message)
#### End of class
###


def initialise_apihandler():
    print("Initialising client")
 
    ip_address :str= ""
    debug_mode :bool= False

    print("Enter server address and port (default localhost:8081)")
    user_input = str(input())
    
    if user_input != "":
        ip_address = user_input
    else:
        ip_address = 'localhost:8081'

    while True:
        print("Initialise client in debug mode, [Y/n]?")
        user_input = str(input())
        
        if user_input == "" or user_input == "y" or user_input == "yes":
            debug_mode = True
            break
        elif user_input == "n" or user_input =="no":        
            debug_mode = False
            break
            

    return APIHandler(ip_address, debug_mode)


handler :APIHandler= initialise_apihandler()
print("Client initialised successfully")

#Send data to the server once every second.
while True:
    handler.send_data()

    sleep(1)


