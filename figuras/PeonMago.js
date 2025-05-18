

import { color } from '../libs/dat.gui.module.js';
import * as THREE from '../libs/three.module.js'
import * as CSG from '../libs/three-bvh-csg.js'
import {Gorro} from './Gorro.js';




class PeonMago extends THREE.Object3D {

    constructor (gui, titleGui) {
        super();
        this.material = new THREE.MeshNormalMaterial();

        //CABEZA
        this.geometry_cabeza = new THREE.SphereGeometry(2);
        this.geometry_cabeza.translate(0,10.8,0);

        this.geometry_toro = new THREE.TorusGeometry(1.1,0.2);
        this.geometry_toro.rotateX(Math.PI/2);
        this.geometry_toro.translate(0,9,0);

        this.geometry_ojo1 = new THREE.SphereGeometry(0.2);
        this.geometry_ojo1.scale(1.5,1.8,1.8);
        this.geometry_ojo1.translate(0.8,11,-1.8);
        this.geometry_ojo1.rotateY(Math.PI);


        this.geometry_ojo2 = new THREE.SphereGeometry(0.2);
        this.geometry_ojo2.scale(1.5,1.8,1.8);
        this.geometry_ojo2.translate(-0.8,11,-1.8);
        this.geometry_ojo2.rotateY(Math.PI);

        //CUERPO
        this.geometry_cuerpo = this.createCuerpo();

        // CONTRUIMOS BRUSH
        var cabeza = new CSG.Brush(this.geometry_cabeza, this.material);
        var cuerpo = new CSG.Brush(this.geometry_cuerpo, this.material);
        var toro = new CSG.Brush(this.geometry_toro, this.material);
        var ojo1 = new CSG.Brush(this.geometry_ojo1, this.material);
        var ojo2 = new CSG.Brush(this.geometry_ojo2, this.material);

        this.gorro = new Gorro(this.material);
        this.gorro.translateY(11.5);
        //OPERAMOS
        var evaluador = new CSG.Evaluator();
        this.figura = evaluador.evaluate(cabeza, cuerpo, CSG.ADDITION);
        this.figura = evaluador.evaluate(this.figura, toro, CSG.ADDITION);
        this.figura = evaluador.evaluate(this.figura, ojo1, CSG.ADDITION);
        this.figura = evaluador.evaluate(this.figura, ojo2, CSG.ADDITION);



        this.add(this.figura);
        //this.add(this.casco);
        this.add(this.gorro);
    }

    createCuerpo() {
        this.shape = new THREE.Shape();
        this.shape.lineTo(4.5,0);
        this.shape.quadraticCurveTo(5,0.25, 5,0.7);
        this.shape.quadraticCurveTo(4.9,1, 4.5,1);
        this.shape.quadraticCurveTo(5.2,1.3, 4.5,1.5);
        this.shape.quadraticCurveTo(3.5,1.9,3.5,3);
        this.shape.lineTo(3,3);
        this.shape.quadraticCurveTo(1.5,5, 1,9);
        this.shape.lineTo(0,9);

        const points = this.shape.extractPoints(40).shape;
        this.geometry = new THREE.LatheGeometry(points, 100);
        return this.geometry;
    }

    

    
    





    scaleShape(shape, scale) {
        var points = shape.extractPoints().shape;
        var scaledPoints = points.map(p => new THREE.Vector2(p.x * scale, p.y * scale));
        return new THREE.Shape(scaledPoints);
      }
    
      translateShape(shape, dx, dy) {
        var points = shape.extractPoints().shape;
        var translatedPoints = points.map(p => new THREE.Vector2(p.x + dx, p.y + dy));
        return new THREE.Shape(translatedPoints);
      }



}




export {PeonMago};


/**
 * Radianes = grados * PI /180
 */