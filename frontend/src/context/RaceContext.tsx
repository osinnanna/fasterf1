import { h, createContext } from "preact";
import type { LapData, TrackData } from "../models/types";
import { useRaceData } from "../hooks/useRaceData";
import { useTrackData } from "../hooks/useTrackData";
import { useContext } from "preact/hooks";


interface RaceContextValue {
    lapData: LapData | null;
    trackData: TrackData | null;
    loading: boolean;
    error: Error | null;
}

const RaceContext = createContext<RaceContextValue | undefined>(undefined);

export function RaceProvider({ children }: {children : any}) {
    const { data: lapData, loading: lapLoading, error: lapError } = useRaceData();
    const { data: trackData, loading: trackLoading, error: trackError } = useTrackData();

    const value: RaceContextValue = {
        lapData,
        trackData,
        loading: lapLoading || trackLoading,
        error: lapError || trackError,
    };

    return <RaceContext.Provider value={value}>{children}</RaceContext.Provider>;
}

export function useRace() {
    const context = useContext(RaceContext);
    if (!context) {
        throw new Error("useRace must be used within RaceProvider");
    }
    return context;
}