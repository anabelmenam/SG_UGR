

import { color } from '../libs/dat.gui.module.js';
import * as THREE from '../libs/three.module.js'
import * as CSG from '../libs/three-bvh-csg.js'





class Gorro extends THREE.Object3D {

    constructor (gui, titleGui) {
        super();
        this.evaluador = new CSG.Evaluator();
        this.material = new THREE.MeshNormalMaterial();

        this.shapeGorro = new THREE.Shape();
        this.shapeGorro.moveTo(0,0);
        this.shapeGorro.lineTo(4,0);
        this.shapeGorro.quadraticCurveTo(3,0.15, 2,0.5);
        this.shapeGorro.lineTo(0,5);

        this.points = this.shapeGorro.extractPoints().shape;
        this.gorro = new THREE.LatheGeometry(this.points, 30);

        this.cilindro = new THREE.CylinderGeometry(2,2,1,30);
        this.cilindroCorte = new THREE.CylinderGeometry(1.9,1.9,1,30);
        this.cilindro.translate(0,0.5,0);
        this.cilindroCorte.translate(0,0.5,0);

        this.caja = new THREE.BoxGeometry(1,0.5,0.5);
        this.caja.translate(0,0.75,2);
        this.cajaCorte = new THREE.BoxGeometry(0.75,0.25,0.25);
        this.cajaCorte.translate(0,0.75,2.2);
       


        




        this.hebilla = new CSG.Brush(this.caja, this.material);
        this.corteHebilla = new CSG.Brush(this.cajaCorte, this.material);
        this.hebilla = this.evaluador.evaluate(this.hebilla, this.corteHebilla, CSG.SUBTRACTION);
        this.cilindro = new CSG.Brush(this.cilindro, this.material);
        this.cilindroCorte = new CSG.Brush(this.cilindroCorte, this.material);
        this.gorro = new CSG.Brush(this.gorro, this.material);
        this.cilindro = this.evaluador.evaluate(this.cilindro, this.cilindroCorte, CSG.SUBTRACTION);
        this.gorro = this.evaluador.evaluate(this.gorro, this.cilindro, CSG.ADDITION);
        this.gorro = this.evaluador.evaluate(this.gorro, this.hebilla, CSG.ADDITION);
        
        this.add(this.gorro);
    }



}




export {Gorro};


/**
 * Radianes = grados * PI /180
 */