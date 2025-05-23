
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
            const materialNegro = new THREE.MeshStandardMaterial({
                color: 0x71508a,
                metalness: 0.9,
                roughness: 0.2,
                envMapIntensity: 1.0
            });
            material = materialNegro;
        } else if (equipo == 1) {
            const materialBlanco = new THREE.MeshPhongMaterial({
                color: 0xf6e1fc,        // Blanco roto
                specular: 0xAAAAAA,
                shininess: 200
            });
            material = materialBlanco;
        }
    
        var cuerpo = this.generarGeometria(); 
        this.generarBrazos(material, equipo);
        var geometriaCabeza = this.generarCabeza(material, equipo);

        if (equipo == 1) {
            cuerpo.rotateY(Math.PI);
            geometriaCabeza.rotateY(Math.PI);
        }

        this.mesh = new THREE.Mesh(cuerpo, material);
        var meshCabeza = new THREE.Mesh(geometriaCabeza, material);
        meshCabeza.userData.pieza = this;
        this.cabeza = meshCabeza;

        this.mesh.add(meshCabeza);

        this.mesh.cabeza = meshCabeza;
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

    generarCabeza() {
        throw new Error('El método generarCabeza() debe ser implementado por la subclase.');
    }
    
    generarBrazos(material, equipo) {
        throw new Error('El método generarBrazos() debe ser implementado por la subclase.');
    }

}

export { Pieza };