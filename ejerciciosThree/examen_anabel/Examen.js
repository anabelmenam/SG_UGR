

import { color } from '../libs/dat.gui.module.js';
import * as THREE from '../libs/three.module.js'
import * as CSG from '../libs/three-bvh-csg.js'





class ExamenI extends THREE.Object3D {

    constructor (gui, titleGui) {
        super();
        this.createGui(gui, titleGui);
        const evaluador = new CSG.Evaluator();
        var material = new THREE.MeshNormalMaterial();

        this.shape = new THREE.Shape();
        
        //Figura general
        this.shape.moveTo(0, 0);
        this.shape.lineTo(1, 0);
        this.shape.lineTo(1, 1);
        this.shape.lineTo(0.5, 1);
        this.shape.quadraticCurveTo(0,1, 0, 0.5);
        this.shape.lineTo(0, 0);

        const options = {depth: 1, 
            bevelEnabled: true, 
            bevelThickness: 0.2, 
            bevelSize: 0.15, 
            bevelSegments: 5,
            bevelSegments: 10};


        this.shape1 = new THREE.Shape();
        this.shape1.moveTo(0.25, 0);
        this.shape1.lineTo(0.75, 0);
        this.shape1.quadraticCurveTo(1, 0, 1, 0.25);
        this.shape1.lineTo(1, 0.75);
        this.shape1.quadraticCurveTo(1, 1, 0.75, 1);
        this.shape1.lineTo(0.25, 1);
        this.shape1.quadraticCurveTo(0, 1, 0, 0.75);
        this.shape1.lineTo(0, 0.25);
        this.shape1.quadraticCurveTo(0, 0, 0.25, 0);

        this.shape1 = this.scaleShape(this.shape1, 0.45);
        this.shape1 = this.translateShape(this.shape1, 0.35, 0.35);
        this.shape.holes.push(this.shape1);

        this.geometry1 = new THREE.ExtrudeGeometry(this.shape,options);

        //Cubo de dentro que corta 
        this.shape2 = new THREE.Shape();
        this.shape2.moveTo(-1, 0.25);
        this.shape2.lineTo(2, 0.25);
        this.shape2.lineTo(2, 2);
        this.shape2.lineTo(0, 2);
        this.shape2.lineTo(-1, 0.25);
        this.geometry2 = new THREE.ExtrudeGeometry(this.shape2, {depth: 0.30, bevelEnabled: true, bevelSegments:100, bevelThickness: 0.1, bevelSize: 0.05});
        this.geometry2.translate(0, 0, 0.35);

        this.figura = new CSG.Brush(this.geometry1, material);
        
        this.corte = new CSG.Brush(this.geometry2, material);
        this.figura = evaluador.evaluate(this.figura, this.corte, CSG.SUBTRACTION)
        this.figura.translateX(-8);
        //this.mesh = new THREE.Mesh(this.geometry2, material);
        
        this.add(this.figura);
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

class ExamenH extends THREE.Object3D {

    constructor (gui, titleGui) {
        super();
        this.createGui(gui, titleGui);
        var material = new THREE.MeshNormalMaterial();
        const evaluador = new CSG.Evaluator();

        //Base
        this.shape = new THREE.Shape();
        this.shape.moveTo(-0.5, -1.5);
        this.shape.quadraticCurveTo(0,-1.7, 0.5,-1.5);
        this.shape.lineTo(3.5, -0.5);
        this.shape.quadraticCurveTo(4.5, 0, 3.5, 0.5);
        this.shape.lineTo(0.5, 1.5);
        this.shape.quadraticCurveTo(0, 1.7, -0.5, 1.5);
        this.shape.lineTo(-3.5, 0.5);
        this.shape.quadraticCurveTo(-4.5, 0, -3.5, -0.5);
        this.shape.lineTo(-0.5, -1.5);

        
        this.hole1 = new THREE.Shape();
        this.hole2 = new THREE.Shape();
        this.hole1.absarc(-2.5, 0, 0.5, 0, Math.PI * 2, false);
        this.hole2.absarc(2.5, 0, 0.5, 0, Math.PI * 2, false);

        this.shape.holes.push(this.hole1);
        this.shape.holes.push(this.hole2);

        //this.geometry = new THREE.LineGeometry(this.shape.getPoints(50));
        this.geometry = new THREE.ExtrudeGeometry(this.shape, {depth: 0.5, curveSegments:20 ,bevelEnabled: true, bevelSegments:100, bevelThickness: 0.3, bevelSize: 0.2});
        this.geometry.rotateX(Math.PI/2);


        //Parte de arriba 
        this.shape1 = new THREE.Shape();
        this.shape1.lineTo(2.5,0);
        this.shape1.lineTo(2.5,1);
        this.shape1.quadraticCurveTo(2,1.4, 2,2);
        this.shape1.lineTo(2,4);
        this.shape1.lineTo(0,4);
        this.shape1 = this.scaleShape(this.shape1, 0.5)
        this.shape1 = this.translateShape(this.shape1, 0, -0.4)
        this.points = this.shape1.extractPoints(90).shape;
        this.geometry1 = new THREE.LatheGeometry(this.points, this.guiControls.resolucion);
        
        this.geometry2 = new THREE.CylinderGeometry(0.5, 0.5, 5)

        this.figura = new CSG.Brush(this.geometry, material);
        this.union = new CSG.Brush(this.geometry1, material);
        this.interseccion = new CSG.Brush(this.geometry2, material);

        this.figura = evaluador.evaluate(this.figura, this.union, CSG.ADDITION)
        this.figura = evaluador.evaluate(this.figura, this.interseccion, CSG.SUBTRACTION)

        this.figura.position.set(10,0,0);
        
        
        
        //this.visagra.position.set(4, 0, 0);
        
        //this.mesh = new THREE.Mesh(this.geometry, material);

        this.add(this.figura);
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
    
    rotateShape(shape, angle) {
        var points = shape.extractPoints().shape;
        var rotatedPoints = points.map(p => new THREE.Vector2(
            p.x * Math.cos(angle) - p.y * Math.sin(angle),
            p.x * Math.sin(angle) + p.y * Math.cos(angle)
        ));
        return new THREE.Shape(rotatedPoints);
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

}

class ExamenJ extends THREE.Object3D {
    constructor (gui, titleGui) {
        super();
        this.createGui(gui, titleGui);
        const evaluador = new CSG.Evaluator();
        var material = new THREE.MeshNormalMaterial();
        this.base = this.createBase();
        this.hueco = this.createHueco();

        this.cilindro = this.createCilindro();
        this.cilindro.translate(-3, 0,0);
        this.cilindroG = this.createCilindro();
        this.cilindroG.translate(0, 0.5, 0);
        this.cilindroG.scale(2, 2, 2);
        this.cubo = this.createCuadrado();
        this.cubo.scale(2, 2, 2);
        this.cubo.translate(1.3, 1, 0);
        this.cuboCorte = this.createCuadrado();
        this.cuboCorte.scale(4, 4, 4);
        this.cuboCorte.rotateZ(Math.PI/2.5);
        this.cuboCorte.translate(1.1, 2.9, 0);
        this.cilindroP = this.createCilindro();
        this.cilindroP.scale(0.5, 2.5, 0.5);
        this.cilindroP.translate(1.5, 0,0);
       

        this.cilindro = new CSG.Brush(this.cilindro, material);
        this.cilindroG = new CSG.Brush(this.cilindroG, material);
        this.cilindroP = new CSG.Brush(this.cilindroP, material);
        this.base = new CSG.Brush(this.base, material);
        this.hueco = new CSG.Brush(this.hueco, material);
        this.cubo = new CSG.Brush(this.cubo, material);
        this.cuboCorte = new CSG.Brush(this.cuboCorte, material);
        this.figura = evaluador.evaluate(this.cilindroG, this.cubo, CSG.ADDITION)
        this.figura = evaluador.evaluate(this.figura, this.cuboCorte, CSG.SUBTRACTION)
        this.figura = evaluador.evaluate(this.base, this.figura, CSG.ADDITION)
        this.figura = evaluador.evaluate(this.figura, this.hueco, CSG.SUBTRACTION)
        this.figura = evaluador.evaluate(this.figura, this.cilindro, CSG.SUBTRACTION)
        this.figura = evaluador.evaluate(this.figura, this.cilindroP, CSG.SUBTRACTION)
        //this.mesh = new THREE.Mesh(this.hueco, material);

        this.add(this.figura);
    }

    createBase () {
        this.shape = new THREE.Shape();
        this.shape.moveTo(-4,0);
        this.shape.lineTo(-4,-1);
        this.shape.quadraticCurveTo(-4,-3, -3, -3);
        this.shape.lineTo(3,-3);
        this.shape.quadraticCurveTo(4,-3, 4, -1);
        this.shape.lineTo(4, 1);
        this.shape.quadraticCurveTo(4,3, 3, 3);
        this.shape.lineTo(-3,3);
        this.shape.quadraticCurveTo(-4, 3, -4, 1);
        this.shape.lineTo(-4,0);

        const options = {
            depth:0.5,
            curveSegments:20,
            bevelEnabled: true, 
            bevelSegments:10, 
            bevelThickness: 0.3, 
            bevelSize: 0.2
        }
        
        this.hole1 = new THREE.Shape();
        this.hole1.absarc(-2,2,0.5,0, Math.PI*2, false);
        this.shape.holes.push(this.hole1);
        this.hole2 = new THREE.Shape();
        this.hole2.absarc(-2,-2,0.5,0, Math.PI*2, false);
        this.shape.holes.push(this.hole2);

        this.geometry = new THREE.ExtrudeGeometry(this.shape, options );
        this.geometry.rotateX(Math.PI / 2);

        const mesh = new THREE.Mesh(this.geometry);
        mesh.updateMatrix();
        this.geometry.applyMatrix4(mesh.matrix);
        this.geometry.computeVertexNormals();


        return this.geometry;
    }


    createHueco() {
        this.shape = new THREE.Shape();
        this.shape.lineTo(1,0);
        this.shape.lineTo(1,1);
        this.shape.bezierCurveTo(1,2.5,-1,2.5,-1,1);
        this.shape.lineTo(-1,0);
        
        this.points = this.shape.extractPoints().shape;
        this.geometry = new THREE.LatheGeometry(this.points, 30);
        this.geometry.scale(1.25,1.25,1.25);
        this.geometry.rotateZ(-Math.PI / 2);
        this.geometry.translate(-4.3,0.8,0);

        return this.geometry;
        
    }

    createCuadrado () {
        this.geometry = new THREE.BoxGeometry(1,1,1);
        return this.geometry;
    }
    createCilindro() {
        this.geometry = new THREE.CylinderGeometry(0.6,0.6,1);

        return this.geometry;
    }

    translateShape(shape, dx, dy) {
        var points = shape.extractPoints().shape;
        var translatedPoints = points.map(p => new THREE.Vector2(p.x + dx, p.y + dy));
        return new THREE.Shape(translatedPoints);
    }
    
    rotateShape(shape, angle) {
        var points = shape.extractPoints().shape;
        var rotatedPoints = points.map(p => new THREE.Vector2(
            p.x * Math.cos(angle) - p.y * Math.sin(angle),
            p.x * Math.sin(angle) + p.y * Math.cos(angle)
        ));
        return new THREE.Shape(rotatedPoints);
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
}


export {ExamenH, ExamenI, ExamenJ};