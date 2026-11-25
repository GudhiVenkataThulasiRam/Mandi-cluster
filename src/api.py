
from flask import Flask, request, jsonify
from flask_cors import CORS

from src.recommendation import (
    get_available_states,
    get_available_commodities,
    get_available_districts,
    get_market_recommendations
)


# Initialize Flask application
app = Flask(__name__)

# Enable frontend-backend communication
CORS(app)


# Convert DataFrame into JSON-friendly records
def dataframe_to_records(df):
    return df.astype(object).where(df.notna(), None).to_dict(
        orient="records"
    )


# Home API
@app.route("/", methods=["GET"])
def home():
    return jsonify({
        "status": "success",
        "message": "MandiCluster API is running!"
    })


# Get available states
@app.route("/api/states", methods=["GET"])
def states():

    try:
        available_states = get_available_states()

        return jsonify({
            "status": "success",
            "states": available_states
        })

    except Exception as error:
        return jsonify({
            "status": "error",
            "message": str(error)
        }), 500


# Get commodities for a state
@app.route("/api/commodities", methods=["GET"])
def commodities():

    state = request.args.get("state")

    if not state:
        return jsonify({
            "status": "error",
            "message": "State parameter is required."
        }), 400

    try:
        available_commodities = get_available_commodities(state)

        return jsonify({
            "status": "success",
            "commodities": available_commodities
        })

    except Exception as error:
        return jsonify({
            "status": "error",
            "message": str(error)
        }), 500


# Get districts for a state and commodity
@app.route("/api/districts", methods=["GET"])
def districts():

    state = request.args.get("state")
    commodity = request.args.get("commodity")

    if not state or not commodity:
        return jsonify({
            "status": "error",
            "message": "State and commodity are required."
        }), 400

    try:
        available_districts = get_available_districts(
            state,
            commodity
        )

        return jsonify({
            "status": "success",
            "districts": available_districts
        })

    except Exception as error:
        return jsonify({
            "status": "error",
            "message": str(error)
        }), 500


# Get market recommendations
@app.route("/api/recommendations", methods=["GET"])
def recommendations():

    state = request.args.get("state")
    commodity = request.args.get("commodity")
    district = request.args.get("district")

    top_n_value = request.args.get("top_n", "5")

    if not state or not commodity:
        return jsonify({
            "status": "error",
            "message": "State and commodity are required."
        }), 400

    try:
        top_n = int(top_n_value)

        results = get_market_recommendations(
            state=state,
            commodity=commodity,
            district=district,
            top_n=top_n
        )

        return jsonify({
            "status": "success",
            "message": results["message"],
            "markets": dataframe_to_records(results["markets"]),
            "cluster_summary": dataframe_to_records(
                results["cluster_summary"]
            )
        })

    except ValueError as error:
        return jsonify({
            "status": "error",
            "message": str(error)
        }), 400

    except Exception as error:
        return jsonify({
            "status": "error",
            "message": str(error)
        }), 500


# Run Flask application
if __name__ == "__main__":
    app.run(
        host="127.0.0.1",
        port=5000,
        debug=True
    )
