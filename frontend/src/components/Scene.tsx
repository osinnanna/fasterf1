import { h } from "preact";
import { useEffect } from "preact/hooks";
import * as THREE from "three";
import Cube from "./Cube"

const CAMERAOPTIONS = { fov: 75, aspect: window.innerWidth / window.innerHeight, near: 0.1, far: 1000 };

export default function Scene() {
    useEffect(() => {
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(
            ...Object.values(CAMERAOPTIONS)
        );

        const renderer = new THREE.WebGLRenderer();
        renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(renderer.domElement);

        const cube = Cube(scene);
        
        camera.position.z = 5;
        
        function animate() {
            requestAnimationFrame(animate);
    
            cube.rotation.x += 0.01
            cube.rotation.y += 0.01
            renderer.render(scene, camera)
        }
        animate();
    }, []);

    return null;
}