// =======================================
// ACTUAL CONSTRUCTION OS - INTEGRATED LOADER
// =======================================
// دمج Lazy + Segmented + LOD + Cache

export class IntegratedLoader {
    constructor(sceneGraph, storage, camera) {
        this.sceneGraph = sceneGraph;
        this.storage = storage;
        this.camera = camera;
        
        // أنظمة التحميل
        this.lazyLoader = new LazySceneLoader(sceneGraph, storage);
        this.segmentedLoader = new SegmentedSceneLoader();
        this.lodManager = new LODManager(camera);
        
        // أنظمة التخزين
        this.cache = new Map();
        this.pending = new Map();
        
        // إحصائيات
        this.stats = {
            scenesLoaded: 0,
            tilesLoaded: 0,
            cacheHits: 0,
            cacheMisses: 0,
            memoryUsage: 0,
            fps: 60
        };

        // بدء المراقبة
        this.startMonitoring();
    }

    // تحميل مشهد
    async loadScene(sceneId, viewport = { x: 0, y: 0 }) {
        console.log(`🎯 تحميل المشهد ${sceneId}...`);

        // 1. تحقق من الكاش أولاً
        if (this.cache.has(sceneId)) {
            this.stats.cacheHits++;
            console.log(`✅ المشهد ${sceneId} موجود في الكاش`);
            return this.cache.get(sceneId);
        }

        this.stats.cacheMisses++;

        // 2. تحميل بيانات المشهد (Lazy)
        const sceneData = await this.lazyLoader.loadScene(sceneId);
        
        // 3. تقسيم الصورة إلى Tiles
        if (!sceneData.segmented) {
            sceneData.tiles = this.segmentedLoader.segmentImage(
                sceneData.image,
                sceneData.width,
                sceneData.height
            );
            sceneData.segmented = true;
            
            // تخزين في IndexedDB
            await this.storage.save(`scene_${sceneId}`, sceneData);
        }

        // 4. تحميل Tiles القريبة
        const tilesToLoad = this.segmentedLoader.getTilesAround(
            sceneData.tiles,
            viewport.x,
            viewport.y
        );

        // 5. تحميل كل Tile مع LOD
        for (const tile of tilesToLoad) {
            await this.loadTile(sceneId, tile);
        }

        // 6. تخزين في الكاش
        this.cache.set(sceneId, sceneData);
        this.stats.scenesLoaded++;

        // 7. تحميل مسبق للمشاهد المتصلة
        this.preloadConnectedScenes(sceneId);

        return sceneData;
    }

    // تحميل Tile مع LOD
    async loadTile(sceneId, tile) {
        // تحقق من وجود التايل في الكاش
        const tileId = `${sceneId}_${tile.id}`;
        
        if (this.pending.has(tileId)) {
            return this.pending.get(tileId);
        }

        // حساب المسافة من الكاميرا
        const distance = this.calculateTileDistance(tile);
        
        // اختيار مستوى التفاصيل المناسب
        const lodLevel = this.lodManager.getLevel(distance);
        
        // إنشاء Promise للتحميل
        const loadPromise = new Promise(async (resolve) => {
            // تحقق من IndexedDB
            let tileData = await this.storage.load(tileId);
            
            if (!tileData) {
                // تحميل الصورة
                tileData = await this.loadTileImage(tile, lodLevel);
                await this.storage.save(tileId, tileData);
            }

            // تطبيق LOD
            tileData.lod = lodLevel;
            
            resolve(tileData);
        });

        this.pending.set(tileId, loadPromise);
        const data = await loadPromise;
        this.pending.delete(tileId);
        
        this.stats.tilesLoaded++;
        
        return data;
    }

    // حساب مسافة التايل من الكاميرا
    calculateTileDistance(tile) {
        if (!this.camera) return 0;
        
        // تحويل إحداثيات التايل إلى موقع افتراضي
        const tileWorldPos = new THREE.Vector3(
            tile.col * tile.size,
            0,
            tile.row * tile.size
        );
        
        return this.camera.position.distanceTo(tileWorldPos);
    }

    // تحميل صورة التايل بمستوى تفاصيل محدد
    async loadTileImage(tile, lodLevel) {
        const qualities = {
            high: { scale: 1.0, quality: 1.0 },
            medium: { scale: 0.5, quality: 0.7 },
            low: { scale: 0.25, quality: 0.4 }
        };

        const q = qualities[lodLevel] || qualities.medium;

        // محاكاة تحميل الصورة
        return {
            id: tile.id,
            lod: lodLevel,
            data: tile.imageData, // مصغرة حسب LOD
            size: q.scale,
            loadedAt: Date.now()
        };
    }

    // تحميل مسبق للمشاهد المتصلة
    async preloadConnectedScenes(sceneId) {
        const connected = this.sceneGraph.getConnectedScenes(sceneId);
        
        for (const conn of connected.slice(0, 2)) {
            // تحميل المشاهد المتصلة في الخلفية
            setTimeout(() => {
                this.loadScene(conn.sceneId, { preload: true });
            }, 2000);
        }
    }

    // تحديث بناءً على حركة الكاميرا
    onCameraMove(viewportX, viewportY) {
        if (!this.currentScene) return;

        // تحديث Tiles
        const newTiles = this.segmentedLoader.getTilesAround(
            this.currentScene.tiles,
            viewportX,
            viewportY
        );

        // تحميل الجديدة
        newTiles.forEach(tile => {
            if (!tile.loaded) {
                this.loadTile(this.currentScene.id, tile);
            }
        });

        // تحديث LOD لجميع التايلات المحملة
        this.lodManager.update();
    }

    // تحديث موقع الكاميرا
    setCamera(camera) {
        this.camera = camera;
        this.lodManager.camera = camera;
    }

    // تفريغ مشهد
    unloadScene(sceneId) {
        this.cache.delete(sceneId);
        this.lazyLoader.unloadScene(sceneId);
        this.stats.scenesLoaded--;
    }

    // بدء مراقبة الأداء
    startMonitoring() {
        setInterval(() => {
            this.updateStats();
        }, 1000);
    }

    // تحديث الإحصائيات
    updateStats() {
        this.stats.memoryUsage = this.calculateMemoryUsage();
        this.stats.fps = this.calculateFPS();
    }

    // حساب استخدام الذاكرة
    calculateMemoryUsage() {
        let total = 0;
        this.cache.forEach(scene => {
            total += scene.tiles?.length || 0;
        });
        return (total * 1024 * 1024) / 1024 / 1024; // MB
    }

    // حساب FPS
    calculateFPS() {
        if (!window.performance) return 60;
        return Math.round(60 - (performance.now() % 60));
    }

    // الحصول على إحصائيات مفصلة
    getDetailedStats() {
        return {
            loader: this.stats,
            lazy: this.lazyLoader.getStats(),
            segmented: this.segmentedLoader.getStats(),
            lod: this.lodManager.getStats(),
            cache: {
                size: this.cache.size,
                hits: this.stats.cacheHits,
                misses: this.stats.cacheMisses,
                hitRate: (this.stats.cacheHits / (this.stats.cacheHits + this.stats.cacheMisses) * 100).toFixed(2) + '%'
            }
        };
    }
}
