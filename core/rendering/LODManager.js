// =======================================
// ACTUAL VIEW CONSTRUCTION OS - LOD MANAGER
// =======================================
// الإصدار: 3.0.0 - مستويات تفاصيل متعددة للكيانات
// =======================================

export class LODManager {
    constructor(camera) {
        this.camera = camera;
        this.entities = new Map();
        this.distances = {
            high: 10,      // أقل من 10 متر → تفاصيل عالية
            medium: 30,    // 10-30 متر → تفاصيل متوسطة
            low: 100,      // 30-100 متر → تفاصيل منخفضة
            culled: 100    // أكثر من 100 متر → لا ترسم
        };
        
        this.stats = {
            high: 0,
            medium: 0,
            low: 0,
            culled: 0
        };
        
        this.debug = false;
        console.log('✅ LODManager initialized');
    }

    // إضافة كيان مع مستويات التفاصيل
    addEntity(entityId, meshes) {
        this.entities.set(entityId, {
            id: entityId,
            meshes: {
                high: meshes.high,
                medium: meshes.medium,
                low: meshes.low,
                current: meshes.high
            },
            position: meshes.position,
            lastLOD: 'high',
            visible: true,
            updateCount: 0
        });

        // إخفاء المستويات المنخفضة في البداية
        if (meshes.medium) meshes.medium.visible = false;
        if (meshes.low) meshes.low.visible = false;
        
        if (this.debug) console.log(`➕ Entity added: ${entityId}`);
    }

    // تحديث LOD بناءً على المسافة
    update() {
        if (!this.camera) return;

        // إعادة تعيين الإحصائيات
        this.stats = { high: 0, medium: 0, low: 0, culled: 0 };

        this.entities.forEach((entity, id) => {
            // حساب المسافة من الكاميرا
            const distance = this.camera.position.distanceTo(entity.position);
            
            // اختيار المستوى المناسب
            let newLOD = 'culled';
            let mesh = null;

            if (distance < this.distances.high) {
                newLOD = 'high';
                mesh = entity.meshes.high;
                this.stats.high++;
            } else if (distance < this.distances.medium) {
                newLOD = 'medium';
                mesh = entity.meshes.medium;
                this.stats.medium++;
            } else if (distance < this.distances.low) {
                newLOD = 'low';
                mesh = entity.meshes.low;
                this.stats.low++;
            } else {
                newLOD = 'culled';
                this.stats.culled++;
            }

            // تطبيق التغيير إذا تغير المستوى
            if (newLOD !== entity.lastLOD) {
                this.switchLOD(entity, newLOD, mesh);
                entity.updateCount++;
            }
        });

        if (this.debug && this.entities.size > 0) {
            console.log('📊 LOD Stats:', this.stats);
        }
    }

    // التبديل بين المستويات
    switchLOD(entity, newLOD, newMesh) {
        // إخفاء القديم
        if (entity.meshes.current) {
            entity.meshes.current.visible = false;
        }

        // إظهار الجديد
        if (newMesh) {
            newMesh.visible = true;
            entity.meshes.current = newMesh;
        }

        entity.lastLOD = newLOD;
        
        if (this.debug) {
            console.log(`🔄 ${entity.id}: ${entity.lastLOD} → ${newLOD}`);
        }
    }

    // ضبط مسافات LOD
    setDistances(high, medium, low, culled) {
        this.distances = { high, medium, low, culled };
        console.log('📏 LOD distances updated:', this.distances);
    }

    // الحصول على إحصائيات
    getStats() {
        return {
            ...this.stats,
            total: this.entities.size,
            distances: this.distances
        };
    }

    // تفعيل وضع التصحيح
    enableDebug() {
        this.debug = true;
        console.log('🔧 LOD Debug enabled');
    }

    // تعطيل وضع التصحيح
    disableDebug() {
        this.debug = false;
    }

    // إزالة كيان
    removeEntity(entityId) {
        const entity = this.entities.get(entityId);
        if (entity) {
            // إخفاء كل المستويات
            if (entity.meshes.high) entity.meshes.high.visible = false;
            if (entity.meshes.medium) entity.meshes.medium.visible = false;
            if (entity.meshes.low) entity.meshes.low.visible = false;
            
            this.entities.delete(entityId);
            if (this.debug) console.log(`➖ Entity removed: ${entityId}`);
            return true;
        }
        return false;
    }

    // إعادة تعيين كل الكيانات
    reset() {
        this.entities.clear();
        this.stats = { high: 0, medium: 0, low: 0, culled: 0 };
        console.log('🔄 LODManager reset');
    }

    // إنشاء نسخ مختلفة التفاصيل لكيان
    static createLODVersions(originalMesh, options = {}) {
        const high = originalMesh.clone();
        
        // نسخة متوسطة
        const medium = originalMesh.clone();
        if (medium.geometry && options.simplify) {
            medium.geometry = this.simplifyGeometry(medium.geometry, 0.5);
        }

        // نسخة منخفضة
        const low = originalMesh.clone();
        if (low.geometry && options.simplify) {
            low.geometry = this.simplifyGeometry(low.geometry, 0.25);
        }

        return { 
            high, 
            medium, 
            low, 
            position: originalMesh.position.clone() 
        };
    }

    // تبسيط الهندسة
    static simplifyGeometry(geometry, factor) {
        // يمكن تطويرها لاحقاً باستخدام THREE.SimplifyModifier
        return geometry.clone();
    }
}
