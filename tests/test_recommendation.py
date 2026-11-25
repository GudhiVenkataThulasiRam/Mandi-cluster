
from src.recommendation import (
    get_market_recommendations,
    get_available_states,
    get_available_commodities,
    get_available_districts
)

# Test 1: Available states
print("\nAvailable States:")
print(get_available_states()[:10])

# Test 2: Available commodities in Punjab
print("\nAvailable Commodities in Punjab:")
print(get_available_commodities("Punjab")[:10])

# Test 3: Available districts for Punjab Wheat
print("\nAvailable Districts:")
print(get_available_districts("Punjab", "Wheat")[:10])

# Test 4: Valid recommendation
print("\nValid Recommendation Test:")

results = get_market_recommendations(
    state="Punjab",
    commodity="Wheat",
    district=None,
    top_n=5
)

print(results["message"])
print(results["markets"].head().to_string(index=False))

# Test 5: Invalid state
print("\nInvalid State Test:")

try:
    get_market_recommendations(
        state="InvalidState",
        commodity="Wheat"
    )
except ValueError as error:
    print("Validation Passed:", error)

# Test 6: Invalid commodity
print("\nInvalid Commodity Test:")

try:
    get_market_recommendations(
        state="Punjab",
        commodity="InvalidCommodity"
    )
except ValueError as error:
    print("Validation Passed:", error)

# Test 7: Invalid top_n
print("\nInvalid top_n Test:")

try:
    get_market_recommendations(
        state="Punjab",
        commodity="Wheat",
        top_n=0
    )
except ValueError as error:
    print("Validation Passed:", error)
