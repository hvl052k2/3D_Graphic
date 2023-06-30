import { TeapotGeometry } from "./libs/TeapotGeometry.js";
import { TransformControls } from "./libs/TransformControls.js";
// get document
const element_left = document.querySelectorAll(".item-feature");
const btnFeatures = document.querySelectorAll(".btn-feature");

const element_material = document.querySelectorAll(".material .item-second");

// Tạo scene, camera và renderer
const scene = new THREE.Scene();
const gui = new dat.GUI();
const aspect = window.innerWidth / window.innerHeight;
const cameraPersp = new THREE.PerspectiveCamera(75, aspect, 0.1, 1000);

const cameraOrtho = new THREE.OrthographicCamera(
  -600 * aspect,
  600 * aspect,
  600,
  -600,
  0.01,
  30000
);
const camera = cameraPersp;
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
document.body.appendChild(renderer.domElement);
const transformControl = new TransformControls(camera, renderer.domElement);
transformControl.showX = false;
transformControl.showY = false;
transformControl.showZ = false;
// Geometry của các hình
const blockMap = {
  box: {
    geometry: (params) =>
      new THREE.BoxGeometry(
        params.width,
        params.height,
        params.depth,
        params.widthSegments,
        params.heightSegments,
        params.depthSegments
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
        params.radialSegments,
        params.heightSegments
      ),
  },
  cylinder: {
    geometry: (params) =>
      new THREE.CylinderGeometry(
        params.radiusTop,
        params.radiusBottom,
        params.height,
        params.radialSegments,
        params.heightSegments,
        params.openEnded
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
  capsule: {
    geometry: (params) =>
      new THREE.CapsuleGeometry(
        params.radius,
        params.length,
        params.capSubdivisions,
        params.radialSegments
      ),
  },
  teapot: {
    geometry: (params) =>
      new TeapotGeometry(
        params.teapotSize,
        params.tess,
        params.bBottom,
        params.bLid,
        params.bBody,
        params.bFitLid,
        params.bNonBlinn
      ),
  },
  octahedron: {
    geometry: (params) =>
      new THREE.OctahedronGeometry(params.radius, params.detail),
  },
};

const loader = new THREE.TextureLoader();
const sprite = new THREE.TextureLoader().load("./assets/images/disc.png");

const materialMap = {
  basic: (color, texture) => {
    if (color) {
      return new THREE.MeshBasicMaterial({ color: color });
    } else {
      return new THREE.MeshBasicMaterial({ map: loader.load(texture) });
    }
  },
  line: (color) => new THREE.LineBasicMaterial({ color: color, linewidth: 2 }),
  points: (color) =>
    new THREE.PointsMaterial({
      color: color,
      size: 0.15,
      sizeAttenuation: true,
      map: sprite,
      alphaTest: 0.5,
      transparent: true,
    }),
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
    block.material.transparent = true;
  } else if (config.nameMaterial === "points") {
    const sizes = [];
    const positionAttribute = geometry.getAttribute("position");
    for (let i = 0, l = positionAttribute.count; i < l; i++) {
      sizes[i] = 0.1;
    }
    geometry.setAttribute("position", positionAttribute);
    geometry.setAttribute(
      "customColor",
      new THREE.Float32BufferAttribute(config.color, 3)
    );
    geometry.setAttribute("size", new THREE.Float32BufferAttribute(sizes, 1));
    block = new THREE.Points(geometry, material);
  } else {
    block = new THREE.Mesh(geometry, material);
  }
  block.castShadow = true;
  block.name = config.nameBlock;
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
    depthSegments: 15,
  },
  color: 0xffffff,
};

// Vẽ hình cầu
const sphereConfig = {
  nameBlock: "sphere",
  nameMaterial: "standard",
  params: {
    radius: 2.5,
    widthSegments: 32,
    heightSegments: 32,
  },
  color: 0xffffff,
  // texture: "./assets/images/ball.jpg",
};

// Vẽ hình nón
const coneConfig = {
  nameBlock: "cone",
  nameMaterial: "points",
  params: {
    radius: 2.5,
    height: 5,
    radialSegments: 32,
    heightSegments: 32,
  },
  color: 0xffffff,
};

// Vẽ hình trụ
const cylinderConfig = {
  nameBlock: "cylinder",
  nameMaterial: "points",
  params: {
    radiusTop: 2,
    radiusBottom: 2,
    height: 4,
    radialSegments: 64,
    heightSegments: 64,
    openEnded: false,
  },
  color: 0xffffff,
};

// Vẽ hình bánh xe
const torusConfig = {
  nameBlock: "torus",
  nameMaterial: "points",
  params: {
    radius: 2,
    tube: 1,
    radialSegments: 32,
    tubularSegments: 32,
  },
  color: 0xffffff,
};

// Vẽ mặt phẳng
const planeConfig = {
  nameBlock: "plane",
  nameMaterial: "points",
  params: {
    width: 20,
    height: 20,
    widthSegments: 15,
    heightSegments: 15,
  },
  color: 0xffffff,
};

const teapotConfig = {
  nameBlock: "teapot",
  nameMaterial: "points",
  params: {
    teapotSize: 2,
    tess: 25,
    bBottom: true,
    bLid: true,
    bBody: true,
    bFitLid: true,
    bNonBlinn: true,
  },
  color: 0xffffff,
};

const octahedronConfig = {
  nameBlock: "octahedron",
  nameMaterial: "line",
  params: {
    radius: 0.3,
    detail: 0,
  },
  color: 0xffffff,
};

// Ánh sáng
const ambientLight = new THREE.AmbientLight(0x333333);
scene.add(ambientLight);

const pointLight = new THREE.PointLight(0xffffff, 1.5);
pointLight.name = "PointLight";
const pointLightHelper = new THREE.PointLightHelper(pointLight, 0.3);

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

// Định nghĩa hàm removeFolder cho dat.GUI
dat.GUI.prototype.removeFolder = function (name) {
  var folder = this.__folders[name];
  if (!folder) {
    return;
  }
  folder.close();
  this.__ul.removeChild(folder.domElement.parentNode);
  delete this.__folders[name];
  this.onResize();
};

var scale = { x: 1, y: 1, z: 1 };
var targetScale = { x: 2, y: 2, z: 2 };

// Tạo các hình
var nameObjects = ["box", "sphere", "cone", "cylinder", "torus", "teapot"];
var animationType;
var currentConfig = boxConfig;
var currentBlock = drawBlock(currentConfig);
const itemSeconds = document.querySelectorAll(".item-second");
itemSeconds.forEach((itemSecond) => {
  itemSecond.addEventListener("click", () => {
    var text = itemSecond.innerText;
    if (text == "Box") {
      scene.children.forEach((child) => {
        if (nameObjects.includes(child.name)) {
          const obj = scene.getObjectByName(child.name);
          scene.remove(obj);
        }
      });
      currentConfig = boxConfig;
      currentBlock = drawBlock(currentConfig);
    } else if (text == "Sphere") {
      scene.children.forEach((child) => {
        if (nameObjects.includes(child.name)) {
          const obj = scene.getObjectByName(child.name);
          scene.remove(obj);
        }
      });
      currentConfig = sphereConfig;
      currentBlock = drawBlock(currentConfig);
    } else if (text == "Cone") {
      scene.children.forEach((child) => {
        if (nameObjects.includes(child.name)) {
          const obj = scene.getObjectByName(child.name);
          scene.remove(obj);
        }
      });
      currentConfig = coneConfig;
      currentBlock = drawBlock(currentConfig);
    } else if (text == "Cylinder") {
      scene.children.forEach((child) => {
        if (nameObjects.includes(child.name)) {
          const obj = scene.getObjectByName(child.name);
          scene.remove(obj);
        }
      });
      currentConfig = cylinderConfig;
      currentBlock = drawBlock(currentConfig);
    } else if (text == "Torus") {
      scene.children.forEach((child) => {
        if (nameObjects.includes(child.name)) {
          const obj = scene.getObjectByName(child.name);
          scene.remove(obj);
        }
      });
      currentConfig = torusConfig;
      currentBlock = drawBlock(currentConfig);
    } else if (text == "Teapot") {
      scene.children.forEach((child) => {
        if (nameObjects.includes(child.name)) {
          const obj = scene.getObjectByName(child.name);
          scene.remove(obj);
        }
      });
      currentConfig = teapotConfig;
      currentBlock = drawBlock(currentConfig);
    } else if (text == "Point Light") {
      pointLight.position.set(-3, 5, 3);
      scene.add(pointLight);
      scene.add(pointLightHelper);

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

      // hiện translate light
      element_left[3].classList.remove("disable-light");
    } else if (text == "Remove Light") {
      scene.remove(pointLight);
      scene.remove(pointLightHelper);
      transformControl.detach(pointLight);
      gui.removeFolder("Light");
      transformControl.showX = false;
      transformControl.showY = false;
      transformControl.showZ = false;

      // ẩn translate light
      element_left[3].classList.add("disable-light");
      btnFeatures[3].classList.remove("active");
    } else if (
      text == "Rotation X" ||
      text == "Rotation Y" ||
      text == "Remove Animation" ||
      text == "Composite Animation"
    ) {
      animationType = text;
    }
  });
});

// thanh bar bên trái.
element_left.forEach((e, i) => {
  e.onclick = () => {
    switch (i) {
      case 0:
        transformControl.attach(currentBlock.block);
        transformControl.setMode("translate");
        break;
      case 1:
        transformControl.attach(currentBlock.block);
        transformControl.setMode("rotate");
        break;
      case 2:
        transformControl.attach(currentBlock.block);
        transformControl.setMode("scale");
        break;
      case 3:
        transformControl.detach(currentBlock.block);
        if (scene.children.includes(pointLight)) {
          transformControl.attach(pointLight);
          transformControl.setMode("translate");
        }
        break;
      case 4:
        transformControl.setMode("scale");
        break;
    }
    btnFeatures[i].classList.toggle("active");
    for (let j = 0; j < 4; j++) {
      if (j != i) btnFeatures[j].classList.remove("active");
    }
    if (transformControl.showX == false) {
      transformControl.showX = true;
      transformControl.showY = true;
      transformControl.showZ = true;
    }
    if (!btnFeatures[i].classList.contains("active")) {
      transformControl.showX = false;
      transformControl.showY = false;
      transformControl.showZ = false;
    }
  };
});

// Material
const material_list = {
  Solid: "standard",
  Point: "points",
  Line: "line",
  Texture: "basic",
};
element_material.forEach((e, i) => {
  e.onclick = () => {
    const position_old = currentBlock.block.position;
    const rotate_old = currentBlock.block.rotation;
    const scale_old = currentBlock.block.scale;
    scene.remove(scene.getObjectByName(currentBlock.block.name));
    // transformControl.detach(currentBlock.block);
    currentConfig.nameMaterial = material_list[e.innerHTML];
    currentBlock = drawBlock(currentConfig);
    currentBlock.block.position.copy(position_old);
    currentBlock.block.rotation.copy(rotate_old);
    currentBlock.block.scale.copy(scale_old);
    // transformControl.attach(currentBlock.block);
  };
});

// Grid hepler
const size = 100;
const divisions = 100;

const gridHelper = new THREE.GridHelper(size, divisions);
gridHelper.receiveShadow = true;
scene.add(gridHelper);

function onWindowResize() {
  const aspect = window.innerWidth / window.innerHeight;

  cameraPersp.aspect = aspect;
  cameraPersp.updateProjectionMatrix();

  cameraOrtho.left = cameraOrtho.bottom * aspect;
  cameraOrtho.right = cameraOrtho.top * aspect;
  cameraOrtho.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);

  render();
}

// OrbitControls
const orbitControl = new THREE.OrbitControls(camera, renderer.domElement);
orbitControl.update();

transformControl.addEventListener("change", render);
transformControl.addEventListener("dragging-changed", function (event) {
  orbitControl.enabled = !event.value;
});

scene.add(transformControl);

// Đặt camera
camera.position.set(3, 5, 10);
camera.lookAt(new THREE.Vector3(0, 0, 0));

const cameraFolder = gui.addFolder("Camera");
cameraFolder.add(camera.position, "x", -5, 10);
cameraFolder.add(camera.position, "y", -5, 20);
cameraFolder.add(camera.position, "z", -5, 20);

// GUI đổi màu chất liệu
const materialData = {
  color: currentBlock.material.color.getHex(),
  mapsEnabled: true,
};

const colorFolder = gui.addFolder("Color");
colorFolder.addColor(materialData, "color").onChange(() => {
  currentBlock.material.color.setHex(
    Number(materialData.color.toString().replace("#", "0x"))
  );
});

window.addEventListener("resize", function () {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

function render() {
  if (animationType == "Rotation X") {
    currentBlock.block.rotation.x += 0.02;
  } else if (animationType == "Rotation Y") {
    currentBlock.block.rotation.y += 0.02;
  } else if (animationType == "Composite Animation") {
    currentBlock.block.rotation.x += 0.02;
    currentBlock.block.rotation.y += 0.02;
  } else if (animationType == "Remove Animation") {
    currentBlock.block.rotation.x = 0;
    currentBlock.block.rotation.y = 0;
  }
  renderer.render(scene, camera);
}

function animate() {
  requestAnimationFrame(animate);
  render();
}
animate();
