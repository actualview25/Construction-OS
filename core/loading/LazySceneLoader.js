// =======================================
// ACTUAL CONSTRUCTION OS - LAZY SCENE LOADER
// =======================================
// نظام تحميل ذكي للمشاهد - يحمل عند الحاجة فقط

export class LazySceneLoader {
    constructor(sceneGraph, storageManager) {
        this.sceneGraph = sceneGraph;
        this.storage = storageManager;
        
        this.loadedScenes = new Map();        // المشاهد المحملة
        this.loadingScenes = new Set();        // قيد التحميل
        this.sceneCache = new Map();           // كاش المشاهد
        
        this.maxLoadedScenes = 5;               // حد أقصى للذاكرة
        this.preloadRadius = 2;                  // مشهدين أمامي/خلفي
        this.loadPriority = 'distance';          // أولوية المسافة
        
        this.stats = {
            totalLoads: 0,
            cacheHits: 0,
            cacheMisses: 0,
            preloads: 0
        };
    }

    // تحميل مشهد
    async loadScene(sceneId, options = {}) {
        // هل هو محمل بالفعل؟
        if (this.loadedScenes.has(sceneId)) {
            this.stats.cacheHits++;
            return this.loadedScenes.get(sceneId);
        }

        // هل هو قيد التحميل؟
        if (this.loadingScenes.has(sceneId)) {
            return new Promise(resolve => {
                const check = setInterval(() => {
                    if (this.loadedScenes.has(sceneId)) {
                        clearInterval(check);
                        resolve(this.loadedScenes.get(sceneId));
                    }
                }, 100);
            });
        }

        this.stats.cacheMisses++;
        this.loadingScenes.add(sceneId);

        console.log(`📥 تحميل المشهد ${sceneId}...`);

        try {
            // تحميل البيانات
            const sceneData = await this.storage.load(`scene_${sceneId}`);
            
            // تحميل الصورة
            const image = await this.loadSceneImage(sceneData.image);
            
            // إنشاء المشهد
            const scene = this.createScene(sceneId, sceneData, image);
            
            // تخزين في الذاكرة
            this.loadedScenes.set(sceneId, scene);
            
            // تحميل مسبق للمشاهد المتصلة
            if (options.preload !== false) {
                this.preloadConnectedScenes(sceneId);
            }

            // تفريغ المشاهد البعيدة
            this.cleanupOldScenes(sceneId);

            this.stats.totalLoads++;
            this.loadingScenes.delete(sceneId);

            console.log(`✅ تم تحميل المشهد ${sceneId} (${this.loadedScenes.size}/${this.maxLoadedScenes})`);
            
            return scene;

        } catch (error) {
            console.error(`❌ فشل تحميل المشهد ${sceneId}:`, error);
            this.loadingScenes.delete(sceneId);
            throw error;
        }
    }

    // تحميل صورة المشهد
    loadSceneImage(imageUrl) {
        return new Promise((resolve, reject) => {
            // استخدام Progressive JPEG للتحميل التدريجي
            const img = new Image();
            
            // نسخة منخفضة الدقة أولاً
            img.src = imageUrl + '?quality=low';
            
            img.onload = () => {
                // ثم استبدال بالنسخة عالية الدقة
                const highRes = new Image();
                highRes.src = imageUrl;
                highRes.onload = () => resolve(highRes);
                highRes.onerror = reject;
            };
            
            img.onerror = reject;
        });
    }

    // إنشاء مشهد
    createScene(sceneId, data, image) {
        return {
            id: sceneId,
            data: data,
            image: image,
            texture: null, // سيتم إنشاؤها عند الحاجة
            hotspots: data.hotspots || [],
            paths: data.paths || [],
            measurements: data.measurements || [],
            loadedAt: Date.now(),
            lastAccessed: Date.now()
        };
    }

    // تحميل مسبق للمشاهد المتصلة
    async preloadConnectedScenes(sceneId) {
        const connected = this.sceneGraph.adjacencyList.get(sceneId) || [];
        
        // ترتيب حسب الأهمية
        const toPreload = connected
            .map(c => ({
                id: c.node,
                weight: c.weight,
                importance: this.sceneGraph.nodes.get(c.node)?.importance || 1
            }))
            .sort((a, b) => {
                if (this.loadPriority === 'distance') {
                    return a.weight - b.weight;
                }
                return b.importance - a.importance;
            })
            .slice(0, 2); // أشحن أقرب مشهدين

        for (const scene of toPreload) {
            if (!this.loadedScenes.has(scene.id) && !this.loadingScenes.has(scene.id)) {
                this.stats.preloads++;
                // تحميل في الخلفية بأولوية منخفضة
                setTimeout(() => this.loadScene(scene.id, { preload: false }), 1000);
            }
        }
    }

    // تفريغ المشاهد القديمة
    cleanupOldScenes(currentSceneId) {
        if (this.loadedScenes.size <= this.maxLoadedScenes) return;

        // ترتيب حسب آخر استخدام
        const scenes = Array.from(this.loadedScenes.entries())
            .map(([id, scene]) => ({
                id,
                lastAccessed: scene.lastAccessed || 0,
                distance: this.getDistance(currentSceneId, id)
            }))
            .sort((a, b) => {
                // المشاهد البعيدة وغير المستخدمة تفرغ أولاً
                if (a.distance > 5 && b.distance <= 5) return -1;
                if (b.distance > 5 && a.distance <= 5) return 1;
                return a.lastAccessed - b.lastAccessed;
            });

        // احتفظ بالأحدث
        const toKeep = scenes.slice(0, this.maxLoadedScenes);
        const toRemove = scenes.slice(this.maxLoadedScenes);

        toRemove.forEach(scene => {
            this.unloadScene(scene.id);
        });
    }

    // حساب المسافة بين مشهدين
    getDistance(sceneId1, sceneId2) {
        const pos1 = this.sceneGraph.scenePositions.get(sceneId1);
        const pos2 = this.sceneGraph.scenePositions.get(sceneId2);
        
        if (!pos1 || !pos2) return Infinity;

        return Math.sqrt(
            Math.pow(pos2.x - pos1.x, 2) +
            Math.pow(pos2.y - pos1.y, 2) +
            Math.pow(pos2.z - pos1.z, 2)
        );
    }

    // تفريغ مشهد
    unloadScene(sceneId) {
        const scene = this.loadedScenes.get(sceneId);
        if (!scene) return;

        // تفريغ الموارد
        if (scene.texture) {
            scene.texture.dispose();
        }

        this.loadedScenes.delete(sceneId);
        console.log(`🧹 تم تفريغ المشهد ${sceneId}`);
    }

    // تحديث آخر استخدام
    touchScene(sceneId) {
        const scene = this.loadedScenes.get(sceneId);
        if (scene) {
            scene.lastAccessed = Date.now();
        }
    }

    // الحصول على إحصائيات
    getStats() {
        return {
            ...this.stats,
            loadedScenes: this.loadedScenes.size,
            loadingScenes: this.loadingScenes.size,
            cacheSize: this.sceneCache.size,
            hitRate: (this.stats.cacheHits / (this.stats.cacheHits + this.stats.cacheMisses) * 100).toFixed(2) + '%'
        };
    }
}
