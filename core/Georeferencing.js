// modules/GeoReferencing/Polyline.js
// core/GeoReferencing.js
export class ReferencePolyline {
    constructor(points = []) {
        this.points = points;
        this.realLength = 0;
        this.virtualLength = 0;
        this.scale = 1;
        this.area = 0;
    }
    
    calibrate(realMeters, virtualUnits) {
        this.realLength = realMeters;
        this.virtualLength = virtualUnits;
        this.scale = realMeters / virtualUnits;
        this.calculateArea();
    }
    
    calculateArea() {
        if (this.points.length < 3) return 0;
        let area = 0;
        for (let i = 0; i < this.points.length - 1; i++) {
            area += this.points[i].x * this.points[i + 1].z;
            area -= this.points[i + 1].x * this.points[i].z;
        }
        this.area = Math.abs(area) / 2 * this.scale;
    }
}
    
    // معايرة مع المخطط المعتمد
    calibrate(knownLength, virtualLength) {
        this.calibrationFactor = knownLength / virtualLength;
        this.calculateDimensions();
    }
    
    // رسم الحدود في المشهد
    draw(scene, color = 0xffaa44) {
        if (this.points.length < 2) return;
        
        const material = new THREE.LineBasicMaterial({ color });
        const geometry = new THREE.BufferGeometry().setFromPoints(this.points);
        const line = new THREE.Line(geometry, material);
        scene.add(line);
        
        // إضافة نقاط بارزة
        const pointMaterial = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
        this.points.forEach(pos => {
            const sphere = new THREE.Mesh(
                new THREE.SphereGeometry(0.5, 16),
                pointMaterial
            );
            sphere.position.copy(pos);
            scene.add(sphere);
        });
    }
}