import { useRef } from "react";
import "./styles/TimerOptions.css"
import { startCountdown } from "../components/countdown";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faPlay } from '@fortawesome/free-solid-svg-icons'

library.add(faPlay)
export const TimerOptions = () => {
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
    }

    return (
        <div id="timerandoptions">
            <div className="designdiv" id="stopwatch-display">
                00:00:00.000
            </div>
            <div ref={displayRef} className="countdown-display"></div>
            <button onClick={handleStartSequence} className="designdiv startbutton">
                <FontAwesomeIcon icon={faPlay} size="xs" />
            </button>
        </div>
    )
}