
from src.clustering import get_cluster_summary

results = get_cluster_summary(
    state="Punjab",
    commodity="Wheat",
    save_csv=True
)

print("\nCluster Summary:")

if not results.empty:
    print(results.to_string(index=False))
else:
    print("No cluster summary available.")
