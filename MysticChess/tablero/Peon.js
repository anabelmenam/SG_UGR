

import { color } from '../libs/dat.gui.module.js';
import * as THREE from '../libs/three.module.js'
import * as CSG from '../libs/three-bvh-csg.js'
import { Pieza } from './Pieza.js';
import { Brazos } from './Brazos.js';

class Peon extends Pieza {

    constructor (equipo, casilla, nombre, resolucion) {
        super(equipo, casilla, nombre, resolucion);
        this.casillaActual = casilla;
        this.casillaInicial = casilla;
        this.equipo = equipo;
        this.resolucion = resolucion;
        this.primerMovimiento = true;
        
    }

    movimientosPosibles(casillasDisp) {
        if(this.casillaActual !== this.casillaInicial) {
            this.primerMovimiento = false;
        }

        let i,j;
        let casillas = [];
        i = this.casillaActual.index[0];
        if (this.equipo == 1) {
            j = this.casillaActual.index[1]-1;
        } else if (this.equipo == 0) {
            j = this.casillaActual.index[1]+1;
        }
        if(j<8 && j>=0){
            casillasDisp[i][j].pieza === null  ? casillas.push(casillasDisp[i][j]) : "" ;
        }

        if(this.casillaActual.index[0]-1 >= 0) {
            i = this.casillaActual.index[0]-1;
            casillasDisp[i][j].pieza !== null && casillasDisp[i][j].pieza?.equipo !== this.equipo ? casillas.push(casillasDisp[i][j]) : "";
        
        }
        if(this.casillaActual.index[0]+1 < 8) {
            i = this.casillaActual.index[0]+1;
            casillasDisp[i][j].pieza !== null && casillasDisp[i][j].pieza?.equipo !== this.equipo ? casillas.push(casillasDisp[i][j]) : "";

        }   
        
        i = this.casillaActual.index[0];
        if (this.primerMovimiento) {
            if (this.equipo == 1) {
                j = this.casillaActual.index[1]-2;
                if (casillasDisp[i][j+1].pieza === null) {
                    casillasDisp[i][j].pieza === null ? casillas.push(casillasDisp[i][j]) : "";
                }
            } else if (this.equipo == 0) {
                j = this.casillaActual.index[1]+2;
                if (casillasDisp[i][j-1].pieza === null) {
                    casillasDisp[i][j].pieza === null ? casillas.push(casillasDisp[i][j]) : "";
                }
            }
            //casillasDisp[i][j].pieza === null ? casillas.push(casillasDisp[i][j]) : "";
        }

        return casillas;
    }

    generarGeometria() {
        var material = new THREE.MeshNormalMaterial();
        var evaluador = new CSG.Evaluator();

        //CABEZA
        var geometry_cabeza = new THREE.SphereGeometry(2, this.resolucion, this.resolucion);
        geometry_cabeza.rotateY(Math.PI/6);
        geometry_cabeza.translate(0,10.8,0);

        var geometry_toro = new THREE.TorusGeometry(1.1,0.2, this.resolucion, this.resolucion);
        geometry_toro.rotateX(Math.PI/2);
        geometry_toro.rotateY(Math.PI/6);
        geometry_toro.translate(0,9,0);

        var geometry_ojo1 = new THREE.SphereGeometry(0.2,this.resolucion, this.resolucion);
        geometry_ojo1.scale(1.5,1.8,1.8);
        geometry_ojo1.translate(0.8,11,-1.8);
        geometry_ojo1.rotateY(Math.PI);

        var geometry_ojo2 = new THREE.SphereGeometry(0.2,this.resolucion, this.resolucion);
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

        var casco = this.createCascoCompleto(material, evaluador);
        casco = casco.geometry;
        casco.scale(2.3,2.3,2.3);
        casco.translate(0,8.7,0);
        casco = new CSG.Brush(casco, material);
        
        //OPERAMOS
        var figura = evaluador.evaluate(cabeza, cuerpo, CSG.ADDITION);
        figura = evaluador.evaluate(figura, toro, CSG.ADDITION);
        figura = evaluador.evaluate(figura, ojo1, CSG.ADDITION);
        figura = evaluador.evaluate(figura, ojo2, CSG.ADDITION);
        figura = evaluador.evaluate(figura, casco, CSG.ADDITION);

        var geometriaPeonCaballero = figura.geometry;
        return geometriaPeonCaballero;
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

        var points = shape.extractPoints(this.resolucion).shape;
        var geometry = new THREE.LatheGeometry(points, this.resolucion);
        return geometry;
    }

    generarBrazos(material, equipo) {
        const brazos = new Brazos(material, this.resolucion);

        const brazoIzq = brazos.createBrazoIzquierdo(equipo);
        const brazoDch = brazos.createBrazoDerecho(equipo);

        if(equipo == 1) {
            brazoIzq.rotation.y = Math.PI;
            brazoDch.rotation.y = Math.PI;
        }
        brazoIzq.position.set(-1.3, 8, 0);
        brazoDch.position.set(1.3, 8, 0);

        this.brazoIzq = brazoIzq;
        this.brazoDch = brazoDch;

        this.add(brazoIzq);
        this.add(brazoDch);
    }

    createCascoCompleto() {
        //Implementar en hijos
    }

    shape2CatmullCurve3(shapePath, res = 30) {
        var v2 = shapePath.extractPoints(res).shape;
        var v3 = [];
        v2.forEach((v) => {
            v3.push(new THREE.Vector3(v.x, v.y, 0));
        })
        return new THREE.CatmullRomCurve3(v3);
    }
}

export {Peon};