
import numpy as np
import pandas as pd

from src.clustering import predict_clusters
from src.preprocessing import (
    load_feature_dataset,
    prepare_clustering_data
)


# Get available states
def get_available_states(df=None):

    if df is None:
        df = load_feature_dataset()

    states = sorted(
        df["state"].dropna().astype(str).str.strip().unique()
    )

    return states


# Get available commodities
def get_available_commodities(state=None, df=None):

    if df is None:
        df = load_feature_dataset()

    if state:
        df = df[
            df["state"].str.strip().str.casefold()
            == state.strip().casefold()
        ]

    commodities = sorted(
        df["commodity"].dropna().astype(str).str.strip().unique()
    )

    return commodities


# Get available districts
def get_available_districts(state, commodity, df=None):

    if df is None:
        df = load_feature_dataset()

    filtered = df[
        (df["state"].str.strip().str.casefold()
         == state.strip().casefold())
        &
        (df["commodity"].str.strip().str.casefold()
         == commodity.strip().casefold())
    ]

    districts = sorted(
        filtered["district"].dropna().astype(str).str.strip().unique()
    )

    return districts


# Validate farmer inputs
def validate_inputs(state, commodity, district=None, top_n=5, df=None):

    if not isinstance(state, str) or not state.strip():
        raise ValueError("Please provide a valid state name.")

    if not isinstance(commodity, str) or not commodity.strip():
        raise ValueError("Please provide a valid commodity name.")

    if district is not None:
        if not isinstance(district, str) or not district.strip():
            raise ValueError("Please provide a valid district name.")

    if isinstance(top_n, bool) or not isinstance(top_n, int) or top_n <= 0:
        raise ValueError("top_n must be a positive integer.")

    if df is None:
        df = load_feature_dataset()

    available_states = get_available_states(df)

    if state.strip().casefold() not in [
        item.casefold() for item in available_states
    ]:
        raise ValueError(
            f"State '{state}' is not available in the dataset."
        )

    available_commodities = get_available_commodities(state, df)

    if commodity.strip().casefold() not in [
        item.casefold() for item in available_commodities
    ]:
        raise ValueError(
            f"Commodity '{commodity}' is not available in {state}."
        )

    if district is not None:
        available_districts = get_available_districts(
            state,
            commodity,
            df
        )

        if district.strip().casefold() not in [
            item.casefold() for item in available_districts
        ]:
            raise ValueError(
                f"District '{district}' has no matching records "
                f"for {commodity} in {state}."
            )


# Get market recommendations for a farmer
def get_market_recommendations(
    state,
    commodity,
    district=None,
    top_n=5
):

    # Load the dataset only once
    df = load_feature_dataset()

    # Validate inputs using the loaded dataset
    validate_inputs(
        state=state,
        commodity=commodity,
        district=district,
        top_n=top_n,
        df=df
    )

    # Filter by state and commodity
    filtered = df[
        (df["state"].str.strip().str.casefold()
         == state.strip().casefold())
        &
        (df["commodity"].str.strip().str.casefold()
         == commodity.strip().casefold())
    ].copy()

    # Apply district filter if provided
    if district is not None:
        filtered = filtered[
            filtered["district"].str.strip().str.casefold()
            == district.strip().casefold()
        ]

    if filtered.empty:
        return {
            "markets": pd.DataFrame(),
            "cluster_summary": pd.DataFrame(),
            "message": "No matching markets found."
        }

    # Prepare metadata and numerical features
    metadata, X = prepare_clustering_data(filtered)

    # Predict clusters only once
    labels = predict_clusters(X)

    # Create market comparison results
    results = metadata.copy()

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

    # Convert log-transformed values to original units
    for column in display_columns:
        results[column] = np.expm1(filtered[column].values)

    # total_records was not log-transformed
    results["total_records"] = filtered["total_records"].values

    # Add cluster labels
    results["cluster"] = labels

    # Rank markets by historical average price
    ranked_markets = results.sort_values(
        by="avg_price",
        ascending=False
    ).reset_index(drop=True)

    ranked_markets.insert(
        0,
        "rank",
        range(1, len(ranked_markets) + 1)
    )

    # Select top N markets
    top_markets = ranked_markets.head(top_n).copy()

    # Prepare cluster summary using the same filtered data
    summary_data = filtered.copy()

    summary_data["cluster"] = labels

    summary_data["avg_price"] = np.expm1(
        summary_data["avg_price"]
    )

    summary_data["avg_arrival"] = np.expm1(
        summary_data["avg_arrival"]
    )

    summary_data["total_arrival"] = np.expm1(
        summary_data["total_arrival"]
    )

    cluster_summary = summary_data.groupby("cluster").agg(
        number_of_markets=("market", "nunique"),
        average_price=("avg_price", "mean"),
        average_arrival=("avg_arrival", "mean"),
        total_arrival=("total_arrival", "sum"),
        average_records=("total_records", "mean")
    ).reset_index()

    return {
        "markets": top_markets,
        "cluster_summary": cluster_summary,
        "message": (
            f"Found {len(filtered)} matching markets "
            f"for {commodity} in {state}."
        )
    }
