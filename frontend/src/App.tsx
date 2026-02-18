import Scene from "./components/Scene";
import { RaceProvider } from "./context/RaceContext";
import { UILayout } from "./uicomponents/UILayout";

export default function App() {
    return (
        <RaceProvider>
            <UILayout />
            <div style={{ position: "absolute", width: "100vw", height: "100vh" }}>
                <Scene />
            </div>
        </RaceProvider>
    )
}