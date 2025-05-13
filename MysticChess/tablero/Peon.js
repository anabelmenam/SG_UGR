

import { color } from '../libs/dat.gui.module.js';
import * as THREE from '../libs/three.module.js'
import * as CSG from '../libs/three-bvh-csg.js'
import {Casco} from './Casco.js';
import { Pieza } from './Pieza.js';




class Peon extends Pieza {

    constructor (equipo, casilla) {
        super(equipo, casilla);
        
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

    

    createCascoCompleto() {
        //Implementar en hijos
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




export {Peon};


/**
 * Radianes = grados * PI /180
 */