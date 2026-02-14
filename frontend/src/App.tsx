import Scene from "./components/Scene";
import { RaceProvider } from "./context/RaceContext";
import "./styles/index.css";
import { LeaderBoardItem } from "./uicomponents/LeaderBoardItem";
import { TimerOptions } from "./uicomponents/TimerOptions";

export default function App() {
    return (
        <RaceProvider>
            <div>
                <div className="ui">
                    <LeaderBoardItem />
                    <TimerOptions />
                </div>
                <Scene></Scene>
            </div>
        </RaceProvider>
    )
}