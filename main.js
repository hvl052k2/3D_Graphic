// Tạo scene, camera và renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
const renderer = new THREE.WebGLRenderer();
const gui = new dat.GUI();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const loader = new THREE.TextureLoader();

const blockMap = {
  box: {
    geometry: (params) =>
      new THREE.BoxGeometry(params.width, params.height, params.depth),
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
    geometry: (params) => new THREE.PlaneGeometry(params.width, params.height),
  },
  buffer: {
    geometry: () => {
      const vertices = [];

      for (let i = 0; i < 10000; i++) {
        const x = THREE.MathUtils.randFloatSpread(2000);
        const y = THREE.MathUtils.randFloatSpread(2000);
        const z = THREE.MathUtils.randFloatSpread(2000);
        vertices.push(x, y, z);
      }
      return new THREE.BufferGeometry().setAttribute(
        "position",
        new THREE.Float32BufferAttribute(vertices, 3)
      );
    },
  },
};

const materialMap = {
  basic: (color, texture) => {
    if (color) {
      return new THREE.MeshBasicMaterial({ color: color });
    } else {
      return new THREE.MeshBasicMaterial({ map: loader.load(texture) });
    }
  },
  line: (color, texture) =>
    new THREE.LineBasicMaterial({ color: color, linewidth: 2 }),
  points: (color, texture) => new THREE.PointsMaterial({ color: color }),
  standard: (color, texture) =>
    new THREE.MeshStandardMaterial({ color: color }),
};

function drawBlock(config) {
  const geometry = blockMap[config.nameBlock].geometry(config.params);
  const material = materialMap[config.nameMaterial](
    config.color,
    config.texture
  );
  const block = new THREE.Mesh(geometry, material);
  scene.add(block);
  return { geometry, block };
}

const sphereConfig = {
  nameBlock: "sphere",
  nameMaterial: "basic",
  params: {
    radius: 1,
    widthSegments: 32,
    heightSegments: 32,
  },
  // color: 0xffff00,
  texture: "./assets/images/ball.jpg",
};

const boxConfig = {
  nameBlock: "box",
  nameMaterial: "basic",
  params: {
    width: 2,
    height: 2,
    depth: 2,
  },
  color: 0x00ff00,
};

const coneConfig = {
  nameBlock: "cone",
  nameMaterial: "basic",
  params: {
    radius: 1,
    height: 2,
    radialSegments: 32,
  },
  color: 0xffffff,
};

const cylinderConfig = {
  nameBlock: "cylinder",
  nameMaterial: "basic",
  params: {
    radiusTop: 1,
    radiusBottom: 1,
    height: 2,
    radialSegments: 32,
  },
  color: 0xffffff,
};

const torusConfig = {
  nameBlock: "torus",
  nameMaterial: "basic",
  params: {
    radius: 0.5,
    tube: 0.25,
    radialSegments: 16,
    tubularSegments: 32,
  },
  color: 0xffffff,
};

const planeConfig = {
  nameBlock: "plane",
  nameMaterial: "basic",
  params: {
    width: 20,
    height: 20,
  },
  color: 0x00ff00 ,
};

// const box = drawBlock(boxConfig);
// box.block.position.y = 2;
const sphere = drawBlock(sphereConfig);
sphere.block.position.y = 2;
const plane = drawBlock(planeConfig);
plane.block.rotation.x = -Math.PI / 2;

// Đặt camera
// const controls = new THREE.OrbitControls(camera, renderer.domElement);
camera.position.set(2, 5, 6);
camera.lookAt(new THREE.Vector3(0, 0, 0));
// controls.update();

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

// Gọi hàm render
render(renderer, scene, camera);
