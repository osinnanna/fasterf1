import { useRef } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPause, faPlay } from '@fortawesome/free-solid-svg-icons'
import { useRace } from "../context/RaceContext";
import "./styles/TimerOptions.css"
import { animate } from "animejs";

function startCountdown(
    el: HTMLElement,
    onComplete?: () => void
) {
    const numbers = ["3", "2", "1", "GO"];

    numbers.forEach((value, i) => {
        setTimeout(() => {
            animate(el, {
                scale: [2, 1],
                opacity: [0, 1],
                duration: 700,
                easing: "easeOutExpo",
                begin: () => {
                    el.textContent = value;
                },
                complete: () => {
                    if (i === numbers.length - 1 && onComplete) {
                        onComplete();
                    }
                },
            });
        }, i * 800);
    });
}


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

