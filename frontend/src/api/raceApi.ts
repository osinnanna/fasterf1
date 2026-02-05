export class RaceAPI {
    static async fetchVerData() {
        const response = await fetch("/data/verstappen_lap.json");
        if (!response.ok) throw new Error("Failed to fetch Verstappen Data");
        return response.json();
    }
    static async fetchTrackData() {
        const response = await fetch("/data/silverstone.json");
        if (!response.ok) throw new Error("Failed to Fetch the track data");
        return response.json();
    }
}