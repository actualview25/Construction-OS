// =======================================
// ACTUAL VIEW CONSTRUCTION OS - DISTANCE TOOL
// =======================================

import * as THREE from 'three';

export class DistanceTool {
    constructor(app) {
        this.app = app;
        this.active = false;
        this.startPoint = null;
        this.endPoint = null;
        this.line = null;
        this.pointMarkers = [];
        this.distance = 0;
        
        // عناصر الواجهة
        this.label = null;
        this.measurements = [];
        
        console.log('✅ DistanceTool initialized');
    }

    // تفعيل الأداة
    activate() {
        this.active = true;
        this.startPoint = null;
        this.endPoint = null;
        this.clearVisuals();
        this.app.updateStatus('📏 Distance tool activated - Click two points to measure', 'info');
        this.setupEventListeners();
    }

    // تعطيل الأداة
    deactivate() {
        this.active = false;
        this.clearVisuals();
        this.app.updateStatus('📏 Distance tool deactivated', 'info');
        this.removeEventListeners();
    }

    // إضافة نقطة
    addPoint(position) {
        if (!this.active) return;
        
        if (!this.startPoint) {
            this.startPoint = position.clone();
            this.addPointMarker(position, 0xff44ff);
            this.app.updateStatus('📏 First point set - Click second point', 'info');
        } else {
            this.endPoint = position.clone();
            this.addPointMarker(position, 0xff44ff);
            this.calculateDistance();
            this.drawLine();
            this.app.updateStatus(`📏 Distance: ${this.distance.toFixed(2)} m`, 'success');
        }
    }

    // حساب المسافة
    calculateDistance() {
        if (!this.startPoint || !this.endPoint) return 0;
        
        const dx = this.endPoint.x - this.startPoint.x;
        const dy = this.endPoint.y - this.startPoint.y;
        const dz = this.endPoint.z - this.startPoint.z;
        
        this.distance = Math.sqrt(dx * dx + dy * dy + dz * dz);
        
        // إضافة القياس للسجل
        this.measurements.push({
            id: `measure-${Date.now()}`,
            start: this.startPoint.clone(),
            end: this.endPoint.clone(),
            distance: this.distance,
            timestamp: new Date().toISOString()
        });
        
        // تحديث واجهة المستخدم
        this.updateUI();
        
        return this.distance;
    }

    // رسم خط القياس
    drawLine() {
        if (!this.startPoint || !this.endPoint) return;
        
        // حذف الخط القديم
        if (this.line) {
            this.app.engine.scene.remove(this.line);
        }
        
        // إنشاء نقاط الخط
        const points = [
            new THREE.Vector3(this.startPoint.x, this.startPoint.y + 0.05, this.startPoint.z),
            new THREE.Vector3(this.endPoint.x, this.endPoint.y + 0.05, this.endPoint.z)
        ];
        
        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        const material = new THREE.LineBasicMaterial({ color: 0xffaa44, linewidth: 2 });
        this.line = new THREE.Line(geometry, material);
        this.app.engine.scene.add(this.line);
        
        // إضافة نص القياس
        this.addDistanceLabel();
    }

    // إضافة نص القياس
    addDistanceLabel() {
        if (this.label) {
            this.app.engine.scene.remove(this.label);
        }
        
        const midPoint = new THREE.Vector3(
            (this.startPoint.x + this.endPoint.x) / 2,
            (this.startPoint.y + this.endPoint.y) / 2 + 0.2,
            (this.startPoint.z + this.endPoint.z) / 2
        );
        
        // إنشاء عنصر HTML للنص
        const div = document.createElement('div');
        div.textContent = `${this.distance.toFixed(2)} m`;
        div.style.backgroundColor = 'rgba(0,0,0,0.7)';
        div.style.color = '#ffaa44';
        div.style.padding = '2px 6px';
        div.style.borderRadius = '4px';
        div.style.fontSize = '12px';
        div.style.fontFamily = 'monospace';
        div.style.border = '1px solid #ffaa44';
        div.style.whiteSpace = 'nowrap';
        
        const css2dObject = new CSS2DObject(div);
        css2dObject.position.copy(midPoint);
        
        this.label = css2dObject;
        this.app.engine.scene.add(this.label);
    }

    // إضافة نقطة مرئية
    addPointMarker(position, color = 0xffaa44) {
        const geometry = new THREE.SphereGeometry(0.1, 16, 16);
        const material = new THREE.MeshStandardMaterial({ color: color });
        const marker = new THREE.Mesh(geometry, material);
        marker.position.copy(position);
        marker.position.y += 0.05;
        marker.userData = { type: 'distancePoint' };
        this.app.engine.scene.add(marker);
        this.pointMarkers.push(marker);
    }

    // مسح العناصر المرئية
    clearVisuals() {
        // حذف النقاط
        this.pointMarkers.forEach(marker => {
            this.app.engine.scene.remove(marker);
        });
        this.pointMarkers = [];
        
        // حذف الخط
        if (this.line) {
            this.app.engine.scene.remove(this.line);
            this.line = null;
        }
        
        // حذف النص
        if (this.label) {
            this.app.engine.scene.remove(this.label);
            this.label = null;
        }
    }

    // تحديث واجهة المستخدم
    updateUI() {
        const props = document.getElementById('propertiesGrid');
        if (props) {
            // إزالة العنصر القديم
            const oldDistance = props.querySelector('.distance-tool-group');
            if (oldDistance) oldDistance.remove();
            
            // إنشاء عنصر جديد
            const distanceDiv = document.createElement('div');
            distanceDiv.className = 'property-group distance-tool-group';
            distanceDiv.innerHTML = `
                <div class="property-group-title"><i class="fas fa-ruler"></i> Distance Tool</div>
                <div class="property-row"><span class="property-label">Distance:</span><span class="property-value">${this.distance.toFixed(2)} m</span></div>
                <div class="property-row"><span class="property-label">Measurements:</span><span class="property-value">${this.measurements.length}</span></div>
                <div class="property-row"><span class="property-label">Last:</span><span class="property-value">${this.measurements[this.measurements.length-1]?.timestamp.slice(11,19) || '-'}</span></div>
            `;
            
            // إضافة أزرار التحكم
            const buttonDiv = document.createElement('div');
            buttonDiv.style.marginTop = '10px';
            buttonDiv.style.display = 'flex';
            buttonDiv.style.gap = '5px';
            buttonDiv.innerHTML = `
                <button class="btn" onclick="window.app?.engine.distanceTool?.reset()" style="flex:1">Reset</button>
                <button class="btn" onclick="window.app?.engine.distanceTool?.exportMeasurements()" style="flex:1">Export</button>
            `;
            distanceDiv.appendChild(buttonDiv);
            
            props.appendChild(distanceDiv);
        }
    }

    // إعادة تعيين الأداة
    reset() {
        this.startPoint = null;
        this.endPoint = null;
        this.distance = 0;
        this.clearVisuals();
        this.updateUI();
        this.app.updateStatus('📏 Distance tool reset', 'info');
    }

    // تصدير القياسات
    exportMeasurements() {
        if (this.measurements.length === 0) {
            this.app.updateStatus('📏 No measurements to export', 'info');
            return;
        }
        
        let report = '📏 Distance Measurements Report\n';
        report += '══════════════════════════════\n\n';
        
        this.measurements.forEach((m, i) => {
            report += `${i+1}. Distance: ${m.distance.toFixed(2)} m\n`;
            report += `   Start: (${m.start.x.toFixed(2)}, ${m.start.y.toFixed(2)}, ${m.start.z.toFixed(2)})\n`;
            report += `   End:   (${m.end.x.toFixed(2)}, ${m.end.y.toFixed(2)}, ${m.end.z.toFixed(2)})\n`;
            report += `   Time:  ${m.timestamp}\n\n`;
        });
        
        report += `══════════════════════════════\n`;
        report += `Total: ${this.measurements.length} measurements\n`;
        
        // نسخ إلى الحافظة
        navigator.clipboard.writeText(report);
        this.app.updateStatus('📏 Report copied to clipboard', 'success');
        
        return report;
    }

    // أحداث النقر
    setupEventListeners() {
        this.clickHandler = this.onClick.bind(this);
        this.app.engine.renderer.domElement.addEventListener('click', this.clickHandler);
    }

    removeEventListeners() {
        if (this.clickHandler) {
            this.app.engine.renderer.domElement.removeEventListener('click', this.clickHandler);
        }
    }

    onClick(event) {
        if (!this.active) return;
        
        // حساب موقع النقر في العالم ثلاثي الأبعاد
        const mouse = new THREE.Vector2();
        mouse.x = (event.clientX / this.app.engine.renderer.domElement.clientWidth) * 2 - 1;
        mouse.y = -(event.clientY / this.app.engine.renderer.domElement.clientHeight) * 2 + 1;
        
        const raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(mouse, this.app.engine.camera);
        
        // استخدام مستوى الأرضية (y=0)
        const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
        const target = new THREE.Vector3();
        
        if (raycaster.ray.intersectPlane(plane, target)) {
            this.addPoint(target);
        }
    }
}
