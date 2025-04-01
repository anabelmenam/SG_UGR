

import { color } from '../libs/dat.gui.module.js';
import * as THREE from '../libs/three.module.js'
import * as CSG from '../libs/three-bvh-csg.js'





class Examen extends THREE.Object3D {

    constructor (gui, titleGui) {
        super();
        this.createGui(gui, titleGui);
        const evaluador = new CSG.Evaluator();
        var material = new THREE.MeshNormalMaterial();

        this.base = this.createBase();
        this.base.rotateX(Math.PI/2);
        this.cuerpo = new THREE.CylinderGeometry(1,2,8, 20);
        this.cuerpo.translate(0,4,0);
        this.cabeza = new THREE.SphereGeometry(1, 20, 20);
        this.cabeza.translate(0, 8, 0);

        this.baseNariz = new THREE.CylinderGeometry(0.25,0.5,2, 20);
        this.baseNariz.rotateX(3* Math.PI / 4);
        this.baseNariz.translate(0, 6.5, 1.4);

        this.puntaNariz = new THREE.SphereGeometry(0.25, 20, 20);
        this.puntaNariz.translate(0, 5.8, 2.1);

        this.crin = this.createCrin();
        this.crin.rotateY(Math.PI/2);

        this.base = new CSG.Brush(this.base, material);
        this.cuerpo = new CSG.Brush(this.cuerpo, material);
        this.cabeza = new CSG.Brush(this.cabeza, material);
        this.baseNariz = new CSG.Brush(this.baseNariz, material);
        this.puntaNariz = new CSG.Brush(this.puntaNariz, material);
        this.crin = new CSG.Brush(this.crin, material);

        this.nariz = evaluador.evaluate(this.baseNariz, this.puntaNariz, CSG.ADDITION);
        this.figura = evaluador.evaluate(this.base,this.cuerpo, CSG.ADDITION);
        this.figura = evaluador.evaluate(this.figura, this.cabeza, CSG.ADDITION);
        this.figura = evaluador.evaluate(this.figura, this.nariz, CSG.DIFFERENCE);
        this.figura = evaluador.evaluate(this.figura, this.crin, CSG.ADDITION);
        
        //this.mesh = new THREE.Mesh(this.crin, material);
        
        
        this.add(this.figura);
    }


    createCrin() {
        this.path = new THREE.Shape();
        this.path.moveTo(-1, 9);
        this.path.lineTo(0,9);
        this.path.quadraticCurveTo(1,9, 1,8);
        this.path.lineTo(1.17,6.63);
        this.path.quadraticCurveTo(1.44, 6.16, 2, 6.25);
        this.path = this.shape2CatmullCurve3(this.path, 30);

        this.crin = new THREE.Shape();
        this.crin.absarc(0, 0, 0.2, 0, Math.PI * 2); 
        this.geometry = new THREE.ExtrudeGeometry(this.crin, { depth: 1,steps: 30, bevelEnabled: false, extrudePath: this.path });
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
    createBase() {
        this.shape = new THREE.Shape();
        this.shape.moveTo(2, -4);
        this.shape.quadraticCurveTo(2,-2, 4, -2);
        this.shape.lineTo(4, 2);
        this.shape.quadraticCurveTo(2, 2, 2, 4);
        this.shape.lineTo(-2, 4);
        this.shape.quadraticCurveTo(-2, 2, -4, 2);
        this.shape.lineTo(-4, -2);
        this.shape.quadraticCurveTo(-2, -2, -2, -4);
        this.shape.lineTo(2, -4);
        
        this.geometry = new THREE.ExtrudeGeometry(this.shape, { depth: 1, bevelEnabled: false });
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




export {Examen};