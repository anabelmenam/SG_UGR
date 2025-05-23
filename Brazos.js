

import * as THREE from '../libs/three.module.js'
import * as CSG from '../libs/three-bvh-csg.js'

class Brazos extends THREE.Object3D {
    constructor (gui, titleGui) {
        super();
        this.createGui(gui, titleGui);
        this.material = new THREE.MeshNormalMaterial();

        //CUERPO
        this.geometry_cuerpo = this.createCuerpo();
        this.geometry_brazoIzq = this.createBrazoIzquierdo();
        this.geometry_brazoDch = this.createBrazoDerecho();
        

        // CONTRUIMOS BRUSH
        var cuerpo = new CSG.Brush(this.geometry_cuerpo, this.material);
        var brazoIzq = new CSG.Brush(this.geometry_brazoIzq, this.material);
        var brazoDch= new CSG.Brush(this.geometry_brazoDch, this.material);

        //OPERAMOS
        var evaluador = new CSG.Evaluator();
        this.figura = evaluador.evaluate(brazoIzq, cuerpo, CSG.ADDITION);
        this.figura = evaluador.evaluate(this.figura, brazoDch, CSG.SUBTRACTION);

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

    createBrazoDerecho() {
        const puntos = [
            new THREE.Vector3(1.12, 3.86, 0),
            new THREE.Vector3(1.54, 3.42, 0),
            new THREE.Vector3(1.82, 2.9, 0),
            new THREE.Vector3(2.0, 2.36, 0),
            new THREE.Vector3(2.08, 1.82, 0),
            new THREE.Vector3(2.12, 1.2, 0),
            new THREE.Vector3(2.08, 0.64, 0),
        ];
    
        const curva = new THREE.CatmullRomCurve3(puntos);
        const geometriaBrazo = new THREE.TubeGeometry(curva, 100, 0.1, 20, false);
    
        return geometriaBrazo;
    }
    
    createBrazoIzquierdo() {
        const puntos = [
            new THREE.Vector3(-1.12, 3.86, 0),
            new THREE.Vector3(-1.54, 3.42, 0),
            new THREE.Vector3(-1.82, 2.9, 0),
            new THREE.Vector3(-2.0, 2.36, 0),
            new THREE.Vector3(-2.08, 1.82, 0),
            new THREE.Vector3(-2.12, 1.2, 0),
            new THREE.Vector3(-2.08, 0.64, 0),
        ];
    
        const curva = new THREE.CatmullRomCurve3(puntos);
        const geometriaBrazo = new THREE.TubeGeometry(curva, 100, 0.1, 20, false);
    
        return geometriaBrazo;
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

export { Brazos };
