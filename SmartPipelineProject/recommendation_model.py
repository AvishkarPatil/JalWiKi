class RecommendationModel:
    def __init__(self):
        pass  

    def predict(self, data):
        recommendations = []
        for _, row in data.iterrows():
            actions = []
            if row.get('Leakage_Flag', 0) == 1 or row.get('Anomaly', 0) == 1:
                actions.append("Inspect this pipeline for leaks immediately.")
            if row.get('Flow_Rate', 0) > 50 and row.get('Pressure', 0) < 2:
                actions.append("Possible burst or leak downstream.")
            if row.get('Operational_Hours', 0) > 1000:
                actions.append("Schedule preventive maintenance.")
            if row.get('Temperature', 0) > 70 or row.get('Vibration', 0) > 0.5:
                actions.append("Overheating or pump wear risk.")
            if not actions:
                actions.append("No issues detected.")
            recommendations.append(actions)
        return recommendations
    
   

