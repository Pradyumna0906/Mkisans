import requests
from bs4 import BeautifulSoup
import datetime

url = "https://agmarknet.gov.in/SearchCmmMkt.aspx"

session = requests.Session()
response = session.get(url)
soup = BeautifulSoup(response.text, 'html.parser')

# Get viewstate and event validation
viewstate = soup.find('input', {'name': '__VIEWSTATE'})['value']
viewstategenerator = soup.find('input', {'name': '__VIEWSTATEGENERATOR'})['value']
eventvalidation = soup.find('input', {'name': '__EVENTVALIDATION'})['value']

print("Successfully retrieved ASP.NET state variables.")
