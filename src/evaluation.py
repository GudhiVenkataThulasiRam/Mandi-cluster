
from sklearn.metrics import (
    silhouette_score,
    davies_bouldin_score,
    calinski_harabasz_score
)


def evaluate_clustering(X_scaled, labels):
    """
    Evaluate clustering performance using three metrics.
    """

    if len(set(labels)) < 2:
        raise ValueError("At least two clusters are required.")

    silhouette = silhouette_score(
        X_scaled,
        labels,
        sample_size=3000,
        random_state=42
    )

    davies_bouldin = davies_bouldin_score(
        X_scaled,
        labels
    )

    calinski_harabasz = calinski_harabasz_score(
        X_scaled,
        labels
    )

    results = {
        "Silhouette Score": silhouette,
        "Davies-Bouldin Index": davies_bouldin,
        "Calinski-Harabasz Score": calinski_harabasz
    }

    print("Clustering Evaluation Results")
    print("--------------------------------")

    for metric, score in results.items():
        print(f"{metric}: {score:.4f}")

    return results
    