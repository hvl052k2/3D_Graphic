// Tạo scene, camera và renderer
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
var renderer = new THREE.WebGLRenderer();
var gui = new dat.GUI();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

var blockMap = {
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
      var vertices = [];

      for (let i = 0; i < 10000; i++) {
        var x = THREE.MathUtils.randFloatSpread(2000);
        var y = THREE.MathUtils.randFloatSpread(2000);
        var z = THREE.MathUtils.randFloatSpread(2000);
        vertices.push(x, y, z);
      }
      return new THREE.BufferGeometry().setAttribute(
        "position",
        new THREE.Float32BufferAttribute(vertices, 3)
      );
    },
  },
};

var materialMap = {
  basic: (color) => new THREE.MeshBasicMaterial({ color: color }),
  line: (color) => new THREE.LineBasicMaterial({ color: color }),
  points: (color) => new THREE.PointsMaterial({ color: color }),
};

function drawBlock(config) {
  var geometry = blockMap[config.nameBlock].geometry(config.params);
  var material = materialMap[config.nameMaterial](config.color);
  var block = new THREE.Mesh(geometry, material);
  scene.add(block);
  return { geometry, block };
}

var boxConfig = {
  nameBlock: "box",
  nameMaterial: "basic",
  params: {
    width: 1,
    height: 1,
    depth: 1,
  },
  color: "0xffffff",
};

var sphereConfig = {
  nameBlock: "sphere",
  nameMaterial: "basic",
  params: {
    radius: 1,
    widthSegments: 32,
    heightSegments: 32,
  },
  color: "0xffffff",
};

var coneConfig = {
  nameBlock: "cone",
  nameMaterial: "basic",
  params: {
    radius: 1,
    height: 2,
    radialSegments: 32,
  },
  color: "0xffffff",
};

var cylinderConfig = {
  nameBlock: "cylinder",
  nameMaterial: "basic",
  params: {
    radiusTop: 1,
    radiusBottom: 1,
    height: 2,
    radialSegments: 32,
  },
  color: "0xffffff",
};

var torusConfig = {
  nameBlock: "torus",
  nameMaterial: "basic",
  params: {
    radius: 0.5,
    tube: 0.25,
    radialSegments: 16,
    tubularSegments: 32,
  },
  color: "0xffffff",
};

var planeConfig = {
  nameBlock: "plane",
  nameMaterial: "basic",
  params: {
    width: 20,
    height: 20,
  },
  color: "0xffffff",
};

var box = drawBlock(boxConfig);

// Đặt camera
camera.position.z = 5;
camera.lookAt(new THREE.Vector3(0, 0, 0));

// Hàm render
function render() {
  requestAnimationFrame(render);
  renderer.render(scene, camera);
}

// Gọi hàm render
render();
