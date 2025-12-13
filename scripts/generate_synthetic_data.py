import requests
import random
import datetime
import math
import json
import time

# Configuration
BASE_URL = "http://localhost:8080/api"
EMAIL = "user1@rakta.app"
PASSWORD = "password123"
DAYS_TO_GENERATE = 30

def login():
    url = f"{BASE_URL}/auth/login"
    payload = {
        "email": EMAIL,
        "password": PASSWORD
    }
    try:
        response = requests.post(url, json=payload)
        response.raise_for_status()
        data = response.json()
        print(f"Login successful for {EMAIL}")
        return data.get("token")
    except requests.exceptions.RequestException as e:
        print(f"Login failed: {e}")
        if response is not None:
            print(f"Response: {response.text}")
        return None

def generate_synthetic_data(token):
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }
    
    end_date = datetime.date.today()
    start_date = end_date - datetime.timedelta(days=DAYS_TO_GENERATE)
    
    current_date = start_date
    
    # Random walk start values
    rhr = 60
    hrv = 50
    sleep = 7.5
    
    success_count = 0
    
    print(f"Starting data generation from {start_date} to {end_date}...")
    
    while current_date <= end_date:
        # Simulate some trends/random walk
        rhr += random.randint(-2, 2)
        rhr = max(45, min(rhr, 85)) # Clamp
        
        hrv += random.randint(-5, 5)
        hrv = max(20, min(hrv, 120))
        
        sleep += random.uniform(-0.5, 0.5)
        sleep = max(4.0, min(sleep, 10.0))
        
        # Other metrics randomized
        training_load = random.randint(0, 200)
        hydration = round(random.uniform(1.0, 3.5), 1)
        energy_level = random.randint(20, 100)
        iron_intake = random.randint(0, 100) # Assuming score 0-100
        
        payload = {
            "date": current_date.isoformat(),
            "restingHeartRate": int(rhr),
            "hrvMs": int(hrv),
            "sleepHours": round(sleep, 2),
            "trainingLoadAcute": training_load,
            "hydrationLiters": hydration,
            "energyLevel": energy_level,
            "ironIntakeScore": iron_intake,
            "source": "SYNTHETIC_SCRIPT"
        }
        
        try:
            url = f"{BASE_URL}/v1/health/daily/sync-from-device"
            response = requests.post(url, json=payload, headers=headers)
            response.raise_for_status()
            print(f"[{current_date}] Synced: RHR={rhr}, Sleep={sleep:.2f}h")
            success_count += 1
        except requests.exceptions.RequestException as e:
            print(f"[{current_date}] Failed: {e}")
            if response is not None:
                print(f"Response: {response.text}")
                
        current_date += datetime.timedelta(days=1)
        
    print(f"\nCompleted! Successfully synced {success_count} days of data.")

def verify_dashboard(token):
    url = f"{BASE_URL}/dashboard/stats"
    headers = {
        "Authorization": f"Bearer {token}"
    }
    try:
        response = requests.get(url, headers=headers)
        response.raise_for_status()
        data = response.json()
        print("\n=== Dashboard Stats Verify ===")
        print(f"Total Donations: {data.get('totalDonations')}")
        trends = data.get('dailyTrends', [])
        print(f"Daily Trends Count: {len(trends)}")
        for i, point in enumerate(trends[:5]):
            print(f"  Day {i}: Date={point.get('date')}, Sleep={point.get('sleepHours')}, RHR={point.get('restingHeartRate')}")
    except requests.exceptions.RequestException as e:
        print(f"Dashboard stats fetch failed: {e}")
        if response is not None:
             print(f"Response: {response.text}")

if __name__ == "__main__":
    print("=== Rakta Synthetic Data Generator ===")
    token = login()
    if token:
        generate_synthetic_data(token)
        verify_dashboard(token)
    else:
        print("Exiting due to login failure.")
