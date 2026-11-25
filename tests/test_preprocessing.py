
from src.preprocessing import (
    load_feature_dataset,
    prepare_clustering_data
)

# Test 1: Load the engineered dataset
df = load_feature_dataset()

print("\nFirst 5 records:")
print(df.head())

# Test 2: Prepare clustering features
metadata, X = prepare_clustering_data(df)

print("\nFirst 5 metadata records:")
print(metadata.head())

print("\nFirst 5 numerical feature records:")
print(X.head())

# Final verification
print("\nPreprocessing Test Completed Successfully!")
print("Metadata Shape:", metadata.shape)
print("Feature Shape:", X.shape)
