
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

        if(equipo == 0) {
            const materialNegroSuave = new THREE.MeshBasicMaterial({ color: 0x555555, metalness: 0.8, roughness: 0.6 });
            material = materialNegroSuave;
        } else if (equipo == 1) {
            const materialBlancoRoto = new THREE.MeshBasicMaterial({ color: 0xEEE8DC, metalness: 0.8, roughness: 0.6 });
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

    movimientosPosibles(casillas) {
        throw new Error('El método movimientosPosibles() debe ser implementado por la subclase.');
    }
    
    moverPieza(casilla) {
        this.casillaActual.vaciarCasilla();
        this.casillaActual = casilla;
        this.casillaActual.setPieza(this);
    }
    
    generarGeometria() {
        throw new Error('El método generarGeometria() debe ser implementado por la subclase.');
    }
    
    generarBrazos(material, equipo) {
        throw new Error('El método generarBrazos() debe ser implementado por la subclase.');
    }

}

export { Pieza };