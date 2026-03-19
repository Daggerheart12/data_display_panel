
from threading import Thread

import api_handler
import server_handler

PORT=8080

Thread(target=server_handler.start_server, args=(PORT,)).start()

api_handler.start_api_endpoint()



