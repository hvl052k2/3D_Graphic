// Tạo scene, camera và renderer
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Tạo hình trụ
var geometry = new THREE.CylinderGeometry(1, 1, 2, 32);
var material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
var cylinder = new THREE.Mesh(geometry, material);

// Thêm hình trụ vào scene
scene.add(cylinder);

// Đặt camera
camera.position.z = 5;

// Hàm render
function render() {
  requestAnimationFrame(render);
  renderer.render(scene, camera);
}

// Gọi hàm render
render();
