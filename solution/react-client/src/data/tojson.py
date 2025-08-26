import json

with open("place_ids.json") as f:
    data = json.load(f)

ids = [item["id"] for item in data]

with open("place_ids.json", "w") as f:
    json.dump(ids, f, indent=2)
