import { h } from "preact";
import { useEffect, useRef } from "preact/hooks";
import * as THREE from "three";
import Cube from "./Cube"
import { Track } from "./Track";
import { useRace } from "../context/RaceContext";

const CAMERAOPTIONS = { fov: 75, aspect: window.innerWidth / window.innerHeight, near: 0.1, far: 10000 };

export default function Scene() {
    const sceneRef = useRef<THREE.Scene | null>(null);
    const { trackData, loading, error } = useRace();

    useEffect(() => {
        if (!trackData) return;

        sceneRef.current = new THREE.Scene();
        const scene = sceneRef.current;
        const camera = new THREE.PerspectiveCamera(...Object.values(CAMERAOPTIONS));
        const renderer = new THREE.WebGLRenderer();

        renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(renderer.domElement);

        const cube = Cube(scene);
        Track(scene, trackData.path)

        camera.position.z = 5;

        let animationId: number;
        function animate() {
            animationId = requestAnimationFrame(animate);
            cube.rotation.x += 0.01
            cube.rotation.y += 0.01
            renderer.render(scene, camera)
        }
        animate();


        return () => {
            cancelAnimationFrame(animationId);
            renderer.dispose();
            document.body.removeChild(renderer.domElement);
        };
    }, [trackData]);

    if (loading) return <div>Loading Race Data</div>
    if (error) return <div>Error: {error.message}</div>
    if (!trackData) return <div>There is no Race Data Available</div>

    return null;
}