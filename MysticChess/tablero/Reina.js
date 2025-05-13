

import * as THREE from '../libs/three.module.js'
import * as CSG from '../libs/three-bvh-csg.js'

class Reina extends THREE.Object3D {
    constructor (gui, titleGui) {
        super();
        this.createGui(gui, titleGui);
        this.material = new THREE.MeshNormalMaterial();

        //CABEZA
        this.geometry_cilindro = new THREE.CylinderGeometry(2.8,1,3.2);
        this.geometry_cilindro.translate(0,12,0);

        //CUERPO
        this.geometry_toro = new THREE.TorusGeometry(2.8,1);
        this.geometry_cuerpo = this.createCuerpo();
        this.geometry_cuerpo2 = this.createCuerpo2();

        // CONTRUIMOS BRUSH
        var cilindro = new CSG.Brush(this.geometry_cilindro, this.material);
        var cuerpo = new CSG.Brush(this.geometry_cuerpo, this.material);
        var cuerpo2 = new CSG.Brush(this.geometry_cuerpo2, this.material);

        //OPERAMOS
        var evaluador = new CSG.Evaluator();
        this.figura = evaluador.evaluate(cilindro, cuerpo, CSG.ADDITION);
        this.figura = evaluador.evaluate(this.figura, cuerpo2, CSG.ADDITION);

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
        this.shape.quadraticCurveTo(1.5,5, 1,9);
        this.shape.lineTo(0,9);

        const points = this.shape.extractPoints(40).shape;
        this.geometry = new THREE.LatheGeometry(points, 100);
        return this.geometry;
    }

    createCuerpo2() {
        this.shape = new THREE.Shape();
        this.shape.lineTo(1.63,0);
        this.shape.quadraticCurveTo(1.1,0.36, 1,1);
        this.shape.lineTo(0,1);

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

export { Reina };