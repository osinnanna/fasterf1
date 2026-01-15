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

def rotate(xy, *, angle):
    rot_mat = np.array([
        [np.cos(angle), np.sin(angle)],
        [-np.sin(angle), np.cos(angle)]
    ])
    return np.matmul(xy, rot_mat)
track_angle = circuit_info.rotation / 180 * np.pi
print(circuit_info.rotation)

track_points = []
for i, row in pos.iterrows():
    x_rot, y_rot = rotate([row["X"], row["Y"]], angle=track_angle)
    track_points.append({
        "x": float(x_rot),
        "y": 0,
        "z": float(y_rot)
    })

corners = []
for _, corner in circuit_info.corners.iterrows():
    cx, cy = rotate([corner["X"], corner["Y"]], angle=track_angle)
    corners.append({
        "number": str(corner["Number"]),
        "pos": {"x": float(cx), "y": 10, "z": float(cy)}
    })

data = {
    "trackName": session.event["Location"],
    "path": track_points,
    "corners": corners
}

with open("silverstone.json", "w") as f:
    json.dump(data, f)