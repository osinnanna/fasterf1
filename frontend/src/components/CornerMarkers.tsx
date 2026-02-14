import * as THREE from "three"
import type { Corner } from "../model/types"

export function CornerMarkers(
    scene: THREE.Scene,
    corners: Corner[],
) {
    const markers: THREE.Mesh[] = [];

    // similar to blibs of circles just above the track
    corners.forEach((corner) => {
        const geometry = new THREE.SphereGeometry(15, 16, 16);
        const material = new THREE.MeshBasicMaterial({
            color: 0xffff00,
            transparent: true,
            opacity: 0.8
        });

        const marker = new THREE.Mesh(geometry, material);
        marker.position.set(corner.pos.x, corner.pos.y, corner.pos.z);
        scene.add(marker);
        markers.push(marker);

    })
    return markers;
}