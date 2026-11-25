
from src.preprocessing import load_feature_dataset, prepare_clustering_data
from src.clustering import load_clustering_models, predict_clusters

# Load dataset
df = load_feature_dataset()

# Prepare numerical features
metadata, X = prepare_clustering_data(df)

# Test model and scaler loading
kmeans_model, scaler = load_clustering_models()

# Predict clusters
labels = predict_clusters(X, kmeans_model, scaler)

# Display results
print("\nFirst 10 Predicted Cluster Labels:")
print(labels[:10])

print("\nClustering Test Completed Successfully!")
print("Total Predictions:", len(labels))
