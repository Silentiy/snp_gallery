# Python 3 server example (https://pythonbasics.org/webserver/)

from http.server import BaseHTTPRequestHandler, HTTPServer
import json


hostName = "localhost"
serverPort = 8090


def read_key():
    with open(".env") as env:
        lines = env.readlines()
        return lines[0].split("=")[1]


class CorsServer(BaseHTTPRequestHandler):
    def do_GET(self):
        self.send_response(200)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET")
        self.end_headers()

        response = json.dumps({"access_key": read_key()})
        self.wfile.write(bytes(response, "utf-8"))


if __name__ == "__main__":
    webServer = HTTPServer((hostName, serverPort), CorsServer)
    print(f"Server started http://{hostName}:{serverPort}")

    try:
        webServer.serve_forever()
    except KeyboardInterrupt:
        pass

    webServer.server_close()
    print("Server stopped.")
