import { h, render} from "preact";
import Scene from "./components/Scene";
import { RaceProvider } from "./context/RaceContext";

export default function App() {
    return (
        <RaceProvider>
            <div>
                <div style={{zIndex: 100, color: "white"}}>
                    <h1 style={{position: "absolute", top: 10, left: 10}}>My Three Js App</h1>
                </div>
                <Scene></Scene>
            </div>
        </RaceProvider>
    )
}