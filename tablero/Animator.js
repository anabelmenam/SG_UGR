import * as THREE from 'three'
import * as TWEEN from '../libs/tween.module.js'


class Animator {

    constructor() {
        this.easing = TWEEN.Easing.Quadratic.InOut;
    }

    setAndStart(from, to, time = 1000, promise = null) {
        const begin = { t: 0.0 };
        const end = { t: 1.0 };
        const fromRef = from.clone();

        new TWEEN.Tween(begin)
            .to(end, time)
            .easing(this.easing)
            .onUpdate(() => {
                from.lerpVectors(fromRef, to, begin.t);
            })
            .onComplete(() => {
                if (promise) promise.resolve();
            })
            .start();
    }

    mandarCementerio(originalFrom, finalTo, time = 1000, finalPromise = null) {
        const paso1 = $.Deferred();
        const paso2 = $.Deferred();

        // Subir
        this.setAndStart(
            originalFrom,
            new THREE.Vector3(originalFrom.x, 2, originalFrom.z),
            time,
            paso1
        );

        paso1.done(() => {
            // Desplazar lateralmente
            this.setAndStart(
                new THREE.Vector3(originalFrom.x, 2, originalFrom.z),
                new THREE.Vector3(finalTo.x, 2, finalTo.z),
                time,
                paso2
            );

            paso2.done(() => {
                // Bajar
                this.setAndStart(
                    new THREE.Vector3(finalTo.x, 2, finalTo.z),
                    new THREE.Vector3(finalTo.x, 0.5, finalTo.z),
                    time,
                    finalPromise
                );
            });
        });
    }
}

/*class Animator {
  
    constructor () {
        this.from = null; // Posicion del nodo a mover
        this.fromRef = new THREE.Vector3();  // Copia para interpolar
        this.to = null;   //Destino
        this.promise = null;   // For sincronization with other methods

        const begin = { t : 0.0 };
        const end = { t : 1.0 };

        this.anim = new TWEEN.Tween(begin).to(end)
          .onUpdate (() => {
            this.from.lerpVectors (this.fromRef, this.to, begin.t);
          })
          .onComplete (() => {
            if (this.promise) {
                this.promise.resolve();
            }
            begin.t = 0.0;
          }).easing(TWEEN.Easing.Quadratic.InOut); // TWEEN.Easing.Quadratic.InOut
    }

    setAndStart (from, to, time = 1000, promise = null) {
        if (!this.anim.isPlaying()) {         // Evitamos que se relance una animación que no ha acabado aún
            this.from = from;
            this.fromRef.set (from.x, from.y, from.z);
            this.to = to;
            this.anim.duration (time);
            this.promise = promise;
            this.anim.start();
        } else {
            console.log ('Error: La animacion no ha termiando aun');
        }
    }

    mandarCementerio(originalFrom, finalTo, time = 1000, promise = null) {
        let from = new THREE.Vector3(originalFrom.x, originalFrom.y, originalFrom.z);
        let to = new THREE.Vector3(originalFrom.x, 2, originalFrom.z);
        var promise1 = $.Deferred();
        this.setAndStart(from, to, time, promise1);

        promise1.done(() => {
            from = new THREE.Vector3(originalFrom.x, 2, originalFrom.z);
            to = new THREE.Vector3(finalTo.x, 2, finalTo.z);

            var promise2 = $.Deferred();
            this.setAndStart(from, to, time, promise2);
            
            promise2.done(() => {
                from = new THREE.Vector3(finalTo.x, 2, finalTo.z);
                to = new THREE.Vector3(finalTo.x, 0.5, finalTo.z);
                this.setAndStart(from, to, time, promise);
            });
        })
    }
}*/

export { Animator };