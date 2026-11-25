
from pathlib import Path
import re

import joblib
import numpy as np
import pandas as pd

from src.preprocessing import (
    CLUSTERING_FEATURES,
    load_feature_dataset,
    prepare_clustering_data
)


# Project paths
PROJECT_ROOT = Path(__file__).resolve().parent.parent
MODEL_PATH = PROJECT_ROOT / "models"
RESULTS_PATH = PROJECT_ROOT / "results"

KMEANS_PATH = MODEL_PATH / "kmeans_model.pkl"
SCALER_PATH = MODEL_PATH / "scaler.pkl"


# Save results as CSV
def save_results_to_csv(results, filename):

    if results.empty:
        print("No results available to export.")
        return None

    RESULTS_PATH.mkdir(parents=True, exist_ok=True)

    file_path = RESULTS_PATH / filename

    results.to_csv(file_path, index=False)

    print("Results exported successfully!")
    print("File saved at:", file_path)

    return file_path


# Load saved clustering models
def load_clustering_models():

    if not KMEANS_PATH.exists():
        raise FileNotFoundError(
            f"KMeans model not found: {KMEANS_PATH}"
        )

    if not SCALER_PATH.exists():
        raise FileNotFoundError(
            f"Scaler not found: {SCALER_PATH}"
        )

    kmeans_model = joblib.load(KMEANS_PATH)
    scaler = joblib.load(SCALER_PATH)

    print("KMeans model loaded successfully.")
    print("Scaler loaded successfully.")

    return kmeans_model, scaler


# Predict cluster labels
def predict_clusters(X, kmeans_model=None, scaler=None):

    if not isinstance(X, pd.DataFrame):
        raise TypeError("X must be a pandas DataFrame.")

    missing_columns = [
        column for column in CLUSTERING_FEATURES
        if column not in X.columns
    ]

    if missing_columns:
        raise ValueError(
            f"Missing clustering features: {missing_columns}"
        )

    X = X[CLUSTERING_FEATURES].copy()

    if not np.isfinite(X.to_numpy(dtype=float)).all():
        raise ValueError(
            "Clustering data contains missing or infinite values."
        )

    if kmeans_model is None or scaler is None:
        kmeans_model, scaler = load_clustering_models()

    X_scaled = scaler.transform(X)

    cluster_labels = kmeans_model.predict(X_scaled)

    print("Cluster prediction completed.")
    print("Total records classified:", len(cluster_labels))

    return cluster_labels


# Compare markets for a selected state and commodity
def compare_markets(state, commodity, district=None, save_csv=False):

    df = load_feature_dataset()

    filtered = df[
        (df["state"].str.strip().str.casefold() == state.strip().casefold())
        &
        (df["commodity"].str.strip().str.casefold()
         == commodity.strip().casefold())
    ].copy()

    if district:
        filtered = filtered[
            filtered["district"].str.strip().str.casefold()
            == district.strip().casefold()
        ]

    if filtered.empty:
        print("No matching markets found.")
        return pd.DataFrame()

    metadata, X = prepare_clustering_data(filtered)

    labels = predict_clusters(X)

    results = metadata.copy()

    # Convert log-transformed features to original units
    display_columns = [
        "avg_price",
        "median_price",
        "std_price",
        "min_price",
        "max_price",
        "avg_arrival",
        "median_arrival",
        "total_arrival"
    ]

    for column in display_columns:
        results[column] = np.expm1(filtered[column].values)

    # total_records was not log-transformed
    results["total_records"] = filtered["total_records"].values

    results["cluster"] = labels

    results = results.sort_values(
        by="avg_price",
        ascending=False
    ).reset_index(drop=True)

    # Optional CSV export
    if save_csv:
        filename = (
            f"{state}_{commodity}_market_comparison.csv"
        )
        filename = re.sub(r"[^a-zA-Z0-9_-]", "_", filename)

        save_results_to_csv(results, filename)

    return results


# Summarize cluster characteristics
def get_cluster_summary(state, commodity, save_csv=False):

    df = load_feature_dataset()

    filtered = df[
        (df["state"].str.strip().str.casefold() == state.strip().casefold())
        &
        (df["commodity"].str.strip().str.casefold()
         == commodity.strip().casefold())
    ].copy()

    if filtered.empty:
        print("No matching markets found.")
        return pd.DataFrame()

    metadata, X = prepare_clustering_data(filtered)

    labels = predict_clusters(X)

    filtered["cluster"] = labels

    summary_data = filtered.copy()

    # Convert transformed values into original units
    display_columns = [
        "avg_price",
        "avg_arrival",
        "total_arrival"
    ]

    for column in display_columns:
        summary_data[column] = np.expm1(summary_data[column])

    summary = summary_data.groupby("cluster").agg(
        number_of_markets=("market", "nunique"),
        average_price=("avg_price", "mean"),
        average_arrival=("avg_arrival", "mean"),
        total_arrival=("total_arrival", "sum"),
        average_records=("total_records", "mean")
    ).reset_index()

    if save_csv:
        filename = f"{state}_{commodity}_cluster_summary.csv"
        filename = re.sub(r"[^a-zA-Z0-9_-]", "_", filename)

        save_results_to_csv(summary, filename)

    return summary


# Rank markets by historical average price
def rank_markets(state, commodity, district=None, save_csv=False):

    results = compare_markets(
        state=state,
        commodity=commodity,
        district=district,
        save_csv=False
    )

    if results.empty:
        return results

    results = results.sort_values(
        by="avg_price",
        ascending=False
    ).reset_index(drop=True)

    results.insert(
        0,
        "rank",
        range(1, len(results) + 1)
    )

    # Optional CSV export
    if save_csv:
        filename = f"{state}_{commodity}_market_ranking.csv"
        filename = re.sub(r"[^a-zA-Z0-9_-]", "_", filename)

        save_results_to_csv(results, filename)

    return results
