

import { color } from '../libs/dat.gui.module.js';
import * as THREE from '../libs/three.module.js'
import * as CSG from '../libs/three-bvh-csg.js'
import {Gorro} from './Gorro.js';
import { Peon } from './Peon.js';

class PeonMago extends Peon {

  constructor (equipo, casilla, nombre, resolucion) {
      super(equipo, casilla, nombre, resolucion);   
  }

  createCascoCompleto(material,evaluador) {
    var shapeGorro = new THREE.Shape();
    shapeGorro.moveTo(0,0);
    shapeGorro.lineTo(4,0);
    shapeGorro.quadraticCurveTo(3,0.15, 2,0.5);
    shapeGorro.lineTo(0,5);

    var points = shapeGorro.extractPoints().shape;
    var gorro = new THREE.LatheGeometry(points, this.resolucion);

    var cilindro = new THREE.CylinderGeometry(2, 2, 1, this.resolucion, this.resolucion);
    var cilindroCorte = new THREE.CylinderGeometry(1.9, 1.9, 1, this.resolucion, this.resolucion);
    cilindro.translate(0,0.5,0);
    cilindroCorte.translate(0,0.5,0);

    var caja = new THREE.BoxGeometry(1,0.5,0.5);
    caja.translate(0,0.75,2);
    var cajaCorte = new THREE.BoxGeometry(0.75,0.25,0.25);
    cajaCorte.translate(0,0.75,2.2);
    
    var hebilla = new CSG.Brush(caja, material);
    var corteHebilla = new CSG.Brush(cajaCorte, material);
    hebilla = evaluador.evaluate(hebilla, corteHebilla, CSG.SUBTRACTION);
    cilindro = new CSG.Brush(cilindro, material);
    cilindroCorte = new CSG.Brush(cilindroCorte, material);
    gorro = new CSG.Brush(gorro, material);
    cilindro = evaluador.evaluate(cilindro, cilindroCorte, CSG.SUBTRACTION);
    gorro = evaluador.evaluate(gorro, cilindro, CSG.ADDITION);
    gorro = evaluador.evaluate(gorro, hebilla, CSG.ADDITION);
    gorro = gorro.geometry;
    gorro.translate(0,3,0);

    gorro.scale(1/2.3, 1/2.3, 1/2.3);
    gorro = new CSG.Brush(gorro, material);
    return gorro;
  }
}

export {PeonMago};