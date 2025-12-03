import urllib.request
import json
import time

BASE_URL = "http://localhost:8080/api"

def register():
    url = f"{BASE_URL}/auth/register"
    payload = {
        "name": "Test User 7",
        "email": "test7@example.com",
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
            print(f"Register Status: {response.status}")
            body = json.loads(response.read().decode('utf-8'))
            return body.get("token")
    except urllib.error.HTTPError as e:
        print(f"Register Failed: {e.code} - {e.read().decode('utf-8')}")
        return None

def submit_metrics(token):
    url = f"{BASE_URL}/v1/health/daily"
    payload = {
        "date": "2025-12-03",
        "sleepHours": 8.0,
        "sleepEfficiency": 95,
        "trainingLoadAcute": 5,
        "restingHeartRate": 60,
        "hrvMs": 50,
        "ironIntakeScore": 4,
        "energyLevel": 4,
        "source": "MANUAL"
    }
    data = json.dumps(payload).encode('utf-8')
    req = urllib.request.Request(url, data=data, headers={
        'Content-Type': 'application/json',
        'Authorization': f'Bearer {token}'
    })
    
    try:
        with urllib.request.urlopen(req) as response:
            print(f"Submit Metrics Status: {response.status}")
            print(response.read().decode('utf-8'))
    except urllib.error.HTTPError as e:
        print(f"Submit Metrics Failed: {e.code} - {e.read().decode('utf-8')}")

def get_readiness(token):
    url = f"{BASE_URL}/v1/readiness/current"
    req = urllib.request.Request(url, headers={
        'Authorization': f'Bearer {token}'
    })
    
    try:
        with urllib.request.urlopen(req) as response:
            print(f"Get Readiness Status: {response.status}")
            print(response.read().decode('utf-8'))
    except urllib.error.HTTPError as e:
        print(f"Get Readiness Failed: {e.code} - {e.read().decode('utf-8')}")

if __name__ == "__main__":
    print("Starting Verification Flow...")
    token = register()
    if token:
        print(f"Got Token: {token[:20]}...")
        time.sleep(1) # Give a moment for async things if any
        submit_metrics(token)
        time.sleep(1)
        get_readiness(token)
    else:
        print("Could not get token, aborting.")
