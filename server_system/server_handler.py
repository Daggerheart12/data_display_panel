from http.server import SimpleHTTPRequestHandler as handler
from socketserver import TCPServer as server
from sys import exit

def start_server(port):
    with server(("0.0.0.0", port), handler) as httpd:
        print(f"Serving at port {port}")
        # Start the server and keep it running until you stop the script
        httpd.serve_forever()


