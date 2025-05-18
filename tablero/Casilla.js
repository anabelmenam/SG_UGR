
import * as THREE from '../libs/three.module.js';
import * as CSG from '../libs/three-bvh-csg.js';

class Casilla extends THREE.Object3D {
    constructor(i, j, colorCasilla) {
        super();

        this.colorPredeterminado = colorCasilla;
        this.material = new THREE.MeshStandardMaterial({color: colorCasilla});
        this.index = [i, j];
        this.posI = i;
        this.posJ = j;
        this.pieza = null;
        var mesh = new THREE.BoxGeometry(1,1,1);
        mesh.translate(this.posI, 0, this.posJ);
        var mesh = new THREE.Mesh (mesh, this.material);
        mesh.userData.casilla = this;

        
        this.add(mesh);
    }

    setPieza(pieza) {
        this.pieza = pieza;
        try {
            this.pieza.scale.set(0.08, 0.08, 0.08);
            this.pieza.position.set(this.posI, 0.5, this.posJ);
            this.add(this.pieza);
            //console.log("Pieza añadida correctamente");
        } catch (e) {
            console.error("Error al añadir pieza en casilla:", this.posI, this.posJ, e);
        }
    }

    hacerPulsable() {
        this.material.color.set(0x00ff00); // verde
    }


    retomarColor() {
        this.material.color.set(this.colorPredeterminado); 
    }

    vaciarCasilla() {
        if (this.pieza != null) {
            this.pieza = null;
        }
    }
}


export { Casilla };