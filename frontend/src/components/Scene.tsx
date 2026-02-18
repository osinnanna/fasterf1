import { useEffect, useRef } from "react";
import * as THREE from "three";
import Cube from "./Cube"
import { Track } from "./Track";
import { useRace } from "../context/RaceContext";
import type { Driver, DriverTelemetry, PointsCoords } from "../model/types";
import { CornerMarkers } from "./CornerMarkers";

const CAMERAOPTIONS = { fov: 75, near: 0.1, far: 100000 };

function getLerpPosition(
    telemetry: DriverTelemetry[],
    raceTime: number,
    fps: number,
    finishTime: number,
): PointsCoords {
    if (raceTime >= finishTime) {
        const lastFrame = telemetry[telemetry.length - 1];
        return lastFrame ? { x: lastFrame.x, y: lastFrame.y, z: lastFrame.z } : { x: 0, y: 0, z: 0 };
    }

    const exactFrame = raceTime * fps;
    const frameIndex = Math.floor(exactFrame);
    const alpha = exactFrame - frameIndex;

    if (frameIndex >= telemetry.length - 1) {
        const lastFrame = telemetry[telemetry.length - 1];
        return lastFrame ? { x: lastFrame.x, y: lastFrame.y, z: lastFrame.z } : { x: 0, y: 0, z: 0 };
    }

    const currentFrame = telemetry[frameIndex];
    const nextFrame = telemetry[frameIndex + 1];

    if (!currentFrame || !nextFrame) return { x: 0, y: 0, z: 0 };

    // We are going to return the slope (depended value based on a given value so it will smoothly transition)
    return {
        x: currentFrame.x + (nextFrame.x - currentFrame.x) * alpha,
        y: currentFrame.y + (nextFrame.y - currentFrame.y) * alpha,
        z: currentFrame.z + (nextFrame.z - currentFrame.z) * alpha,
    }
}

export default function Scene() {
    const mountRef = useRef<HTMLDivElement>(null);
    const { raceData, trackData, raceTime, isPlaying, loading, error } = useRace();

    const sceneRef = useRef<THREE.Scene | null>(null);
    const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
    const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
    const driverCarsRef = useRef<Array<{mesh: THREE.Mesh; driver: Driver}>>([]);
    
    const raceTimeRef = useRef(0);
    const isPlayingRef = useRef(false);

    useEffect(() => {
        raceTimeRef.current = raceTime;
        isPlayingRef.current = isPlaying;
    }, [raceTime, isPlaying]);

    useEffect(() => {
        if (!trackData || !raceData || !mountRef.current) return;
        const mount = mountRef.current;

        const scene = new THREE.Scene();
        sceneRef.current = scene;

        const camera = new THREE.PerspectiveCamera(CAMERAOPTIONS.fov, mount.clientWidth / mount.clientHeight, CAMERAOPTIONS.near, CAMERAOPTIONS.far);
        cameraRef.current = camera;

        const renderer = new THREE.WebGLRenderer();
        renderer.setSize(mount.clientWidth, mount.clientHeight);
        mount.appendChild(renderer.domElement);
        rendererRef.current = renderer;
        
        const handleResize = () => {
            if (cameraRef.current && rendererRef.current && mountRef.current) {
                const { clientWidth, clientHeight } = mountRef.current;
                cameraRef.current.aspect = clientWidth / clientHeight;
                cameraRef.current.updateProjectionMatrix();
                rendererRef.current.setSize(clientWidth, clientHeight);
            }
        };
        
        window.addEventListener('resize', handleResize);

        // Lighting
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(100, 200, 100);
        scene.add(directionalLight);
        // Lighting End

        // Track und Corner markers
        Track(scene, trackData.path);
        const cornerMarkers = CornerMarkers(scene, trackData.corners);
        console.log(`Added ${trackData.corners.length} corner markers`);

        // Drivers data
        const driverCars: Array<{ mesh: THREE.Mesh; driver: Driver }> = [];
        console.log(`Creating ${raceData.drivers.length} driverCars`);

        raceData.drivers.forEach((driver) => {
            const carMesh = Cube(scene);

            driverCars.push({
                mesh: carMesh,
                driver: driver
            });

            const startingPos = driver.telemetry[0];
            if (startingPos) {
                carMesh.position.set(startingPos.x, startingPos.y, startingPos.z);
            }

            console.log(`Created car for ${driver.id}`);
        });
        driverCarsRef.current = driverCars;

        camera.position.set(400, 10000, 4400);
        camera.lookAt(new THREE.Vector3(4000, 0, 4000)); // good view

        return () => {
            window.removeEventListener('resize', handleResize);
            if (mount && rendererRef.current) {
                mount.removeChild(rendererRef.current.domElement);
            }
            renderer.dispose();

            cornerMarkers.forEach(marker => {
                scene.remove(marker);
                marker.geometry.dispose();
                (marker.material as THREE.Material).dispose();
            });
        };
    }, [trackData, raceData]);

    // separated animation loop into separate files
    useEffect(() => {
        if (!sceneRef.current || !cameraRef.current || !rendererRef.current || !raceData) return;

        const scene = sceneRef.current;
        const camera = cameraRef.current;
        const renderer = rendererRef.current;
        const driverCars = driverCarsRef.current;
        const fps = raceData.fps;

        let animationId: number;

        function animate() {
            animationId = requestAnimationFrame(animate);

            const currentRaceTime = raceTimeRef.current;
            // const currentlyPlaying = isPlayingRef.current;

            const raceClock = document.getElementById("stopwatch-display");
            if (raceClock) {
                const hours = Math.floor(currentRaceTime / 3600);
                const minutes = Math.floor((currentRaceTime % 3600) / 60);
                const seconds = Math.floor(currentRaceTime % 60);
                const milliseconds = Math.floor((currentRaceTime % 1) * 1000);

                raceClock.textContent =
                    `${hours.toString().padStart(2, "0")}:` +
                    `${minutes.toString().padStart(2, "0")}:` +
                    `${seconds.toString().padStart(2, "0")}.` +
                    `${milliseconds.toString().padStart(3, "0")}`;
            }

            driverCars.forEach(({ mesh, driver }) => {
                const position = getLerpPosition(
                    driver.telemetry,
                    currentRaceTime,
                    fps,
                    driver.finishTime as number
                );
                mesh.position.set(position.x, position.y, position.z);
            });

            renderer.render(scene, camera);
        }

        animate();

        return () => {
            cancelAnimationFrame(animationId);
        };
    }, [raceData]);

    if (loading) return <div>Loading Race Data</div>;
    if (error) return <div>Error: {error.message}</div>;
    if (!trackData || !raceData) return <div>There is no Race Data Available</div>;

    return <div ref={mountRef} style={{ width: '100%', height: '100%' }} />;
}