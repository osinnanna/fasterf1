import { LeaderBoard } from "./LeaderBoard"
import { TimerOptions } from "./TimerOptions"
import CameraControls from "./CameraControls"
import "../styles/UILayout.css"


export const UILayout = () => {
    return (
        <div className="ui">
            <section id="section">
                    <TimerOptions />
                <div style={{display: "flex", flexDirection: "row-reverse", margin: "0 20px"}}>
                    <LeaderBoard />
                </div>
            </section>
            <CameraControls></CameraControls>
        </div>
    )
}