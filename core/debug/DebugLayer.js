// =======================================
// ACTUAL CONSTRUCTION OS - DEBUG LAYER
// =======================================
// طبقة التصحيح وعرض المعلومات

export class DebugLayer {
    constructor(sceneGraph, realityBridge, loader, lodManager) {
        this.sceneGraph = sceneGraph;
        this.bridge = realityBridge;
        this.loader = loader;
        this.lod = lodManager;
        
        this.visible = false;
        this.panel = null;
        this.stats = {};
        
        this.init();
    }

    // تهيئة
    init() {
        this.createPanel();
        this.startMonitoring();
    }

    // إنشاء لوحة التصحيح
    createPanel() {
        this.panel = document.createElement('div');
        this.panel.style.cssText = `
            position: fixed;
            top: 10px;
            left: 10px;
            background: rgba(0,0,0,0.8);
            color: #0f0;
            font-family: monospace;
            font-size: 12px;
            padding: 15px;
            border-radius: 5px;
            z-index: 10000;
            display: none;
            max-width: 400px;
            max-height: 80vh;
            overflow-y: auto;
            border: 2px solid #0f0;
        `;

        document.body.appendChild(this.panel);
    }

    // بدء المراقبة
    startMonitoring() {
        setInterval(() => {
            if (this.visible) {
                this.updateStats();
                this.renderPanel();
            }
        }, 1000);
    }

    // تحديث الإحصائيات
    updateStats() {
        this.stats = {
            time: new Date().toLocaleTimeString(),
            fps: this.calculateFPS(),
            memory: this.getMemoryUsage(),
            
            // SceneGraph
            scenes: this.sceneGraph.nodes.size,
            edges: this.sceneGraph.edges.length,
            
            // RealityBridge
            anchors: this.bridge.anchors.size,
            markers: this.bridge.markers.size,
            links: this.bridge.links.size,
            
            // Loader
            loadedScenes: this.loader?.loadedScenes?.size || 0,
            loadingScenes: this.loader?.loadingScenes?.size || 0,
            
            // LOD
            lodStats: this.lod?.getStats() || {},
            
            // Sync
            syncQueue: this.bridge.syncManager?.syncQueue.length || 0,
            syncConflicts: this.bridge.syncManager?.stats.conflicts || 0
        };
    }

    // رسم لوحة المعلومات
    renderPanel() {
        this.panel.innerHTML = `
            <div style="color:#0f0; font-weight:bold; margin-bottom:10px;">
                🐛 DEBUG MODE
            </div>
            
            <div style="border-bottom:1px solid #0f0; margin:5px 0;"></div>
            
            <div style="color:#88aaff;">⏱️ الوقت: ${this.stats.time}</div>
            <div style="color:#88aaff;">🎮 FPS: ${this.stats.fps}</div>
            <div style="color:#88aaff;">💾 الذاكرة: ${this.stats.memory}</div>
            
            <div style="border-bottom:1px solid #0f0; margin:5px 0;"></div>
            
            <div style="color:#ffaa44;">📊 SCENE GRAPH</div>
            <div style="margin-left:10px;">
                <div>المشاهد: ${this.stats.scenes}</div>
                <div>الروابط: ${this.stats.edges}</div>
            </div>
            
            <div style="border-bottom:1px solid #0f0; margin:5px 0;"></div>
            
            <div style="color:#ffaa44;">🌉 REALITY BRIDGE</div>
            <div style="margin-left:10px;">
                <div>المرتكزات: ${this.stats.anchors}</div>
                <div>العلامات: ${this.stats.markers}</div>
                <div>الروابط: ${this.stats.links}</div>
            </div>
            
            <div style="border-bottom:1px solid #0f0; margin:5px 0;"></div>
            
            <div style="color:#ffaa44;">📥 LOADER</div>
            <div style="margin-left:10px;">
                <div>محملة: ${this.stats.loadedScenes}</div>
                <div>قيد التحميل: ${this.stats.loadingScenes}</div>
            </div>
            
            <div style="border-bottom:1px solid #0f0; margin:5px 0;"></div>
            
            <div style="color:#ffaa44;">🔄 LOD</div>
            <div style="margin-left:10px;">
                <div>High: ${this.stats.lodStats.high || 0}</div>
                <div>Medium: ${this.stats.lodStats.medium || 0}</div>
                <div>Low: ${this.stats.lodStats.low || 0}</div>
                <div>Culled: ${this.stats.lodStats.culled || 0}</div>
            </div>
            
            <div style="border-bottom:1px solid #0f0; margin:5px 0;"></div>
            
            <div style="color:#ffaa44;">🔄 SYNC</div>
            <div style="margin-left:10px;">
                <div>قائمة الانتظار: ${this.stats.syncQueue}</div>
                <div>التعارضات: ${this.stats.syncConflicts}</div>
            </div>
            
            <div style="border-bottom:1px solid #0f0; margin:5px 0;"></div>
            
            <div style="color:#888; font-size:10px; margin-top:10px;">
                F2: إخفاء/إظهار | F5: تحديث
            </div>
        `;
    }

    // حساب FPS
    calculateFPS() {
        if (!window.performance) return 60;
        
        // FPS تقريبي
        return Math.round(60 - (performance.now() % 60));
    }

    // استخدام الذاكرة
    getMemoryUsage() {
        if (window.performance && window.performance.memory) {
            const mb = window.performance.memory.usedJSHeapSize / 1024 / 1024;
            return mb.toFixed(2) + ' MB';
        }
        return 'N/A';
    }

    // عرض الرسم البياني للمشاهد
    renderSceneGraph() {
        const canvas = document.createElement('canvas');
        canvas.width = 300;
        canvas.height = 200;
        
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#000';
        ctx.fillRect(0, 0, 300, 200);
        
        ctx.strokeStyle = '#0f0';
        ctx.lineWidth = 1;
        
        // رسم العقد
        let index = 0;
        this.sceneGraph.nodes.forEach((node, id) => {
            const x = 50 + (index % 5) * 50;
            const y = 50 + Math.floor(index / 5) * 30;
            
            ctx.fillStyle = '#0f0';
            ctx.beginPath();
            ctx.arc(x, y, 5, 0, 2 * Math.PI);
            ctx.fill();
            
            ctx.fillStyle = '#fff';
            ctx.font = '8px monospace';
            ctx.fillText(id.substring(0, 4), x - 10, y - 10);
            
            index++;
        });

        // رسم الروابط
        this.sceneGraph.edges.forEach(edge => {
            // البحث عن مواقع العقد
            // رسم خط بينهما
        });

        return canvas;
    }

    // إظهار/إخفاء
    toggle() {
        this.visible = !this.visible;
        this.panel.style.display = this.visible ? 'block' : 'none';
    }

    // إضافة اختصار لوحة المفاتيح
    setupKeyboardShortcut() {
        document.addEventListener('keydown', (e) => {
            if (e.key === 'F2') {
                this.toggle();
            }
            if (e.key === 'F5' && this.visible) {
                this.updateStats();
                this.renderPanel();
            }
        });
    }
}
