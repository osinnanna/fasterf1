import * as THREE from "three";
import type { PointsCoords } from "../model/types";

export function Track(targetScene: THREE.Scene, dataCoords: PointsCoords[]) {
    const TRACK_WIDTH: number = 50;
    const TRACK_THICKNESS: number = 2;

    const points = dataCoords.map(p => new THREE.Vector3(p.x, p.y, p.z));
    const curve = new THREE.CatmullRomCurve3(points, true);

    const shape = new THREE.Shape();
    shape.moveTo(-TRACK_WIDTH / 2, 0);
    shape.lineTo(TRACK_WIDTH / 2, 0);
    shape.lineTo(TRACK_WIDTH / 2, TRACK_THICKNESS);
    shape.lineTo(-TRACK_WIDTH / 2, TRACK_THICKNESS);
    shape.lineTo(-TRACK_WIDTH / 2, 0)

    const extrudeSettings = {
        steps: points.length, 
        bevelEnabled: false,
        extrudePath: curve
    };

    const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    const material = new THREE.MeshStandardMaterial({ 
        color: 0x2a2a2a, 
        side: THREE.DoubleSide,
        roughness: 0.8,
        metalness: 0.1,
    });

    const track = new THREE.Mesh(geometry, material);
    targetScene.add(track);

    addTrackOutline(targetScene, curve, TRACK_WIDTH)

    return track;
}

function addTrackOutline(scene: THREE.Scene, curve: THREE.CatmullRomCurve3, trackWidth: number) {
    // Try THREE.Line2
    const curvePoints = curve.getPoints(500);

    const leftPoints: THREE.Vector3[] = [];
    const rightPoints: THREE.Vector3[] = [];

    for (let i = 0; i < curvePoints.length; i++) {
        const point = curvePoints[i];
        const nextPoint = curvePoints[(i + 1) % curvePoints.length];

        const direction = new THREE.Vector3().subVectors(nextPoint, point).normalize();
        const perpendicular = new THREE.Vector3(-direction.z, 0, direction.x);

        const leftOffset = perpendicular.clone().multiplyScalar(trackWidth / 2);
        const rightOffset = perpendicular.clone().multiplyScalar(-trackWidth / 2);

        leftPoints.push(point.clone().add(leftOffset));
        rightPoints.push(point.clone().add(rightOffset));
    }

    const leftLineGeometry = new THREE.BufferGeometry().setFromPoints(leftPoints)
    const rightLineGeometry = new THREE.BufferGeometry().setFromPoints(rightPoints)

    const lineMaterial = new THREE.LineBasicMaterial({
        color: 0xffffff,
    });

    const leftLine = new THREE.Line(leftLineGeometry, lineMaterial);
    const rightLine = new THREE.Line(rightLineGeometry, lineMaterial);

    scene.add(leftLine);
    scene.add(rightLine);
}