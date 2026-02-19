import "./styles/LeaderBoard.css"
import { useMemo } from "react"
import type { LeaderboardEntry } from "../model/types"
import { useRace } from "../context/RaceContext"

interface LeaderBoardItemProps {
    entry: LeaderboardEntry;
    position: number; // Pass position for CSS order
}

export const LeaderBoardItem = ({ entry, position }: LeaderBoardItemProps) => {
    const { driver, gap, isFinished } = entry

    return (
        <div 
            className="long-box designdiv"
            style={{ order: position }} // Use CSS order for positioning
        >
            <div className="small-box">{position}</div>
            <div className="info">
                <div className="driverNameundStripe">
                    <svg width="70" height="32" viewBox="0 0 70 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path fill={driver.color} d="M1.98856e-05 17.9406C0.0808986 18.174 0.161777 18.4075 0.242656 18.6409C2.3937 18.143 4.58635 17.7652 6.74188 17.2803C8.00398 16.9964 9.25335 16.6757 10.4742 16.2727C22.9363 12.1589 35.4238 8.11864 47.8737 3.96972L45.6338 0.569575C41.3229 5.1866 37.0318 9.82157 32.7762 14.489C29.373 18.2216 25.9962 21.9783 22.6458 25.759L17.3121 31.5507L24.8492 29.2021C37.8917 24.8625 50.8541 20.2705 63.7365 15.4261C65.7943 14.6522 67.8501 13.8719 69.9039 13.0852C69.8293 12.8497 69.7546 12.6142 69.6799 12.3787C67.548 12.9191 65.4182 13.4659 63.2904 14.0192C49.9702 17.4829 36.7301 21.1991 23.57 25.1676L25.7734 28.6107C29.2295 24.9263 32.6591 21.2178 36.0624 17.4852C40.318 12.8178 44.538 8.11795 48.7383 3.40015L46.4984 1.00136e-05C34.1502 4.44254 21.8397 8.99373 9.50365 13.4714C8.29516 13.91 7.11519 14.431 5.94795 14.9888C3.95443 15.9413 1.99803 17.001 1.98856e-05 17.9406Z" />
                    </svg>
                    <span>{driver.id}</span>
                </div>
                <div className="time">
                    {isFinished ? (
                        <span>🏁 {gap}</span>
                    ) : (
                        <span>{gap}</span>
                    )}
                </div>
            </div>
        </div>
    )
}

function calculateDistanceTraveled(telemetry: any[], upToFrame: number): number {
    let totalDistance = 0;
    
    for (let i = 1; i <= upToFrame && i < telemetry.length; i++) {
        const prev = telemetry[i - 1];
        const curr = telemetry[i];
        
        const dx = curr.x - prev.x;
        const dy = curr.y - prev.y;
        const dz = curr.z - prev.z;
        
        totalDistance += Math.sqrt(dx * dx + dy * dy + dz * dz);
    }
    
    return totalDistance;
}

export const LeaderBoard = () => {
    const { raceData, raceTime } = useRace();

    const leaderboard = useMemo<LeaderboardEntry[]>(() => {
        if (!raceData) return [];

        const driversWithProgress = raceData.drivers.map((driver) => {
            const isFinished = raceTime >= driver.finishTime;
            const currentTime = isFinished ? driver.finishTime : raceTime;

            const frameIndex = Math.min(
                Math.floor(currentTime * raceData.fps),
                driver.telemetry.length - 1
            );

            const distanceTraveled = calculateDistanceTraveled(driver.telemetry, frameIndex);

            return {
                driver,
                currentTime,
                isFinished,
                frameIndex,
                distanceTraveled,
            };
        });

        const sorted = driversWithProgress.sort((a, b) => {
            if (a.isFinished && !b.isFinished) return -1;
            if (!a.isFinished && b.isFinished) return 1;
            if (a.isFinished && b.isFinished) {
                return a.currentTime - b.currentTime;
            }
            return b.distanceTraveled - a.distanceTraveled;
        });

        const leaderDistance = sorted[0]?.distanceTraveled || 0;
        const leaderTime = sorted[0]?.currentTime || 0;

        return sorted.map((entry, index) => {
            let gap: string;
            
            if (index === 0) {
                gap = "LEADER";
            } else if (entry.isFinished) {
                gap = `+${(entry.currentTime - leaderTime).toFixed(3)}s`;
            } else {
                const distGap = leaderDistance - entry.distanceTraveled;
                gap = `${distGap.toFixed(0)}m`;
            }

            return {
                position: index + 1,
                driver: entry.driver,
                currentTime: entry.currentTime,
                gap,
                isFinished: entry.isFinished,
            };
        });
    }, [raceData, raceTime]);

    if (!raceData) return null;

    return (
        <div className="custom-scroll leaderboard-container">
            <h1 style={{color: "#cdcdcd"}}>LEADERBOARD</h1>
            <div className="leaderboard-list">
                {leaderboard.map((entry) => (
                    <LeaderBoardItem 
                        key={entry.driver.id}
                        entry={entry}
                        position={entry.position}
                    />
                ))}
            </div>
        </div>
    )
}
