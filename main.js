import { TeapotGeometry } from './libs/TeapotGeometry.js';
// Tạo scene, camera và renderer
const scene = new THREE.Scene();
const gui = new dat.GUI();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
document.body.appendChild(renderer.domElement);

// Geometry của các hình
const blockMap = {
  box: {
    geometry: (params) =>
      new THREE.BoxGeometry(
        params.width,
        params.height,
        params.depth,
        params.widthSegments,
        params.heightSegments
      ),
  },
  sphere: {
    geometry: (params) =>
      new THREE.SphereGeometry(
        params.radius,
        params.widthSegments,
        params.heightSegments
      ),
  },
  cone: {
    geometry: (params) =>
      new THREE.ConeGeometry(
        params.radius,
        params.height,
        params.radialSegments
      ),
  },
  cylinder: {
    geometry: (params) =>
      new THREE.CylinderGeometry(
        params.radiusTop,
        params.radiusBottom,
        params.height,
        params.radialSegments
      ),
  },
  torus: {
    geometry: (params) =>
      new THREE.TorusGeometry(
        params.radius,
        params.tube,
        params.radialSegments,
        params.tubularSegments
      ),
  },
  plane: {
    geometry: (params) =>
      new THREE.PlaneGeometry(
        params.width,
        params.height,
        params.widthSegments,
        params.heightSegments
      ),
  },
  capsule:{
    geometry: (params)=>new THREE.CapsuleGeometry(
      params.radius,
      params.length,
      params.capSubdivisions,
      params.radialSegments
    )
  },

};

const loader = new THREE.TextureLoader();


const materialMap = {
  basic: (color, texture) => {
    if (color) {
      return new THREE.MeshBasicMaterial({ color: color });
    } else {
      return new THREE.MeshBasicMaterial({ map: loader.load(texture) });
    }
  },
  line: (color) => new THREE.LineBasicMaterial({ color: color, linewidth: 2 }),
  points: (color) => new THREE.PointsMaterial({color: color}),
  standard: (color, texture) => {
    if (color) {
      return new THREE.MeshStandardMaterial({ color: color });
    } else {
      return new THREE.MeshStandardMaterial({ map: loader.load(texture) });
    }
  },
};

// Hàm vẽ hình
function drawBlock(config) {
  const geometry = blockMap[config.nameBlock].geometry(config.params);
  const material = materialMap[config.nameMaterial](
    config.color,
    config.texture
  );
  let block;
  if (config.nameMaterial === "line") {
    const wireframe = new THREE.WireframeGeometry(geometry);
    block = new THREE.LineSegments(wireframe, material);
    block.material.depthTest = false;
    block.material.opacity = 0.5;
    block.material.transparent = true;
  } else {
    block = new THREE.Mesh(geometry, material);
  }

  scene.add(block);
  return { geometry, material, block };
}


const boxConfig = {
  nameBlock: "box",
  nameMaterial: "standard",
  params: {
    width: 4,
    height: 4,
    depth: 4,
    widthSegments: 15,
    heightSegments: 15,
  },
  color: 0xffffff,
};

// Vẽ hình cầu
const sphereConfig = {
  nameBlock: "sphere",
  nameMaterial: "line",
  params: {
    radius: 2,
    widthSegments: 32,
    heightSegments: 32,
  },
  color: 0xffffff,
  // texture: "./assets/images/ball.jpg",
};

// Vẽ hình nón
const coneConfig = {
  nameBlock: "cone",
  nameMaterial: "line",
  params: {
    radius: 2,
    height: 4,
    radialSegments: 32,
  },
  color: 0xffffff,
};

// Vẽ hình trụ
const cylinderConfig = {
  nameBlock: "cylinder",
  nameMaterial: "line",
  params: {
    radiusTop: 2,
    radiusBottom: 2,
    height: 4,
    radialSegments: 64,
  },
  color: 0xffffff,
};

// Vẽ hình bánh xe
const torusConfig = {
  nameBlock: "torus",
  nameMaterial: "line",
  params: {
    radius: 3,
    tube: 2,
    radialSegments: 32,
    tubularSegments: 32,
  },
  color: 0xffffff,
};

// Vẽ mặt phẳng
const planeConfig = {
  nameBlock: "plane",
  nameMaterial: "standard",
  params: {
    width: 20,
    height: 20,
    widthSegments: 15,
    heightSegments: 15,
  },
  color: 0xffffff,
};
// -------------teapot-------------
let tess = 15;	// force initialization
let bBottom = true;
let bLid = true;
let bBody= true;
let bFitLid= true;
let bNonBlinn= true;
let shading= true;
const teapotSize = 2;
let teapot, textureCube;

function createNewTeapot(config) {
  const material = materialMap[config.nameMaterial](
    config.color,
    config.texture
  );
  if ( teapot !== undefined ) {

    teapot.geometry.dispose();
    scene.remove( teapot );

  }

  const geometry = new TeapotGeometry( teapotSize,
    tess,
    bBottom,
    bLid,
    bBody,
    bFitLid,
    bNonBlinn);
  teapot = new THREE.Mesh( geometry, material);
  scene.add( teapot );
}
createNewTeapot(sphereConfig)


// Ánh sáng
const ambientLight = new THREE.AmbientLight(0x333333);
const pointLight = new THREE.PointLight(0xffffff, 1.5);
pointLight.castShadow = true;
pointLight.position.set(3, 7, 1);
scene.add(pointLight);
scene.add(ambientLight);

// Tạo background cho scene
var path = "./assets/images/dark-s_";
var format = ".jpg";
var urls = [
  path + "px" + format,
  path + "nx" + format,
  path + "py" + format,
  path + "ny" + format,
  path + "pz" + format,
  path + "nz" + format,
];

var reflectionCube = new THREE.CubeTextureLoader().load(urls);
reflectionCube.format = THREE.RGBAFormat;
scene.background = reflectionCube;


// Tạo các hình

// const box = drawBlock(boxConfig);
// box.block.position.y = 1;

const sphere = drawBlock(sphereConfig);
sphere.block.castShadow = true;
sphere.block.position.y = 1;

// const torus = drawBlock(torusConfig);
// torus.block.position.y = 1;

// const cylinder = drawBlock(cylinderConfig);

// const cone = drawBlock(coneConfig);

const plane = drawBlock(planeConfig);
plane.block.position.y = -2;
plane.block.rotation.x = -Math.PI / 2;
plane.block.receiveShadow = true;

// OrbitControls
const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.update();

// Đặt camera
camera.position.set(3, 5, 10);
camera.lookAt(new THREE.Vector3(0, 0, 0));

const cameraFolder = gui.addFolder("Camera");
cameraFolder.add(camera.position, "x", -5, 10);
cameraFolder.add(camera.position, "y", -5, 20);
cameraFolder.add(camera.position, "z", -5, 20);

// GUI đổi màu chất liệu
// const materialData = {
//   color: sphere.material.color.getHex(),
//   mapsEnabled: true
// }

// const colorFolder = gui.addFolder("Color");
// colorFolder.addColor(materialData, "color").onChange(() => {
//   sphere.material.color.setHex(
//     Number(materialData.color.toString().replace("#", "0x"))
//   );
// });

// GUI đổi màu ánh sáng
const lightdata = {
  color: pointLight.color.getHex(),
  mapsEnabled: true,
};

const lightFolder = gui.addFolder("Light");
lightFolder.add(pointLight, "intensity", 0, 10);
lightFolder.add(pointLight, "distance", 0, 1000);
lightFolder.add(pointLight, "decay", 0, 100);
lightFolder.addColor(lightdata, "color").onChange(() => {
  pointLight.color.setHex(
    Number(lightdata.color.toString().replace("#", "0x"))
  );
});

// Hàm render
function render(renderer, scene, camera) {
  renderer.render(scene, camera);
  requestAnimationFrame(function () {
    render(renderer, scene, camera);
  });
}

window.addEventListener("resize", function () {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

render(renderer, scene, camera);