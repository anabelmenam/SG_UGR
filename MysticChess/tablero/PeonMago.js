

import { color } from '../libs/dat.gui.module.js';
import * as THREE from '../libs/three.module.js'
import * as CSG from '../libs/three-bvh-csg.js'
import {Gorro} from './Gorro.js';
import { Pieza } from './Pieza.js';





class PeonMago extends Pieza {

    constructor (equipo) {
      super(equipo);
    }

    generarGeometria() {
      var material = new THREE.MeshNormalMaterial();
      var evaluador = new CSG.Evaluator();

      //CABEZA
      var geometry_cabeza = new THREE.SphereGeometry(2);
      geometry_cabeza.translate(0,10.8,0);

      var geometry_toro = new THREE.TorusGeometry(1.1,0.2);
      geometry_toro.rotateX(Math.PI/2);
      geometry_toro.translate(0,9,0);

      var geometry_ojo1 = new THREE.SphereGeometry(0.2);
      geometry_ojo1.scale(1.5,1.8,1.8);
      geometry_ojo1.translate(0.8,11,-1.8);
      geometry_ojo1.rotateY(Math.PI);


      var geometry_ojo2 = new THREE.SphereGeometry(0.2);
      geometry_ojo2.scale(1.5,1.8,1.8);
      geometry_ojo2.translate(-0.8,11,-1.8);
      geometry_ojo2.rotateY(Math.PI);

      //CUERPO
      var geometry_cuerpo = this.createCuerpo();

      // CONTRUIMOS BRUSH
      var cabeza = new CSG.Brush(geometry_cabeza, material);
      var cuerpo = new CSG.Brush(geometry_cuerpo, material);
      var toro = new CSG.Brush(geometry_toro, material);
      var ojo1 = new CSG.Brush(geometry_ojo1, material);
      var ojo2 = new CSG.Brush(geometry_ojo2, material);


      var gorro = this.createGorro(material, evaluador);
      gorro = gorro.geometry;

      gorro.translate(0,11.5,0);
      gorro = new CSG.Brush(gorro, material);
      //OPERAMOS
      var figura = evaluador.evaluate(cabeza, cuerpo, CSG.ADDITION);
      figura = evaluador.evaluate(figura, toro, CSG.ADDITION);
      figura = evaluador.evaluate(figura, ojo1, CSG.ADDITION);
      figura = evaluador.evaluate(figura, ojo2, CSG.ADDITION);
      figura = evaluador.evaluate(figura, gorro, CSG.ADDITION);

      var geometriaPeonMago = figura.geometry;
      return geometriaPeonMago;
    }


    createCuerpo() {
      var shape = new THREE.Shape();
      shape.lineTo(4.5,0);
      shape.quadraticCurveTo(5,0.25, 5,0.7);
      shape.quadraticCurveTo(4.9,1, 4.5,1);
      shape.quadraticCurveTo(5.2,1.3, 4.5,1.5);
      shape.quadraticCurveTo(3.5,1.9,3.5,3);
      shape.lineTo(3,3);
      shape.quadraticCurveTo(1.5,5, 1,9);
      shape.lineTo(0,9);

      var points = shape.extractPoints(40).shape;
      var geometry = new THREE.LatheGeometry(points, 100);
      return geometry;
    }

    createGorro(material,evaluador) {
      var shapeGorro = new THREE.Shape();
      shapeGorro.moveTo(0,0);
      shapeGorro.lineTo(4,0);
      shapeGorro.quadraticCurveTo(3,0.15, 2,0.5);
      shapeGorro.lineTo(0,5);

      var points = shapeGorro.extractPoints().shape;
      var gorro = new THREE.LatheGeometry(points, 30);

      var cilindro = new THREE.CylinderGeometry(2,2,1,30);
      var cilindroCorte = new THREE.CylinderGeometry(1.9,1.9,1,30);
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

      return gorro;
    }

}




export {PeonMago};


/**
 * Radianes = grados * PI /180
 */