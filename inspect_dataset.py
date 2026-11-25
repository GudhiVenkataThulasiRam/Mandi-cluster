
import pandas as pd
from pathlib import Path

# Dataset folder
DATA_FOLDER = Path(__file__).resolve().parent / "dataset"

# All five datasets
files = list(DATA_FOLDER.glob("*.csv"))

for file in files:

    print("\n" + "=" * 70)
    print("DATASET:", file.name)
    print("=" * 70)

    try:
        df = pd.read_csv(file, nrows=5)

        print("\nCOLUMN NAMES:")
        print(df.columns.tolist())

        print("\nDATA TYPES:")
        print(df.dtypes)

        print("\nFIRST 5 ROWS:")
        print(df.to_string(index=False))

    except Exception as e:
        print("ERROR:", e)
