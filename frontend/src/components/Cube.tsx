import * as THREE from "three";

export default function Cube(scene: THREE.Scene) {
    const geometry = new THREE.BoxGeometry(200, 200, 200);
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube)

    return cube
}
