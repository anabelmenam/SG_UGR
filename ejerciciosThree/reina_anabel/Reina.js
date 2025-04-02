

import { color } from '../libs/dat.gui.module.js';
import * as THREE from '../libs/three.module.js'
import * as CSG from '../libs/three-bvh-csg.js'





class Reina extends THREE.Object3D {

    constructor (gui, titleGui) {
        super();
        this.createGui(gui, titleGui);
        const evaluador = new CSG.Evaluator();
        var material = new THREE.MeshNormalMaterial();

        //BASE
        this.base1 = this.createBase();
        this.base2 = this.createBase();
        this.base1.scale(2.5,2.5,2.5);
        this.base2.scale(2.5,2.5,2.5);
        this.base2.rotateY(3*Math.PI / 4);

    
        this.base1 = new CSG.Brush(this.base1, material);
        this.base2 = new CSG.Brush(this.base2, material);

        this.base = evaluador.evaluate(this.base1, this.base2, CSG.ADDITION);

        //CUERPO
        this.cuerpo = this.createCuerpo();
        this.cuerpo.translate(0,3,0);
        this.cuerpo = new CSG.Brush(this.cuerpo, material);


        //CABEZA
        this.cabeza = this.createCabeza();
        this.cabeza = new CSG.Brush(this.geometry, material);
        
        //CORTE CABEZA
        this.corte1 = this.createCorteCabeza(Math.PI);
        this.corte2 = this.createCorteCabeza(Math.PI/2);
        this.corte3 = this.createCorteCabeza(3*Math.PI/4);
        this.corte4 = this.createCorteCabeza(-3* Math.PI/4);

        this.corte1 = new CSG.Brush(this.corte1, material);
        this.corte2 = new CSG.Brush(this.corte2, material);
        this.corte3 = new CSG.Brush(this.corte3, material);
        this.corte4 = new CSG.Brush(this.corte4, material);

        this.corte = evaluador.evaluate(this.corte1, this.corte2, CSG.ADDITION);
        this.corte = evaluador.evaluate(this.corte, this.corte4, CSG.ADDITION);
        this.corte = evaluador.evaluate(this.corte, this.corte3, CSG.ADDITION);

        this.cilindro = new THREE.CylinderGeometry(2,2,4,30);
        this.cilindro.translate(0,13,0);
        this.cilindroG = new CSG.Brush(this.cilindro, material);
        this.corte = evaluador.evaluate(this.corte, this.cilindroG, CSG.ADDITION);

        this.esfera = new THREE.SphereGeometry(2,20,20);
        this.esfera.translate(0,14,0);
        this.esferaG = new CSG.Brush(this.esfera, material);

        this.cilindro.scale(0.2,0.2,0.2);
        this.cilindro.translate(0,13.5,0);
        this.cilindroP = new CSG.Brush(this.cilindro, material);

        this.esferaP = new THREE.SphereGeometry(2,20,20);
        this.esferaP.scale(0.2,0.2,0.2);
        this.esferaP.translate(0,16.5,0);
        this.esferaP = new CSG.Brush(this.esferaP, material);
    

        
    
        //FIGURA FINAL
        this.cabeza = evaluador.evaluate(this.cabeza, this.corte, CSG.SUBTRACTION);
        //this.figura = evaluador.evaluate(this.figura, this.base, CSG.ADDITION);
        this.figura = evaluador.evaluate(this.base, this.cuerpo, CSG.ADDITION);
        this.figura = evaluador.evaluate(this.figura, this.cabeza, CSG.ADDITION);
        this.figura = evaluador.evaluate(this.figura, this.esferaG, CSG.ADDITION);
        this.figura = evaluador.evaluate(this.figura, this.cilindroP, CSG.ADDITION);
        this.figura = evaluador.evaluate(this.figura, this.esferaP, CSG.ADDITION);


        //this.mesh = new THREE.Mesh(this.base2, material);
        
        
        this.add(this.figura);
    }

    createCuerpo() {
        this.shape = new THREE.Shape();
        this.shape.lineTo(4.5,0);
        this.shape.quadraticCurveTo(5,0.25, 5,0.7);
        this.shape.quadraticCurveTo(4.9,1, 4.5,1);
        this.shape.quadraticCurveTo(5.2,1.3, 4.5,1.5);
        this.shape.quadraticCurveTo(3.5,1.9,3.5,3);
        this.shape.lineTo(3,3);
        this.shape.quadraticCurveTo(2,7, 2,11);
        this.shape.lineTo(0,11);

        const points = this.shape.extractPoints(40).shape;
        this.geometry = new THREE.LatheGeometry(points, 100);
        return this.geometry;
    }

    createCabeza (material) {
        this.shape = new THREE.Shape();
        this.shape.moveTo(0,0);
        this.shape.lineTo(2,0);
        this.shape.lineTo(2.85,2);
        this.shape.quadraticCurveTo(3,2.5,3,3);
        this.shape.lineTo(0,3);

        this.points = this.shape.extractPoints(40).shape;
        this.geometry = new THREE.LatheGeometry(this.points, 30);
        this.geometry.translate(0,12,0);
        
        return this.geometry;
    }

    createCorteCabeza(angulo) {
        this.shape = new THREE.Shape();
        this.shape.moveTo(-0.5,0);
        this.shape.lineTo(0.5,0);
        this.shape.bezierCurveTo(0.5,-1,-0.5,-1,-0.5,0);

        const options = {
            depth: 8,
            curveSegments:40,
            bevelEnabled: false,
        }

        this.geometry = new THREE.ExtrudeGeometry(this.shape, options);
        this.geometry.translate(0,15,-4);
        this.geometry.rotateY(angulo);
        return this.geometry;
    }


    createBase() {
        this.shape = new THREE.Shape();
        this.shape.moveTo(1,2);
        this.shape.bezierCurveTo(2,3,3,2,2,1);
        this.shape.lineTo(2,-1);
        this.shape.bezierCurveTo(3,-2,2,-3,1,-2);
        this.shape.lineTo(-1,-2);
        this.shape.bezierCurveTo(-2,-3,-3,-2,-2,-1);
        this.shape.lineTo(-2,1);
        this.shape.bezierCurveTo(-3,2,-2,3,-1,2);
        this.shape.lineTo(1,2);

        const options = {
            depth:1,
            bevelEnable: false
        }

        this.geometry = new THREE.ExtrudeGeometry(this.shape, options);
        this.geometry.rotateX(Math.PI/2);
        this.geometry.translate(0,1,0);
        return this.geometry;
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




export {Reina};


/**
 * Radianes = grados * PI /180
 */