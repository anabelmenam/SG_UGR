

import { color } from '../libs/dat.gui.module.js';
import * as THREE from '../libs/three.module.js'
import * as CSG from '../libs/three-bvh-csg.js'
import { Pieza } from './Pieza.js';
import { Brazos } from './Brazos.js';

class Torre extends Pieza {

    constructor (equipo, casilla, nombre, resolucion) {
        super(equipo, casilla, nombre, resolucion);  
    }

    generarGeometria() {
        const evaluador = new CSG.Evaluator();
        var material = new THREE.MeshNormalMaterial();

        //CUERPO
        var cuerpo = this.createCuerpo();
        cuerpo = new CSG.Brush(cuerpo, material);

        //CABEZA
        var cabeza = this.createCabeza();
        cabeza = new CSG.Brush(cabeza, material);
        
        //CORTE CABEZA
        var corte1 = this.createCorteCabeza(Math.PI);
        var corte2 = this.createCorteCabeza(Math.PI/2);
        var corte3 = this.createCorteCabeza(3*Math.PI/4);
        var corte4 = this.createCorteCabeza(-3* Math.PI/4);

        corte1 = new CSG.Brush(corte1, material);
        corte2 = new CSG.Brush(corte2, material);
        corte3 = new CSG.Brush(corte3, material);
        corte4 = new CSG.Brush(corte4, material);

        var corte = evaluador.evaluate(corte1, corte2, CSG.ADDITION);
        corte = evaluador.evaluate(corte, corte4, CSG.ADDITION);
        corte = evaluador.evaluate(corte, corte3, CSG.ADDITION);

        var cilindro = new THREE.CylinderGeometry(2, 2, 4, this.resolucion);
        cilindro.translate(0,13,0);
        var cilindroG = new CSG.Brush(cilindro, material);
        corte = evaluador.evaluate(corte, cilindroG, CSG.ADDITION);

        var toroide = new THREE.TorusGeometry(2, 0.2, this.resolucion, this.resolucion);
        toroide.rotateX(Math.PI/2);
        toroide.rotateY(Math.PI/6);
        toroide.translate(0, 10.8, 0);

        toroide = new CSG.Brush(toroide, material);
    
        //FIGURA FINAL
        cabeza = evaluador.evaluate(cabeza, corte, CSG.SUBTRACTION);
        var figura = evaluador.evaluate(cuerpo, cabeza, CSG.ADDITION);
        figura = evaluador.evaluate(figura, toroide, CSG.ADDITION);
        var geometriaTorre = figura.geometry;
        
        return geometriaTorre;
    }

    generarBrazos(material, equipo) {
        const brazos = new Brazos(material,this.resolucion);

        const brazoIzq = brazos.createBrazoIzquierdo(equipo);
        const brazoDch = brazos.createBrazoDerecho(equipo);

        if(equipo == 1) {
            brazoIzq.rotation.y = Math.PI;
            brazoDch.rotation.y = Math.PI;
        }
        brazoIzq.position.set(-2.3, 9.5, 0);
        brazoDch.position.set(2.3, 9.5, 0);

        this.brazoIzq = brazoIzq;
        this.brazoDch = brazoDch;

        this.add(brazoIzq);
        this.add(brazoDch);
    }

    createCuerpo() {
        var shape = new THREE.Shape();
        shape.lineTo(4.5,0);
        shape.quadraticCurveTo(5,0.25, 5,0.7);
        shape.quadraticCurveTo(4.9,1, 4.5,1);
        shape.quadraticCurveTo(5.2,1.3, 4.5,1.5);
        shape.quadraticCurveTo(3.5,1.9,3.5,3);
        shape.lineTo(3,3);
        shape.quadraticCurveTo(2,7, 2,11);
        shape.lineTo(0,11);

        var points = shape.extractPoints(this.resolucion).shape;
        var geometry = new THREE.LatheGeometry(points, this.resolucion);
        return geometry;
    }

    createCabeza (material) {
        var shape = new THREE.Shape();
        shape.moveTo(0,0);
        shape.lineTo(2,0);
        shape.lineTo(2.85,2);
        shape.quadraticCurveTo(3,2.5,3,3);
        shape.lineTo(0,3);

        var points = shape.extractPoints(this.resolucion).shape;
        var geometry = new THREE.LatheGeometry(points, this.resolucion);
        geometry.translate(0,10.8,0);
        
        return geometry;
    }

    createCorteCabeza(angulo) {
        var shape = new THREE.Shape();
        shape.moveTo(-0.5,0);
        shape.lineTo(0.5,0);
        shape.bezierCurveTo(0.5,-1,-0.5,-1,-0.5,0);

        var options = {
            depth: 8,
            curveSegments:this.resolucion,
            bevelEnabled: false,
        }

        var geometry = new THREE.ExtrudeGeometry(shape, options);
        geometry.translate(0,13.8,-4);
        geometry.rotateY(angulo);
        return geometry;
    }


    createBase() {
        var shape = new THREE.Shape();
        shape.moveTo(1,2);
        shape.bezierCurveTo(2,3,3,2,2,1);
        shape.lineTo(2,-1);
        shape.bezierCurveTo(3,-2,2,-3,1,-2);
        shape.lineTo(-1,-2);
        shape.bezierCurveTo(-2,-3,-3,-2,-2,-1);
        shape.lineTo(-2,1);
        shape.bezierCurveTo(-3,2,-2,3,-1,2);
        shape.lineTo(1,2);

        var options = {
            depth:1,
            bevelEnable: false
        }

        var geometry = new THREE.ExtrudeGeometry(shape, options);
        geometry.rotateX(Math.PI/2);
        geometry.translate(0,1,0);
        return geometry;
    }
}

export { Torre };