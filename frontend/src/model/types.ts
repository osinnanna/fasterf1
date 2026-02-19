export interface PointsCoords {
    x: number;
    y: number;
    z: number;
}

export interface Corner {
    number: string;
    pos: PointsCoords;
}

export interface TrackData {
    trackName: string;
    path: PointsCoords[];
    corners: Corner[];
}

export interface DriverTelemetry extends PointsCoords {
    speed: Number;
}

export interface Driver {
    id: string;
    driverNumber: 1;
    team: string;
    color: string;
    finishTime: number;
    telemetry: DriverTelemetry[];
}

export interface RaceData {
    raceId: string;
    fps: number;
    maxDuration: Number;
    drivers: Driver[];
}

export interface LeaderboardEntry {
    position: number;
    driver: Driver;
    currentTime: number;
    gap: string;
    isFinished: boolean;
}