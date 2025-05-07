
import * as THREE from '../libs/three.module.js';
import * as CSG from '../libs/three-bvh-csg.js';
import { Pieza } from './Pieza.js';


class Caballo extends Pieza {
    constructor(equipo) {
        super(equipo);
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
            curveSegments: 100,
            bevelEnabled: true,
            bevelThickness: 0.75,
            bevelSegments: 10
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


        var points_base = shape_base.extractPoints(40).shape;
        var geometry_base = new THREE.LatheGeometry(points_base, 100);
        geometry_base.scale(1.3,1.3,1.3);
        geometry_base.translate(0.5,-2.5,2);

        // OJOS
        var geometry_ojo1 = new THREE.TorusGeometry(0.6,0.2);
        geometry_ojo1.translate(-1.5,12.2,-0.8);

        var geometry_ojo2 = new THREE.TorusGeometry(0.6,0.2);
        geometry_ojo2.translate(-1.5,12.2,5.3);


        // RECORTE_OREJAS   
        var geometry_orejas = new THREE.CylinderGeometry(1,1,10,3);
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
        var figura = evaluador.evaluate(cabeza, base, CSG.ADDITION);
        figura = evaluador.evaluate(figura, ojo1, CSG.SUBTRACTION);
        figura = evaluador.evaluate(figura, ojo2, CSG.SUBTRACTION);
        figura = evaluador.evaluate(figura, orejas, CSG.SUBTRACTION);

        var geometriaCaballo = figura.geometry;
        
        return geometriaCaballo;
    }

    

    updateGeometria() {
        mesh.geometry.dispose();
        mesh.geometry = new THREE.LatheGeometry(points, guiControls.resolucion);
    }

}


export { Caballo };