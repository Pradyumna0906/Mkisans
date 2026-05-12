# 🌾 MKISANS Machine Learning Module

This module provides AI-driven price intelligence for farmers, helping them understand market trends and set fair prices for their crops.

## 🚀 Features
- **Fair Price Recommendation**: Analyzes current market spreads and historical data to recommend a fair selling price.
- **Future Price Forecasting**: Predicts the next week's price trends using a LightGBM model.
- **Fairness Status**: Automatically compares market prices with AI recommendations to guide farmers.

## 🛠️ Setup & Execution
1. Ensure you have Python 3.10+ installed.
2. Run the automated startup script:
   ```bash
   run_ml_service.bat
   ```
3. The API will be available at `http://localhost:8000`.

## 📂 Project Structure
- `app.py`: FastAPI server exposing the prediction endpoints.
- `AI Price Recommendation System/`: Contains encoders and prediction notebooks.
- `Demand Analytics & Forecasting System/`: Contains the primary LightGBM forecasting model.
- `scripts/`: Contains the retraining pipeline and data scrapers.

## 📱 Integration
The mobile app calls the following endpoints:
- `POST /recommend-price`: For fair price status.
- `POST /predict-demand`: For future price trends.
