import urllib.request
import json

url = "http://localhost:8080/api/auth/register"
payload = {
    "name": "Test User 6",
    "email": "test6@example.com",
    "password": "password123",
    "age": 30,
    "gender": "MALE",
    "weight": 75.0,
    "city": "Test City"
}
data = json.dumps(payload).encode('utf-8')
req = urllib.request.Request(url, data=data, headers={'Content-Type': 'application/json'})

try:
    with urllib.request.urlopen(req) as response:
        if response.status in [200, 201]:
            body = response.read().decode('utf-8')
            json_body = json.loads(body)
            print("TOKEN_START")
            print(json_body["token"])
            print("TOKEN_END")
        else:
            print(f"Error: {response.status}")
except Exception as e:
    print(f"Exception: {e}")
