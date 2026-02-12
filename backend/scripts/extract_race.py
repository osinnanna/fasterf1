import fastf1
import numpy as np
import json
import pandas as pd

fastf1.Cache.enable_cache("C:/Users/osii/Desktop/FLAVOURTOWN/fasterf1/backend/cache/")
session = fastf1.get_session(2023, "Silverstone", "R")
session.load()

target_lap = 1
FPS = 25

def get_times_difference():
    first_driver = drivers_data[0]
    telemetry = first_driver['telemetry']

    print(f"\n=== Inspecting {first_driver['id']}'s timestamps ===")
    print(f"First 10 timestamps:")
    print(telemetry['Time'].head(10))

    print(f"\nLast 10 timestamps:")
    print(telemetry['Time'].tail(10))

    time_diffs = telemetry['Time'].diff().dt.total_seconds()
    print(f"\nTime gaps between samples (first 10):")
    print(time_diffs.head(10))

    print(f"\nAverage gap: {time_diffs.mean():.4f} seconds")
    print(f"Min gap: {time_diffs.min():.4f} seconds")
    print(f"Max gap: {time_diffs.max():.4f} seconds")

def resample_telemetry(telemetry_df, *, target_fps):
    time_seconds = telemetry_df["Time"].dt.total_seconds().values

    start_time = time_seconds[0]
    end_time = time_seconds[-1]
    frame_interval = 1.0/target_fps

    uniform_times  = np.arange(start_time, end_time, frame_interval)

    resampled_data = {
        "t": uniform_times,
        "x": np.interp(uniform_times, time_seconds, telemetry_df["X"].values),
        "y": np.interp(uniform_times, time_seconds, telemetry_df["Y"].values),
        "z": np.interp(uniform_times, time_seconds, telemetry_df["Z"].values),
        "speed": np.interp(uniform_times, time_seconds, telemetry_df["Speed"].values),
    }

    return pd.DataFrame(resampled_data)


print(f"Extracting telemetry for Lap {target_lap}")

drivers_data = []

for driver_number in session.results["DriverNumber"]:
    driver_info = session.get_driver(driver_number)
    abbreviation = driver_info["Abbreviation"]
    team_color = driver_info["TeamColor"]

    laps = session.laps.pick_drivers(abbreviation)

    lap_1 = laps[laps["LapNumber"] == target_lap]

    if lap_1.empty:
        print(f"Skipping {abbreviation} - No data found for Lap {target_lap}")
        continue

    telemetry = lap_1.get_telemetry()

    resampled = resample_telemetry(telemetry, target_fps=FPS)

    drivers_data.append({
        "id": abbreviation,
        "color": f"#{team_color}",
        "telemetry": resampled.to_dict(orient="records")
    })

    print(f"Proccessed {abbreviation}: {len(telemetry)} -> {len(resampled)} data points")


print(f"Done Processed {len(drivers_data)} drivers")

with open("./../silverstone_race_lap_1.json", "w") as f:
    json.dump(drivers_data, f)