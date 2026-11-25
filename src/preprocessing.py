
from pathlib import Path
import numpy as np
import pandas as pd


# Project paths
PROJECT_ROOT = Path(__file__).resolve().parent.parent
DATASET_PATH = PROJECT_ROOT / "dataset"

FEATURE_FILE = DATASET_PATH / "market_features_engineered.csv"


# Metadata columns
METADATA_COLUMNS = [
    "state",
    "district",
    "market",
    "commodity"
]


# Numerical features used for clustering
CLUSTERING_FEATURES = [
    "avg_price",
    "median_price",
    "std_price",
    "min_price",
    "max_price",
    "avg_arrival",
    "median_arrival",
    "total_arrival",
    "total_records"
]


def load_feature_dataset(file_path=FEATURE_FILE):
    """Load the engineered market feature dataset."""

    if not Path(file_path).exists():
        raise FileNotFoundError(
            f"Feature dataset not found: {file_path}"
        )

    df = pd.read_csv(file_path)

    print("Feature Dataset Loaded Successfully!")
    print("Dataset Shape:", df.shape)

    return df


def prepare_clustering_data(df):
    """Validate and separate metadata and numerical features."""

    required_columns = METADATA_COLUMNS + CLUSTERING_FEATURES

    missing_columns = [
        col for col in required_columns
        if col not in df.columns
    ]

    if missing_columns:
        raise ValueError(
            f"Missing required columns: {missing_columns}"
        )

    metadata = df[METADATA_COLUMNS].copy()

    X = df[CLUSTERING_FEATURES].copy()

    X = X.replace([np.inf, -np.inf], np.nan)

    if X.isnull().any().any():
        raise ValueError(
            "Missing or infinite values found in clustering features."
        )

    print("Preprocessing Completed Successfully!")
    print("Metadata Shape:", metadata.shape)
    print("Numerical Features Shape:", X.shape)

    return metadata, X
