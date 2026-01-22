#%%

import json
import numpy as np
import fastf1

session = fastf1.get_session(2023, "Silverstone", "Q")
session.load()

lap = session.laps.pick_fastest()
assert lap is not None
pos = lap.get_pos_data()

circuit_info = session.get_circuit_info()
assert circuit_info is not None

#%%
track_points = []
for i, row in pos.iterrows():
    track_points.append({
        "x": row["X"],
        "y": 0,
        "z": row["Y"]
    })

corners = []
for _, corner in circuit_info.corners.iterrows():
    corners.append({
        "number": str(corner["Number"]),
        "pos": {"x": float(corner["X"]), "y": 10, "z": float(corner["Y"])}
    })

data = {
    "trackName": session.event["Location"],
    "path": track_points,
    "corners": corners
}

with open("../json/silverstone.json", "w") as f:
    json.dump(data, f)
# %%
