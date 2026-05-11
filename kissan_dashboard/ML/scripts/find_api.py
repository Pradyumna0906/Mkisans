import requests
import urllib3
import re
import json

urllib3.disable_warnings()

try:
    js = requests.get('https://agmarknet.gov.in/static/js/main.17af7b54.js', verify=False).text
    apis = list(set(re.findall(r'"(https?://[^"]+)"', js)))
    paths = list(set(re.findall(r'"(/[a-zA-Z0-9_]+/[^"]*)"', js)))
    
    with open('api_results.json', 'w') as f:
        json.dump({"apis": apis, "paths": paths}, f, indent=2)
except Exception as e:
    print("Error:", e)
