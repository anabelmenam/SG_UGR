import * as THREE from '../libs/three.module.js'
import * as CSG from '../libs/three-bvh-csg.js'

import { Pieza } from './Pieza.js'
import { Brazos } from './Brazos.js'

class Reina extends Pieza {
    constructor (equipo, casilla, nombre, resolucion) {
        super(equipo, casilla, nombre,resolucion);
    }

    movimientosPosibles(casillasDisp) {
        let i,j;
        let casillas = [];

        j= this.casillaActual.index[1];
        let ocupada = false;
        for(let x = this.casillaActual.index[0]-1; x >= 0; x--) {
            if(casillasDisp[x][j].pieza !== null && casillasDisp[x][j].pieza.equipo === this.equipo) {
                ocupada = true;
            }
            if(casillasDisp[x][j].pieza !== null && casillasDisp[x][j].pieza.equipo !== this.equipo && !ocupada) {
                ocupada = true;
                casillas.push(casillasDisp[x][j])
            }
            ocupada ? "" : casillas.push(casillasDisp[x][j]);
        }
        ocupada = false;
        for(let x = this.casillaActual.index[0]+1; x < 8; x++) {
            if(casillasDisp[x][j].pieza !== null && casillasDisp[x][j].pieza.equipo === this.equipo) {
                ocupada = true;
            }
            if(casillasDisp[x][j].pieza !== null && casillasDisp[x][j].pieza.equipo !== this.equipo && !ocupada) {
                ocupada = true;
                casillas.push(casillasDisp[x][j])
            }
            ocupada ? "" : casillas.push(casillasDisp[x][j]);
        }

        i = this.casillaActual.index[0];
        ocupada = false;
        for(let y = this.casillaActual.index[1]-1; y >= 0; y--) {
            if(casillasDisp[i][y].pieza !== null && casillasDisp[i][y].pieza.equipo === this.equipo) {
                ocupada = true;
            }
            if(casillasDisp[i][y].pieza !== null && casillasDisp[i][y].pieza.equipo !== this.equipo && !ocupada) {
                ocupada = true;
                casillas.push(casillasDisp[i][y])
            }
            ocupada ? "" : casillas.push(casillasDisp[i][y]);
        }
        ocupada = false;
        for(let y = this.casillaActual.index[1]+1; y < 8; y++) {
            if(casillasDisp[i][y].pieza !== null && casillasDisp[i][y].pieza.equipo === this.equipo) {
                ocupada = true;
            }
            if(casillasDisp[i][y].pieza !== null && casillasDisp[i][y].pieza.equipo !== this.equipo && !ocupada) {
                ocupada = true;
                casillas.push(casillasDisp[i][y])
            }
            ocupada ? "" : casillas.push(casillasDisp[i][y]);
        }
        
        ocupada = false;
        for(let x = this.casillaActual.index[0]-1, y = this.casillaActual.index[1]-1; x >= 0 && y >= 0; x--, y--) {
            if(casillasDisp[x][y].pieza !== null && casillasDisp[x][y].pieza.equipo === this.equipo) {
                ocupada = true;
            }
            if(casillasDisp[x][y].pieza !== null && casillasDisp[x][y].pieza.equipo !== this.equipo && !ocupada) {
                ocupada = true;
                casillas.push(casillasDisp[x][y])
            }
            ocupada ? "" : casillas.push(casillasDisp[x][y]);
        }
        ocupada = false;
        for(let x = this.casillaActual.index[0]+1, y = this.casillaActual.index[1]+1; x < 8 && y < 8; x++, y++) {
            if(casillasDisp[x][y].pieza !== null && casillasDisp[x][y].pieza.equipo === this.equipo) {
                ocupada = true;
            }
            if(casillasDisp[x][y].pieza !== null && casillasDisp[x][y].pieza.equipo !== this.equipo && !ocupada) {
                ocupada = true;
                casillas.push(casillasDisp[x][y])
            }
            ocupada ? "" : casillas.push(casillasDisp[x][y]);
        }
        ocupada = false;
        for(let x = this.casillaActual.index[0]-1, y = this.casillaActual.index[1]+1; x >= 0 && y < 8; x--, y++) {
            if(casillasDisp[x][y].pieza !== null && casillasDisp[x][y].pieza.equipo === this.equipo) {
                ocupada = true;
            }
            if(casillasDisp[x][y].pieza !== null && casillasDisp[x][y].pieza.equipo !== this.equipo && !ocupada) {
                ocupada = true;
                casillas.push(casillasDisp[x][y])
            }
            ocupada ? "" : casillas.push(casillasDisp[x][y]);
        }
        ocupada = false;
        for(let x = this.casillaActual.index[0]+1, y = this.casillaActual.index[1]-1; x < 8 && y >= 0; x++, y--) {
            if(casillasDisp[x][y].pieza !== null && casillasDisp[x][y].pieza.equipo === this.equipo) {
                ocupada = true;
            }
            if(casillasDisp[x][y].pieza !== null && casillasDisp[x][y].pieza.equipo !== this.equipo && !ocupada) {
                ocupada = true;
                casillas.push(casillasDisp[x][y])
            }
            ocupada ? "" : casillas.push(casillasDisp[x][y]);
        }

        
        
        return casillas;
    }


    generarGeometria() {
        this.material = new THREE.MeshNormalMaterial();

        //CABEZA
        this.geometry_cilindro = new THREE.CylinderGeometry(2.6, 0.7, 3.2, this.resolucion, this.resolucion);
        this.geometry_cilindro.translate(0,14,0);

        //CUERPO
        this.geometry_cuerpo = this.createCuerpo();

        this.geometry_circunferencia = this.createCircunferenia();
        this.geometry_circunferencia.translate(0,9.8,0);

        this.geometry_toro3 = new THREE.TorusGeometry(1.73, 0.1, this.resolucion, this.resolucion);
        this.geometry_toro3.rotateX(Math.PI/2);
        this.geometry_toro3.rotateY(Math.PI/6);
        this.geometry_toro3.translate(0,10.3,0);

        this.geometry_relieve = this.createRelieve();
        this.geometry.scale(1.4,1.4,1.4);
        this.geometry_relieve.translate(0,10.6,0);

        this.geometry_circunferencia2 = this.createCircunferenia();
        this.geometry_circunferencia2.scale(0.6,0.6,0.6);
        this.geometry_circunferencia2.translate(0,11.8,0);

        this.geometry_cuerpo2 = this.createCuerpo2();
        this.geometry_cuerpo2.translate(0,8.89,0);

        this.geometry_toro2 = new THREE.TorusGeometry(1, 0.11, this.resolucion, this.resolucion);
        this.geometry_toro2.rotateX(Math.PI/2);
        this.geometry_toro2.rotateY(Math.PI/6);
        this.geometry_toro2.translate(0,8.9,0);

        this.geometry_recorte = this.createRecorte();
        this.geometry_recorte.scale(1,3,1);
        this.geometry_recorte.rotateY(0.261799); // 15 GRADOS
        this.geometry_recorte.translate(0.55,13.8,0);

        this.geometry_recorte2 = this.createRecorte();
        this.geometry_recorte2.scale(1,3,1);
        this.geometry_recorte2.rotateY(-0.261799); // 15 GRADOS
        this.geometry_recorte2.translate(-0.55,13.8,0);

        this.geometry_recorte3 = this.createRecorte();
        this.geometry_recorte3.scale(1,3,3);
        this.geometry_recorte3.rotateY(Math.PI/2); // 30 GRADOS
        this.geometry_recorte3.translate(-5,13.8,0);

        this.geometry_recorte4 = this.createRecorte();
        this.geometry_recorte4.scale(1,3,1);
        this.geometry_recorte4.rotateY(Math.PI+0.261799); // 90 GRADOS
        this.geometry_recorte4.translate(-0.55,13.8,0);

        this.geometry_recorte5 = this.createRecorte();
        this.geometry_recorte5.scale(1,3,1);
        this.geometry_recorte5.rotateY(-(Math.PI+0.261799)); // 90 GRADOS
        this.geometry_recorte5.translate(0.55,13.8,0);

        this.geometry_esfera = new THREE.SphereGeometry(1.4, this.resolucion, this.resolucion);
        this.geometry_esfera.translate(0,14,0);


        this.geometry_cabezal = this.createCabezal();
        this.geometry_cabezal.translate(0,15.4,0);
        

        // CONTRUIMOS BRUSH
        var cilindro = new CSG.Brush(this.geometry_cilindro, this.material);
        var cuerpo = new CSG.Brush(this.geometry_cuerpo, this.material);
        var cuerpo2 = new CSG.Brush(this.geometry_cuerpo2, this.material);
        var toro2 = new CSG.Brush(this.geometry_toro2, this.material);
        var toro = new CSG.Brush(this.geometry_circunferencia, this.material);
        var toro3 = new CSG.Brush(this.geometry_toro3, this.material);
        var relieve = new CSG.Brush(this.geometry_relieve, this.material);
        var circunferencia2 = new CSG.Brush(this.geometry_circunferencia2, this.material);
        var recorte1 = new CSG.Brush(this.geometry_recorte, this.material);
        var recorte2 = new CSG.Brush(this.geometry_recorte2, this.material);
        var recorte3 = new CSG.Brush(this.geometry_recorte3, this.material);
        var recorte4 = new CSG.Brush(this.geometry_recorte4, this.material);
        var recorte5 = new CSG.Brush(this.geometry_recorte5, this.material);
        var esfera = new CSG.Brush(this.geometry_esfera, this.material);
        var cabezal = new CSG.Brush(this.geometry_cabezal, this.material);

        //OPERAMOS
        var evaluador = new CSG.Evaluator();
        this.figura = evaluador.evaluate(cilindro, cuerpo, CSG.ADDITION);
        this.figura = evaluador.evaluate(this.figura, cuerpo2, CSG.ADDITION);
        this.figura = evaluador.evaluate(this.figura, toro2, CSG.ADDITION);
        this.figura = evaluador.evaluate(this.figura, toro, CSG.ADDITION);
        this.figura = evaluador.evaluate(this.figura, toro3, CSG.ADDITION);
        this.figura = evaluador.evaluate(this.figura, relieve, CSG.ADDITION);
        this.figura = evaluador.evaluate(this.figura, circunferencia2, CSG.ADDITION);
        this.figura = evaluador.evaluate(this.figura, recorte1, CSG.SUBTRACTION);
        this.figura = evaluador.evaluate(this.figura, recorte2, CSG.SUBTRACTION);
        this.figura = evaluador.evaluate(this.figura, recorte3, CSG.SUBTRACTION);
        this.figura = evaluador.evaluate(this.figura, recorte4, CSG.SUBTRACTION);
        this.figura = evaluador.evaluate(this.figura, recorte5, CSG.SUBTRACTION);
        this.figura = evaluador.evaluate(this.figura, esfera, CSG.ADDITION);
        this.figura = evaluador.evaluate(this.figura, cabezal, CSG.ADDITION);

        var geometria = this.figura.geometry;
        return geometria;
    }

    generarBrazos(material, equipo) {
        const brazos = new Brazos(material, this.resolucion);

        const brazoIzq = brazos.createBrazoIzquierdo(equipo);
        const brazoDch = brazos.createBrazoDerecho(equipo);

        if(equipo == 1) {
            brazoIzq.rotation.y = Math.PI;
            brazoDch.rotation.y = Math.PI;
        }
        brazoIzq.position.set(-1.3, 8.5, 0);
        brazoDch.position.set(1.3, 8.5, 0);

        this.brazoIzq = brazoIzq;
        this.brazoDch = brazoDch;

        this.add(brazoIzq);
        this.add(brazoDch);
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

        const points = this.shape.extractPoints(this.resolucion).shape;
        this.geometry = new THREE.LatheGeometry(points, this.resolucion);
        return this.geometry;
    }

    createCuerpo2() {
        this.shape = new THREE.Shape();
        this.shape.lineTo(1.1, 0);
        this.shape.quadraticCurveTo(0.42,0.7, 1.26,1.26);
        this.shape.lineTo(0, 1.2);

        const points = this.shape.extractPoints(this.resolucion).shape;
        this.geometry = new THREE.LatheGeometry(points, this.resolucion);
        return this.geometry;
    }

    createCircunferenia() {
        this.shape = new THREE.Shape();
        this.shape.lineTo(1, 0);
        this.shape.quadraticCurveTo(1.56,0.01, 1.82,0.5);
        this.shape.quadraticCurveTo(1.56,0.99, 1,1);
        this.shape.lineTo(0, 1);

        const points = this.shape.extractPoints(this.resolucion).shape;
        this.geometry = new THREE.LatheGeometry(points, this.resolucion);
        return this.geometry;
    }

    createRelieve() {
        this.shape = new THREE.Shape();
        this.shape.lineTo(0.5, 0);
        this.shape.quadraticCurveTo(0.88,0.15, 0.94,0.47);
        this.shape.quadraticCurveTo(0.53,0.59, 0.4,1);
        this.shape.lineTo(0, 1);

        const points = this.shape.extractPoints(this.resolucion).shape;
        this.geometry = new THREE.LatheGeometry(points, this.resolucion);
        return this.geometry;
    }

    createRecorte() {
        this.shape = new THREE.Shape();
        this.shape.quadraticCurveTo(0.63,0.59, 1.5,0.6)
        this.shape.lineTo(-1.5,0.6);
        this.shape.quadraticCurveTo(-0.63,0.59, 0,0)

        this.options = {
            depth: 5,
            steps:5,
            curveSegments: this.resolucion,
            bevelEnabled: false
        }

        this.geometry = new THREE.ExtrudeGeometry(this.shape, this.options);
        return this.geometry;
    }

    createCabezal() {
        this.shape = new THREE.Shape();
        this.shape.quadraticCurveTo(0.15,0.01, 0.21,0.14);
        this.shape.quadraticCurveTo(0.22,0.29, 0.08,0.31);
        this.shape.quadraticCurveTo(0.17,0.44, 0.2,0.6);
        this.shape.quadraticCurveTo(0.19,0.79, 0,0.8);
        this.shape.bezierCurveTo(0.14,0.79, 0.14,0.94, 0.14,1.08);
        this.shape.lineTo(0, 1);

        const points = this.shape.extractPoints(this.resolucion).shape;
        this.geometry = new THREE.LatheGeometry(points, this.resolucion);
        return this.geometry;
    }

    createGui (gui, titleGui) {
        this.guiControls = {
            resolucion: 20,
        }

        var folder = gui.addFolder(titleGui);
        folder.add(this.guiControls, 'resolucion', 3, 50, 1).name('Resolucion: ').listen().onChange ( () =>this.updateGeometria() );
    }
}

export { Reina };