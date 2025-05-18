

import { color } from '../libs/dat.gui.module.js';
import * as THREE from '../libs/three.module.js'
import * as CSG from '../libs/three-bvh-csg.js'
import {Casco} from './Casco.js';
import {Gorro} from './Gorro.js';




class Peon extends THREE.Object3D {

    constructor (gui, titleGui) {
        super();
        this.createGui(gui, titleGui);
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


        this.casco = new Casco(this.material);
        this.casco.scale.set(2.3,2.3,2.3);
        this.casco.translateY(8.7);

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

    

    
    




    createGui (gui, titleGui) {
        this.guiControls = {
            resolucion: 20,
        }

        var folder = gui.addFolder(titleGui);
        folder.add(this.guiControls, 'resolucion', 3, 50, 1).name('Resolucion: ').listen().onChange ( () =>this.updateGeometria() );
        //folder.add(this.guiControls, 'scalex', 1, 5, 1).name('Escalado: ').listen().onChange ( (value) => this.scale.x = value );
        //folder.add(this.guiControls, 'rotacion', 1, 5, 0.2).name('Rotacion: ').listen().onChange ( (value) => this.rotation.y = value );
        //console.log(rotacion);
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




export {Peon};


/**
 * Radianes = grados * PI /180
 */