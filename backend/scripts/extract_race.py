import fastf1
import numpy as np
import json
import pandas as pd

fastf1.Cache.enable_cache("C:/Users/osii/Desktop/FLAVOURTOWN/fasterf1/backend/cache/")
session = fastf1.get_session(2023, "Silverstone", "R")
session.load()

target_lap = 1
FPS = 25

def resample_telemetry(telemetry_df, *, target_fps):
    time_seconds = telemetry_df["Time"].dt.total_seconds().values

    start_time = time_seconds[0]
    end_time = time_seconds[-1]
    frame_interval = 1.0/target_fps

    uniform_times  = np.arange(start_time, end_time, frame_interval)

    resampled_data = {
        "x": np.round(np.interp(uniform_times, time_seconds, telemetry_df["X"].values), 2),
        "y": np.round(np.interp(uniform_times, time_seconds, telemetry_df["Z"].values), 2),
        "z": np.round(np.interp(uniform_times, time_seconds, telemetry_df["Y"].values), 2),
        "speed": np.round(np.interp(uniform_times, time_seconds, telemetry_df["Speed"].values), 2),
    }

    return pd.DataFrame(resampled_data)


print(f"Extracting telemetry for Lap {target_lap}")

drivers_data = []

for driver_number in session.results["DriverNumber"]:
    driver_info = session.get_driver(driver_number)
    abbreviation = driver_info["Abbreviation"]
    team_color = driver_info["TeamColor"]
    team_name = driver_info["TeamName"]

    laps = session.laps.pick_drivers(abbreviation)
    lap_1 = laps[laps["LapNumber"] == target_lap]

    if lap_1.empty:
        print(f"Skipping {abbreviation} - No data found for Lap {target_lap}")
        continue

    telemetry = lap_1.get_telemetry()
    resampled = resample_telemetry(telemetry, target_fps=FPS)

    drivers_data.append({
        "id": abbreviation,
        "driverNumber": int(driver_number),
        "team": team_name,
        "color": f"#{team_color}",
        "finishTime": round(len(resampled) / FPS, 2),
        "telemetry": resampled.to_dict(orient="records")
    })

    print(f"Proccessed {abbreviation}: {len(telemetry)} -> {len(resampled)} data points")


print(f"Done Processed {len(drivers_data)} drivers")

max_finish_time = max(driver["finishTime"] for driver in drivers_data)
print(f"Longest lap time: {max_finish_time}")


# Final JSON Data
race_data = {
    "raceId": session.name,
    "fps": FPS,
    "maxDuration": max_finish_time,
    "drivers": [
        {
            "id": driver["id"],
            "driverNumber": driver["driverNumber"],
            "team": driver["team"],
            "color": driver["color"],
            "finishTime": driver["finishTime"],
            "telemetry": driver["telemetry"]
        }
        for driver in drivers_data
    ]
}


output_path = "./../frontend/public/data/silverstone_race_lap_1.json"
with open(output_path, "w") as f:
    json.dump(race_data, f, indent=2)

print(f"\n Exported to {output_path}")
print(f"{len(race_data["drivers"])} drivers")
print(f"Lap Times: {min(d["finishTime"] for d in drivers_data)}s - {max_finish_time}s")
print(f"{race_data["fps"]} FPS")