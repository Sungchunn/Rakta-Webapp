#!/usr/bin/env python3
"""
Load Test Script for Device Webhook Endpoints
==============================================
Sends 10,000 synthetic webhook requests to test backend volume handling.

Features:
- Randomizes dates within the last 5 years
- Randomizes health metrics (HR: 50-100, Sleep: 4-10 hrs)
- Alternates between Garmin and Apple Health payload formats
- Uses async/await with configurable concurrency (default: 50)
- Reports success rate and average response time

Usage:
    python scripts/load_test_device_data.py

Requirements:
    pip install aiohttp
"""

import asyncio
import aiohttp
import json
import random
import time
from datetime import datetime, timedelta
from dataclasses import dataclass
from typing import Optional

# Configuration
BASE_URL = "http://localhost:8080"
LOGIN_ENDPOINT = "/api/auth/login"
GARMIN_ENDPOINT = "/api/webhooks/garmin"
APPLE_ENDPOINT = "/api/webhooks/apple"

# Test user credentials (from DataSeeder)
TEST_USER_EMAIL = "test@rakta.app"
TEST_USER_PASSWORD = "password123"

# Load test parameters
TOTAL_REQUESTS = 10000
CONCURRENCY = 50  # Number of concurrent requests


@dataclass
class LoadTestStats:
    """Tracks load test statistics."""
    total_sent: int = 0
    success_count: int = 0
    failure_count: int = 0
    total_response_time_ms: float = 0.0
    errors: list = None

    def __post_init__(self):
        if self.errors is None:
            self.errors = []

    @property
    def success_rate(self) -> float:
        if self.total_sent == 0:
            return 0.0
        return (self.success_count / self.total_sent) * 100

    @property
    def avg_response_time_ms(self) -> float:
        if self.success_count == 0:
            return 0.0
        return self.total_response_time_ms / self.success_count


def generate_random_date() -> str:
    """Generate a random date within the last 5 years."""
    days_back = random.randint(0, 5 * 365)
    random_date = datetime.now() - timedelta(days=days_back)
    return random_date.strftime("%Y-%m-%d")


def generate_garmin_payload() -> dict:
    """Generate a Garmin Health API webhook payload."""
    date = generate_random_date()
    rhr = random.randint(50, 100)
    
    # Sleep components (in seconds)
    deep_sleep = random.randint(1800, 7200)    # 30 min to 2 hours
    light_sleep = random.randint(10800, 21600)  # 3 to 6 hours
    rem_sleep = random.randint(3600, 7200)      # 1 to 2 hours
    awake = random.randint(0, 1800)             # 0 to 30 min

    return {
        "dailies": [
            {
                "summaryId": f"sum_{random.randint(100000, 999999)}",
                "calendarDate": date,
                "steps": random.randint(2000, 15000),
                "restingHeartRateInBeatsPerMinute": rhr,
                "averageHeartRateInBeatsPerMinute": rhr + random.randint(10, 30),
                "maxHeartRateInBeatsPerMinute": rhr + random.randint(50, 100),
                "timeOffsetSleepRespiration": 3600
            }
        ],
        "sleeps": [
            {
                "summaryId": f"sleep_{random.randint(100000, 999999)}",
                "calendarDate": date,
                "deepSleepSeconds": deep_sleep,
                "lightSleepSeconds": light_sleep,
                "remSleepSeconds": rem_sleep,
                "awakeSleepSeconds": awake
            }
        ]
    }


def generate_apple_payload() -> dict:
    """Generate an Apple Health Export payload."""
    date = generate_random_date()
    rhr = random.randint(50, 100)
    sleep_hours = round(random.uniform(4.0, 10.0), 2)

    return {
        "data": {
            "metrics": [
                {
                    "name": "sleep_analysis",
                    "units": "hr",
                    "data": [
                        {
                            "date": f"{date} 07:00:00",
                            "qty": sleep_hours,
                            "source": "Apple Watch"
                        }
                    ]
                },
                {
                    "name": "resting_heart_rate",
                    "units": "bpm",
                    "data": [
                        {
                            "date": f"{date} 08:00:00",
                            "qty": rhr,
                            "source": "Apple Watch"
                        }
                    ]
                }
            ]
        }
    }


async def login(session: aiohttp.ClientSession) -> Optional[str]:
    """Login and get JWT token."""
    login_data = {
        "email": TEST_USER_EMAIL,
        "password": TEST_USER_PASSWORD
    }
    
    try:
        async with session.post(
            f"{BASE_URL}{LOGIN_ENDPOINT}",
            json=login_data,
            headers={"Content-Type": "application/json"}
        ) as response:
            if response.status == 200:
                data = await response.json()
                token = data.get("accessToken") or data.get("token")
                print(f"✅ Login successful. Token received.")
                return token
            else:
                text = await response.text()
                print(f"❌ Login failed: {response.status} - {text}")
                return None
    except Exception as e:
        print(f"❌ Login error: {e}")
        return None


async def send_webhook(
    session: aiohttp.ClientSession,
    token: str,
    stats: LoadTestStats,
    request_id: int,
    semaphore: asyncio.Semaphore
):
    """Send a single webhook request."""
    async with semaphore:
        # Randomly choose between Garmin and Apple
        use_garmin = random.choice([True, False])
        
        if use_garmin:
            endpoint = GARMIN_ENDPOINT
            payload = generate_garmin_payload()
        else:
            endpoint = APPLE_ENDPOINT
            payload = generate_apple_payload()
        
        headers = {
            "Content-Type": "application/json",
            "Authorization": f"Bearer {token}"
        }
        
        start_time = time.time()
        
        try:
            async with session.post(
                f"{BASE_URL}{endpoint}",
                json=payload,
                headers=headers
            ) as response:
                elapsed_ms = (time.time() - start_time) * 1000
                stats.total_sent += 1
                
                if response.status == 200:
                    stats.success_count += 1
                    stats.total_response_time_ms += elapsed_ms
                else:
                    stats.failure_count += 1
                    text = await response.text()
                    if len(stats.errors) < 10:  # Keep only first 10 errors
                        stats.errors.append(f"Request {request_id}: {response.status} - {text[:100]}")
        except Exception as e:
            stats.failure_count += 1
            stats.total_sent += 1
            if len(stats.errors) < 10:
                stats.errors.append(f"Request {request_id}: {str(e)}")


async def run_load_test():
    """Run the load test."""
    print("=" * 60)
    print("🔥 DEVICE WEBHOOK LOAD TEST")
    print("=" * 60)
    print(f"Target: {BASE_URL}")
    print(f"Total Requests: {TOTAL_REQUESTS:,}")
    print(f"Concurrency: {CONCURRENCY}")
    print("=" * 60)
    
    stats = LoadTestStats()
    
    # Create connection pool with higher limits
    connector = aiohttp.TCPConnector(limit=CONCURRENCY + 10, limit_per_host=CONCURRENCY + 10)
    timeout = aiohttp.ClientTimeout(total=30)
    
    async with aiohttp.ClientSession(connector=connector, timeout=timeout) as session:
        # Step 1: Login
        print("\n📡 Authenticating...")
        token = await login(session)
        
        if not token:
            print("❌ Cannot proceed without authentication.")
            return
        
        # Step 2: Create semaphore for concurrency control
        semaphore = asyncio.Semaphore(CONCURRENCY)
        
        # Step 3: Generate and send requests
        print(f"\n🚀 Starting load test...")
        start_time = time.time()
        
        tasks = []
        for i in range(TOTAL_REQUESTS):
            task = asyncio.create_task(
                send_webhook(session, token, stats, i + 1, semaphore)
            )
            tasks.append(task)
            
            # Progress indicator every 1000 requests
            if (i + 1) % 1000 == 0:
                print(f"   📊 Queued: {i + 1:,}/{TOTAL_REQUESTS:,}")
        
        # Wait for all tasks to complete
        await asyncio.gather(*tasks)
        
        total_time = time.time() - start_time
    
    # Print results
    print("\n" + "=" * 60)
    print("📈 LOAD TEST RESULTS")
    print("=" * 60)
    print(f"Total Requests Sent:    {stats.total_sent:,}")
    print(f"Successful (200 OK):    {stats.success_count:,}")
    print(f"Failed:                 {stats.failure_count:,}")
    print(f"Success Rate:           {stats.success_rate:.2f}%")
    print(f"Avg Response Time:      {stats.avg_response_time_ms:.2f} ms")
    print(f"Total Test Duration:    {total_time:.2f} seconds")
    print(f"Throughput:             {stats.total_sent / total_time:.2f} req/sec")
    print("=" * 60)
    
    if stats.errors:
        print("\n⚠️  Sample Errors (first 10):")
        for error in stats.errors:
            print(f"   - {error}")
    
    # Summary verdict
    print("\n" + "=" * 60)
    if stats.success_rate >= 99.0:
        print("✅ PASS: Backend handled volume test successfully!")
    elif stats.success_rate >= 95.0:
        print("⚠️  WARN: Mostly successful, but some failures occurred.")
    else:
        print("❌ FAIL: Significant failures detected. Review backend logs.")
    print("=" * 60)


if __name__ == "__main__":
    asyncio.run(run_load_test())
