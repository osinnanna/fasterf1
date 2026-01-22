import * as THREE from "three";

function createTrackLine(pathData, targetScene) {
    const points = pathData.map(p => new THREE.Vector3(p.x, p.y, p.z));
    const geometry = new THREE.BufferGeometry().setFromPoints(points);

    const material = new THREE.LineBasicMaterial({ color: 0x0000ff });
    const line = new THREE.Line(geometry, material);
    targetScene.add(line);
}
function createCorners(cornerData, targetScene) {
    const cornerShape = new THREE.BoxGeometry(50, 50, 50);
    const cornerMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
    
    cornerData.forEach(corner => {
        const mesh = new THREE.Mesh(cornerShape, cornerMaterial);

        mesh.position.set(corner.pos.x, corner.pos.y, corner.pos.z);
        targetScene.add(mesh)
    });
}

export async function loadTrack(targetScene) {
    try {
        const response = await fetch("./data/silverstone.json");
        const data = await response.json();

        createTrackLine(data.path, targetScene);
        createCorners(data.corners, targetScene);
    } catch (error) {
        console.error("There was an issue loading track: ", error)
    }
    
}
export async function loadVerstappenData() {
    try {
        const response = await fetch("./data/verstappen_lap.json");
        const verData = await response.json();

        return verData.path; 
    } catch (error) {
        console.error("There was an error loading verstappens")
    }
}
export function findPointAtTime(path, timeSeconds) {
    if (!Array.isArray(path) || path.length === 0) {
        return { x: 0, y: 0, z: 0 };
    }

    if (path.length === 1) {
        return path[0];
    }

    const lastIndex = path.length - 1;
    const startTime = path[0].t;
    const endTime = path[lastIndex].t;
    if (endTime <= startTime) {
        return path[0];
    }

    let t = timeSeconds % endTime;
    if (t < 0) {
        t += endTime;
    }

    if (t <= path[0].t) {
        return path[0];
    }
    if (t >= path[lastIndex].t) {
        return path[lastIndex];
    }

    let low = 0;
    let high = lastIndex;
    while (high - low > 1) {
        const mid = Math.floor((low + high) / 2);
        if (path[mid].t <= t) {
            low = mid;
        } else {
            high = mid;
        }
    }

    const p0 = path[low];
    const p1 = path[high];
    const span = p1.t - p0.t;
    if (span <= 0) {
        return p0;
    }

    const alpha = (t - p0.t) / span;
    return {
        x: p0.x + (p1.x - p0.x) * alpha,
        y: p0.y + (p1.y - p0.y) * alpha,
        z: p0.z + (p1.z - p0.z) * alpha
    };
}