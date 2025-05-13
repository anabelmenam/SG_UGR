
import * as THREE from '../libs/three.module.js';
import * as CSG from '../libs/three-bvh-csg.js';

class Pieza extends THREE.Object3D {
    constructor(equipo, casilla, nombre) {
        super();
        //this.createGUI(gui, titleGui);
        const materialNegroSuave = new THREE.MeshStandardMaterial({ color: 0x555555 });
        const materialNegroAzulado = new THREE.MeshStandardMaterial({ color: 0x2B2F3A });
        const materialBlancoRoto = new THREE.MeshStandardMaterial({ color: 0xEEE8DC });

        this.casillaActual = casilla;
        this.nombre = nombre;

        var material = null;
        if(equipo == 0) {
            material = materialNegroAzulado;
        } else if (equipo == 1) {
            material = materialBlancoRoto;
        }
        

        var geometry = this.generarGeometria(); 
        if(equipo == 1) {
            geometry.rotateY(Math.PI);
        }
        this.mesh = new THREE.Mesh(geometry, material);
        
        this.add(this.mesh);
    }

    generarGeometria() {
        throw new Error('El método generarGeometria() debe ser implementado por la subclase.');
    }
    
    moverPieza(posI, posJ) {
        this.mesh.position.set(posI,0,posJ)
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