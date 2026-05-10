import os
import requests
import pandas as pd
import datetime
import logging
import urllib3

urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Paths
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
RAW_DATA_PATH = os.path.join(BASE_DIR, "Demand Analytics & Forecasting System", "data", "raw", "mp_data.csv")

def fetch_agmarknet_api_data(date_str):
    """
    Fetches real AGMARKNET data using the backend JSON API.
    URL: https://api.agmarknet.gov.in/v1/prices-and-arrivals/commodity-wise/daily-report-state
    Method: GET
    Params: date (DD-MMM-YYYY), stateIds (19 for MP)
    """
    url = "https://api.agmarknet.gov.in/v1/prices-and-arrivals/commodity-wise/daily-report-state"
    params = {
        "date": date_str,
        "stateIds": "19"
    }
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'application/json'
    }
    
    logger.info(f"Fetching API data from {url} with params {params}")
    try:
        response = requests.get(url, params=params, headers=headers, verify=False, timeout=120)
        response.raise_for_status()
        data = response.json()
        
        if not data.get('success'):
            logger.warning(f"API returned success=false: {data.get('message')}")
            return pd.DataFrame()
            
        markets = data.get('markets', [])
        logger.info(f"Fetched {len(markets)} markets data from API.")
        return parse_api_response(markets, date_str)
        
    except Exception as e:
        logger.error(f"Failed to fetch data from API: {e}")
        return pd.DataFrame()

def parse_api_response(markets, date_str):
    """
    Parses the JSON response into the schema required by the training data.
    """
    records = []
    
    for market in markets:
        market_name = market.get('marketName', '')
        for group in market.get('commodityGroups', []):
            group_name = group.get('groupName', '')
            for commodity in group.get('commodities', []):
                commodity_name = commodity.get('commodityName', '')
                for item in commodity.get('data', []):
                    record = {
                        "State Name": "Madhya Pradesh",
                        "District Name": "", # API does not return District natively in this view
                        "Market Name": market_name,
                        "Variety": item.get('variety', ''),
                        "Group": group_name,
                        "Arrivals (Tonnes)": item.get('arrivals', 0),
                        "Min Price (Rs./Quintal)": item.get('minimumPrice', 0),
                        "Max Price (Rs./Quintal)": item.get('maximumPrice', 0),
                        "Modal Price (Rs./Quintal)": item.get('modalPrice', 0),
                        "Reported Date": date_str,
                        "Commodity_File": commodity_name,
                        "Arrivals": "",
                        "Min Price": "",
                        "Max Price": "",
                        "Modal Price": ""
                    }
                    records.append(record)
                    
    df = pd.DataFrame(records)
    logger.info(f"Parsed {len(df)} records into DataFrame.")
    return df

def append_to_raw_data(df):
    if df.empty:
        logger.info("No data to append to CSV.")
        return
        
    if os.path.exists(RAW_DATA_PATH):
        df.to_csv(RAW_DATA_PATH, mode='a', header=False, index=False)
        logger.info(f"Appended {len(df)} records to {RAW_DATA_PATH}")
    else:
        os.makedirs(os.path.dirname(RAW_DATA_PATH), exist_ok=True)
        df.to_csv(RAW_DATA_PATH, index=False)
        logger.info(f"Created {RAW_DATA_PATH} and saved {len(df)} records.")

def fetch_latest_data():
    """
    Called by the retrain pipeline.
    Fetches real API AGMARKNET data, appends it to raw training data CSV, 
    and returns a standardized dataframe for immediate feature engineering.
    """
    logger.info("Starting API-based AGMARKNET extraction pipeline...")
    

    today = datetime.datetime.now()

    safe_date = today - datetime.timedelta(days=3)

    date_str = safe_date.strftime("%Y-%m-%d")
    
    df = fetch_agmarknet_api_data(date_str)
    
    if df.empty:
        return pd.DataFrame()
        
    append_to_raw_data(df)
    
    # Convert to the standardized format expected by retrain_pipeline.py
    retrain_df = pd.DataFrame()
    retrain_df['state'] = df['State Name']
    retrain_df['district'] = df['District Name']
    retrain_df['market'] = df['Market Name']
    retrain_df['commodity'] = df['Commodity_File']
    retrain_df['arrivals'] = pd.to_numeric(df['Arrivals (Tonnes)'], errors='coerce').fillna(0)
    retrain_df['min_price'] = pd.to_numeric(df['Min Price (Rs./Quintal)'], errors='coerce').fillna(0)
    retrain_df['max_price'] = pd.to_numeric(df['Max Price (Rs./Quintal)'], errors='coerce').fillna(0)
    retrain_df['modal_price'] = pd.to_numeric(df['Modal Price (Rs./Quintal)'], errors='coerce').fillna(0)
    retrain_df['date'] = pd.to_datetime(df['Reported Date'],errors='coerce')    
    return retrain_df

if __name__ == "__main__":
    fetch_latest_data()
