import { createContext, useContext } from "react";
import type { RaceData, TrackData } from "../model/types";
import { useRaceData } from "../hooks/useRaceData";
import { useTrackData } from "../hooks/useTrackData";


interface RaceContextValue {
    raceData: RaceData | null;
    trackData: TrackData | null;
    loading: boolean;
    error: Error | null;
}

const RaceContext = createContext<RaceContextValue | undefined>(undefined);

export function RaceProvider({ children }: {children : any}) {
    const { data: raceData, loading: raceLoading, error: raceError  } = useRaceData();
    const { data: trackData, loading: trackLoading, error: trackError } = useTrackData();

    const value: RaceContextValue = {
        raceData,
        trackData,
        loading: raceLoading || trackLoading,
        error: raceError || trackError,
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