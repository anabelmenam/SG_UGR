import * as THREE from '../libs/three.module.js'



class FiguraRevolucion extends THREE.Object3D {

    constructor (gui, titleGui) {
        super();
        this.createGui(gui, titleGui);

        this.shape = new THREE.Shape();
        //shape.moveTo( 0, 0 );
        this.shape.lineTo( 1, 0 );
        this.shape.lineTo( 1, 0.5 );
        this.shape.quadraticCurveTo(0.2,1, 0.2,2);
        this.shape.bezierCurveTo(0.5,2,0.5,2.5, 0,2.5);
        this.shape.bezierCurveTo(0.7,2.5,0.7,3.5, 0,3.5);
        this.shape.lineTo( 0, 0 );
                
        this.points = this.shape.extractPoints(40).shape;
        this.geometry = new THREE.LatheGeometry(this.points, this.guiControls.resolucion);
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
        this.mesh.geometry.dispose();
        this.mesh.geometry = new THREE.LatheGeometry(this.points, this.guiControls.resolucion);
    }



}


export {FiguraRevolucion};