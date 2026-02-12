import { useState, useEffect } from "react";
import type { RaceData } from "../model/types";
import { RaceAPI } from "../api/raceApi";


export function useRaceData() {
    const [data, setData] = useState<RaceData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        let cancelled = false;

        async function load() {
            try {
                setLoading(true);
                const result = await RaceAPI.fetchRace();
                if (!cancelled) {
                    setData(result);
                    setError(null);
                }
            } catch (error) {
                if (!cancelled) {
                    setError(new Error("There was an error fetching RaceData"))
                }
            } finally {
                if (!cancelled) {
                    setLoading(false)
                }
            }
        }

        load();

        return () => {
            cancelled = true;
        };
    }, []);
    return { data, loading, error}
}