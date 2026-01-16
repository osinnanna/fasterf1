import * as THREE from "three";
import { FlyControls } from "three/addons/controls/FlyControls.js"

const scene = new THREE.Scene()
let nearPoint, farPoint
nearPoint = 0.1
farPoint = 100000
const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, nearPoint, farPoint)
const renderer = new THREE.WebGLRenderer()
renderer.setSize( window.innerWidth, window.innerHeight )
document.body.appendChild( renderer.domElement )

const clock = new THREE.Clock()

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

const controls = new FlyControls(camera, renderer.domElement);
controls.movementSpeed = 1000;
controls.rollSpeed = Math.PI / 24;
controls.autoForward = false;
controls.dragToLook = true;
camera.position.set(0, 4000, 14000);


let pathData = null;
let pathIndex = 0;

async function loadTrack() {
    try {
        const response = await fetch("./silverstone.json");
        const data = await response.json();
        
        pathData = data.path;

        createTrackLine(data.path, scene);
        createCorners(data.corners, scene);
    } catch (error) {
        console.error("There was an issue loading track: ", error)
    }
    
}


const geometry = new THREE.BoxGeometry(50, 50, 50);
const material = new THREE.MeshBasicMaterial({color: 0x00ff00});

const car = new THREE.Mesh(geometry, material);
scene.add(car);

loadTrack();



let gamepad = null;

window.addEventListener("gamepadconnected", (e) => {
    console.log("Gamepad connected!", e.gamepad);
    gamepad = e.gamepad;
});


const offset = new THREE.Vector3(0, 13000, 5);
const targetCarPosition = new THREE.Vector3();

function followCar(delta) {
    targetCarPosition.copy(car.position).add(offset);

    camera.position.lerp(targetCarPosition, 0.2);
    camera.lookAt(car.position);
}


function animate() {
    const delta = clock.getDelta();
    
    if (pathData && pathData.length > 0) {
        const currentPoint = pathData[pathIndex];

        car.position.set(currentPoint.x, currentPoint.y, currentPoint.z);

        const nextIndex = (pathIndex + 1) % pathData.length;
        const nextPoint = pathData[nextIndex];
        car.lookAt(nextPoint.x, nextPoint.y, nextPoint.z);

        pathIndex++;

        if (pathIndex >= pathData.length) {
            pathIndex = 0;
        }
    }

    // followCar(delta);

    renderer.render(scene, camera);
}


renderer.setAnimationLoop( animate );

