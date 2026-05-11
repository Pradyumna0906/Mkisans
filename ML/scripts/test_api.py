import requests
import urllib3

urllib3.disable_warnings()

BASE_URL = "https://api.agmarknet.gov.in/v1"

headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept': 'application/json, text/plain, */*',
    'Accept-Language': 'en-US,en;q=0.9',
    'Origin': 'https://agmarknet.gov.in',
    'Referer': 'https://agmarknet.gov.in/',
    'Connection': 'keep-alive',
    'Sec-Fetch-Dest': 'empty',
    'Sec-Fetch-Mode': 'cors',
    'Sec-Fetch-Site': 'same-site'
}

endpoints = [
    "/daily-price-arrival/report",
    "/prices-and-arrivals/market-report/daily",
    "/prices-and-arrivals/date-wise/specific-commodity",
    "/prices-and-arrivals/market-report/specific",
    "/prices-and-arrivals/commodity-wise/daily-report-state"
]

for endpoint in endpoints:
    url = f"{BASE_URL}{endpoint}"
    print(f"\n--- GET {url} ---")
    try:
        r = requests.get(url, headers=headers, verify=False, timeout=5)
        print("Status:", r.status_code)
        if r.status_code == 200:
            print("Response:", r.text[:200])
    except Exception as e:
        print("Error:", e)
    
    print(f"\n--- POST {url} ---")
    payload = {"state_id": "MP"} # Try dummy
    try:
        r = requests.post(url, json=payload, headers=headers, verify=False, timeout=5)
        print("Status:", r.status_code)
        if r.status_code == 200:
            print("Response:", r.text[:200])
    except Exception as e:
        print("Error:", e)
