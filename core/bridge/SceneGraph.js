// =======================================
// ACTUAL CONSTRUCTION OS - SCENE GRAPH
// =======================================
// رسم بياني للمشاهد - للتنقل الذكي والتحميل المسبق

export class SceneGraph {
    constructor(sceneConnector) {
        this.sceneConnector = sceneConnector;
        this.nodes = new Map();     // عقد المشاهد
        this.edges = [];             // روابط بين المشاهد
        this.adjacencyList = new Map(); // قائمة الجوار
        this.scenePositions = new Map(); // مواقع المشاهد
        
        this.rootScene = null;        // المشهد الجذر
        this.loadedScenes = new Set(); // المشاهد المحملة
        this.loadDistance = 50;       // مسافة التحميل المسبق
    }

    // بناء الرسم البياني من المشاهد المتصلة
    buildFromScenes() {
        this.sceneConnector.scenes.forEach((scene, sceneId) => {
            this.addNode(sceneId, scene.realWorldPosition);
        });

        this.sceneConnector.connections.forEach(conn => {
            this.addEdge(conn.from, conn.to, conn.distance, conn.type);
        });

        this.calculateShortestPaths();
        console.log(`📊 تم بناء الرسم البياني: ${this.nodes.size} عقدة، ${this.edges.length} رابط`);
    }

    // إضافة عقدة (مشهد)
    addNode(sceneId, position) {
        this.nodes.set(sceneId, {
            id: sceneId,
            position: { ...position },
            visited: false,
            distance: Infinity,
            previous: null,
            hotspots: [],
            importance: this.calculateImportance(sceneId)
        });

        this.scenePositions.set(sceneId, position);
        this.adjacencyList.set(sceneId, []);
    }

    // حساب أهمية المشهد (عدد الكيانات، النقاط، الخ)
    calculateImportance(sceneId) {
        const scene = this.sceneConnector.scenes.get(sceneId);
        if (!scene) return 1;

        let importance = 1;
        importance += scene.globalEntities?.size || 0;
        importance += scene.hotspots?.length || 0;
        return importance;
    }

    // إضافة حافة (رابط بين مشهدين)
    addEdge(fromId, toId, weight, type = 'door') {
        this.edges.push({ from: fromId, to: toId, weight, type });
        
        // إضافة للقائمة (غير موجه)
        this.adjacencyList.get(fromId).push({ node: toId, weight, type });
        this.adjacencyList.get(toId).push({ node: fromId, weight, type });
    }

    // حساب أقصر المسارات (Dijkstra)
    calculateShortestPaths(startId = this.rootScene) {
        if (!startId) return;

        // تهيئة
        this.nodes.forEach(node => {
            node.distance = Infinity;
            node.previous = null;
        });

        const startNode = this.nodes.get(startId);
        startNode.distance = 0;

        const unvisited = new Set(this.nodes.keys());
        const distances = new Map();

        while (unvisited.size > 0) {
            // اختيار العقدة بأقل مسافة
            let current = null;
            let minDistance = Infinity;

            unvisited.forEach(nodeId => {
                const dist = this.nodes.get(nodeId).distance;
                if (dist < minDistance) {
                    minDistance = dist;
                    current = nodeId;
                }
            });

            if (!current) break;
            unvisited.delete(current);

            // تحديث الجيران
            const neighbors = this.adjacencyList.get(current) || [];
            neighbors.forEach(neighbor => {
                const alt = this.nodes.get(current).distance + neighbor.weight;
                if (alt < this.nodes.get(neighbor.node).distance) {
                    this.nodes.get(neighbor.node).distance = alt;
                    this.nodes.get(neighbor.node).previous = current;
                }
            });
        }

        console.log(`📍 تم حساب المسارات من ${startId}`);
    }

    // الحصول على المسار بين مشهدين
    getPath(fromId, toId) {
        this.calculateShortestPaths(fromId);
        
        const path = [];
        let current = toId;

        while (current) {
            path.unshift(current);
            current = this.nodes.get(current)?.previous;
        }

        return path;
    }

    // الحصول على المشاهد القريبة
    getNearbyScenes(sceneId, radius = 50) {
        const position = this.scenePositions.get(sceneId);
        if (!position) return [];

        const nearby = [];

        this.scenePositions.forEach((pos, id) => {
            if (id === sceneId) return;

            const distance = Math.sqrt(
                Math.pow(pos.x - position.x, 2) +
                Math.pow(pos.y - position.y, 2) +
                Math.pow(pos.z - position.z, 2)
            );

            if (distance <= radius) {
                nearby.push({
                    id,
                    distance,
                    direction: this.getDirection(position, pos)
                });
            }
        });

        // ترتيب حسب المسافة
        return nearby.sort((a, b) => a.distance - b.distance);
    }

    // الحصول على اتجاه المشهد
    getDirection(fromPos, toPos) {
        const dx = toPos.x - fromPos.x;
        const dz = toPos.z - fromPos.z;
        const angle = Math.atan2(dz, dx) * 180 / Math.PI;
        
        if (angle > -45 && angle <= 45) return 'شرق';
        if (angle > 45 && angle <= 135) return 'شمال';
        if (angle > 135 || angle <= -135) return 'غرب';
        return 'جنوب';
    }

    // تحديد المشاهد للتحميل المسبق
    getScenesToPreload(currentSceneId) {
        const nearby = this.getNearbyScenes(currentSceneId, this.loadDistance);
        
        // تحميل المشاهد القريبة
        const toLoad = nearby.map(n => n.id);
        
        // إضافة المشاهد المهمة حتى لو بعيدة
        this.nodes.forEach((node, id) => {
            if (node.importance > 5 && !toLoad.includes(id) && id !== currentSceneId) {
                toLoad.push(id);
            }
        });

        return toLoad;
    }

    // الحصول على توصيات التنقل الذكي
    getSmartNavigation(currentSceneId, targetSceneId) {
        const path = this.getPath(currentSceneId, targetSceneId);
        
        if (path.length === 0) return null;

        return {
            path,
            steps: path.length - 1,
            nextScene: path[1],
            estimatedTime: path.length * 5, // 5 ثوان لكل مشهد
            scenes: path.map(id => ({
                id,
                name: `مشهد ${id}`,
                distance: this.nodes.get(id)?.distance || 0
            }))
        };
    }

    // الحصول على خريطة حرارية للتنقل
    getHeatmap() {
        const heatmap = [];

        this.nodes.forEach((node, id) => {
            const connections = this.adjacencyList.get(id)?.length || 0;
            heatmap.push({
                id,
                importance: node.importance,
                connections,
                centrality: this.calculateCentrality(id)
            });
        });

        return heatmap.sort((a, b) => b.centrality - a.centrality);
    }

    // حساب المركزية (أهمية العقدة في الرسم البياني)
    calculateCentrality(nodeId) {
        let centrality = 0;
        
        this.nodes.forEach((_, id) => {
            if (id === nodeId) return;
            const path = this.getPath(nodeId, id);
            centrality += 1 / (path.length || 1);
        });

        return centrality;
    }

    // إنشاء نقاط انتقال ذكية
    createSmartHotspots() {
        const hotspots = [];

        this.nodes.forEach((node, id) => {
            const neighbors = this.adjacencyList.get(id) || [];
            
            neighbors.forEach(neighbor => {
                // نقطة انتقال باتجاه الجار
                const direction = this.getDirection(node.position, 
                    this.scenePositions.get(neighbor.node));

                hotspots.push({
                    id: `smart_${id}_to_${neighbor.node}`,
                    type: 'SCENE',
                    position: this.calculateTransitionPoint(
                        node.position,
                        this.scenePositions.get(neighbor.node)
                    ),
                    data: {
                        targetSceneId: neighbor.node,
                        description: `انتقال إلى ${direction}`,
                        distance: neighbor.weight,
                        smart: true
                    }
                });
            });
        });

        return hotspots;
    }

    // حساب نقطة انتقال مناسبة
    calculateTransitionPoint(fromPos, toPos) {
        return {
            x: (fromPos.x + toPos.x) / 2,
            y: (fromPos.y + toPos.y) / 2,
            z: (fromPos.z + toPos.z) / 2
        };
    }

    // تصدير الرسم البياني
    exportGraph() {
        return {
            nodes: Array.from(this.nodes.entries()).map(([id, node]) => ({
                id,
                position: node.position,
                importance: node.importance
            })),
            edges: this.edges.map(edge => ({
                from: edge.from,
                to: edge.to,
                weight: edge.weight,
                type: edge.type
            })),
            rootScene: this.rootScene
        };
    }

    // استيراد الرسم البياني
    importGraph(data) {
        data.nodes.forEach(node => {
            this.addNode(node.id, node.position);
        });

        data.edges.forEach(edge => {
            this.addEdge(edge.from, edge.to, edge.weight, edge.type);
        });

        this.rootScene = data.rootScene;
        this.calculateShortestPaths();
    }
}
