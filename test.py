import requests
data = {"Hello": "World"}

response = requests.post("http://localhost:8080/api/data", json=data)
print(response)