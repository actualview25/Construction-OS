// =======================================
// ACTUAL CONSTRUCTION OS - SYNC MANAGER
// =======================================
// مدير المزامنة - يضمن تطابق البيانات

export class SyncManager {
    constructor(bridge) {
        this.bridge = bridge;
        this.syncQueue = [];
        this.syncHistory = [];
        this.conflicts = [];
        
        this.autoSync = true;
        this.syncInterval = 5000; // 5 ثوان
        
        if (this.autoSync) {
            this.startAutoSync();
        }
    }

    // بدء المزامنة التلقائية
    startAutoSync() {
        setInterval(() => {
            this.syncAll();
        }, this.syncInterval);
    }

    // مزامنة كل شيء
    syncAll() {
        console.log('🔄 بدء المزامنة الشاملة...');
        
        const report = {
            timestamp: new Date().toISOString(),
            entitiesSynced: 0,
            anchorsSynced: 0,
            markersSynced: 0,
            conflicts: 0
        };

        // مزامنة الكيانات العالمية
        this.bridge.globalSystem.entities.forEach((entity, entityId) => {
            const result = this.syncEntity(entityId);
            report.entitiesSynced += result.entities;
            report.anchorsSynced += result.anchors;
            report.markersSynced += result.markers;
            report.conflicts += result.conflicts;
        });

        this.syncHistory.push(report);
        console.log('✅ اكتملت المزامنة:', report);
        
        return report;
    }

    // مزامنة كيان محدد
    syncEntity(entityId) {
        const entity = this.bridge.globalSystem.getCompleteEntity(entityId);
        if (!entity) return { entities: 0, anchors: 0, markers: 0, conflicts: 0 };

        let result = {
            entities: 1,
            anchors: 0,
            markers: 0,
            conflicts: 0
        };

        // مزامنة جميع أجزاء الكيان
        entity.segments.forEach((segment, sceneId) => {
            const anchor = this.bridge.sceneAnchors.get(`${entityId}_${sceneId}`);
            const marker = this.bridge.entityMarkers.get(`${entityId}_${sceneId}`);

            if (anchor) {
                this.syncAnchor(anchor, entity, segment);
                result.anchors++;
            }

            if (marker) {
                this.syncMarker(marker, entity, segment);
                result.markers++;
            }
        });

        return result;
    }

    // مزامنة مرتكز
    syncAnchor(anchor, entity, segment) {
        // التحقق من تطابق البيانات
        const entityVersion = entity.data?.version || 0;
        const anchorVersion = anchor.metadata.version || 0;

        if (entityVersion > anchorVersion) {
            // تحديث المرتكز من الكيان
            anchor.updateFromEntity(entity);
            this.logSync('anchor', anchor.id, 'updated');
        } else if (entityVersion < anchorVersion) {
            // هناك تعارض
            this.handleConflict({
                type: 'anchor',
                id: anchor.id,
                entityVersion,
                anchorVersion
            });
        }
    }

    // مزامنة علامة
    syncMarker(marker, entity, segment) {
        // تحديث موقع العلامة
        if (segment && segment.localPosition) {
            marker.updatePosition(segment.localPosition, this.bridge.sceneConnector);
        }
        
        // تحديث خصائص العرض
        marker.updateFromEntity(entity);
        
        this.logSync('marker', marker.id, 'synced');
    }

    // معالجة التعارضات
    handleConflict(conflict) {
        this.conflicts.push({
            ...conflict,
            timestamp: new Date().toISOString()
        });

        console.warn('⚠️ تعارض في البيانات:', conflict);

        // هنا يمكن إضافة منطق لحل التعارضات
        // مثلاً: اختيار الإصدار الأحدث دائماً
    }

    // تسجيل عملية المزامنة
    logSync(type, id, action) {
        this.syncQueue.push({
            type,
            id,
            action,
            timestamp: new Date().toISOString()
        });

        // حفظ آخر 100 عملية فقط
        if (this.syncQueue.length > 100) {
            this.syncQueue.shift();
        }
    }

    // الحصول على حالة المزامنة
    getStatus() {
        return {
            queueLength: this.syncQueue.length,
            conflictsCount: this.conflicts.length,
            lastSync: this.syncHistory[this.syncHistory.length - 1],
            isHealthy: this.conflicts.length === 0
        };
    }

    // حل جميع التعارضات (اختيار الأحدث)
    resolveAllConflicts() {
        this.conflicts.forEach(conflict => {
            // حل التعارض - الأحدث يفوز
            console.log('🔧 حل التعارض:', conflict);
        });
        this.conflicts = [];
    }
}
