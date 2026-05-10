import requests
import re
import urllib3

urllib3.disable_warnings()

js = requests.get('https://agmarknet.gov.in/static/js/main.17af7b54.js', verify=False).text

headers = re.findall(r'headers:\{(.*?)\}', js)
print("Headers definitions:", headers[:10])

tokens = re.findall(r'localStorage\.getItem\((.*?)\)', js)
print("LocalStorage items accessed:", list(set(tokens)))
