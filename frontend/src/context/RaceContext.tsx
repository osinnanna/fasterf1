import { createContext, useContext, useEffect, useRef, useState } from "react";
import type { RaceData, TrackData } from "../model/types";
import { useRaceData } from "../hooks/useRaceData";
import { useTrackData } from "../hooks/useTrackData";


interface RaceContextValue {
    raceData: RaceData | null;
    trackData: TrackData | null;
    loading: boolean;
    error: Error | null;

    // State for playback
    raceTime: number;
    isPlaying: boolean;
    playbackSpeed: number;
    duration: number;

    // state for controlling playback
    play: () => void;
    pause: () => void;
    seek: (time: number) => void;
    setPlaybackSpeed: (speed: number) => void;
}

const RaceContext = createContext<RaceContextValue | undefined>(undefined);

export function RaceProvider({ children }: {children : any}) {
    const { data: raceData, loading: raceLoading, error: raceError  } = useRaceData();
    const { data: trackData, loading: trackLoading, error: trackError } = useTrackData();

    const [isPlaying, setIsPlaying] = useState(false);
    const [playbackSpeed, setPlaybackSpeed] = useState(1.0);
    const [raceTime, setRaceTime] = useState(0);

    const lastTimeRef = useRef(0);
    const animationFrameRef = useRef<number | undefined>(undefined);
    const lastFrameTimeRef = useRef(performance.now());

    const duration = raceData?.maxDuration as number || 0;

    // making playback controls

    const play = () => {
        if (!isPlaying && raceData) {
            setIsPlaying(true);
            lastFrameTimeRef.current = performance.now();
        }
    };

    const pause = () => {
        if (isPlaying) {
            setIsPlaying(false);
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
        }
    };

    const seek = (targetTime: number) => {
        const clampedTime = Math.max(0, Math.min(targetTime, duration));
        lastTimeRef.current = clampedTime;
        setRaceTime(clampedTime);
    };

    useEffect(() => {
        if (!isPlaying) return;

        const update = () => {
            const now = performance.now();
            const deltaMs = now - lastFrameTimeRef.current;
            lastFrameTimeRef.current = now;

            const delta = (deltaMs / 1000) * playbackSpeed;
            const newTime = lastTimeRef.current + delta;

            if (newTime >= duration) {
                pause();
                setRaceTime(duration);
                lastTimeRef.current = duration;
                return;
            }
            lastTimeRef.current = newTime;
            setRaceTime(newTime);

            animationFrameRef.current = requestAnimationFrame(update);
        };
        animationFrameRef.current = requestAnimationFrame(update);
        
        return () => {
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
        };
    }, [isPlaying, playbackSpeed, duration])

    
    const value: RaceContextValue = {
        raceData,
        trackData,
        loading: raceLoading || trackLoading,
        error: raceError || trackError,

        raceTime,
        isPlaying,
        playbackSpeed,
        duration,

        play,
        pause,
        seek,
        setPlaybackSpeed
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