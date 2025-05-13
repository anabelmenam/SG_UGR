
import * as THREE from '../libs/three.module.js';
import * as CSG from '../libs/three-bvh-csg.js';
import { Pieza } from './Pieza.js';
import { Casilla } from './Casilla.js';

import { Caballo } from './Caballo.js';
import { Torre } from './Torre.js';
import { Alfil } from './Alfil.js';
//import { Reina } from './Reina.js';
import { Rey } from './Rey.js';
import { PeonCaballero } from './PeonCaballero.js';
import { PeonMago } from './PeonMago.js';

class Tablero extends THREE.Object3D {
    constructor() {
        super();
        //this.createGUI(gui, titleGui);

        var material = new THREE.MeshNormalMaterial();
        this.casillas = [];

        //OPCIÓN 1
        var marronClaro = 0xD2B48C;
        var marronOscuro = 0x5C3317;

        //OPCIÓN 2
        //var marronClaro = 0xC49E74;
        //var marronOscuro = 0x40220F;

        //OPCIÓN 3
        //var marronClaro = 0xBCA27E;
        //var marronOscuro = 0x3E1F0E;
        

        for( let i = 0; i < 8; i++ ) {
            this.casillas[i] = [];
            for( let j = 0; j < 8; j++ ) {
                var casilla = null;
                if( (i+j)%2 == 0 ) {
                    casilla = new Casilla(i-3.5,j-3.5, marronClaro);
                } else {
                    casilla = new Casilla(i-3.5,j-3.5, marronOscuro);
                }
                this.casillas[i][j] = casilla;
                this.add(casilla);
            }
        }

        //this.inicializarTablero();





        

        
        //this.add(this.figura);
    }

    inicializarTablero() {
        /*for( let i = 0; i < 8; i++ ) {
            for( let j = 0; j < 8; j++ ) {
                this.casillas[i][j].setPieza(null);
            }
        }*/

        this.casillas[0][0].setPieza(new Torre(0, this.casillas[0][0]));
        this.casillas[1][0].setPieza(new Caballo(0, this.casillas[1][0]));
        this.casillas[2][0].setPieza(new Alfil(0, this.casillas[2][0]));
        //this.casillas[0][3].setPieza(new Reina(0, this.casillas[0][3]));
        this.casillas[4][0].setPieza(new Rey(0, this.casillas[4][0]));
        this.casillas[5][0].setPieza(new Alfil(0, this.casillas[5][0]));
        this.casillas[6][0].setPieza(new Caballo(0, this.casillas[6][0]));
        this.casillas[7][0].setPieza(new Torre(0, this.casillas[7][0]));
        for (let j = 0; j < 8; j++) {
            this.casillas[j][1].setPieza(new PeonCaballero(0, this.casillas[j][1]));
        }
        

        this.casillas[0][7].setPieza(new Torre(1, this.casillas[0][7]));
        this.casillas[1][7].setPieza(new Caballo(1, this.casillas[1][7]));
        this.casillas[2][7].setPieza(new Alfil(1, this.casillas[2][7]));
        //this.casillas[3][7].setPieza(new Reina(1, this.casillas[3][7]));
        this.casillas[4][7].setPieza(new Rey(1, this.casillas[4][7]));
        this.casillas[5][7].setPieza(new Alfil(1, this.casillas[5][7]));
        this.casillas[6][7].setPieza(new Caballo(1, this.casillas[6][7]));
        this.casillas[7][7].setPieza(new Torre(1, this.casillas[7][7]));
        for (let j = 0; j < 8; j++) {
            this.casillas[j][6].setPieza(new PeonMago(1, this.casillas[j][6]));
        }

    }


    createGUI (gui, titleGui) {
        this.guiControls = {
            resolucion: 20,
        }

        var folder = gui.addFolder(titleGui);
        folder.add(this.guiControls, 'resolucion', 3, 50, 1).name('Resolucion: ').listen().onChange ( () =>this.updateGeometria() );
    }

    updateGeometria() {
        this.mesh.geometry.dispose();
        this.mesh.geometry = new THREE.LatheGeometry(this.points, this.guiControls.resolucion);
    }

}


export { Tablero };