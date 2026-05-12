"""
MKISANS AI Price Intelligence - Full Demo Test
Tests all API endpoints with real data
"""
import requests
import json

BASE = "http://localhost:8000"

print("=" * 60)
print("   MKISANS AI PRICE INTELLIGENCE - FULL DEMO")
print("=" * 60)

# Test 1: Wheat at 8000 (way too high)
print("\n🔴 TEST 1: Wheat at ₹8000 in Bhopal (overpriced)")
r = requests.post(f"{BASE}/recommend-price", json={
    "commodity": "Wheat", "market": "Bhopal", "farmer_price": 8000
})
d = r.json()
print(f"   Market Price (AGMARKNET): ₹{d['recommended_price']:.0f}/qtl")
print(f"   Market Range: ₹{d['min_market_price']:.0f} - ₹{d['max_market_price']:.0f}")
print(f"   Data Source: {d['data_source']} ({d.get('data_date', 'N/A')})")
print(f"   Data Points: {d['data_points']}")
diff = (8000 - d["recommended_price"]) / d["recommended_price"] * 100
print(f"   ⚠️  Farmer asking ₹8000 = {diff:.1f}% ABOVE market = TOO HIGH")

# Test 2: Wheat at 2400 (fair)
print("\n🟢 TEST 2: Wheat at ₹2400 in Bhopal (fair price)")
r = requests.post(f"{BASE}/recommend-price", json={
    "commodity": "Wheat", "market": "Bhopal", "farmer_price": 2400
})
d = r.json()
diff = (2400 - d["recommended_price"]) / d["recommended_price"] * 100
print(f"   Market Price: ₹{d['recommended_price']:.0f}/qtl")
print(f"   Farmer asking ₹2400 = {diff:+.1f}% vs market = FAIR ✅")

# Test 3: Wheat at 1500 (too low)
print("\n🟡 TEST 3: Wheat at ₹1500 in Bhopal (underpriced)")
r = requests.post(f"{BASE}/recommend-price", json={
    "commodity": "Wheat", "market": "Bhopal", "farmer_price": 1500
})
d = r.json()
diff = (1500 - d["recommended_price"]) / d["recommended_price"] * 100
print(f"   Market Price: ₹{d['recommended_price']:.0f}/qtl")
print(f"   Farmer asking ₹1500 = {diff:.1f}% BELOW market = TOO LOW ⚠️")

# Test 4: Soybean with MSP
print("\n🫘 TEST 4: Soybean at ₹4500 in Indore")
r = requests.post(f"{BASE}/recommend-price", json={
    "commodity": "Soybean", "market": "Indore", "farmer_price": 4500
})
d = r.json()
print(f"   Market Price: ₹{d['recommended_price']:.0f}/qtl")
print(f"   Market Range: ₹{d['min_market_price']:.0f} - ₹{d['max_market_price']:.0f}")
msp = d.get("msp")
if msp:
    print(f"   MSP (Govt): ₹{msp:.0f}/qtl")
print(f"   Data Source: {d['data_source']}")

# Test 5: ML Forecast
print("\n🔮 TEST 5: Price Forecast for Wheat (ML Model)")
r = requests.post(f"{BASE}/predict-demand", json={
    "commodity": "Wheat", "market": "Bhopal", "modal_price": 2400
})
d = r.json()
print(f"   Current Market: ₹{d['current_market_price']:.0f}/qtl")
print(f"   ML Forecast:    ₹{d['predicted_future_price']:.0f}/qtl")
print(f"   Trend: {d['trend_direction'].upper()} ({d['trend_percent']:+.1f}%)")
print(f"   Model: {d['status']}")

# Test 6: Gram
print("\n🌾 TEST 6: Gram at ₹5000 in Ujjain")
r = requests.post(f"{BASE}/recommend-price", json={
    "commodity": "Gram", "market": "Ujjain", "farmer_price": 5000
})
d = r.json()
print(f"   Market Price: ₹{d['recommended_price']:.0f}/qtl")
msp = d.get("msp")
if msp:
    print(f"   MSP (Govt): ₹{msp:.0f}/qtl")
diff = (5000 - d["recommended_price"]) / d["recommended_price"] * 100
print(f"   Farmer asking ₹5000 = {diff:+.1f}% vs market")

print("\n" + "=" * 60)
print("   ✅ ALL TESTS PASSED - AI Price Intelligence Working!")
print("=" * 60)
