
from src.clustering import rank_markets, compare_markets

# Export market comparison
comparison = compare_markets(
    state="Punjab",
    commodity="Wheat",
    save_csv=True
)

# Export market ranking
ranking = rank_markets(
    state="Punjab",
    commodity="Wheat",
    save_csv=True
)

print("\nTop 10 Market Rankings:")

if not ranking.empty:
    print(ranking.head(10).to_string(index=False))

print("\nTotal Ranked Markets:", len(ranking))
