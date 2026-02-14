import { useRef } from "react";
import Scene from "./components/Scene";
import { RaceProvider } from "./context/RaceContext";
import { startCountdown } from "./components/countdown";
import "./styles/index.css";
import { LeaderBoardItem } from "./uicomponents/LeaderBoardItem";

const RaceControls = () => {
    const displayRef = useRef<HTMLDivElement>(null);

    const handleStartSequence = () => {
        if (!displayRef.current) return;

        // Starting the animejs countdonw
        startCountdown(displayRef.current, () => {
            const event = new CustomEvent("RACE_START",
                { detail: { startTime: Date.now() } }
            );
            window.dispatchEvent(event);

            setTimeout(() => {
                if (displayRef.current) displayRef.current.textContent = "";
            }, 1000);
        });
    };
    return (
        <div>
            <div ref={displayRef} className="countdown-display"></div>
            <button onClick={handleStartSequence} className="race-btn">
                Start Race
            </button>
        </div>
    )
}

export default function App() {
    return (
        <RaceProvider>
            <div>
                <div className="ui">
                    <h1>My Three Js App</h1>
                    <RaceControls />
                    <LeaderBoardItem />
                </div>
                <Scene></Scene>
            </div>
        </RaceProvider>
    )
}