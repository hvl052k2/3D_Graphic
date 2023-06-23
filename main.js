import Stats from "./libs/stats.module.js";

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
  line: (color, texture) =>
    new THREE.LineBasicMaterial({ color: color, linewidth: 2 }),
  points: (color, texture) => new THREE.PointsMaterial({ color: color }),
  standard: (color, texture) => {
    if (color) {
      return new THREE.MeshStandardMaterial({ color: color });
    } else {
      return new THREE.MeshStandardMaterial({ map: loader.load(texture) });
    }
  },
};

function drawBlock(config) {
  const geometry = blockMap[config.nameBlock].geometry(config.params);
  const material = materialMap[config.nameMaterial](
    config.color,
    config.texture
  );
  let block;
  if (config.nameBlock === "sphere") {
    if (config.nameMaterial === "line") {
      const vertices = geometry.attributes.position.array;
      const indices = geometry.index.array;

      const verticesCount = vertices.length / 3;
      const lines = [];

      for (let i = 0; i < indices.length; i += 3) {
        const v1 = indices[i] * 3;
        const v2 = indices[i + 1] * 3;
        const v3 = indices[i + 2] * 3;

        const line1 = new THREE.Line3(
          new THREE.Vector3(vertices[v1], vertices[v1 + 1], vertices[v1 + 2]),
          new THREE.Vector3(vertices[v2], vertices[v2 + 1], vertices[v2 + 2])
        );

        const line2 = new THREE.Line3(
          new THREE.Vector3(vertices[v2], vertices[v2 + 1], vertices[v2 + 2]),
          new THREE.Vector3(vertices[v3], vertices[v3 + 1], vertices[v3 + 2])
        );

        const line3 = new THREE.Line3(
          new THREE.Vector3(vertices[v3], vertices[v3 + 1], vertices[v3 + 2]),
          new THREE.Vector3(vertices[v1], vertices[v1 + 1], vertices[v1 + 2])
        );

        lines.push(line1, line2, line3);
      }

      const geometryLines = new THREE.BufferGeometry().setFromPoints(
        lines.flatMap((line) => [line.start, line.end])
      );

      block = new THREE.LineSegments(geometryLines, material);
    } else {
      block = new THREE.Mesh(geometry, material);
    }
  }
  if (config.nameBlock === "plane") {
    if (config.nameMaterial === "line") {
      const halfWidth = config.params.width / 2;
      const halfHeight = config.params.height / 2;
      const segmentWidth = config.params.width / 20;
      const segmentHeight = config.params.height / 20;

      const vertices = [];
      const indices = [];

      for (let i = 0; i <= 20; i++) {
        const y = i * segmentHeight - halfHeight;

        for (let j = 0; j <= 20; j++) {
          const x = j * segmentWidth - halfWidth;

          vertices.push(x, y, 0);

          if (i < 20 && j < 20) {
            const currentIndex = i * (20 + 1) + j;
            const nextIndex = currentIndex + 20 + 1;

            indices.push(currentIndex, currentIndex + 1, nextIndex);
            indices.push(nextIndex, currentIndex + 1, nextIndex + 1);

            // Đường thẳng dọc
            indices.push(currentIndex, nextIndex, currentIndex + 1);
            indices.push(currentIndex + 1, nextIndex, nextIndex + 1);
          }
        }
      }

      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute(
        "position",
        new THREE.Float32BufferAttribute(vertices, 3)
      );
      geometry.setIndex(indices);

      const material = new THREE.LineBasicMaterial({ color: config.color });

      block = new THREE.LineSegments(geometry, material);
    }
  }
  scene.add(block);
  return { geometry, block };
}

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

const boxConfig = {
  nameBlock: "box",
  nameMaterial: "line",
  params: {
    width: 2,
    height: 2,
    depth: 2,
  },
  color: 0xffffff,
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
  nameMaterial: "line",
  params: {
    width: 20,
    height: 20,
  },
  color: 0x00ff00,
};

const ambientLight = new THREE.AmbientLight(0x333333);
const pointLight = new THREE.PointLight(0xffffff, 1.5);
pointLight.position.set(1, 3);
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

// const box = drawBlock(boxConfig);
// box.block.position.y = 1;
const sphere = drawBlock(sphereConfig);
sphere.block.position.y = 1;
const plane = drawBlock(planeConfig);
plane.block.rotation.x = -Math.PI / 2;

// Đặt camera
const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.update();
camera.position.set(2, 5, 6);
camera.lookAt(new THREE.Vector3(0, 0, 0));

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
