

import { color } from '../libs/dat.gui.module.js';
import * as THREE from '../libs/three.module.js'
import * as CSG from '../libs/three-bvh-csg.js'





class Casco extends THREE.Object3D {

    constructor (gui, titleGui) {
        super();
        this.evaluador = new CSG.Evaluator();
        this.material = new THREE.MeshNormalMaterial();

        this.cascoCompleto = this.createCascoCompleto();

        
        
        this.add(this.cascoCompleto);
    }

    createCasco () {
        this.cilindro = new THREE.CylinderGeometry(1,1,1,30);
        this.esfera = new THREE.SphereGeometry(1,30,30);
        this.cilindro.translate(0,0.5,0);
        this.esfera.translate(0,1,0);
        this.cilindro = new CSG.Brush(this.cilindro, this.material);
        this.esfera = new CSG.Brush(this.esfera, this.material);

        this.cilindro2 = new THREE.CylinderGeometry(0.8,0.8,1,30);
        this.esfera2 = new THREE.SphereGeometry(0.8,30,30);
        this.cilindro2.translate(0,0.5,0);
        this.esfera2.translate(0,1.1,0);
        this.cilindro2 = new CSG.Brush(this.cilindro2, this.material);
        this.esfera2 = new CSG.Brush(this.esfera2, this.material);
        this.hueco = this.evaluador.evaluate(this.cilindro2, this.esfera2, CSG.ADDITION);
        
        this.caja = new THREE.BoxGeometry(1.5,1.5,1.5);
        this.caja.translate(0,0.5,1);
        this.caja = new CSG.Brush(this.caja, this.material);
        this.casco = this.evaluador.evaluate(this.cilindro, this.esfera, CSG.ADDITION);
        this.casco = this.evaluador.evaluate(this.casco, this.hueco, CSG.SUBTRACTION);
        this.casco = this.evaluador.evaluate(this.casco, this.caja, CSG.SUBTRACTION);
        return this.casco;
    }

    createBarrido () {
        this.path = new THREE.Shape();
        this.path.moveTo(1.4,1);
        this.path.quadraticCurveTo(1.25,2.25,0,2.4);
        this.path = this.shape2CatmullCurve3(this.path, 30);
        
        this.figura = new THREE.Shape();
        this.figura.lineTo(0.15,0.1);
        this.figura.lineTo(0.3,0);
        
        this.figura.lineTo(0.3,0.4);
        this.figura.quadraticCurveTo(0.15,0.35,0,0.4);
        this.figura.lineTo(0,0);

        this.geometry = new THREE.ExtrudeGeometry(this.figura, { depth: 1,steps: 30, bevelEnabled: false, extrudePath: this.path });
        return this.geometry;
    }

    createMascara () {
        this.cilindro3 = new THREE.CylinderGeometry(1.1,1.1,1,30);
        this.cilindro3.translate(0,0.4,0);
        this.caja2 = new THREE.BoxGeometry(3,4,3);
        this.caja2.translate(0,0.4,-1.3);
        this.cilindro4 = new THREE.CylinderGeometry(1,1,4,30);
        this.cilindro4.translate(0,0.4,0);
        
        this.shape1 = new THREE.Shape();
        this.shape1.moveTo(1.2,1.4);
        this.shape1.lineTo(-1.2,1.4);
        this.shape1.lineTo(-1.2,0.5);
        this.shape1.quadraticCurveTo(-0.75,0.5, -0.3,0.7);
        this.shape1.quadraticCurveTo(0,0.95, 0.3,0.7);
        this.shape1.quadraticCurveTo(0.75,0.5, 1.2,0.5);
        this.shape1.lineTo(1.2,1.4);

        this.recorte1 = new THREE.ExtrudeGeometry(this.shape1, { depth: 2,steps: 30, bevelEnabled: false });

        this.cilindro3 = new CSG.Brush(this.cilindro3, this.material);
        this.caja2 = new CSG.Brush(this.caja2, this.material);
        this.cilindro4 = new CSG.Brush(this.cilindro4, this.material);
        this.recorte1 = new CSG.Brush(this.recorte1, this.material);

        this.mascara = this.evaluador.evaluate(this.cilindro3, this.cilindro4, CSG.SUBTRACTION);
        this.mascara = this.evaluador.evaluate(this.mascara, this.caja2, CSG.SUBTRACTION);
        this.mascara = this.evaluador.evaluate(this.mascara, this.recorte1, CSG.SUBTRACTION);


        return this.mascara;
    }

    createCascoCompleto() {
        this.casco = this.createCasco();
        this.casco.translateY(0.5);

        this.cresta = this.createBarrido();
        this.cresta.rotateY(Math.PI/2);
        this.cresta.translate(0.15,0,0);
        this.cresta = new CSG.Brush(this.cresta, this.material);
        
        this.casco = this.evaluador.evaluate(this.casco, this.cresta, CSG.ADDITION);
        this.casco.position.set(0,0,0);

        this.mascara = this.createMascara();
        this.casco = this.evaluador.evaluate(this.casco, this.mascara, CSG.ADDITION);
        return this.casco;
    }
  


  

    

    shape2CatmullCurve3(shapePath, res = 30) {
        var v2 = shapePath.extractPoints(res).shape;
        var v3 = [];
        v2.forEach((v) => {
            v3.push(new THREE.Vector3(v.x, v.y, 0));
        })
        return new THREE.CatmullRomCurve3(v3);
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




export {Casco

};


/**
 * Radianes = grados * PI /180
 */