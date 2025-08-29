import streamlit as st
import joblib
import sys
import os
sys.path.append(os.path.dirname(__file__))
from recommendation_model import RecommendationModel
import numpy as np
import re
import pandas as pd
from tensorflow.keras.models import load_model
from tensorflow.keras import losses


# ==============================
# Load Models
# ==============================
leak_prediction_rf = joblib.load("models/leak_prediction_rf.pkl")
predictive_maintenance_rf = joblib.load("models/predictive_maintenance_rf.pkl")
isolation_forest_model = joblib.load("models/isolation_forest.pkl")
lstm_model = load_model("models/lstm_model.h5", custom_objects={'mse': losses.MeanSquaredError()})

# ==============================
# Location Codes
# ==============================
LOCATION_CODES = [
    f"Zone_{z}_Block_{b}_Pipe_{p}"
    for z in range(1, 6)
    for b in range(1, 6)
    for p in range(1, 6)
]

def parse_location_code(code: str):
    match = re.match(r"Zone_(\d+)_Block_(\d+)_Pipe_(\d+)", code)
    if match:
        return int(match.group(1)), int(match.group(2)), int(match.group(3))
    return 1, 1, 1

# ==============================
# Streamlit Page Setup
# ==============================
st.set_page_config(page_title="Smart Pipeline Monitoring Dashboard", layout="centered")
st.title("💧 Smart Pipeline Monitoring Dashboard")

# Sidebar navigation
option = st.sidebar.selectbox(
    "Choose a Model",
    ["Leak Prediction", "Predictive Maintenance", "Anomaly Detection", "Recommendations", "LSTM Forecasting"]
)

# ==============================
# Leak Prediction
# ==============================
if option == "Leak Prediction":
    st.header("🚨 Leak Prediction")
    st.markdown("Enter pipeline sensor readings and select location details.")

    # Location selection
    location_code = st.selectbox("Select Location Code", LOCATION_CODES)
    zone, block, pipe = parse_location_code(location_code)
    location_code_encoded = LOCATION_CODES.index(location_code)

    # Inputs for numerical features
    pressure = st.number_input("Pipe Pressure (PSI)", value=0.0)
    flow_rate = st.number_input("Flow Rate (L/s)", value=0.0)
    temperature = st.number_input("Temperature (°C)", value=0.0)
    vibration = st.number_input("Vibration Level (Hz)", value=0.0)
    rpm = st.number_input("Pump/Valve RPM", value=0.0)
    operational_hours = st.number_input("Operational Hours", value=0.0)
    latitude = st.number_input("Latitude", value=0.0, format="%.6f")
    longitude = st.number_input("Longitude", value=0.0, format="%.6f")

    # Build feature dataframe
    features = pd.DataFrame([[pressure, flow_rate, temperature, vibration, rpm,
                              operational_hours, zone, block, pipe,
                              location_code_encoded, latitude, longitude]],
                            columns=['Pressure', 'Flow_Rate', 'Temperature', 'Vibration', 'RPM',
                                     'Operational_Hours', 'Zone', 'Block', 'Pipe',
                                     'Location_Code', 'Latitude', 'Longitude'])

    if st.button("🔍 Predict Leak"):
        prediction = leak_prediction_rf.predict(features)
        if prediction[0] == 1:
            st.error("⚠️ Leak Detected! Immediate Action Required.")
        else:
            st.success("✅ No Leak Detected.")

# ==============================
# Predictive Maintenance
# ==============================
elif option == "Predictive Maintenance":
    st.header("🛠 Predictive Maintenance")
    st.markdown("Enter maintenance parameters to check if servicing is required.")

    pressure = st.number_input("Pipe Pressure (PSI)", value=0.0)
    flow_rate = st.number_input("Flow Rate (L/s)", value=0.0)
    temperature = st.number_input("Pipe Temperature (°C)", value=0.0)
    vibration = st.number_input("Vibration Level (Hz)", value=0.0)
    rpm = st.number_input("Pump/Valve RPM", value=0.0)
    operational_hours = st.number_input("Operational Hours", value=0.0)

    if st.button("🔧 Predict Maintenance"):
        try:
            X_input = np.array([[pressure, flow_rate, temperature, vibration, rpm, operational_hours]])
            prediction = predictive_maintenance_rf.predict(X_input)
            st.success(f"⚡ Failure Risk Score: {prediction[0]:.2f}")
        except Exception as e:
            st.error(f"Prediction Error: {e}")


# ==============================
# Anomaly Detection
# ==============================
elif option == "Anomaly Detection":
    st.header("🔍 Anomaly Detection")
    st.markdown("Check for unusual sensor readings.")

    # Collect all 6 features used in training
    pressure = st.number_input("Pressure", value=0.0)
    flow_rate = st.number_input("Flow Rate", value=0.0)
    temperature = st.number_input("Temperature", value=0.0)
    vibration = st.number_input("Vibration", value=0.0)
    rpm = st.number_input("RPM", value=0.0)
    operational_hours = st.number_input("Operational Hours", value=0.0)

    if st.button("🚨 Detect Anomaly"):
        try:
            # Build feature array
            X_input = np.array([[pressure, flow_rate, temperature, vibration, rpm, operational_hours]])
            
            # Predict anomaly
            prediction = isolation_forest_model.predict(X_input)
            if prediction[0] == -1:
                st.error("⚠️ Anomaly Detected!")
            else:
                st.success("✅ No Anomaly Found.")
        except Exception as e:
            st.error(f"Prediction Error: {e}")


# ==============================
# Recommendations
# ==============================
elif option == "Recommendations":
    st.header("💡 Pipeline Recommendations")
    st.markdown("AI-based pipeline maintenance and optimization suggestions.")

    leakage_flag = st.number_input("Leakage Flag (0 or 1)", value=1, min_value=0, max_value=1)
    anomaly = st.number_input("Anomaly (0 or 1)", value=0, min_value=0, max_value=1)
    flow_rate = st.number_input("Flow Rate (L/s)", value=0.0)
    pressure = st.number_input("Pressure (Bar)", value=0.0)
    operational_hours = st.number_input("Operational Hours", value=0)
    temperature = st.number_input("Temperature (°C)", value=0.0)
    vibration = st.number_input("Vibration (Hz)", value=0.0)

    if st.button("💡 Get Recommendations"):
        try:
            input_data = pd.DataFrame([{
                "Leakage_Flag": leakage_flag,
                "Anomaly": anomaly,
                "Flow_Rate": flow_rate,
                "Pressure": pressure,
                "Operational_Hours": operational_hours,
                "Temperature": temperature,
                "Vibration": vibration
            }])
            rec_model = RecommendationModel()
            recs = rec_model.predict(input_data)
            st.subheader("🔍 Recommendations:")
            for rec in recs:
                st.info(f"💡 {rec}")
        except Exception as e:
            st.error(f"Recommendation Error: {e}")

# ==============================
# LSTM Forecasting
# ==============================
elif option == "LSTM Forecasting":
    st.header("📈 Pipeline Forecasting (LSTM)")
    seq_length = 10
    features = ['Pressure', 'Flow_Rate', 'Temperature', 'Vibration', 'RPM', 'Operational_Hours']

    st.markdown(f"Enter the last {len(features)} readings (repeated to form sequence of length {seq_length})")

    # Collect feature inputs
    input_seq = []
    for feat in features:
        val = st.number_input(f"{feat}", value=0.0)
        input_seq.append(val)

    # Build proper sequence
    X_input = np.array([input_seq] * seq_length).reshape(1, seq_length, len(features))

    if st.button("📊 Forecast"):
        try:
            forecast = lstm_model.predict(X_input)
            st.success(f"📉 Forecasted Value: {forecast[0][0]:.2f}")
        except Exception as e:
            st.error(f"Forecasting Error: {e}")
