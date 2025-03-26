import * as THREE from '../libs/three.module.js'



class GeometriaBasica extends THREE.Object3D {

    constructor (gui, titleGui) {
        super();
        this.createGui(gui, titleGui);

        var esferaGeom = new THREE.SphereGeometry(1, 30, 30);
        var esferaMat = new THREE.MeshNormalMaterial();

        var esfera = new THREE.Mesh(esferaGeom, esferaMat);
        this.add(esfera);
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


export {GeometriaBasica};