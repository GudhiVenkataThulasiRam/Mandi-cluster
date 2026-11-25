
import json
import base64
from pathlib import Path

ROOT = Path(__file__).resolve().parent
NOTEBOOKS = ROOT / "notebooks"
VISUALIZATIONS = ROOT / "visualizations"

NOTEBOOKS_TO_EXTRACT = {
    "04_exploratory_data_analysis.ipynb": "EDA",
    "06_clustering.ipynb": "Clustering",
    "07_model_evaluation.ipynb": "Evaluation"
}

for notebook_name, folder_name in NOTEBOOKS_TO_EXTRACT.items():
    notebook_path = NOTEBOOKS / notebook_name
    output_folder = VISUALIZATIONS / folder_name
    output_folder.mkdir(parents=True, exist_ok=True)

    if not notebook_path.exists():
        print(f"Notebook not found: {notebook_name}")
        continue

    with open(notebook_path, "r", encoding="utf-8") as file:
        notebook = json.load(file)

    count = 0

    for cell_index, cell in enumerate(notebook.get("cells", []), start=1):
        for output_index, output in enumerate(cell.get("outputs", []), start=1):
            image_data = output.get("data", {}).get("image/png")

            if image_data:
                if isinstance(image_data, list):
                    image_data = "".join(image_data)

                image_bytes = base64.b64decode(image_data)

                image_name = f"{folder_name}_{cell_index}_{output_index}.png"
                image_path = output_folder / image_name
                image_path.write_bytes(image_bytes)

                count += 1

    print(f"{folder_name}: {count} images extracted")

print("Extraction completed.")
