export interface PointsCoords {
    x: number;
    y: number;
    z: number;
}

export interface LapPoint extends PointsCoords {
    t: number;
    speed: number;
}

export interface LapData {
    driver: string;
    track: string;
    path: LapPoint[];
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