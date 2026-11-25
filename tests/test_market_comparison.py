
from src.clustering import compare_markets

# Test market comparison
results = compare_markets(
    state="Punjab",
    commodity="Wheat"
)

print("\nMarket Comparison Results:")

if not results.empty:
    print(results.to_string(index=False))
    print("\nTotal Matching Markets:", len(results))
else:
    print("No matching markets found.")
