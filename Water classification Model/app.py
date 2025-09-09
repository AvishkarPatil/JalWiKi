import streamlit as st
import numpy as np
import joblib

# Load model and scaler
rf_model = joblib.load("final_water_quality_rf_model.pkl")
scaler = joblib.load("scaler.pkl")

feature_order = ['pH', 'TDS (mg/l)', 'Turbidity (NTU)', 'Depth (m)', 'Flow Discharge (L/min)']

def predict_water_combined(sample):
    # Quick threshold check
    if 6.5 <= sample['pH'] <= 8.5 and sample['TDS (mg/l)'] <= 500 and sample['Turbidity (NTU)'] <= 5:
        return "Safe"
    
    # Random Forest prediction
    sample_array = np.array([sample[feat] for feat in feature_order]).reshape(1, -1)
    sample_scaled = scaler.transform(sample_array)
    pred = rf_model.predict(sample_scaled)[0]
    return "Safe" if pred == 1 else "Unsafe"

# Streamlit UI
st.title("Water Potability Prediction")

st.sidebar.header("Input Water Features")
pH = st.sidebar.slider("pH", 0.0, 14.0, 7.0)
TDS = st.sidebar.slider("TDS (mg/l)", 0, 2000, 400)
Turbidity = st.sidebar.slider("Turbidity (NTU)", 0.0, 20.0, 3.0)
Depth = st.sidebar.slider("Depth (m)", 0.0, 10.0, 2.0)
Flow = st.sidebar.slider("Flow Discharge (L/min)", 0, 200, 50)

sample = {
    'pH': pH,
    'TDS (mg/l)': TDS,
    'Turbidity (NTU)': Turbidity,
    'Depth (m)': Depth,
    'Flow Discharge (L/min)': Flow
}

if st.button("Predict"):
    result = predict_water_combined(sample)
    st.success(f"The water is: {result}")
