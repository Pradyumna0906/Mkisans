from fastapi import FastAPI
import pandas as pd
import joblib
import logging
from contextlib import asynccontextmanager
from apscheduler.schedulers.background import BackgroundScheduler
from scripts.retrain_pipeline import run_pipeline

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Global variables for models
forecast_model = None
price_model = None

def load_models():
    global forecast_model, price_model
    logger.info("Loading models into memory...")
    try:
        forecast_model = joblib.load(
            r"Demand Analytics & Forecasting System\models\commodity_price_forecast_lgbm.pkl"
        )
        price_model = joblib.load(
            r"AI Price Recommendation System\price_model.pkl"
        )
        logger.info("Models loaded successfully.")
    except Exception as e:
        logger.error(f"Error loading models: {e}")

def scheduled_task():
    logger.info("Running scheduled retraining task...")
    run_pipeline()
    load_models() # Hot swap models in memory
    logger.info("Scheduled task completed.")

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Load models initially
    load_models()
    
    # Setup scheduler for daily retraining
    scheduler = BackgroundScheduler()
    scheduler.add_job(scheduled_task, 'interval', hours=24)
    scheduler.start()
    
    yield
    
    scheduler.shutdown()

app = FastAPI(lifespan=lifespan)


# =========================================================
# FEATURES
# =========================================================

FORECAST_FEATURES = [

    "state",
    "district",
    "market",
    "commodity",

    "arrivals",
    "min_price",
    "max_price",

    "day",
    "month",
    "week",
    "quarter",
    "year",

    "month_sin",
    "month_cos",

    "price_lag_1d",
    "price_lag_3d",
    "price_lag_7d",
    "price_lag_14d",

    "arrival_lag_1d",
    "arrival_lag_7d",
    "arrival_lag_14d",

    "rolling_mean_7d",
    "rolling_mean_14d",

    "rolling_std_7d",
    "rolling_std_14d",

    "price_momentum_7d",
    "arrival_price_ratio"
]

PRICE_FEATURES = [

    "commodity_encoded",
    "market_encoded",
    "district_encoded",

    "Min_Price",
    "Max_Price",

    "price_spread",

    "month",
    "week"
]

# =========================================================
# HOME
# =========================================================

@app.get("/")

def home():

    return {

        "message": "MKISANS ML APIs Running"

    }

# =========================================================
# DEMAND FORECASTING API
# =========================================================

@app.post("/predict-demand")

def predict_demand(data: dict):

    df = pd.DataFrame([data])

    cat_cols = [
        "state",
        "district",
        "market",
        "commodity"
    ]

    for col in cat_cols:
        df[col] = df[col].astype("category")

    prediction = forecast_model.predict(
        df[FORECAST_FEATURES]
    )[0]

    return {

        "predicted_future_price": float(prediction)

    }

# =========================================================
# PRICE RECOMMENDATION API
# =========================================================

@app.post("/recommend-price")

def recommend_price(data: dict):

    df = pd.DataFrame([data])

    prediction = price_model.predict(
        df[PRICE_FEATURES]
    )[0]

    return {

        "recommended_price": float(prediction)

    }