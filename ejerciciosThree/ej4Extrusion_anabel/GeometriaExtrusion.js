

import { color } from '../libs/dat.gui.module.js';
import * as THREE from '../libs/three.module.js'



class FiguraExtrusion extends THREE.Object3D {

    constructor (gui, titleGui) {
        super();
        this.createGui(gui, titleGui);

        this.shape = new THREE.Shape();
        this.shape.moveTo(0, 0);
        this.shape.lineTo(0.7, 0);
        this.shape.quadraticCurveTo(0.1, 0, 0.1, 1);
        this.shape.lineTo(0.1, 1.5);
        this.shape.bezierCurveTo(2.1, 0.5, 2.1, 3, 1, 3);
        this.shape.bezierCurveTo(1, 4.5, -1, 4.5, -1, 3);
        this.shape.bezierCurveTo(-2.1, 3, -2.1, 0.5, -0.1, 1.5);
        this.shape.lineTo(-0.1, 1.5);
        this.shape.quadraticCurveTo(-0.1, 0, -0.7, 0);

        this.options = {
            depth: 1,
            steps:1,
            curveSegments: 100,
            bevelEnabled: true,
            bevelThickness: 0.2,
            //bevelSize: 4,
            bevelSegments: 10
        }

        //this.geometry = new THREE.ShapeGeometry(this.shape);
        this.geometry = new THREE.ExtrudeGeometry(this.shape, this.options);
        var material = new THREE.MeshNormalMaterial();
        this.mesh = new THREE.Mesh(this.geometry, material);


        this.add(this.mesh);
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

    updateGeometria() {
        //this.mesh.geometry.dispose();
        //this.mesh.geometry = new THREE.LatheGeometry(this.points, this.guiControls.resolucion);
    }



}


export {FiguraExtrusion};