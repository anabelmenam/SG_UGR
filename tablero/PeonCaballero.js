import { color } from '../libs/dat.gui.module.js';
import * as THREE from '../libs/three.module.js'
import * as CSG from '../libs/three-bvh-csg.js'
import {Casco} from './Casco.js';
import { Peon } from './Peon.js';

class PeonCaballero extends Peon {

    constructor (equipo, casilla, nombre, resolucion) {
        super(equipo, casilla, nombre, resolucion);
    }

    createCasco (material, evaluador) {
        var cilindro = new THREE.CylinderGeometry(1, 1, 1, this.resolucion, this.resolucion);
        var esfera = new THREE.SphereGeometry(1, this.resolucion, this.resolucion);
        cilindro.translate(0,0.5,0);
        esfera.translate(0,1,0);
        cilindro = new CSG.Brush(cilindro, material);
        esfera = new CSG.Brush(esfera, material);

        var cilindro2 = new THREE.CylinderGeometry(0.8, 0.8, 1, this.resolucion, this.resolucion);
        var esfera2 = new THREE.SphereGeometry(0.8, this.resolucion, this.resolucion);
        cilindro2.translate(0,0.5,0);
        esfera2.translate(0,1.1,0);
        cilindro2 = new CSG.Brush(cilindro2, material);
        esfera2 = new CSG.Brush(esfera2, material);
        var hueco = evaluador.evaluate(cilindro2, esfera2, CSG.ADDITION);
        
        var caja = new THREE.BoxGeometry(1.5, 1.5, 1.5);
        caja.translate(0,0.5,1);
        caja = new CSG.Brush(caja, material);
        var casco = evaluador.evaluate(cilindro, esfera, CSG.ADDITION);
        casco = evaluador.evaluate(casco, hueco, CSG.SUBTRACTION);
        casco = evaluador.evaluate(casco, caja, CSG.SUBTRACTION);
        return casco;
    }

    createBarrido () {
        var path = new THREE.Shape();
        path.moveTo(1.4,1);
        path.quadraticCurveTo(1.25,2.25,0,2.4);
        path = this.shape2CatmullCurve3(path, this.resolucion);
        
        var figura = new THREE.Shape();
        figura.lineTo(0.15,0.1);
        figura.lineTo(0.3,0);
        
        figura.lineTo(0.3,0.4);
        figura.quadraticCurveTo(0.15,0.35,0,0.4);
        figura.lineTo(0,0);

        var geometry = new THREE.ExtrudeGeometry(figura, { depth: 1,steps: this.resolucion, bevelEnabled: false, extrudePath: path });
        return geometry;
    }

    createMascara (material, evaluador) {
        var cilindro3 = new THREE.CylinderGeometry(1.1, 1.1, 1, this.resolucion);
        cilindro3.translate(0,0.4,0);
        var caja2 = new THREE.BoxGeometry(3,4,3);
        caja2.translate(0,0.4,-1.3);
        var cilindro4 = new THREE.CylinderGeometry(1, 1, 4, this.resolucion);
        cilindro4.translate(0,0.4,0);
        
        var shape1 = new THREE.Shape();
        shape1.moveTo(1.2,1.4);
        shape1.lineTo(-1.2,1.4);
        shape1.lineTo(-1.2,0.5);
        shape1.quadraticCurveTo(-0.75,0.5, -0.3,0.7);
        shape1.quadraticCurveTo(0,0.95, 0.3,0.7);
        shape1.quadraticCurveTo(0.75,0.5, 1.2,0.5);
        shape1.lineTo(1.2,1.4);

        var recorte1 = new THREE.ExtrudeGeometry(shape1, { depth: 2,steps: this.resolucion, bevelEnabled: false });

        cilindro3 = new CSG.Brush(cilindro3, material);
        caja2 = new CSG.Brush(caja2, material);
        cilindro4 = new CSG.Brush(cilindro4, material);
        recorte1 = new CSG.Brush(recorte1, material);

        var mascara = evaluador.evaluate(cilindro3, cilindro4, CSG.SUBTRACTION);
        mascara = evaluador.evaluate(mascara, caja2, CSG.SUBTRACTION);
        mascara = evaluador.evaluate(mascara, recorte1, CSG.SUBTRACTION);


        return mascara;
    }

    createCascoCompleto(material, evaluador) {
        var casco = this.createCasco(material, evaluador);
        casco.translateY(0.5);

        var cresta = this.createBarrido();
        cresta.rotateY(Math.PI/2);
        cresta.translate(0.15,0,0);
        cresta = new CSG.Brush(cresta, material);
        
        casco = evaluador.evaluate(casco, cresta, CSG.ADDITION);
        casco.position.set(0,0,0);

        var mascara = this.createMascara(material, evaluador);
        casco = evaluador.evaluate(casco, mascara, CSG.ADDITION);
        return casco;
    }

    shape2CatmullCurve3(shapePath, res = this.resolucion) {
        var v2 = shapePath.extractPoints(res).shape;
        var v3 = [];
        v2.forEach((v) => {
            v3.push(new THREE.Vector3(v.x, v.y, 0));
        })
        return new THREE.CatmullRomCurve3(v3);
    }
}

export { PeonCaballero };