import socket
import json

def read_key():
    with open("key.env") as env:
        lines = env.readlines()
        return lines[0].split("=")[1]


def create_server():
    serverSocket = socket.socket(family=socket.AF_INET, type=socket.SOCK_STREAM)
    try:
        serverSocket.bind(("localhost", 9000))
        serverSocket.listen(5)  # up to 5 requests in a queue
        while True:  # infinite loop
            (clientSocket, address) = serverSocket.accept()

            readedData = clientSocket.recv(5000).decode()  # recieve up to 5 000 characters in request
            pieces = readedData.split("\n")  # depending on cintent of request we can alter behaviour on the server side
            if len(pieces) > 0:  # now we are just sending headers back
                print(pieces[0])
            # building our responce according to HTTP protocol
            key = read_key()
            data = "HTTP/1.1 200 OK\r\n"
            data += "Access-Control-Allow-Origin: http://localhost:8000\r\n" 
            data += "Access-Control-Allow-Methods: GET\r\n"
            data += "Access-Control-Allow-Credentials: true\r\n"
            data += "Access-Control-Allow-Headers: Content-Type\r\n"
            data += "Content-Type: application/json; charset=utf-8\r\n"
            data += "\r\n"  # we have finished our header
            data += json.dumps({'access_key': key}) # body of our response
            clientSocket.sendall(data.encode())
            clientSocket.shutdown(socket.SHUT_WR)
            

    except KeyboardInterrupt as e:
        print("\nShutting down...\n")
    except Exception as e:
        print(f"Error has occured: {e}")
    finally:
        serverSocket.close()

print("Access http://localhost:9000")
create_server()
