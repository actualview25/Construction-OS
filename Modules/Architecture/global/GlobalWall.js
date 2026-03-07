// =======================================
// ACTUAL CONSTRUCTION OS - GLOBAL WALL
// =======================================

export class GlobalWall {
    constructor(globalSystem, sceneConnector, options = {}) {
        this.globalSystem = globalSystem;
        this.sceneConnector = sceneConnector;
        
        this.wallData = {
            material: options.material || 'concrete_block',
            thickness: options.thickness || 0.2,
            height: options.height || 3.0,
            finish: options.finish || null,
            color: options.color || 0x808080
        };
        
        this.entityId = null;
        this.segments = [];
        this.totalLength = 0;
        this.totalVolume = 0;
        this.totalArea = 0;
    }

    // إنشاء جدار عالمي
    create(startPoint, endPoint, sceneId = null) {
        this.entityId = this.globalSystem.createEntity('wall', {
            ...this.wallData,
            created: new Date().toISOString()
        });

        if (sceneId) {
            this.addSegment(sceneId, startPoint, endPoint);
        }

        return this.entityId;
    }

    // إضافة جزء في مشهد
    addSegment(sceneId, startPoint, endPoint, openings = []) {
        // تحويل إلى إحداثيات عالمية
        const globalStart = this.sceneConnector.localToGlobal(sceneId, startPoint);
        const globalEnd = this.sceneConnector.localToGlobal(sceneId, endPoint);
        
        // حساب الخصائص
        const length = this.calculateLength(globalStart, globalEnd);
        const area = length * this.wallData.height;
        const volume = area * this.wallData.thickness;

        const segmentData = {
            start: globalStart,
            end: globalEnd,
            localStart: startPoint,
            localEnd: endPoint,
            length: length,
            area: area,
            volume: volume,
            openings: openings.map(op => ({
                ...op,
                globalPosition: this.sceneConnector.localToGlobal(sceneId, op.position)
            }))
        };

        this.globalSystem.addSegment(this.entityId, sceneId, segmentData);
        
        // تحديث الإجماليات
        this.totalLength += length;
        this.totalArea += area;
        this.totalVolume += volume;
        this.segments.push({ sceneId, ...segmentData });

        console.log(`🧱 تم إضافة جدار بطول ${length.toFixed(2)} م في المشهد ${sceneId}`);
        return segmentData;
    }

    calculateLength(point1, point2) {
        return Math.sqrt(
            Math.pow(point2.x - point1.x, 2) +
            Math.pow(point2.z - point1.z, 2)
        );
    }

    // إضافة فتحة (باب/شباك)
    addOpening(sceneId, position, width, height, type = 'door') {
        const globalPos = this.sceneConnector.localToGlobal(sceneId, position);
        
        const opening = {
            position: globalPos,
            localPosition: position,
            width: width,
            height: height,
            type: type,
            area: width * height
        };

        // البحث عن الجزء المناسب وإضافة الفتحة
        const sceneEntities = this.globalSystem.getSceneEntities(sceneId);
        sceneEntities.forEach(item => {
            if (item.entityId === this.entityId) {
                if (!item.segment.openings) item.segment.openings = [];
                item.segment.openings.push(opening);
            }
        });

        return opening;
    }

    // عرض الجدار في مشهد
    renderInScene(sceneId, threeScene) {
        const sceneEntities = this.globalSystem.getSceneEntities(sceneId);
        
        sceneEntities.forEach(item => {
            if (item.entityId === this.entityId) {
                this.renderSegment(item.segment, threeScene);
            }
        });
    }

    renderSegment(segment, threeScene) {
        const direction = new THREE.Vector3().subVectors(segment.end, segment.start);
        const length = direction.length();
        
        if (length < 0.1) return;

        // جسم الجدار
        const geometry = new THREE.BoxGeometry(length, this.wallData.height, this.wallData.thickness);
        const material = new THREE.MeshStandardMaterial({
            color: this.wallData.color,
            transparent: true,
            opacity: 0.9
        });
        
        const mesh = new THREE.Mesh(geometry, material);
        
        const center = new THREE.Vector3().addVectors(segment.start, segment.end).multiplyScalar(0.5);
        mesh.position.copy(center);
        
        mesh.quaternion.setFromUnitVectors(
            new THREE.Vector3(1, 0, 0),
            direction.clone().normalize()
        );
        
        threeScene.add(mesh);

        // رسم الفتحات (إذا وجدت)
        if (segment.openings) {
            segment.openings.forEach(opening => {
                this.renderOpening(opening, threeScene);
            });
        }
    }

    renderOpening(opening, threeScene) {
        // يمكن إضافة إطار حول الفتحة
        const geometry = new THREE.BoxGeometry(opening.width, opening.height, 0.1);
        const material = new THREE.MeshBasicMaterial({ color: 0x000000, wireframe: true });
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.copy(opening.globalPosition);
        threeScene.add(mesh);
    }

    // الحصول على الكميات الإجمالية
    getTotalQuantities() {
        return {
            material: this.wallData.material,
            thickness: this.wallData.thickness,
            height: this.wallData.height,
            totalLength: this.totalLength.toFixed(2),
            totalArea: this.totalArea.toFixed(2),
            totalVolume: this.totalVolume.toFixed(2),
            segments: this.segments.length,
            openings: this.segments.reduce((sum, s) => sum + (s.openings?.length || 0), 0),
            scenes: [...new Set(this.segments.map(s => s.sceneId))]
        };
    }

    // تقرير مفصل
    generateReport() {
        const totals = this.getTotalQuantities();
        
        return `
📋 تقرير الجدار العالمي
══════════════════════════════
🏗️ المعرف: ${this.entityId}
🧱 المادة: ${totals.material}
📏 السمك: ${totals.thickness} م
📐 الارتفاع: ${totals.height} م
══════════════════════════════
📊 الإجماليات:
• الطول: ${totals.totalLength} م
• المساحة: ${totals.totalArea} م²
• الحجم: ${totals.totalVolume} م³
• الأجزاء: ${totals.segments}
• الفتحات: ${totals.openings}
• المشاهد: ${totals.scenes.length}
══════════════════════════════
        `;
    }
}
