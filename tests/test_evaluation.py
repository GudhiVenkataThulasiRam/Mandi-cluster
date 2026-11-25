
from src.preprocessing import load_feature_dataset, prepare_clustering_data
from src.clustering import load_clustering_models
from src.evaluation import evaluate_clustering

# Step 1: Load dataset
df = load_feature_dataset()

# Step 2: Prepare features
metadata, X = prepare_clustering_data(df)

# Step 3: Load saved model and scaler
kmeans_model, scaler = load_clustering_models()

# Step 4: Scale features
X_scaled = scaler.transform(X)

# Step 5: Predict cluster labels
labels = kmeans_model.predict(X_scaled)

# Step 6: Evaluate the model
results = evaluate_clustering(X_scaled, labels)

print("\nEvaluation Test Completed Successfully!")
