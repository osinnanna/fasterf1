import * as THREE from "three";

const scene = new THREE.Scene();
const clock = new THREE.Clock();
// const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
// changing 75 to 30
const camera = new THREE.PerspectiveCamera(30, window.innerWidth / window.innerHeight, 0.1, 10000);

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );

document.body.appendChild( renderer.domElement );

const geometry = new THREE.BoxGeometry( 1, 1, 1 );
const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
const cube = new THREE.Mesh( geometry, material );
scene.add( cube );

camera.position.z = 20;
camera.position.y = 10;
camera.rotation.x = -0.5;

const radius = 4;

function animate() {
    // Want to try updating the car's positon so it moves in a circular path so thats the z and x positions

    const t = clock.getElapsedTime();

    cube.position.x = radius * Math.cos(t);
    cube.position.z = radius * Math.sin(t);

    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;
    renderer.render( scene, camera );
}

renderer.setAnimationLoop( animate );