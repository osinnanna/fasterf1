import * as THREE from "three";
import type { PointsCoords } from "../models/types";

export function Track(targetScene: THREE.Scene, dataCoords: PointsCoords[]) {
    const TRACK_WIDTH: number = 20;
    const points = dataCoords.map(p => new THREE.Vector3(p.x, p.y, p.z));
    const curve = new THREE.CatmullRomCurve3(points, true);

    const shape = new THREE.Shape();
    shape.moveTo(0, -TRACK_WIDTH / 2); // Width of 10
    shape.lineTo(0, TRACK_WIDTH / 2);

    const extrudeSettings = {
        steps: points.length, 
        bevelEnabled: false,
        extrudePath: curve
    };

    const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    const material = new THREE.MeshBasicMaterial({ 
        color: 0x444444, 
        side: THREE.DoubleSide,
        wireframe: false 
    });

    const track = new THREE.Mesh(geometry, material);
    targetScene.add(track);

    return track;
}