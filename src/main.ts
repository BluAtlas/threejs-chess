import * as THREE from 'three';
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { Board } from "./board"
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader'

// setup three renderer
const canvas = <HTMLCanvasElement>document.querySelector("#app");
const renderer = new THREE.WebGLRenderer({ canvas });

// global variables and event listeners
document.body.addEventListener('keydown', keyPressed);
const scene = new THREE.Scene();
const orthoCamera = getOrthographicCamera();
const perspCamera = getPerspectiveCamera();
let camera: THREE.PerspectiveCamera | THREE.OrthographicCamera = perspCamera;
let controls = new OrbitControls(camera, canvas);


// create scene and set its background color
scene.background = new THREE.Color(0x101010);

function getPerspectiveCamera(): THREE.PerspectiveCamera {
  const camera = new THREE.PerspectiveCamera(
    45, // fov
    window.innerWidth / window.innerHeight, // aspect
    .1, // near
    100 // far
  )
  camera.position.set(0, 10, 20)
  return camera
}

function getOrthographicCamera(): THREE.OrthographicCamera {
  const camera = new THREE.OrthographicCamera(
    window.innerWidth / 200,
    window.innerWidth / -200,
    window.innerHeight / 200,
    window.innerHeight / -200,
    -1,
    100
  )
  camera.position.set(0, 10, 0)
  camera.up.set(0, 1, 0)
  camera.zoom = 1;
  return camera
}


controls.target.set(3.5, 0, 3.5);
controls.update();

// AmbientLight
//const ambientLight = new THREE.AmbientLight(0xFFFFFF, 1)
//scene.add(ambientLight)

// HemisphereLight
//const light = new THREE.HemisphereLight(0xB1E1FF, 0xB97A20, 1)
//scene.add(light)

// DirectionalLight
const DirectionalLight = new THREE.DirectionalLight(0xFFFFFF, 1)
DirectionalLight.position.set(3, 2, 3);
DirectionalLight.target.position.set(0, 0, 0);
scene.add(DirectionalLight)
scene.add(DirectionalLight.target)

// PointLight
/*const pointLight = new THREE.PointLight(0xFFFFFF, 1);
pointLight.position.set(3.5, 0, 3.5);
scene.add(pointLight)

const pointLight2 = new THREE.PointLight(0xFFFFFF, 1);
pointLight2.position.set(-5, -5, -5);
scene.add(pointLight2)
*/

// create chess board
for (var i: number = 0; i < 8; i++) {
  for (var j: number = 0; j < 8; j++) {
    if ((i % 2 == 0 && j % 2 != 0) || (i % 2 != 0 && j % 2 == 0)) {
      createCube(i, 0, j, '#003333')
    } else {
      createCube(i, 0, j, '#ffffff')
    }
  }
}

// create the pieces
for (var i: number = 0; i < 8; i++) {
  createPiece(i, 1, "pieces/bpawn.obj")
  createPiece(i, 6, "pieces/wpawn.obj")
}

createPiece(0, 7, "pieces/brook.obj")
createPiece(0, 0, "pieces/wrook.obj")
createPiece(1, 7, "pieces/bknight.obj")
createPiece(1, 0, "pieces/wknight.obj")
createPiece(2, 7, "pieces/bbishop.obj")
createPiece(2, 0, "pieces/wbishop.obj")
createPiece(3, 7, "pieces/bqueen.obj")
createPiece(3, 0, "pieces/wqueen.obj")
createPiece(4, 7, "pieces/bking.obj")
createPiece(4, 0, "pieces/wking.obj")
createPiece(5, 7, "pieces/bbishop.obj")
createPiece(5, 0, "pieces/wbishop.obj")
createPiece(6, 7, "pieces/bknight.obj")
createPiece(6, 0, "pieces/wknight.obj")
createPiece(7, 7, "pieces/brook.obj")
createPiece(7, 0, "pieces/wrook.obj")

function createPiece(row: number, column: number, piecePath: string) {
  const objLoader = new OBJLoader();
  objLoader.load(piecePath, (root) => {
    root.position.set(row, 0, column)
    root.scale.set(.4, .4, .4)
    scene.add(root)
  })
}


// create a cube mesh and add to scene
function createCube(x: number, y: number, z: number, color: THREE.ColorRepresentation) {
  const cubeSize = 1;
  const cubeGeo = new THREE.BoxGeometry(cubeSize, cubeSize / 4, cubeSize);
  const cubeMat = new THREE.MeshPhongMaterial({ emissive: color });
  const cubeMesh = new THREE.Mesh(cubeGeo, cubeMat);
  cubeMesh.position.set(x, -cubeSize / 8, z);
  scene.add(cubeMesh);
}

function keyPressed(e: KeyboardEvent) {
  switch (e.key) {
    case '1':
      camera = perspCamera;

      controls = new OrbitControls(camera, canvas);
      controls.target.set(3.5, 0, 3.5);
      controls.update();
      break;
    case '2':
      camera = orthoCamera;

      controls = new OrbitControls(camera, canvas);
      controls.target.set(3.5, 0, 3.5);
      controls.update();
      break;
    case ' ':
      break;
  }
}

function resizeRendererToDisplaySize(renderer: THREE.WebGLRenderer) {
  // get the canvases current internal resolution width, height, and pixelRatio (for high dpi screens)
  const canvas = renderer.domElement;

  const width = canvas.clientWidth;
  const height = canvas.clientHeight;

  // check if internal resolution is different to canvas element size, and resize if so
  const needResize = canvas.width !== width || canvas.height !== height;
  if (needResize) {
    renderer.setSize(width, height, false);
  }
  // return if the element needed to be resized
  return needResize;
}

// render the scene, essentially the main program loop
function render(time: number) {

  // check if the internal resolution needs to be updated, instead of updating it every frame, costing performance
  if (resizeRendererToDisplaySize(renderer)) {
    // get the canvas dom element from renderer, and use its width and height to setup the new aspect ratio
    if (camera instanceof THREE.PerspectiveCamera) {
      const canvas = renderer.domElement;
      camera.aspect = canvas.clientWidth / canvas.clientHeight;

      // after setting the new aspect, update the cameras projection matrix
      camera.updateProjectionMatrix();
    } else {
      camera.left = window.innerWidth / 200;
      camera.right = window.innerWidth / -200;
      camera.top = window.innerHeight / 200;
      camera.bottom = window.innerHeight / -200;
      camera.updateProjectionMatrix();
    }
  }

  // render the scene
  renderer.render(scene, camera);

  // request the next frame to be rendered, essentially calling this function again
  requestAnimationFrame(render);
}
// request the first frame to be rendered, starts main loop
requestAnimationFrame(render);