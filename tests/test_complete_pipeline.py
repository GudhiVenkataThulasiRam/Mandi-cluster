
from src.preprocessing import load_feature_dataset, prepare_clustering_data
from src.clustering import load_clustering_models, predict_clusters
from src.evaluation import evaluate_clustering

# Load dataset
df = load_feature_dataset()

# Prepare features
metadata, X = prepare_clustering_data(df)

# Load trained models
kmeans_model, scaler = load_clustering_models()

# Predict clusters
labels = predict_clusters(X, kmeans_model, scaler)

# Scale features for evaluation
X_scaled = scaler.transform(X)

# Evaluate clustering
results = evaluate_clustering(X_scaled, labels)

# Combine metadata and predictions
final_results = metadata.copy()
final_results["cluster"] = labels

print("\nFinal Results:")
print(final_results.head())

print("\nPipeline Completed Successfully!")
print("Total Records:", len(final_results))
print("Cluster Distribution:")
print(final_results["cluster"].value_counts())
