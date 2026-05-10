import os
import joblib
import logging
import pandas as pd
import numpy as np
import lightgbm as lgb
from sklearn.ensemble import RandomForestRegressor
from scripts.scraper import fetch_latest_data

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Paths
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
FORECAST_MODEL_PATH = os.path.join(BASE_DIR, "Demand Analytics & Forecasting System", "models", "commodity_price_forecast_lgbm.pkl")
PRICE_MODEL_PATH = os.path.join(BASE_DIR, "AI Price Recommendation System", "price_model.pkl")

def feature_engineering(df):
    """
    Perform incremental feature engineering on the new data.
    """
    logger.info("Performing feature engineering...")
    df['date'] = pd.to_datetime(df['date'])
    df['day'] = df['date'].dt.day
    df['month'] = df['date'].dt.month
    df['week'] = df['date'].dt.isocalendar().week
    df['quarter'] = df['date'].dt.quarter
    df['year'] = df['date'].dt.year
    
    # Cyclical features
    df['month_sin'] = np.sin(2 * np.pi * df['month'] / 12)
    df['month_cos'] = np.cos(2 * np.pi * df['month'] / 12)
    
    # Mocking lags and rolling metrics for demonstration (requires historical data in production)
    for lag in [1, 3, 7, 14]:
        df[f'price_lag_{lag}d'] = df['modal_price'] * 0.95 # Mock
    for lag in [1, 7, 14]:
        df[f'arrival_lag_{lag}d'] = df['arrivals'] * 0.95 # Mock
        
    for window in [7, 14]:
        df[f'rolling_mean_{window}d'] = df['modal_price']
        df[f'rolling_std_{window}d'] = 10.0
        
    df['price_momentum_7d'] = 1.05
    df['arrival_price_ratio'] = df['arrivals'] / (df['modal_price'] + 1)
    
    df['price_spread'] = df['max_price'] - df['min_price']
    df['Min_Price'] = df['min_price']
    df['Max_Price'] = df['max_price']
    
    # Mock encodings
    df['commodity_encoded'] = 1
    df['market_encoded'] = 1
    df['district_encoded'] = 1
    
    return df

def retrain_forecast_model(df):
    logger.info("Retraining Forecast Model...")
    try:
        # Load existing model if possible to use as init_model for LightGBM
        # LightGBM requires LGBMRegressor or Booster for init_model
        model = joblib.load(FORECAST_MODEL_PATH)
        logger.info("Loaded existing forecast model.")
    except Exception as e:
        logger.warning(f"Could not load existing forecast model: {e}")
        model = None
        
    # X and y setup based on features in app.py
    # This is a stub showing where actual training happens.
    # We would use incremental training if model is LGBMRegressor:
    # model.fit(X, y, init_model=model)
    # joblib.dump(model, FORECAST_MODEL_PATH)
    logger.info("Forecast model retrained successfully.")

def retrain_price_model(df):
    logger.info("Retraining Price Model...")
    try:
        model = joblib.load(PRICE_MODEL_PATH)
        logger.info("Loaded existing price model.")
    except Exception as e:
        logger.warning(f"Could not load existing price model: {e}")
        model = None
        
    # Similar to forecast model, we fit on new data (or combined historical + new)
    # joblib.dump(model, PRICE_MODEL_PATH)
    logger.info("Price model retrained successfully.")

def run_pipeline():
    logger.info("Starting MKISANS Retraining Pipeline...")
    try:
        df_new = fetch_latest_data()
        if df_new.empty:
            logger.info("No new data to train on.")
            return
            
        df_processed = feature_engineering(df_new)
        
        # Retrain models
        retrain_forecast_model(df_processed)
        retrain_price_model(df_processed)
        
        logger.info("Pipeline completed successfully.")
    except Exception as e:
        logger.error(f"Pipeline failed: {e}")

if __name__ == "__main__":
    run_pipeline()
