
import * as THREE from '../libs/three.module.js';
import * as CSG from '../libs/three-bvh-csg.js';
import { Pieza } from './Pieza.js';
import { Brazos } from './Brazos.js';

class Caballo extends Pieza {
    constructor (equipo, casilla, nombre, resolucion) {
        super(equipo, casilla, nombre, resolucion);
    }

    movimientosPosibles(casillasDisp) {
        const movimientos = [
            [2, 1], [1, 2], [-1, 2], [-2, 1],
            [-2, -1], [-1, -2], [1, -2], [2, -1]
        ];

        const [i, j] = this.casillaActual.index;
        const casillas = [];

        for (let [dx, dy] of movimientos) {
            const x = i + dx;
            const y = j + dy;

            if (x >= 0 && x < 8 && y >= 0 && y < 8) {
                if(casillasDisp[x][y].pieza === null || casillasDisp[x][y].pieza.equipo !== this.equipo)  {
                   casillas.push(casillasDisp[x][y]); 
                }
                
            }
        }

        return casillas;
    }

    generarGeometria() {
        var evaluador = new CSG.Evaluator();
        var material = new THREE.MeshNormalMaterial();
        
        // CABEZA
        var shape_cabeza = new THREE.Shape();
        shape_cabeza.moveTo(0,1.43);
        shape_cabeza.lineTo(1.76, 1.43); // P
        shape_cabeza.lineTo(3.21, 1.61); // N
        shape_cabeza.quadraticCurveTo(5.34,2.46, 6.56, 4.39); // D1 O
        shape_cabeza.quadraticCurveTo(6.05,5.66, 4.78,6.17); // E1 R
        shape_cabeza.quadraticCurveTo(6.08,10.67, 2.16,13.24); // F1 G
        shape_cabeza.quadraticCurveTo(1.85,14.33, 0.75,14.61); // G1 F
        shape_cabeza.lineTo(-0.79, 13); // E
        shape_cabeza.quadraticCurveTo(-1.46,13.27, -2.13,13.02); // H1 D
        shape_cabeza.lineTo(-4.35, 11.42); // C
        shape_cabeza.lineTo(-7.13, 10.27); // A
        shape_cabeza.lineTo(-6.37, 8.77); // B
        shape_cabeza.lineTo(-4.55, 8.33); // H
        shape_cabeza.quadraticCurveTo(-3.25,8.72, -1.9,8.67); // I1 I
        shape_cabeza.lineTo(-1.9, 6.71); // J
        shape_cabeza.quadraticCurveTo(-2.35,5.51, -1.9,6.71); // J1 K
        shape_cabeza.quadraticCurveTo(-4.5,3.69, -5.97,3.18); // K1 L
        shape_cabeza.quadraticCurveTo(-3.54,1.85, -0.81,1.43); // L1 M
        shape_cabeza.lineTo(0, 1.43); // C1

        var options_cabeza = {
            depth: 4.5,
            steps:1,
            curveSegments: this.resolucion,
            bevelEnabled: true,
            bevelThickness: 0.75,
            bevelSegments: this.resolucion
        }

        var geometry_cabeza = new THREE.ExtrudeGeometry(shape_cabeza, options_cabeza);
        geometry_cabeza.translate(0,0.8,0);

        // BASE
        var shape_base = new THREE.Shape();
        shape_base.lineTo(4.5,0);
        shape_base.quadraticCurveTo(5,0.25, 5,0.7);
        shape_base.quadraticCurveTo(4.9,1, 4.5,1);
        shape_base.quadraticCurveTo(5.2,1.3, 4.5,1.5);
        shape_base.quadraticCurveTo(3.5,1.9,3.5,3);
        shape_base.lineTo(3,3);
        shape_base.lineTo(0,2.5);

        var points_base = shape_base.extractPoints(this.resolucion).shape;
        var geometry_base = new THREE.LatheGeometry(points_base, this.resolucion);

        // OJOS
        var geometry_ojo1 = new THREE.TorusGeometry(0.6, 0.2, this.resolucion, this.resolucion);
        geometry_ojo1.translate(-1.5,12.2,-0.8);
        var geometry_ojo2 = new THREE.TorusGeometry(0.6, 0.2, this.resolucion, this.resolucion);
        geometry_ojo2.translate(-1.5,12.2,5.3);


        // RECORTE_OREJAS   
        var geometry_orejas = new THREE.CylinderGeometry(1, 1, 10, 3, this.resolucion, this.resolucion);
        geometry_orejas.scale(2,2,2);
        geometry_orejas.rotateX(Math.PI/2);
        geometry_orejas.rotateY(-Math.PI/2);
        geometry_orejas.translate(-6,16.6,2.3);

        // CONTRUIMOS BRUSH
        var cabeza = new CSG.Brush(geometry_cabeza, material);
        var base = new CSG.Brush(geometry_base, material);
        var ojo1 = new CSG.Brush(geometry_ojo1, material);
        var ojo2 = new CSG.Brush(geometry_ojo2, material);
        var orejas = new CSG.Brush(geometry_orejas, material);

         //OPERAMOS
        var evaluador = new CSG.Evaluator();
        var figura = evaluador.evaluate(cabeza, ojo1, CSG.SUBTRACTION);
        figura = evaluador.evaluate(figura, ojo2, CSG.SUBTRACTION);
        figura = evaluador.evaluate(figura, orejas, CSG.SUBTRACTION);
        figura = figura.geometry;
        figura.scale(0.8,0.8,0.8)
        figura.translate(-0.5, 1.5, -1.5);
        figura.rotateY(Math.PI/2);

        figura = new CSG.Brush(figura, material);
        figura = evaluador.evaluate(figura, base, CSG.ADDITION);
        
        var geometriaCaballo = figura.geometry;
        
        return geometriaCaballo;
    }

    generarBrazos(material, equipo) {
        const brazos = new Brazos(material, this.resolucion);

        const brazoIzq = brazos.createBrazoIzquierdo(equipo);
        const brazoDch = brazos.createBrazoDerecho(equipo);

        if(equipo == 1) {
            brazoIzq.rotation.y = Math.PI;
            brazoDch.rotation.y = Math.PI;
        }
        brazoIzq.position.set(-3, 9, 0);
        brazoDch.position.set(2.5, 9, 0);

        this.brazoIzq = brazoIzq;
        this.brazoDch = brazoDch;

        this.add(brazoIzq);
        this.add(brazoDch);
    }

    updateGeometria() {
        mesh.geometry.dispose();
        mesh.geometry = new THREE.LatheGeometry(points, guiControls.resolucion);
    }
}

export { Caballo };