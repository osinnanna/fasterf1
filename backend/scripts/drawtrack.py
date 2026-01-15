import matplotlib.pyplot as plt
import numpy as np

import fastf1

# Getting a session of an f1 race from the fastf1 package and assigning it to a new variable called session
session = fastf1.get_session(2023, "Silverstone", "Q")
session.load()

# Getting the fastest lap (FROM POSITION) and assinging it to a new variable called lab
lap = session.laps.pick_fastest()
# Get the positions data from that LAP -> assign to new pos variable
pos = lap.get_pos_data() # type: ignore

circuit_info = session.get_circuit_info()

def rotate(xy, *, angle):
    rot_mat = np.array([
        [np.cos(angle), np.sin(angle)],
        [-np.sin(angle), np.cos(angle)]
    ])
    return np.matmul(xy, rot_mat)

track = pos.loc[:, ("X", "Y")].to_numpy() # type: ignore

track_angle = circuit_info.rotation / 180 * np.pi # type:ignore

rotated_track = rotate(track, angle=track_angle)
plt.plot(rotated_track[:, 0], rotated_track[:, 1])

offset_vector = [500, 0]

for _, corner in circuit_info.corners.iterrows(): # type: ignore

    txt = f"{corner["Number"]}{corner["Letter"]}"

    offset_angle = corner["Angle"] / 180 * np.pi

    offset_x, offset_y = rotate(offset_vector, angle=offset_angle)

    text_x = corner["X"] + offset_x
    text_y = corner["Y"] + offset_y

    text_x, text_y = rotate([text_x, text_y], angle=track_angle)

    track_x, track_y = rotate([corner["X"], corner["Y"]], angle=track_angle)

    plt.scatter(text_x, text_y, color="grey", s=140)
    plt.plot([track_x, text_x], [track_y, text_y], color="grey")

    plt.text(text_x, text_y, txt, va="center_baseline", ha="center", size="small", color="white")

plt.title(session.event["Location"])
plt.xticks([])
plt.yticks([])
plt.axis("equal")
plt.show()