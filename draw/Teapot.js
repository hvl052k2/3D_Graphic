import {TeapotGeometry} from '../libs/TeapotGeometry.js'
// -------------teapot-------------
let tess = 1;	// force initialization
let bBottom = true;
let bLid = true;
let bBody= true;
let bFitLid= true;
let bNonBlinn= true;
let shading= true;
const teapotSize = 2;
let teapot;

function Teapot(config,materialMap,option) {
    const material = materialMap[config.nameMaterial](
        config.color,
        config.texture
      );
  if ( teapot !== undefined ) {

    teapot.geometry.dispose();
    scene.remove( teapot );

  }

  const geometry = new TeapotGeometry( option.teapotSize,
    option.tess,
    option.bBottom,
    option.bLid,
    option.bBody,
    option.bFitLid,
    option.bNonBlinn);
  teapot = new THREE.Mesh( geometry, material);
  return teapot;
}
export default Teapot;