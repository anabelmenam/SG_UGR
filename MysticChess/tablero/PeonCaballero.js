

import { color } from '../libs/dat.gui.module.js';
import * as THREE from '../libs/three.module.js'
import * as CSG from '../libs/three-bvh-csg.js'
import {Casco} from './Casco.js';
import { Pieza } from './Pieza.js';




class PeonCaballero extends Pieza {

    constructor (equipo) {
        super(equipo);
    }

    generarGeometria() {
        var material = new THREE.MeshNormalMaterial();
        var evaluador = new CSG.Evaluator();

        //CABEZA
        var geometry_cabeza = new THREE.SphereGeometry(2);
        geometry_cabeza.translate(0,10.8,0);

        var geometry_toro = new THREE.TorusGeometry(1.1,0.2);
        geometry_toro.rotateX(Math.PI/2);
        geometry_toro.translate(0,9,0);

        var geometry_ojo1 = new THREE.SphereGeometry(0.2);
        geometry_ojo1.scale(1.5,1.8,1.8);
        geometry_ojo1.translate(0.8,11,-1.8);
        geometry_ojo1.rotateY(Math.PI);


        var geometry_ojo2 = new THREE.SphereGeometry(0.2);
        geometry_ojo2.scale(1.5,1.8,1.8);
        geometry_ojo2.translate(-0.8,11,-1.8);
        geometry_ojo2.rotateY(Math.PI);

        //CUERPO
        var geometry_cuerpo = this.createCuerpo();

        // CONTRUIMOS BRUSH
        var cabeza = new CSG.Brush(geometry_cabeza, material);
        var cuerpo = new CSG.Brush(geometry_cuerpo, material);
        var toro = new CSG.Brush(geometry_toro, material);
        var ojo1 = new CSG.Brush(geometry_ojo1, material);
        var ojo2 = new CSG.Brush(geometry_ojo2, material);


        var casco = this.createCascoCompleto(material, evaluador);
        casco = casco.geometry;

        casco.scale(2.3,2.3,2.3);
        casco.translate(0,8.7,0);
        casco = new CSG.Brush(casco, material);
        //OPERAMOS
        var figura = evaluador.evaluate(cabeza, cuerpo, CSG.ADDITION);
        figura = evaluador.evaluate(figura, toro, CSG.ADDITION);
        figura = evaluador.evaluate(figura, ojo1, CSG.ADDITION);
        figura = evaluador.evaluate(figura, ojo2, CSG.ADDITION);
        figura = evaluador.evaluate(figura, casco, CSG.ADDITION);

        var geometriaPeonCaballero = figura.geometry;
        return geometriaPeonCaballero;
    }



    createCuerpo() {
        var shape = new THREE.Shape();
        shape.lineTo(4.5,0);
        shape.quadraticCurveTo(5,0.25, 5,0.7);
        shape.quadraticCurveTo(4.9,1, 4.5,1);
        shape.quadraticCurveTo(5.2,1.3, 4.5,1.5);
        shape.quadraticCurveTo(3.5,1.9,3.5,3);
        shape.lineTo(3,3);
        shape.quadraticCurveTo(1.5,5, 1,9);
        shape.lineTo(0,9);

        var points = shape.extractPoints(40).shape;
        var geometry = new THREE.LatheGeometry(points, 100);
        return geometry;
    }

    createCasco (material, evaluador) {
        var cilindro = new THREE.CylinderGeometry(1,1,1,30);
        var esfera = new THREE.SphereGeometry(1,30,30);
        cilindro.translate(0,0.5,0);
        esfera.translate(0,1,0);
        cilindro = new CSG.Brush(cilindro, material);
        esfera = new CSG.Brush(esfera, material);

        var cilindro2 = new THREE.CylinderGeometry(0.8,0.8,1,30);
        var esfera2 = new THREE.SphereGeometry(0.8,30,30);
        cilindro2.translate(0,0.5,0);
        esfera2.translate(0,1.1,0);
        cilindro2 = new CSG.Brush(cilindro2, material);
        esfera2 = new CSG.Brush(esfera2, material);
        var hueco = evaluador.evaluate(cilindro2, esfera2, CSG.ADDITION);
        
        var caja = new THREE.BoxGeometry(1.5,1.5,1.5);
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
        path = this.shape2CatmullCurve3(path, 30);
        
        var figura = new THREE.Shape();
        figura.lineTo(0.15,0.1);
        figura.lineTo(0.3,0);
        
        figura.lineTo(0.3,0.4);
        figura.quadraticCurveTo(0.15,0.35,0,0.4);
        figura.lineTo(0,0);

        var geometry = new THREE.ExtrudeGeometry(figura, { depth: 1,steps: 30, bevelEnabled: false, extrudePath: path });
        return geometry;
    }

    createMascara (material, evaluador ) {
        var cilindro3 = new THREE.CylinderGeometry(1.1,1.1,1,30);
        cilindro3.translate(0,0.4,0);
        var caja2 = new THREE.BoxGeometry(3,4,3);
        caja2.translate(0,0.4,-1.3);
        var cilindro4 = new THREE.CylinderGeometry(1,1,4,30);
        cilindro4.translate(0,0.4,0);
        
        var shape1 = new THREE.Shape();
        shape1.moveTo(1.2,1.4);
        shape1.lineTo(-1.2,1.4);
        shape1.lineTo(-1.2,0.5);
        shape1.quadraticCurveTo(-0.75,0.5, -0.3,0.7);
        shape1.quadraticCurveTo(0,0.95, 0.3,0.7);
        shape1.quadraticCurveTo(0.75,0.5, 1.2,0.5);
        shape1.lineTo(1.2,1.4);

        var recorte1 = new THREE.ExtrudeGeometry(shape1, { depth: 2,steps: 30, bevelEnabled: false });

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

    shape2CatmullCurve3(shapePath, res = 30) {
        var v2 = shapePath.extractPoints(res).shape;
        var v3 = [];
        v2.forEach((v) => {
            v3.push(new THREE.Vector3(v.x, v.y, 0));
        })
        return new THREE.CatmullRomCurve3(v3);
    }



}




export {PeonCaballero};


/**
 * Radianes = grados * PI /180
 */