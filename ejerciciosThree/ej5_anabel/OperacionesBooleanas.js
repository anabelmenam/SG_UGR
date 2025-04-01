

import { color } from '../libs/dat.gui.module.js';
import * as THREE from '../libs/three.module.js'
import * as CSG from '../libs/three-bvh-csg.js'



class Taza extends THREE.Object3D {

    constructor (gui, titleGui) {
        super();
        this.createGui(gui, titleGui);
        var material = new THREE.MeshNormalMaterial();

        this.geometry1 = new THREE.CylinderGeometry( 1, 1, 2, 32 );
        this.geometry2 = new THREE.CylinderGeometry( 0.9, 0.9, 2, 32 );
        this.geometry3 = new THREE.TorusGeometry(0.5, 0.1, 16, 100);

        this.geometry2.translate(0, 0.1, 0);
        this.geometry3.translate(-1, 0, 0);

        this.cilindroG = new CSG.Brush(this.geometry1, material);
        this.cilindroP = new CSG.Brush(this.geometry2, material);
        this.torus = new CSG.Brush(this.geometry3, material);

        var evaluador = new CSG.Evaluator();
        this.taza = evaluador.evaluate(this.torus, this.cilindroG, CSG.ADDITION);
        this.taza = evaluador.evaluate(this.taza, this.cilindroP, CSG.SUBTRACTION);
        this.taza.position.set(0, 1, 0);
        
        //this.mesh = new THREE.Mesh(this.taza, material);

        this.add(this.taza);
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



}

class Visagra extends THREE.Object3D {

    constructor (gui, titleGui) {
        super();
        this.createGui(gui, titleGui);
        var material = new THREE.MeshNormalMaterial();

        this.shape = new THREE.Shape();
        this.shape.moveTo(0, 0);
        this.shape.lineTo(3, 0);
        this.shape.lineTo(3, 0.5);
        this.shape.lineTo(1, 0.5);
        this.shape.quadraticCurveTo(0.5, 0.5, 0.5, 1);
        this.shape.lineTo(0.5, 3);
        this.shape.lineTo(0, 3);
        this.shape.lineTo(0, 0);

        this.options = {
            depth: 1,
            steps:1,
            curveSegments: 100,
            bevelEnabled: false,
        }

        this.geometry1 = new THREE.ExtrudeGeometry(this.shape,this.options);
        this.geometry2 = new THREE.CylinderGeometry( 0.2, 0.2, 3, 32 );
        this.geometry3 = new THREE.CylinderGeometry( 0.2, 0.2, 3, 32 );
        this.geometry2.translate(2.5, 0, 0.5);
        this.geometry3.translate(2.5, 0, 0.5);
        this.geometry3.rotateZ(Math.PI/2);
        this.visagra = new CSG.Brush(this.geometry1, material);
        this.cilindro1 = new CSG.Brush(this.geometry2, material);
        this.cilindro2 = new CSG.Brush(this.geometry3, material);

        var evaluador = new CSG.Evaluator();
        this.visagra = evaluador.evaluate(this.visagra, this.cilindro1, CSG.SUBTRACTION);
        this.visagra = evaluador.evaluate(this.visagra, this.cilindro2, CSG.SUBTRACTION);
        this.visagra.position.set(4, 0, 0);
        
        //this.mesh = new THREE.Mesh(this.geometry1, material);

        this.add(this.visagra);
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

}

class Tuerca extends THREE.Object3D {
    constructor (gui, titleGui) {
        super();
        this.createGui(gui, titleGui);
        const evaluador = new CSG.Evaluator();
        var material = new THREE.MeshNormalMaterial();
        this.geom = this.createEspiral();
		this.geom.translate(0, -1, 0);

		this.espiralBrush = new CSG.Brush(this.geom, material);

		// Cuerpo
		this.geom = new THREE.CylinderGeometry(1, 1, 1, 6);
		this.cuerpoBrush = new CSG.Brush(this.geom, material);

		// Agujero
		this.geom = new THREE.CylinderGeometry(0.5, 0.5, 1, 50);
		this.agujeroBrush = new CSG.Brush(this.geom, material);

		// Esfera
		this.geom = new THREE.SphereGeometry(1.05, 32, 32);
		this.esferaBrush = new CSG.Brush(this.geom, material);

		// Unión
		this.tuerca = evaluador.evaluate(this.cuerpoBrush, this.agujeroBrush, CSG.SUBTRACTION);
		this.tuerca = evaluador.evaluate(this.tuerca, this.espiralBrush, CSG.SUBTRACTION);
		this.tuerca = evaluador.evaluate(this.tuerca, this.esferaBrush, CSG.INTERSECTION);
        this.tuerca.position.set(-4, 0.5, 0);
		this.add(this.tuerca);
    }

    createEspiral() {
		const puntos = [];
		const radio = 0.5;
		const altura = 2;
		const vueltas = 5;
		const segmentos = 50;


		for (let i = 0; i <= segmentos; i++) {
			const angulo = (Math.PI * 2 * vueltas) * (i / segmentos);
			const x = radio * Math.cos(angulo);
			const y = altura * (i / segmentos);
			const z = radio * Math.sin(angulo);

			puntos.push(new THREE.Vector3(x, y, z));
		}

		const curva = new THREE.CatmullRomCurve3(puntos);

		const grosor = 0.1;
		const tubularSegments = 64;
		return new THREE.TubeGeometry(curva, segmentos, grosor, tubularSegments, false);
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
}


export {Taza, Visagra, Tuerca};