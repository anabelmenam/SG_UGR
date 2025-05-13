
import * as THREE from '../libs/three.module.js';
import * as CSG from '../libs/three-bvh-csg.js';

class Casilla extends THREE.Object3D {
    constructor(i, j, colorCasilla) {
        super();

        var material = new THREE.MeshStandardMaterial({color: colorCasilla});
        
        this.posI = i;
        this.posJ = j;
        this.pieza = null;
        var mesh = new THREE.BoxGeometry(1,1,1);
        mesh.translate(this.posI, 0, this.posJ);
        var mesh = new THREE.Mesh (mesh, material);
        
        this.add(mesh);
    }

    setPieza(pieza) {
        console.log(pieza);
        this.pieza = pieza;
        console.log(this.pieza);
        this.pieza.scale.set(0.1, 0.1, 0.1);
        this.pieza.position.set(this.posI, 0.5, this.posJ);
        this.add(this.pieza);
    }

    updateGeometria() {
        this.mesh.geometry.dispose();
        this.mesh.geometry = new THREE.LatheGeometry(this.points, this.guiControls.resolucion);
    }

}


export { Casilla };