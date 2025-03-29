

import { color } from '../libs/dat.gui.module.js';
import * as THREE from '../libs/three.module.js'



class FiguraBarrido extends THREE.Object3D {

    constructor (gui, titleGui) {
        super();
        this.createGui(gui, titleGui);

        this.shape = new THREE.Shape();
        this.shape.moveTo(0, 1.5);
        this.shape.bezierCurveTo(2.1, 0.5, 2.1, 3, 1, 3);
        this.shape.bezierCurveTo(1, 4.5, -1, 4.5, -1, 3);
        this.shape.bezierCurveTo(-2.1, 3, -2.1, 0.5, 0, 1.5);
        
        const segments = 400;
        const radius = 10;        // radio de la espiral
        const height = 30;        // altura total
        const turns = 4;          // número de vueltas
        this.points = [];

        for (let i = 0; i <= segments; i++) {
            const t = i / segments;
            const angle = t * Math.PI * 2 * turns;
            const x = Math.cos(angle) * radius;
            const y = Math.sin(angle) * radius;
            const z = height * t;
            this.points.push(new THREE.Vector3(x, y, z));
        }



        this.path = new THREE.CatmullRomCurve3(this.points);
        this.options = {
            steps:segments,
            curveSegments: 100,
            bevelEnabled: false,
            extrudePath: this.path
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


export {FiguraBarrido};