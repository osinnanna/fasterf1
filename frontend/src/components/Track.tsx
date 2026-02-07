import * as THREE from "three";
import type { PointsCoords } from "../models/types";

const TRACK_WIDTH: number = 20;


// Track.ts
export function Track(targetScene: THREE.Scene, dataCoords: PointsCoords[]) {
    const points = dataCoords.map(p => new THREE.Vector3(p.x, p.y, p.z));
    const curve = new THREE.CatmullRomCurve3(points, true);

    const shape = new THREE.Shape();
    shape.moveTo(0, -10); // Width of 10
    shape.lineTo(0, 10);

    const extrudeSettings = {
        steps: points.length, 
        bevelEnabled: false,
        extrudePath: curve
    };

    const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    // BasicMaterial = No lights needed!
    const material = new THREE.MeshBasicMaterial({ 
        color: 0x444444, 
        side: THREE.DoubleSide,
        wireframe: false 
    });

    const track = new THREE.Mesh(geometry, material);
    targetScene.add(track);

    return track;
}

// export function Track(targetScene: THREE.Scene, dataCoords: PointsCoords[]) {
//     const points = dataCoords.map(p => new THREE.Vector3(p.x, p.y, p.z));
//     const curve = new THREE.CatmullRomCurve3(points, true);

//     const shape = new THREE.Shape();
//     shape.moveTo(0, -TRACK_WIDTH / 2);
//     shape.lineTo(0, TRACK_WIDTH / 2);

//     const extrudeSettings = {
//         "steps": 200,
//         "bevelEnabled": false,
//         "extrudePath": curve
//     }

//     const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
//     const material = new THREE.MeshStandardMaterial({ 
//         color: 0xffffff, 
//         side: THREE.DoubleSide 
//     });

//     const trackMesh = new THREE.Mesh(geometry, material);
    
//     targetScene.add(trackMesh);
// }