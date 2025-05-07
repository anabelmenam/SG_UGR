
import * as THREE from '../libs/three.module.js';
import * as CSG from '../libs/three-bvh-csg.js';

class Casilla extends THREE.Object3D {
    constructor(i, j, color, gui, titleGui) {
        super();
        this.createGUI(gui, titleGui);

        var material = new THREE.MeshStandardMaterial({color: 0xA0522D});
        

        var posI = i;
        var posJ = j;
        var pieza = null;
        var mesh = new THREE.BoxGeometry(1,1,1);
        var mesh = new THREE.Mesh (mesh, material);
        
        

        
        this.add(mesh);
    }

    createGUI (gui, titleGui) {
        this.guiControls = {
            resolucion: 20,
        }

        var folder = gui.addFolder(titleGui);
        folder.add(this.guiControls, 'resolucion', 3, 50, 1).name('Resolucion: ').listen().onChange ( () =>this.updateGeometria() );
    }

    updateGeometria() {
        this.mesh.geometry.dispose();
        this.mesh.geometry = new THREE.LatheGeometry(this.points, this.guiControls.resolucion);
    }

}


export { Casilla };