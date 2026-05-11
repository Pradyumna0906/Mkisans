import requests
import urllib3
import datetime

urllib3.disable_warnings()

headers = {'User-Agent': 'Mozilla/5.0'}
date = "2024-01-31"

endpoints = [
    f"https://api.agmarknet.gov.in/v1/prices-and-arrivals/commodity-wise/daily-report-state?date={date}&stateIds=19",
    f"https://api.agmarknet.gov.in/v1/prices-and-arrivals/market-report/daily?date={date}&stateId=19",
    f"https://api.agmarknet.gov.in/v1/daily-price-arrival/report?date={date}&state=19"
]

for url in endpoints:
    print(f"\n--- GET {url} ---")
    try:
        r = requests.get(url, headers=headers, verify=False, timeout=10)
        print("Status:", r.status_code)
        if r.status_code == 200:
            print("Response:", r.text[:300])
        else:
            print("Response:", r.text[:100])
    except Exception as e:
        print("Error:", e)
