import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRace } from "../context/RaceContext";
import "./styles/CameraControls.css";
import { faArrowLeft, faArrowRight } from "@fortawesome/free-solid-svg-icons";

const CameraControls = () => {
    const { selectedDriver, nextDriver, prevDriver, cameraMode, setCameraMode } = useRace();

    return (
        <div id="camera-controller" style={{display: "flex", }}>

            <div id="driver-selector">
                <button className="designdiv arrow-btn" onClick={prevDriver}>
                    <FontAwesomeIcon icon={faArrowLeft} size="xs" />
                </button>

                <div className="designdiv driver-name" style={{ borderColor: selectedDriver?.color }}>
                    {selectedDriver?.id ?? "No Driver"}
                </div>
                <button className="designdiv" onClick={nextDriver}>
                    <FontAwesomeIcon icon={faArrowRight} size="xs" />
                </button>
            </div>

            <button className={`designdiv cam-btn ${cameraMode === "overview" ? "active" : ""}`}
                onClick={() => setCameraMode("overview")}
            >OVERVIEW BUTTON</button>
            <button className={`designdiv cam-btn ${cameraMode === "follow" ? "active" : ""}`} onClick={() => setCameraMode("follow")}>
                FOLLOW
            </button>
        </div>

    );
}




export default CameraControls;