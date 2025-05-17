import { color } from '../libs/dat.gui.module.js';
import * as THREE from '../libs/three.module.js'
import * as CSG from '../libs/three-bvh-csg.js'
import { Pieza } from './Pieza.js';
import { Brazos } from './Brazos.js';

class Rey extends Pieza {
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
        cuerpo = new CSG.Brush(cuerpo, material);

        var toroide1 = new THREE.TorusGeometry(2, 0.4, this.resolucion, this.resolucion);
        toroide1.rotateX(Math.PI/2);
        toroide1.rotateY(Math.PI/6);
        toroide1.translate(0,9.5,0);
        toroide1 = new CSG.Brush(toroide1, material);

        var toroide2 = new THREE.TorusGeometry(2, 0.15, this.resolucion, this.resolucion);
        toroide2.rotateX(Math.PI/2);
        toroide2.rotateY(Math.PI/6);
        toroide2.translate(0,10,0);
        toroide2 = new CSG.Brush(toroide2, material);

        var toroide3 = new THREE.TorusGeometry(2, 0.15, this.resolucion, this.resolucion);
        toroide3.rotateX(Math.PI/2);
        toroide3.rotateX(Math.PI/6);
        toroide3.translate(0,10.7,0);
        toroide3 = new CSG.Brush(toroide3, material);

        //CABEZA
        var cabeza = this.createCabeza();
        cabeza = new CSG.Brush(cabeza, material);
        
        // CRUZ
        var centroCruz = new THREE.BoxGeometry(0.7,0.7, 0.7,1);
        centroCruz.translate(0,16.4,0);
        centroCruz = new CSG.Brush(centroCruz, material);
        var geometriaLadoCruz = new THREE.CylinderGeometry(0.4,0.7, 1.5,4);
        geometriaLadoCruz.rotateY(3*Math.PI/4);
        geometriaLadoCruz.translate(0,15.4,0);
        
        var ladoCruz = new CSG.Brush(geometriaLadoCruz, material);
        var cruz = evaluador.evaluate(centroCruz, ladoCruz, CSG.ADDITION);

        for(let i=1; i<4; i++){
            geometriaLadoCruz.rotateZ(Math.PI / 2);
            geometriaLadoCruz.translate(16.4,16.4,0);
            ladoCruz = new CSG.Brush(geometriaLadoCruz, material);
            cruz = evaluador.evaluate(cruz, ladoCruz, CSG.ADDITION);
        }

        //FIGURA FINAL
        var figura = evaluador.evaluate(cuerpo, cabeza, CSG.ADDITION);
        figura = evaluador.evaluate(figura, toroide1, CSG.ADDITION);
        figura = evaluador.evaluate(figura, toroide2, CSG.ADDITION);
        figura = evaluador.evaluate(figura, toroide3, CSG.ADDITION);
        figura = evaluador.evaluate(figura, cruz, CSG.ADDITION);

        var geometriaRey = figura.geometry;
        return geometriaRey;
    }

    movimientosPosibles() {
        let i,j;
        let casillas = [];

        i = this.casillaActual.index[0]-1;
        j = this.casillaActual.index[1];
        casillas.push([i, j]);

        i = this.casillaActual.index[0]+1;
        j = this.casillaActual.index[1];
        casillas.push([i, j]);

        if (this.equipo == 1) {
            i = this.casillaActual.index[0];
            j = this.casillaActual.index[1]-1;
        } 
        else if (this.equipo == 0) {
            i = this.casillaActual.index[0];
            j = this.casillaActual.index[1]+1;
        }
        casillas.push([i, j]);
        
        return casillas;
    }

    generarBrazos(material, equipo) {
        const brazos = new Brazos(material, this.resolucion);

        const brazoIzq = brazos.createBrazoIzquierdo(equipo);
        const brazoDch = brazos.createBrazoDerecho(equipo);

        if(equipo == 1) {
            brazoIzq.rotation.y = Math.PI;
            brazoDch.rotation.y = Math.PI;
        }
        brazoIzq.position.set(-2.3, 9.5, 0);
        brazoDch.position.set(2.3, 9.5, 0);

        this.brazoIzq = brazoIzq;
        this.brazoDch = brazoDch;

        this.add(brazoIzq);
        this.add(brazoDch);
    }

    createCuerpo() {
        var shape = new THREE.Shape();
        shape.lineTo(4.5,0);
        shape.quadraticCurveTo(5,0.25, 5,0.7);
        shape.quadraticCurveTo(4.9,1, 4.5,1);
        shape.quadraticCurveTo(5.2,1.3, 4.5,1.5);
        shape.quadraticCurveTo(3.5,1.9,3.5,3);
        shape.lineTo(3,3);
        shape.quadraticCurveTo(2,7, 2,11);
        shape.lineTo(0,11);

        var points = shape.extractPoints(this.resolucion).shape;
        var geometry = new THREE.LatheGeometry(points, this.resolucion);
        return geometry;
    }

    createCabeza () {
        var shape = new THREE.Shape();
        shape.moveTo(0,0);
        shape.lineTo(2,0);
        shape.quadraticCurveTo(1.9,1.4,2.75,2.5);
        shape.quadraticCurveTo(3.2,2.6,3,3);
        shape.quadraticCurveTo(1.6,4, 0,3.75);
        shape.lineTo(0.5,3.8);
        shape.quadraticCurveTo(1,3.9, 0.5,4);
        shape.lineTo(0,4);

        var points = shape.extractPoints(this.resolucion).shape;
        var geometry = new THREE.LatheGeometry(points, this.resolucion);
        geometry.translate(0,10.8,0);
        return geometry;
    }
}
export { Rey };