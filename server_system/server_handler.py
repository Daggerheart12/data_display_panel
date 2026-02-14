from http.server import SimpleHTTPRequestHandler
from socketserver import TCPServer as server
from functools import partial
from os import getcwd as current_directory





def start_server(port):
    serve_this_directory = current_directory() + "/server_system/data_display"
    handler = partial(SimpleHTTPRequestHandler, directory = serve_this_directory)

    with server(("0.0.0.0", port), handler) as httpd:
        print(f"Serving at port {port}")
        # Start the server and keep it running until you stop the script
        httpd.serve_forever()


