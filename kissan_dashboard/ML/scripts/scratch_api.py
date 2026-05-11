import requests
import re
import urllib3
import json

urllib3.disable_warnings()

js = requests.get('https://agmarknet.gov.in/static/js/main.17af7b54.js', verify=False).text

# Extract all string literals that look like paths
paths = re.findall(r'"(/[a-zA-Z0-9_/-]+)"', js)
paths = list(set(paths))

# Filter paths that might be related to market data, price, arrival, report
api_paths = [p for p in paths if any(kw in p.lower() for kw in ['market', 'price', 'arrival', 'report', 'data', 'daily'])]

print("Potential API endpoints found in JS bundle:")
for p in sorted(api_paths):
    print(p)
