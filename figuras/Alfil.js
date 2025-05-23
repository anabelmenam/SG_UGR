

import { color } from '../libs/dat.gui.module.js';
import * as THREE from '../libs/three.module.js'
import * as CSG from '../libs/three-bvh-csg.js'





class Alfil extends THREE.Object3D {

    constructor (gui, titleGui) {
        super();
        this.createGui(gui, titleGui);
        this.evaluador = new CSG.Evaluator();
        this.material = new THREE.MeshNormalMaterial();

        //CUERPO
        this.cuerpo = this.createCuerpo();
        this.cuerpo = new CSG.Brush(this.cuerpo, this.material);

        this.cuello = new THREE.TorusGeometry(1, 0.2, 30, 30);
        this.cuello.rotateX(Math.PI/2);
        this.cuello.translate(0,11,0);
        this.cuello = new CSG.Brush(this.cuello, this.material);

        this.cuello2 = new THREE.TorusGeometry(1.2, 0.06, 30, 30);
        this.cuello2.rotateX(Math.PI/2);
        this.cuello2.translate(0,11,0);
        this.cuello2 = new CSG.Brush(this.cuello2, this.material);

        //CABEZA
        this.cabeza = this.createCabeza();
        this.cabeza = new CSG.Brush(this.cabeza, this.material);
        this.bolaCabeza = new THREE.SphereGeometry(0.4, 30, 30);
        this.bolaCabeza.translate(0,15,0);
        this.bolaCabeza = new CSG.Brush(this.bolaCabeza, this.material);

        this.cuello3 = new THREE.TorusGeometry(0.4, 0.1, 30, 30);
        this.cuello3.rotateX(Math.PI/2);
        this.cuello3.translate(0,14.7,0);
        this.cuello3 = new CSG.Brush(this.cuello3, this.material);


        //CORTE 
        this.corte = new THREE.BoxGeometry(0.3,2,3);
        this.corte.rotateZ(-160*Math.PI/180);
        this.corte.translate(-1,14,0);
        this.corte = new CSG.Brush(this.corte, this.material);

        
        
        this.alfil = this.evaluador.evaluate(this.cuerpo,this.cabeza, CSG.ADDITION);
        this.alfil = this.evaluador.evaluate(this.alfil,this.bolaCabeza, CSG.ADDITION);
        this.alfil = this.evaluador.evaluate(this.alfil, this.corte, CSG.SUBTRACTION);
        this.alfil = this.evaluador.evaluate(this.alfil, this.cuello, CSG.ADDITION);
        this.alfil = this.evaluador.evaluate(this.alfil, this.cuello2, CSG.SUBTRACTION);
        this.alfil = this.evaluador.evaluate(this.alfil, this.cuello3, CSG.ADDITION);

        
        
        this.add(this.alfil);
    }

    createCuerpo() {
        this.shape = new THREE.Shape();
        this.shape.lineTo(4.5,0);
        this.shape.quadraticCurveTo(5,0.25, 5,0.7);
        this.shape.quadraticCurveTo(4.9,1, 4.5,1);
        this.shape.quadraticCurveTo(5.2,1.3, 4.5,1.5);
        this.shape.quadraticCurveTo(3.5,1.9,3.5,3);
        this.shape.lineTo(3,3);
        this.shape.quadraticCurveTo(1,7, 1,11);
        this.shape.lineTo(0,11);

        const points = this.shape.extractPoints(40).shape;
        this.geometry = new THREE.LatheGeometry(points, 100);
        return this.geometry;
    }

    createCabeza () {
        this.shapeCabeza = new THREE.Shape();
        this.shapeCabeza.moveTo(0,11)
        this.shapeCabeza.lineTo(1,11);
        this.shapeCabeza.quadraticCurveTo(2.7,13, 0,15);

        const points = this.shapeCabeza.extractPoints(40).shape;
        this.geometry2 = new THREE.LatheGeometry(points, 100);
        return this.geometry2;
    }

    createCorteCabeza() {
       
    }


    

    shape2CatmullCurve3(shapePath, res = 30) {
        var v2 = shapePath.extractPoints(res).shape;
        var v3 = [];
        v2.forEach((v) => {
            v3.push(new THREE.Vector3(v.x, v.y, 0));
        })
        return new THREE.CatmullRomCurve3(v3);
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




export {Alfil};


/**
 * Radianes = grados * PI /180
 */