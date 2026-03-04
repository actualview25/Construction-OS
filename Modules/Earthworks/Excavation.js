// modules/Earthworks/Excavation.js

class Excavation {
    constructor(boundary, options = {}) {
        this.boundary = boundary; // حدود الحفر (Polyline)
        this.depth = options.depth || 2.0; // عمق الحفر (متر)
        this.slopeAngle = options.slopeAngle || 45; // زاوية الميل (درجة)
        this.soilType = options.soilType || 'topsoil';
        this.material = new SoilMaterial(this.soilType);
        
        this.volume = 0;
        this.mesh = null;
        this.layers = [];
        
        this.calculateVolume();
    }
    
    // حساب حجم الحفر
    calculateVolume() {
        const area = this.boundary.realWorldDimensions.area;
        this.volume = area * this.depth;
        
        // تقسيم إلى طبقات
        const layerCount = Math.ceil(this.depth / 0.5); // طبقات كل 50 سم
        for (let i = 0; i < layerCount; i++) {
            const layerThickness = (i === layerCount - 1) 
                ? this.depth - (i * 0.5) 
                : 0.5;
            
            const layer = new Layer(
                `طبقة ${i + 1}`,
                this.material,
                layerThickness,
                - (i * 0.5) // منسوب تنازلي
            );
            this.layers.push(layer);
        }
    }
    
    // رسم الحفر في المشهد
    draw(scene) {
        this.layers.forEach(layer => {
            const mesh = layer.createMesh(this.boundary.points);
            scene.add(mesh);
        });
        
        // إضافة خطوط حدود الحفر
        this.drawBoundary(scene);
    }
    
    drawBoundary(scene) {
        const points = this.boundary.points.map(p => 
            new THREE.Vector3(p.x, -this.depth, p.z)
        );
        
        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        const material = new THREE.LineBasicMaterial({ color: 0xffaa44 });
        const line = new THREE.Line(geometry, material);
        scene.add(line);
    }
    
    // تصدير جدول كميات الحفر
    getBOQ() {
        return {
            نوع: 'حفريات',
            المساحة: this.boundary.realWorldDimensions.area.toFixed(2) + ' م²',
            العمق: this.depth.toFixed(2) + ' م',
            الحجم: this.volume.toFixed(2) + ' م³',
            نوع_التربة: this.material.name,
            الكثافة: this.material.density + ' طن/م³',
            الوزن: (this.volume * this.material.density).toFixed(2) + ' طن'
        };
    }
}