import * as THREE from '../libs/three.module.js'



class Esfera extends THREE.Object3D {

    constructor (gui, titleGui) {
        super();
        this.createGui(gui, titleGui);

        var esferaGeom = new THREE.SphereGeometry(0.7, 5, 30);
        var esferaMat = new THREE.MeshNormalMaterial();

        var esfera = new THREE.Mesh(esferaGeom, esferaMat);
        esfera.rotation.y = this.guiControls.rotacion;
        esfera.scale.x = this.guiControls.scalex;

        this.add(esfera);
    }

    createGui (gui, titleGui) {
        this.guiControls = {
            radio: 1,
            resolucion: 30,
            scalex: 1,
            rotacion:1,
        }

        var folder = gui.addFolder(titleGui);
        folder.add(this.guiControls, 'radio', 1, 5, 0.1).name('Radio: ').listen();
        
        folder.add(this.guiControls, 'resolucion', 3, 30, 1).name('Resolución: ').listen();
        folder.add(this.guiControls, 'scalex', 1, 5, 1).name('Escalado: ').listen();
        folder.add(this.guiControls, 'rotacion', 1, 5, 0.2).name('Rotacion: ').listen().onChange ( (value) => this.rotation.y = value );
        //console.log(rotacion);
    }

    setRotation(valor) {
        this.esfera.rotation.y = value
    }


}

class Box extends THREE.Object3D {

    constructor (gui, titleGui) {
        super();
        this.createGui(gui, titleGui);


        var boxGeom = new THREE.BoxGeometry (1,1,1);
        var boxMat = new THREE.MeshStandardMaterial();
        var box = new THREE.Mesh (boxGeom, boxMat);
        box.position.set (2, 0, 0);
        this.add (box);
    }

    createGui (gui, titleGui) {
        this.guiControls = {
            radio: 1,
            resolucion: 30,
        }

        var folder = gui.addFolder(titleGui);
        folder.add(this.guiControls, 'radio', 1, 5, 0.1).name('Radio: ').listen();
        folder.add(this.guiControls, 'resolucion', 3, 30, 1).name('Resolución: ').listen();
    }


}


export {Esfera};