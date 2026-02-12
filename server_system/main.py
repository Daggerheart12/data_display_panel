
from threading import Thread

import receive_data
import server_handler

PORT=8080

Thread(target=server_handler.start_server, args=(PORT,)).start()

receive_data.start_api_endpoint()





