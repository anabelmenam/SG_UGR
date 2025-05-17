
import * as THREE from '../libs/three.module.js';
import * as CSG from '../libs/three-bvh-csg.js';

class Pieza extends THREE.Object3D {
    constructor(equipo, casilla, nombre, resolucion = 10) {
        super();
        
        // VARIABLES DE CLASE
        this.equipo = equipo;
        this.casillaActual = casilla;
        this.nombre = nombre;
        this.resolucion = resolucion;
        var material = null;
        var evaluador = new CSG.Evaluator();

        if(equipo == 0) {
            const materialNegroSuave = new THREE.MeshStandardMaterial({ color: 0x555555 });
            material = materialNegroSuave;
        } else if (equipo == 1) {
            const materialBlancoRoto = new THREE.MeshStandardMaterial({ color: 0xEEE8DC });
            material = materialBlancoRoto;
        }
    
        var geometry = this.generarGeometria(); 
        this.generarBrazos(material, equipo);

        if (equipo == 1) {
            geometry.rotateY(Math.PI);
        }

        this.mesh = new THREE.Mesh(geometry, material);
        this.mesh.userData.pieza = this;
        
        this.add(this.mesh);
    }

    movimientosPosibles() { // MOSTRAR CAMINO
        let i,j;
        console.log(this.equipo);
        if (this.equipo == 1) {
            i = this.casillaActual.index[0];
            j = this.casillaActual.index[1]-1;
        } else if (this.equipo == 0) {
            i = this.casillaActual.index[0];
            j = this.casillaActual.index[1]+1;
        }
        
        return [[i, j]];
    }

    

    generarGeometria() {
        throw new Error('El método generarGeometria() debe ser implementado por la subclase.');
    }
    
    moverPieza(posI, posJ) {
        this.mesh.position.set(posI,0,posJ); // X Y Z
    }

    generarBrazos(material, equipo) {
        throw new Error('El método generarBrazos() debe ser implementado por la subclase.');
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