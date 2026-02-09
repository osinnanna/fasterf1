import { h } from "preact";
import { useEffect, useRef, useState } from "preact/hooks";
import * as THREE from "three";
import Cube from "./Cube"
import { Track } from "./Track";
import { useRace } from "../context/RaceContext";
import type { LapPoint, PointsCoords } from "../models/types";

const CAMERAOPTIONS = { fov: 75, aspect: window.innerWidth / window.innerHeight, near: 0.1, far: 100000 };

function findPointAtTime(path: LapPoint[], timeSeconds: number): PointsCoords {
    if (!Array.isArray(path) || path.length === 0) {
        return { x: 0, y: 0, z: 0 };
    }
    if (path.length === 1) {
        return path[0]!;
    }

    const lastIndex = path.length - 1;
    const startPoint = path[0];
    const endPoint = path[lastIndex];

    if (startPoint && endPoint) {
        const startTime = startPoint.t;
        const endTime = endPoint.t;

        if (endTime < startTime) return path[0]!;

        let t = timeSeconds % endTime;
        if (t < 0) t += endTime;

        if (t <= startTime) return startPoint;
        if (t >= endTime) return endPoint;

        let low = 0;
        let high = lastIndex;

        while (high - low > 1) {
            const mid = Math.floor((low + high) / 2);
            if (path[mid]!.t <= t) low = mid;
            else high = mid;
        }

        const p0 = path[low];
        const p1 = path[high];
        const span = p1!.t - p0!.t;
        if (span <= 0) {
            return p0!;
        }
        const alpha = (t - p0!.t) / span;
        return {
            x: p0!.x + (p1!.x - p0!.x) * alpha,
            y: p0!.y + (p1!.y - p0!.y) * alpha,
            z: p0!.z + (p1!.z - p0!.z) * alpha
        };
    };
    return path[0] || { x: 0, y: 0, z: 0 }
}

export default function Scene() {
    const sceneRef = useRef<THREE.Scene | null>(null);
    const { lapData, trackData, loading, error } = useRace();


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

            const dataStatus = (lapData?.path) && (lapData.path.length > 0);
            if (dataStatus) {
                if (clock.running) {
                    const time = clock.getElapsedTime();
                    const point = findPointAtTime(lapData.path, time);
                    cube.position.set(point.x, point.y, point.z)
                } else {
                    const startPoint = lapData.path[0];
                    if (startPoint) cube.position.set(startPoint.x, startPoint.y, startPoint.z);
                }
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
    }, [trackData, lapData]);

    if (loading) return <div>Loading Race Data</div>
    if (error) return <div>Error: {error.message}</div>
    if (!trackData) return <div>There is no Race Data Available</div>

    return null;
}