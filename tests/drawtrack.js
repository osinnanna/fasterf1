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
camera.position.set(0, 4000, 14000);

async function loadTrack() {
    try {
        const response = await fetch("./silverstone.json");
        const data = await response.json();
        
        createTrackLine(data.path, scene);
        createCorners(data.corners, scene);
    } catch (error) {
        console.error("There was an issue loading track: ", error)
    }
    
}


loadTrack();



// testing with a controller
let gamepad = null;

window.addEventListener("gamepadconnected", (e) => {
    console.log("Gamepad connected!", e.gamepad);
    gamepad = e.gamepad;
});


function animate() {
    const delta = clock.getDelta();

    const gamepads = navigator.getGamepads();
    if (gamepads[0]) {
        const gp = gamepads[0];

        const movementSpeed = 5000 * delta;
        camera.translateX(gp.axes[0] * movementSpeed);
        camera.translateZ(gp.axes[1] * movementSpeed);

        const lookSpeed = 2 * delta;
        camera.rotation.y -= gp.axes[2] * lookSpeed;
        camera.rotation.x -= gp.axes[3] * lookSpeed;
    }

    controls.update(delta);

    renderer.render(scene, camera);
}


renderer.setAnimationLoop( animate );

