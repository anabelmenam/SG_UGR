

import { color } from '../libs/dat.gui.module.js';
import * as THREE from '../libs/three.module.js'
import * as CSG from '../libs/three-bvh-csg.js'





class Rey extends THREE.Object3D {

    constructor (gui, titleGui) {
        super();
        this.createGui(gui, titleGui);
        this.evaluador = new CSG.Evaluator();
        this.material = new THREE.MeshNormalMaterial();

        //CUERPO
        this.cuerpo = this.createCuerpo();
        this.cuerpo = new CSG.Brush(this.cuerpo, this.material);

        this.toroide1 = new THREE.TorusGeometry(2,0.4,30,30);
        this.toroide1.rotateX(Math.PI/2);
        this.toroide1.translate(0,9.5,0);
        this.toroide1 = new CSG.Brush(this.toroide1, this.material);

        this.toroide2 = new THREE.TorusGeometry(2,0.15,30,30);
        this.toroide2.rotateX(Math.PI/2);
        this.toroide2.translate(0,10,0);
        this.toroide2 = new CSG.Brush(this.toroide2, this.material);

        this.toroide3 = new THREE.TorusGeometry(2,0.15,30,30);
        this.toroide3.rotateX(Math.PI/2);
        this.toroide3.translate(0,10.7,0);
        this.toroide3 = new CSG.Brush(this.toroide3, this.material);



        //CABEZA
        this.cabeza = this.createCabeza();
        this.cabeza = new CSG.Brush(this.geometry, this.material);
        
        
        this.cruz = this.createCruz();
        //this.cruz = this.createCruz2();

        
    
        //FIGURA FINAL
        this.figura = this.evaluador.evaluate(this.cuerpo, this.cabeza, CSG.ADDITION);
        this.figura = this.evaluador.evaluate(this.figura, this.toroide1, CSG.ADDITION);
        this.figura = this.evaluador.evaluate(this.figura, this.toroide2, CSG.ADDITION);
        this.figura = this.evaluador.evaluate(this.figura, this.toroide3, CSG.ADDITION);
        this.figura = this.evaluador.evaluate(this.figura, this.cruz, CSG.ADDITION);
        
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

    createCabeza () {
        this.shape = new THREE.Shape();
        this.shape.moveTo(0,0);
        this.shape.lineTo(2,0);
        this.shape.quadraticCurveTo(1.9,1.4,2.75,2.5);
        this.shape.quadraticCurveTo(3.2,2.6,3,3);
        this.shape.quadraticCurveTo(1.6,4, 0,3.75);
        this.shape.lineTo(0.5,3.8);
        this.shape.quadraticCurveTo(1,3.9, 0.5,4);
        this.shape.lineTo(0,4);

        this.points = this.shape.extractPoints(40).shape;
        this.geometry = new THREE.LatheGeometry(this.points, 30);
        this.geometry.translate(0,10.8,0);

        
        return this.geometry;
    }

    createCruz() {
        this.centroCruz = new THREE.BoxGeometry(0.7,0.7, 0.7,1);
        this.centroCruz.translate(0,16.4,0);
        this.centroCruz = new CSG.Brush(this.centroCruz, this.material);
        this.geometriaLadoCruz = new THREE.CylinderGeometry(0.4,0.7, 1.5,4);
        this.geometriaLadoCruz.rotateY(3*Math.PI / 4);
        this.geometriaLadoCruz.translate(0,15.4,0);
        
        this.ladoCruz = new CSG.Brush(this.geometriaLadoCruz, this.material);
        this.cruz = this.evaluador.evaluate(this.centroCruz, this.ladoCruz, CSG.ADDITION);

        for(let i=1; i<4; i++){
            this.geometriaLadoCruz.rotateZ(Math.PI / 2);
            this.geometriaLadoCruz.translate(16.4,16.4,0);
            this.ladoCruz = new CSG.Brush(this.geometriaLadoCruz, this.material);
            this.cruz = this.evaluador.evaluate(this.cruz, this.ladoCruz, CSG.ADDITION);

        }

        return this.cruz;
    }

    createCruz2() {
        // CRUZ
        this.geometry_centro = new THREE.BoxGeometry(0.4, 0.4, 0.4);
        this.geometry_centro.translate(0,17,0);

        this.geometry_palo1 = new THREE.CylinderGeometry(0.8, 0.25, 1.2, 4);
        this.geometry_palo1.rotateY(Math.PI/3*Math.PI/4);
        this.geometry_palo1.rotateX(Math.PI/2+Math.PI/2);
        this.geometry_palo1.translate(0,16.25,0);


        this.geometry_palo2 = new THREE.CylinderGeometry(0.8, 0.25, 1.2, 4);
        this.geometry_palo2.rotateY(-Math.PI/3*Math.PI/4);
        this.geometry_palo2.translate(0,17.8,0);


        this.geometry_palo3 = new THREE.CylinderGeometry(0.8, 0.25, 1.5, 4);
        this.geometry_palo3.rotateY(-Math.PI/3*Math.PI/4);
        this.geometry_palo3.rotateZ(Math.PI/2);
        this.geometry_palo3.translate(-0.9,17,0);

        this.geometry_palo4 = new THREE.CylinderGeometry(0.8, 0.25, 1.5, 4);
        this.geometry_palo4.rotateY(-Math.PI/3*Math.PI/4);
        this.geometry_palo4.rotateZ(-Math.PI/2);
        this.geometry_palo4.translate(0.9,17,0);

        // CONTRUIMOS BRUSH
        this.palo1 = new CSG.Brush(this.geometry_palo1, this.material);
        this.palo2 = new CSG.Brush(this.geometry_palo2, this.material);
        this.palo3 = new CSG.Brush(this.geometry_palo3, this.material);
        this.palo4 = new CSG.Brush(this.geometry_palo4, this.material);
        this.centro = new CSG.Brush(this.geometry_centro, this.material);
        
        this.cruz = this.evaluador.evaluate(this.palo1, this.palo2, CSG.ADDITION);
        this.cruz = this.evaluador.evaluate(this.cruz, this.palo3, CSG.ADDITION);
        this.cruz = this.evaluador.evaluate(this.cruz, this.palo4, CSG.ADDITION);
        this.cruz = this.evaluador.evaluate(this.cruz, this.centro, CSG.ADDITION);

        return this.cruz;
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




export {Rey};


/**
 * Radianes = grados * PI /180
 */