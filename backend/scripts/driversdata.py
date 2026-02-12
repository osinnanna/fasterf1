#%%
import fastf1

session = fastf1.get_session(2023, "Silverstone", "Q")
session.load()

driver_codes = {}


for num in session.drivers:
    driver_codes[num] = session.get_driver(num)["Abbreviation"]
# %%

for num, driver_abbreviation in driver_codes.items():
    # print(driver_abbreviation)
    target_driver_lap = session.laps.pick_drivers(driver_abbreviation)
    drivers_fastest_lap = target_driver_lap.pick_fastest()
    if drivers_fastest_lap is not None:
        telemetry = drivers_fastest_lap.get_telemetry()
        print(f"The Drivers: {driver_abbreviation}, has a fastest Time of {drivers_fastest_lap["LapTime"]}")
        print(f"The Drivers: {driver_abbreviation}, has {len(telemetry)} rows")


# %%
session.drivers
