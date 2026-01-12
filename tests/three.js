import * as THREE from "three";

const scene = new THREE.Scene();
const clock = new THREE.Clock();


const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 10000);

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );

document.body.appendChild( renderer.domElement );

const geometry = new THREE.BoxGeometry( 1, 1, 1 );
const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
const cube = new THREE.Mesh( geometry, material );

camera.position.z = 14;
camera.position.y = 10;
camera.rotation.x = -.6;

const radius = 4;

const cube2 = new THREE.Mesh( geometry, material );
const path = [
    { x: 0, z: 0 },
    { x: 5, z: 5 },
    { x: 10, z: 0 },
    { x: 15, z: -5},
    { x: 20, z: 0 }
];

let duration = 4;
const pointCount = path.length - 1;

scene.add( cube, cube2 );

function animate() {
    // Want to try updating the car's positon so it moves in a circular path so thats the z and x positions

    const t = clock.getElapsedTime();

    cube.position.x = radius * Math.cos(t);
    cube.position.z = radius * Math.sin(t);

    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;


    // cube 2

    const phase = (t % duration) / duration;

    const indexFloat = phase * pointCount;
    const index0 = Math.floor(indexFloat);
    const index1 = Math.ceil(indexFloat);
    const alpha = indexFloat - index0;

    const p0 = path[index0];
    const p1 = path[index1 % path.length];

    cube2.position.x = p0.x + (p1.x - p0.x) * alpha;
    cube2.position.z = p0.z + (p1.z - p0.z) * alpha;

    renderer.render( scene, camera );
}

renderer.setAnimationLoop( animate );