import * as THREE from '../libs/three.module.js';
import * as CSG from '../libs/three-bvh-csg.js';

class Caballo extends THREE.Object3D {
    constructor(gui, titleGui) {
        super();
        this.createGUI(gui, titleGui);

        this.material = new THREE.MeshNormalMaterial({
            transparent: true,
            opacity: this.guiControls.opacity,
        });

        // CABEZA
        this.shape_cabeza = new THREE.Shape();
        this.shape_cabeza.moveTo(0,1.43);
        this.shape_cabeza.lineTo(1.76, 1.43); // P
        this.shape_cabeza.lineTo(3.21, 1.61); // N
        this.shape_cabeza.quadraticCurveTo(5.34,2.46, 6.56, 4.39); // D1 O
        this.shape_cabeza.quadraticCurveTo(6.05,5.66, 4.78,6.17); // E1 R
        this.shape_cabeza.quadraticCurveTo(6.08,10.67, 2.16,13.24); // F1 G
        this.shape_cabeza.quadraticCurveTo(1.85,14.33, 0.75,14.61); // G1 F
        this.shape_cabeza.lineTo(-0.79, 13); // E
        this.shape_cabeza.quadraticCurveTo(-1.46,13.27, -2.13,13.02); // H1 D
        this.shape_cabeza.lineTo(-4.35, 11.42); // C
        this.shape_cabeza.lineTo(-7.13, 10.27); // A
        this.shape_cabeza.lineTo(-6.37, 8.77); // B
        this.shape_cabeza.lineTo(-4.55, 8.33); // H
        this.shape_cabeza.quadraticCurveTo(-3.25,8.72, -1.9,8.67); // I1 I
        this.shape_cabeza.lineTo(-1.9, 6.71); // J
        this.shape_cabeza.quadraticCurveTo(-2.35,5.51, -1.9,6.71); // J1 K
        this.shape_cabeza.quadraticCurveTo(-4.5,3.69, -5.97,3.18); // K1 L
        this.shape_cabeza.quadraticCurveTo(-3.54,1.85, -0.81,1.43); // L1 M
        this.shape_cabeza.lineTo(0, 1.43); // C1

        this.options_cabeza = {
            depth: 4.5,
            steps:1,
            curveSegments: 100,
            bevelEnabled: true,
            bevelThickness: 0.85,
            bevelSegments: 10
        }

        this.geometry_cabeza = new THREE.ExtrudeGeometry(this.shape_cabeza, this.options_cabeza);
        this.geometry_cabeza.translate(0,0.8,0);

        // BASE
        this.shape_base = new THREE.Shape();
        this.shape_base.lineTo(4.5,0);
        this.shape_base.quadraticCurveTo(5,0.25, 5,0.7);
        this.shape_base.quadraticCurveTo(4.9,1, 4.5,1);
        this.shape_base.quadraticCurveTo(5.2,1.3, 4.5,1.5);
        this.shape_base.quadraticCurveTo(3.5,1.9,3.5,3);
        this.shape_base.lineTo(3,3);
        this.shape_base.lineTo(0,4.5);


        const points_base = this.shape_base.extractPoints(40).shape;
        this.geometry_base = new THREE.LatheGeometry(points_base, 100);
        this.geometry_base.scale(1.3,1.3,1.3);
        this.geometry_base.translate(0.5,-3,2);
        // OJOS


        // RECORTE BOCA

        // RECORTE_OREJAS   

        // CONTRUIMOS BRUSH
        var cabeza = new CSG.Brush(this.geometry_cabeza, this.material);
        var base = new CSG.Brush(this.geometry_base, this.material);

         //OPERAMOS
        var evaluador = new CSG.Evaluator();
        this.figura = evaluador.evaluate(cabeza, base, CSG.ADDITION);

        
        this.add(this.figura);
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


export { Caballo };


