

import { color } from '../libs/dat.gui.module.js';
import * as THREE from '../libs/three.module.js'
import * as CSG from '../libs/three-bvh-csg.js'





class Examen extends THREE.Object3D {

    constructor (gui, titleGui) {
        super();
        this.createGui(gui, titleGui);
        const evaluador = new CSG.Evaluator();
        var material = new THREE.MeshNormalMaterial();

        //BASE
        this.cuadrado1 = new THREE.BoxGeometry(4,0.5,4);
        this.cuadrado2 = new THREE.BoxGeometry(4,0.5,4);
        this.cuadrado2.rotateY(3* Math.PI/4);
        this.cuadrado1 = new CSG.Brush(this.cuadrado1, material);
        this.cuadrado2 = new CSG.Brush(this.cuadrado2, material);
        this.base = evaluador.evaluate(this.cuadrado1, this.cuadrado2, CSG.ADDITION);

        //CUERPO
        this.cuerpo = this.createCuerpo();
        this.cuerpo.translate(0,0.25,0);
        this.cuerpo = new CSG.Brush(this.cuerpo, material);
        this.figura = evaluador.evaluate(this.base, this.cuerpo, CSG.ADDITION);

        //CABEZA
        this.cabeza = new THREE.SphereGeometry(1.5, 30, 30);
        this.cabeza.translate(0, 6.4, 0);
        this.cabeza = new CSG.Brush(this.cabeza, material);
        this.figura = evaluador.evaluate(this.figura, this.cabeza, CSG.ADDITION);

        //TOROIDE UNION
        this.toroide = new THREE.TorusGeometry(1.75, 0.1, 30, 30);
        this.toroide.rotateX(Math.PI/2);
        this.toroide.translate(0, 0.8, 0);
        this.toroide = new CSG.Brush(this.toroide, material);
        this.figura = evaluador.evaluate(this.figura, this.toroide, CSG.ADDITION);

        //TOROIDE INTERSECCION
        this.toroide2 = new THREE.TorusGeometry(1.3, 0.1, 30, 30);
        this.toroide2.rotateX(Math.PI/2);
        this.toroide2.translate(0, 2.3, 0);
        this.toroide2 = new CSG.Brush(this.toroide2, material);
        this.figura = evaluador.evaluate(this.figura, this.toroide2, CSG.SUBTRACTION);
        
        //OJOS IZQUIERDO
        this.ojoIzq = this.createOjo();
        this.ojoIzq.scale(1,2,1);
        this.ojoIzq.translate(0.7, 6.4, 1.3);
       
        this.ojoIzq = new CSG.Brush(this.ojoIzq, material);
        this.figura = evaluador.evaluate(this.figura, this.ojoIzq, CSG.SUBTRACTION);

        //OJOS DERECHO
        this.ojoDer = this.createOjo();
        this.ojoDer.scale(1,2,1);
        this.ojoDer.translate(-0.7, 6.4, 1.3);
        this.ojoDer = new CSG.Brush(this.ojoDer, material);
        this.figura = evaluador.evaluate(this.figura, this.ojoDer, CSG.SUBTRACTION);

        //this.mesh = new THREE.Mesh(this.toroide, material);
        
        
        this.add(this.figura);
    }

    createOjo() {
        this.shape = new THREE.Shape();
        this.shape.moveTo(0, 0);
        this.shape.quadraticCurveTo(0.5,0.25, 0, 0.5);

        this.points = this.shape.extractPoints(40).shape;
        this.geometry = new THREE.LatheGeometry(this.points, 30);
        return this.geometry;
    }

    createCuerpo() {
        this.shape = new THREE.Shape();
        this.shape.moveTo(0, 0);
        this.shape.lineTo(1.75, 0);
        this.shape.lineTo(1.75, 0.5);
        this.shape.quadraticCurveTo(1,2.7, 1,5);
        this.shape.lineTo(0, 5);

        this.points = this.shape.extractPoints(40).shape;
        this.geometry = new THREE.LatheGeometry(this.points, 30);
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




export {Examen};