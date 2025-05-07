
import * as THREE from '../libs/three.module.js';
import * as CSG from '../libs/three-bvh-csg.js';

class Pieza extends THREE.Object3D {
    constructor( equipo) {
        super();
        //this.createGUI(gui, titleGui);
        const materialNegroSuave = new THREE.MeshStandardMaterial({ color: 0x555555 });
        const materialNegroAzulado = new THREE.MeshStandardMaterial({ color: 0x2B2F3A });
        const materialBlancoRoto = new THREE.MeshStandardMaterial({ color: 0xEEE8DC });
        
        var material = null;
        if(equipo == 0) {
            material = materialNegroAzulado;
        } else if (equipo == 1) {
            material = materialBlancoRoto;
        }
        
        var equipo = 0;
        var casillaActual = null;

        var geometry = this.generarGeometria(); 
        var mesh = new THREE.Mesh(geometry, material);
        
        this.add(mesh);
    }

    generarGeometria() {
        throw new Error('El método generarGeometria() debe ser implementado por la subclase.');
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
        this.mesh.geometry = this.generarGeometria();
    }

}


export { Pieza };