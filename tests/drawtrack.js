import * as THREE from "three";
import { FlyControls } from "three/addons/controls/FlyControls.js"
import { loadTrack, loadVerstappenData, findPointAtTime } from "./src/functions";

const scene = new THREE.Scene()
let nearPoint, farPoint
nearPoint = 0.1
farPoint = 100000
const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, nearPoint, farPoint)
const renderer = new THREE.WebGLRenderer()
renderer.setSize( window.innerWidth, window.innerHeight )
document.body.appendChild( renderer.domElement )

const clock = new THREE.Clock()

const controls = new FlyControls(camera, renderer.domElement);
controls.movementSpeed = 1000;
controls.rollSpeed = Math.PI / 24;
controls.autoForward = false;
controls.dragToLook = true;
camera.position.set(0, 4000, 14000);


const geometry = new THREE.BoxGeometry(50, 50, 50);
const material = new THREE.MeshBasicMaterial({color: 0x00ff00});

const car = new THREE.Mesh(geometry, material);
scene.add(car);


loadTrack(scene);
let verPos = null;
async function init() {
    verPos = await loadVerstappenData();
    renderer.setAnimationLoop(animate);
}

init();

const offset = new THREE.Vector3(0, 10000, -1200);
const targetCarPosition = new THREE.Vector3();
const smoothFactor = 6;

function followCar(delta) {
    targetCarPosition.copy(car.position).add(offset);
    const t = 1 - Math.exp(-smoothFactor * delta)

    camera.position.lerp(targetCarPosition, t);
    camera.lookAt(car.position);
}


function animate() {
    const delta = clock.getDelta();
    const elapsedTime = clock.getElapsedTime();
    if (verPos && verPos.length > 0) {
        const point = findPointAtTime(verPos, elapsedTime);
        car.position.set(point.x, point.y, point.z);
    }
    followCar(delta);

    renderer.render(scene, camera);
}