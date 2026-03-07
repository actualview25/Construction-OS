// =======================================
// ACTUAL CONSTRUCTION OS - LOADING STRATEGY
// =======================================
// استراتيجيات تحميل ذكية حسب الجهاز

export class LoadingStrategy {
    constructor(sceneGraph) {
        this.sceneGraph = sceneGraph;
        this.device = this.detectDevice();
        this.strategies = {
            desktop: {
                maxLoadedScenes: 10,
                preloadRadius: 3,
                textureQuality: 'high',
                useWebGL: true
            },
            tablet: {
                maxLoadedScenes: 5,
                preloadRadius: 2,
                textureQuality: 'medium',
                useWebGL: true
            },
            mobile: {
                maxLoadedScenes: 3,
                preloadRadius: 1,
                textureQuality: 'low',
                useWebGL: false
            }
        };

        this.current = this.strategies[this.device];
        console.log(`📱 الجهاز: ${this.device}`, this.current);
    }

    // اكتشاف نوع الجهاز
    detectDevice() {
        const ua = navigator.userAgent;
        const width = window.innerWidth;

        if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
            return 'tablet';
        }

        if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)) {
            return 'mobile';
        }

        if (width < 768) return 'mobile';
        if (width < 1024) return 'tablet';

        return 'desktop';
    }

    // الحصول على استراتيجية التحميل
    getLoadStrategy(currentSceneId) {
        const nearby = this.sceneGraph.getNearbyScenes(currentSceneId, 50);
        
        // تحميل المشاهد القريبة حسب الاستراتيجية
        const toLoad = nearby
            .filter(n => n.distance < 20) // المشاهد القريبة جداً
            .slice(0, this.current.preloadRadius)
            .map(n => n.id);

        // المشاهد المهمة
        const important = this.sceneGraph.getHeatmap()
            .filter(h => h.importance > 3)
            .slice(0, 2)
            .map(h => h.id);

        return {
            immediate: [currentSceneId],
            preload: [...new Set([...toLoad, ...important])],
            lazy: nearby.map(n => n.id).slice(this.current.preloadRadius),
            strategy: this.current
        };
    }

    // الحصول على جودة الصورة
    getImageQuality() {
        const qualities = {
            high: { width: 4096, format: 'jpg' },
            medium: { width: 2048, format: 'jpg' },
            low: { width: 1024, format: 'webp' }
        };
        return qualities[this.current.textureQuality];
    }

    // هل نستخدم WebGL؟
    useWebGL() {
        return this.current.useWebGL;
    }

    // هل نستخدم التحميل المسبق؟
    shouldPreload() {
        return this.device !== 'mobile' || 
               (navigator.connection && navigator.connection.downlink > 2);
    }

    // الحصول على مهلة التحميل
    getTimeout() {
        const timeouts = {
            desktop: 5000,
            tablet: 10000,
            mobile: 15000
        };
        return timeouts[this.device];
    }

    // تحديث الاستراتيجية
    updateStrategy() {
        this.device = this.detectDevice();
        this.current = this.strategies[this.device];
    }
}
