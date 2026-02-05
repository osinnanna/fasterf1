import { useEffect, useState } from "preact/hooks";
import type { TrackData } from "../models/types";
import { RaceAPI } from "../api/raceApi";

export function useTrackData() {
    const [data, setData] = useState<TrackData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        let cancelled = false;

        async function load() {
            try {
                setLoading(true);
                const result = await RaceAPI.fetchTrackData();
                if (!cancelled) {
                    setData(result);
                    setError(null);
                }
            } catch (error) {
                if (!cancelled) {
                    setError(new Error("There was an issue fetching the TrackData"));
                }
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        }

        load();

        return () => {
            cancelled = true;
        };
    }, []);
    return { data, loading, error }
} 