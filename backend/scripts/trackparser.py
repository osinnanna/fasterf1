## We are getting track data and parsing it into json using the fast f1 package
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

track_points = []
for i, row in pos.iterrows():
    track_points.append({
        "x": row["X"],
        "y": row["Z"],
        "z": row["Y"]
    })


def find_elevation_at_corner(corner_x, corner_y, track_data):
    # since the corners data only has the x(left right) and y(depth) data, no Z(height) we have to derive it from the trackdata's point.

    distances = np.sqrt(
        (track_data["X"] - corner_x)**2 +
        (track_data["Y"] - corner_y)**2
    )

    closest_idx = distances.idxmin()
    return float(track_data.loc[closest_idx, "Z"])

corners = []
for _, corner in circuit_info.corners.iterrows():
    elevation = find_elevation_at_corner(corner["X"], corner["Y"], pos)
    corners.append({
        "number": str(corner["Number"]),
        "pos": {
            "x": float(corner["X"]),
            "y": elevation + 10,
            "z": float(corner["Y"])
        }
    })

data = {
    "trackName": session.event["Location"],
    "path": track_points,
    "corners": corners
}

with open("./../frontend/public/data/silverstone.json", "w") as f:
    json.dump(data, f)

print(f"Exported {session.event['Location']}")
print(f"there were {len(track_points)} track points")
print(f"No of corners: {len(corners)} corners")
