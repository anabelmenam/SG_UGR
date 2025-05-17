import { color } from '../libs/dat.gui.module.js';
import * as THREE from '../libs/three.module.js'
import * as CSG from '../libs/three-bvh-csg.js'
import { Pieza } from './Pieza.js';
import { Brazos } from './Brazos.js';

class Alfil extends Pieza {

    constructor (equipo, casilla, nombre, resolucion) {
        super(equipo, casilla, nombre, resolucion);
        this.casillaActual = casilla;
        this.equipo = equipo;
        this.resolucion = resolucion;
    }

    generarGeometria() {
        var evaluador = new CSG.Evaluator();
        var material = new THREE.MeshNormalMaterial();

        //CUERPO
        var cuerpo = this.createCuerpo();
        var cuerpo = new CSG.Brush(cuerpo, material);

        var cuello = new THREE.TorusGeometry(1, 0.2, this.resolucion, this.resolucion);
        cuello.rotateX(Math.PI/2);
        cuello.rotateY(Math.PI/6);
        cuello.translate(0,11,0);
        cuello = new CSG.Brush(cuello, material);

        var cuello2 = new THREE.TorusGeometry(1.2, 0.06, this.resolucion, this.resolucion);
        cuello2.rotateX(Math.PI/2);
        cuello2.rotateY(Math.PI/6);
        cuello2.translate(0,11,0);
        cuello2 = new CSG.Brush(cuello2, material);

        //CABEZA
        var cabeza = this.createCabeza();
        cabeza = new CSG.Brush(cabeza, material);
        var bolaCabeza = new THREE.SphereGeometry(0.4, this.resolucion, this.resolucion);
        bolaCabeza.translate(0,15,0);
        bolaCabeza = new CSG.Brush(bolaCabeza, material);

        var cuello3 = new THREE.TorusGeometry(0.4, 0.1, this.resolucion, this.resolucion);
        cuello3.rotateX(Math.PI/2);
        cuello3.rotateY(Math.PI/6);
        cuello3.translate(0,14.7,0);
        cuello3 = new CSG.Brush(cuello3, material);

        //CORTE 
        var corte = new THREE.BoxGeometry(0.3,2,3);
        corte.rotateZ(-160*Math.PI/180);
        corte.translate(-1,14,0);
        corte = new CSG.Brush(corte, material);
 
        var alfil = evaluador.evaluate(cuerpo, cabeza, CSG.ADDITION);
        alfil = evaluador.evaluate(alfil, bolaCabeza, CSG.ADDITION);
        alfil = evaluador.evaluate(alfil, corte, CSG.SUBTRACTION);
        alfil = evaluador.evaluate(alfil, cuello, CSG.ADDITION);
        alfil = evaluador.evaluate(alfil, cuello2, CSG.SUBTRACTION);
        alfil = evaluador.evaluate(alfil, cuello3, CSG.ADDITION);
        var geometriaAlfil = alfil.geometry;
        
        return geometriaAlfil;
    }

    generarBrazos(material, equipo) {
        const brazos = new Brazos(material, this.resolucion);

        const brazoIzq = brazos.createBrazoIzquierdo(equipo);
        const brazoDch = brazos.createBrazoDerecho(equipo);

        if(equipo == 1) {
            brazoIzq.rotation.y = Math.PI;
            brazoDch.rotation.y = Math.PI;
        }
        brazoIzq.position.set(-1.3, 10, 0);
        brazoDch.position.set(1.3, 10, 0);

        this.brazoIzq = brazoIzq;
        this.brazoDch = brazoDch;

        this.add(brazoIzq);
        this.add(brazoDch);
    }

    movimientosPosibles() {
        let i,j;
        let casillas = [];

        
        for(let x = this.casillaActual.index[0]-1, y = this.casillaActual.index[1]-1; x >= 0 && y >= 0; x--, y--) {
            casillas.push([x, y]);
        }
        for(let x = this.casillaActual.index[0]+1, y = this.casillaActual.index[1]+1; x < 8 && y < 8; x++, y++) {
            casillas.push([x, y]);
        }
        for(let x = this.casillaActual.index[0]-1, y = this.casillaActual.index[1]+1; x >= 0 && y < 8; x--, y++) {
            casillas.push([x, y]);
        }
        for(let x = this.casillaActual.index[0]+1, y = this.casillaActual.index[1]-1; x < 8 && y >= 0; x++, y--) {
            casillas.push([x, y]);
        }

        
        
        return casillas;
    }

    createCuerpo() {
        var shape = new THREE.Shape();
        shape.lineTo(4.5,0);
        shape.quadraticCurveTo(5,0.25, 5,0.7);
        shape.quadraticCurveTo(4.9,1, 4.5,1);
        shape.quadraticCurveTo(5.2,1.3, 4.5,1.5);
        shape.quadraticCurveTo(3.5,1.9,3.5,3);
        shape.lineTo(3,3);
        shape.quadraticCurveTo(1,7, 1,11);
        shape.lineTo(0,11);

        const points = shape.extractPoints(this.resolucion).shape;
        var geometry = new THREE.LatheGeometry(points, this.resolucion);
        return geometry;
    }

    createCabeza () {
        var shapeCabeza = new THREE.Shape();
        shapeCabeza.moveTo(0,11)
        shapeCabeza.lineTo(1,11);
        shapeCabeza.quadraticCurveTo(2.7,13, 0,15);

        const points = shapeCabeza.extractPoints(this.resolucion).shape;
        var geometry2 = new THREE.LatheGeometry(points, this.resolucion);
        return geometry2;
    }
}

export { Alfil };