import { useEffect, useRef } from "react";
import * as THREE from "three";
import Cube from "./Cube"
import { Track } from "./Track";
import { useRace } from "../context/RaceContext";
import type { Driver, DriverTelemetry, PointsCoords } from "../model/types";

const CAMERAOPTIONS = { fov: 75, aspect: window.innerWidth / window.innerHeight, near: 0.1, far: 100000 };

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

    if (frameIndex >= telemetry.length -1) {
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
    const sceneRef = useRef<THREE.Scene | null>(null);
    const { raceData, trackData, loading, error } = useRace();


    useEffect(() => {
        if (!trackData) return;
        const clock = new THREE.Clock(false);

        sceneRef.current = new THREE.Scene();
        const scene = sceneRef.current;
        const camera = new THREE.PerspectiveCamera(...Object.values(CAMERAOPTIONS));
        const renderer = new THREE.WebGLRenderer();

        renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(renderer.domElement);

        const cube = Cube(scene);
        const track = Track(scene, trackData.path);

        const driverCars: Array<{ mesh: THREE.Mesh; driver: Driver }> = [];

        if (raceData) {
            console.log(`Creating ${raceData.drivers.length} driverCars`);

            raceData.drivers.forEach((driver) => {
                const carMesh = Cube(scene);

                driverCars.push({
                    mesh: carMesh,
                    driver: driver
                });

                const startingPos = driver.telemetry[0];
                if (startingPos) {
                    carMesh.position.set(startingPos.x, startingPos.y, startingPos.z)
                }

                console.log(`Created car for ${driver.id}`)
            })

        }

        // camera.position.z = 5;
        // camera.position.y = 7200;
        camera.position.set(400, 10000, 4400)
        camera.lookAt(new THREE.Vector3(4000, 0, 4000)) // good view

        const handleStart = () => {
            console.log("Race started via event");
            clock.start();
        }

        window.addEventListener("RACE_START", handleStart);

        let animationId: number;
        function animate() {
            animationId = requestAnimationFrame(animate);

            if (raceData && clock.running) {
                const raceTime = clock.getElapsedTime();

                driverCars.forEach(({ mesh, driver}) => {
                    const position = getLerpPosition(driver.telemetry, raceTime, raceData.fps, driver.finishTime);
                    mesh.position.set(position.x, position.y, position.z);
                });
            } else if (raceData) {
                driverCars.forEach(({ mesh, driver }) => {
                    const startingPos = driver.telemetry[0];
                    if (startingPos) {
                        mesh.position.set(startingPos.x, startingPos.y, startingPos.z);
                    }
                })
            }

            renderer.render(scene, camera);
        }

        animate();


        return () => {
            window.removeEventListener("RACE_START", handleStart);
            cancelAnimationFrame(animationId);
            renderer.dispose();
            document.body.removeChild(renderer.domElement);
        };
    }, [trackData, raceData]);

    if (loading) return <div>Loading Race Data</div>
    if (error) return <div>Error: {error.message}</div>
    if (!trackData) return <div>There is no Race Data Available</div>

    return null;
}