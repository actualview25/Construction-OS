// =======================================
// ACTUAL CONSTRUCTION OS - SYNC MANAGER
// =======================================
// مزامنة البيانات بين RealityBridge و SceneGraph و LazyLoader

export class SyncManager {
    constructor(bridge) {
        this.bridge = bridge;
        this.syncQueue = [];
        this.syncing = false;
        
        this.stats = {
            totalSyncs: 0,
            queueSize: 0,
            lastSync: null,
            conflicts: 0
        };

        this.startSyncLoop();
    }

    // بدء حلقة المزامنة
    startSyncLoop() {
        setInterval(() => {
            if (this.syncQueue.length > 0 && !this.syncing) {
                this.processQueue();
            }
        }, 1000);
    }

    // إضافة كيان لقائمة المزامنة
    queueSync(entityId, priority = 5) {
        this.syncQueue.push({
            entityId,
            priority,
            queuedAt: Date.now()
        });

        // ترتيب حسب الأولوية
        this.syncQueue.sort((a, b) => b.priority - a.priority);
        this.stats.queueSize = this.syncQueue.length;

        console.log(`📋 تمت إضافة ${entityId} للمزامنة (أولوية ${priority})`);
    }

    // معالجة قائمة المزامنة
    async processQueue() {
        if (this.syncQueue.length === 0) return;

        this.syncing = true;
        const item = this.syncQueue.shift();

        try {
            await this.syncEntity(item.entityId);
            this.stats.totalSyncs++;
            this.stats.lastSync = new Date().toISOString();
        } catch (error) {
            console.error(`❌ فشل مزامنة ${item.entityId}:`, error);
            
            // إعادة المحاولة بأولوية أقل
            if (item.priority > 1) {
                this.queueSync(item.entityId, item.priority - 1);
            }
        }

        this.syncing = false;
    }

    // مزامنة كيان واحد
    async syncEntity(entityId) {
        const entity = this.bridge.globalSystem.getCompleteEntity(entityId);
        if (!entity) return;

        console.log(`🔄 مزامنة ${entityId}...`);

        // 1. تحديث SceneGraph
        this.updateSceneGraph(entity);

        // 2. تحديث المرتكزات والعلامات
        this.updateAnchorsAndMarkers(entity);

        // 3. تحديث LazyLoader إذا كان موجوداً
        if (this.bridge.loader) {
            await this.updateLoader(entity);
        }

        // 4. حفظ في التخزين
        await this.saveToStorage(entity);
    }

    // تحديث الرسم البياني
    updateSceneGraph(entity) {
        entity.segments.forEach((segment, sceneId) => {
            this.bridge.sceneGraph.addEntityToScene(sceneId, entity.id);
        });
    }

    // تحديث المرتكزات والعلامات
    updateAnchorsAndMarkers(entity) {
        entity.segments.forEach((segment, sceneId) => {
            const id = `${entity.id}_${sceneId}`;
            const anchor = this.bridge.anchors.get(id);
            const marker = this.bridge.markers.get(id);

            if (anchor) {
                anchor.updateFromEntity(entity);
                if (segment.position) {
                    anchor.updateFromLocal(segment.position, this.bridge.sceneConnector);
                }
            }

            if (marker) {
                marker.updateFromEntity(entity);
                if (segment.position) {
                    marker.updatePosition(segment.position, this.bridge.sceneConnector);
                }
            }
        });
    }

    // تحديث LazyLoader
    async updateLoader(entity) {
        // تحديث أولويات التحميل
        entity.segments.forEach((_, sceneId) => {
            this.bridge.loader.updateScenePriority(sceneId, entity.data?.importance || 1);
        });

        // تحميل مسبق للمشاهد المهمة
        const importantScenes = Array.from(entity.segments.keys())
            .filter(sceneId => entity.data?.importance > 5);

        for (const sceneId of importantScenes) {
            await this.bridge.loader.preloadScene(sceneId);
        }
    }

    // حفظ في التخزين
    async saveToStorage(entity) {
        if (this.bridge.storage) {
            await this.bridge.storage.save(`entity_${entity.id}`, entity);
        }
    }

    // حل التعارضات
    resolveConflict(entityId, version1, version2) {
        this.stats.conflicts++;
        
        // استراتيجية: الأحدث يفوز
        if (version1.timestamp > version2.timestamp) {
            return version1;
        }
        return version2;
    }

    // الحصول على الحالة
    getStatus() {
        return {
            ...this.stats,
            isSyncing: this.syncing,
            queueLength: this.syncQueue.length
        };
    }
}
