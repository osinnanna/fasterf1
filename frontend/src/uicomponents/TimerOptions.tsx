import { useRef } from "react";
import { startCountdown } from "../components/countdown";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faPause, faPlay } from '@fortawesome/free-solid-svg-icons'
import { useRace } from "../context/RaceContext";
import "./styles/TimerOptions.css"

library.add(faPlay)
export const TimerOptions = () => {
    const { isPlaying, play, pause } = useRace();
    const displayRef = useRef<HTMLDivElement>(null);

    const handleStartSequence = () => {
        if (!displayRef.current) return;

        // Starting the animejs countdonw
        startCountdown(displayRef.current, () => {
            play();

            setTimeout(() => {
                if (displayRef.current) displayRef.current.textContent = "";
            }, 1000);
        });
    }

    const handlePause = () => {
        pause();
    }

    return (
        <header>
            <div id="timerandoptions">
                <button onClick={handlePause} className="designdiv pausebutton" disabled={!isPlaying}>
                    <FontAwesomeIcon icon={faPause} size="xs" />
                </button>
                <div className="designdiv" id="stopwatch-display">
                    00:00:00.000
                </div>
                <button onClick={handleStartSequence} className="designdiv startbutton" disabled={isPlaying}>
                    <FontAwesomeIcon icon={faPlay} size="xs" />
                </button>
            </div>
            <div ref={displayRef} className="countdown-display"></div>
        </header>
    )
}