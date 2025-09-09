# 💧 Water Potability Prediction
Overview

This project predicts whether water is safe or unsafe for consumption using a Random Forest Machine Learning model. It aims to support public health and water conservation by enabling communities to detect water contamination early, especially in areas lacking laboratory testing facilities.

# The model uses key water quality parameters:

pH

Total Dissolved Solids (TDS in mg/l)

Turbidity (NTU)

Depth (m)

Flow Discharge (L/min)

Additionally, a threshold-based check ensures that obviously safe samples are immediately classified as Safe without unnecessary model computation.

# Features

✅ Interactive Web App: Built using Streamlit for real-time input and prediction.

✅ Random Forest Model: Trained on water quality data for accurate classification.

✅ Threshold-Based Quick Check: Instantly marks water as Safe if it meets standard safe limits.

✅ Reusable Model: Saved RandomForest and StandardScaler objects for future predictions.

✅ Expandable: Can handle batch inputs and be extended for additional features or deployment.



models/
 final_water_quality_rf_model.pkl
 scaler.pkl

Usage
Run the Streamlit App
streamlit run app.py


**Use the sidebar sliders to input water features: pH, TDS, Turbidity, Depth, Flow.**

Click Predict - See if the water is Safe or Unsafe.

Sample Safe Input
sample = {
    'pH': 7.0,
    'TDS (mg/l)': 400,
    'Turbidity (NTU)': 3,
    'Depth (m)': 2,
    'Flow Discharge (L/min)': 50
}


This input will be classified as Safe.

Model Details-

Algorithm: Random Forest Classifier

Accuracy: ~91% on test data

Cross-Validation: 5-fold, consistent performance

Additional Logic: Threshold-based check for obvious safe water


References-
https://www.kaggle.com/datasets/swekerr/water-quality-metrics-and-filter-performance-dataset?utm_

# Author 
GitHub Link: https://github.com/student-smritipandey