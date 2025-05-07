
import * as THREE from '../libs/three.module.js';
import * as CSG from '../libs/three-bvh-csg.js';

class Tablero extends THREE.Object3D {
    constructor( gui, titleGui) {
        super();
        this.createGUI(gui, titleGui);

        var material = new THREE.MeshNormalMaterial();

        const marronClaro = new THREE.MeshStandardMaterial({ color: 0xA0522D });
        const marronOscuro = new THREE.MeshStandardMaterial({ color: 0x5C3317 });
        

        





        

        
        this.add(this.figura);
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


export { Tablero };