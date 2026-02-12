export class RaceAPI {
    static async fetchTrackData() {
        const response = await fetch("/data/silverstone.json");
        if (!response.ok) throw new Error("Failed to Fetch the track data");
        return response.json();
    }
    static async fetchRace() {
        const response = await fetch("/data/silverstone_race_lap_1.json");
        if (!response.ok) throw new Error("Failed to fetch the RaceData")
        return response.json();
    }
}