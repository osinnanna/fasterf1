import { LeaderBoard } from "./LeaderBoard"
import { TimerOptions } from "./TimerOptions"
import "../styles/UILayout.css"


export const UILayout = () => {
    return (
        <div className="ui">
            <TimerOptions />
            <section id="section">
                <div style={{display: "flex", flexDirection: "row-reverse", margin: "0 20px"}}>
                    <LeaderBoard />
                </div>
            </section>
        </div>
    )
}