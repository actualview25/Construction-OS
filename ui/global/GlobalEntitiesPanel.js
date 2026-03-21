// =======================================
// ACTUAL VIEW CONSTRUCTION OS - GLOBAL ENTITIES PANEL
// =======================================

export class GlobalEntitiesPanel {
    constructor(app) {
        this.app = app;
        this.panel = null;
        this.isVisible = false;
        this.entities = new Map();
        this.selectedEntity = null;
        console.log('✅ GlobalEntitiesPanel initialized');
    }

    /**
     * إنشاء لوحة التحكم
     */
    createPanel() {
        if (this.panel) return;

        this.panel = document.createElement('div');
        this.panel.id = 'globalEntitiesPanel';
        this.panel.style.cssText = `
            position: fixed;
            top: 80px;
            right: 20px;
            width: 320px;
            max-height: 500px;
            background: rgba(26, 26, 26, 0.95);
            backdrop-filter: blur(10px);
            border: 1px solid #ffaa44;
            border-radius: 12px;
            color: white;
            z-index: 1000;
            display: none;
            flex-direction: column;
            overflow: hidden;
            box-shadow: 0 4px 20px rgba(0,0,0,0.3);
        `;

        this.panel.innerHTML = `
            <div style="padding: 15px; border-bottom: 1px solid #333; display: flex; justify-content: space-between; align-items: center;">
                <h3 style="color: #ffaa44; margin: 0;">🌍 Global Entities</h3>
                <button id="closeGlobalPanel" style="background: none; border: none; color: white; cursor: pointer; font-size: 18px;">&times;</button>
            </div>
            <div style="padding: 10px;">
                <div style="margin-bottom: 10px;">
                    <input type="text" id="searchEntity" placeholder="Search entities..." style="width: 100%; padding: 8px; background: #2a2a2a; border: 1px solid #444; border-radius: 6px; color: white;">
                </div>
                <div id="entitiesList" style="max-height: 350px; overflow-y: auto;">
                    <div class="text-muted" style="text-align:center; padding:20px;">No global entities</div>
                </div>
            </div>
        `;

        document.body.appendChild(this.panel);

        // إضافة الأحداث
        document.getElementById('closeGlobalPanel').onclick = () => this.hide();
        document.getElementById('searchEntity').oninput = (e) => this.filterEntities(e.target.value);

        console.log('✅ GlobalEntitiesPanel created');
    }

    /**
     * عرض اللوحة
     */
    show() {
        if (!this.panel) this.createPanel();
        this.panel.style.display = 'flex';
        this.isVisible = true;
        this.refresh();
    }

    /**
     * إخفاء اللوحة
     */
    hide() {
        if (this.panel) {
            this.panel.style.display = 'none';
            this.isVisible = false;
        }
    }

    /**
     * تبديل حالة اللوحة
     */
    toggle() {
        if (this.isVisible) {
            this.hide();
        } else {
            this.show();
        }
    }

    /**
     * تحديث قائمة الكيانات
     */
    refresh() {
        this.loadEntities();
        this.renderEntities();
    }

    /**
     * تحميل الكيانات من النظام
     */
    loadEntities() {
        this.entities.clear();

        // تحميل من GlobalEntitySystem
        if (this.app?.engine?.globalSystem) {
            const globalSystem = this.app.engine.globalSystem;
            
            // الحصول على جميع الكيانات (إذا كانت موجودة)
            if (globalSystem.entities) {
                globalSystem.entities.forEach((entity, id) => {
                    this.entities.set(id, {
                        id: id,
                        type: entity.type || 'unknown',
                        name: entity.name || entity.type,
                        data: entity,
                        scenes: entity.scenes || [],
                        createdAt: entity.createdAt || new Date().toISOString()
                    });
                });
            }
        }

        // إضافة كيانات من state.scenes
        if (this.app?.state?.scenes) {
            this.app.state.scenes.forEach((scene, sceneId) => {
                if (scene.elements) {
                    scene.elements.forEach((element, index) => {
                        const entityId = `element_${sceneId}_${index}`;
                        if (!this.entities.has(entityId)) {
                            this.entities.set(entityId, {
                                id: entityId,
                                type: element.type || 'element',
                                name: element.name || `${element.type || 'Element'} in ${scene.name}`,
                                data: element,
                                scenes: [sceneId],
                                createdAt: element.createdAt || new Date().toISOString()
                            });
                        }
                    });
                }
            });
        }
    }

    /**
     * عرض الكيانات في القائمة
     */
    renderEntities(filter = '') {
        const listEl = document.getElementById('entitiesList');
        if (!listEl) return;

        let filteredEntities = Array.from(this.entities.values());
        
        if (filter) {
            const lowerFilter = filter.toLowerCase();
            filteredEntities = filteredEntities.filter(e => 
                e.name.toLowerCase().includes(lowerFilter) ||
                e.type.toLowerCase().includes(lowerFilter) ||
                e.id.toLowerCase().includes(lowerFilter)
            );
        }

        if (filteredEntities.length === 0) {
            listEl.innerHTML = '<div class="text-muted" style="text-align:center; padding:20px;">No entities found</div>';
            return;
        }

        listEl.innerHTML = filteredEntities.map(entity => `
            <div class="entity-item" data-id="${entity.id}" style="
                padding: 10px;
                margin: 5px 0;
                background: #1a1a1a;
                border-radius: 6px;
                cursor: pointer;
                transition: all 0.2s;
                border-left: 3px solid ${this.getEntityColor(entity.type)};
            ">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <div>
                        <strong style="color: #ffaa44;">${this.getEntityIcon(entity.type)} ${entity.name}</strong>
                        <div style="font-size: 11px; color: #888;">ID: ${entity.id}</div>
                        <div style="font-size: 11px; color: #888;">Type: ${entity.type}</div>
                        ${entity.scenes.length > 0 ? `<div style="font-size: 11px; color: #888;">Scenes: ${entity.scenes.join(', ')}</div>` : ''}
                    </div>
                    <button class="focus-entity" data-id="${entity.id}" style="
                        background: #ffaa44;
                        border: none;
                        border-radius: 4px;
                        padding: 4px 8px;
                        cursor: pointer;
                        font-size: 11px;
                    ">Focus</button>
                </div>
            </div>
        `).join('');

        // إضافة الأحداث للعناصر
        document.querySelectorAll('.entity-item').forEach(el => {
            el.addEventListener('click', (e) => {
                if (!e.target.classList.contains('focus-entity')) {
                    this.selectEntity(el.dataset.id);
                }
            });
        });

        document.querySelectorAll('.focus-entity').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.focusEntity(btn.dataset.id);
            });
        });
    }

    /**
     * تصفية الكيانات
     */
    filterEntities(searchTerm) {
        this.renderEntities(searchTerm);
    }

    /**
     * اختيار كيان
     */
    selectEntity(entityId) {
        this.selectedEntity = this.entities.get(entityId);
        this.showEntityDetails(this.selectedEntity);
    }

    /**
     * عرض تفاصيل الكيان
     */
    showEntityDetails(entity) {
        if (!entity) return;

        // عرض التفاصيل في لوحة الخصائص
        const propertiesGrid = document.getElementById('propertiesGrid');
        if (propertiesGrid) {
            const detailsDiv = document.createElement('div');
            detailsDiv.className = 'property-group';
            detailsDiv.innerHTML = `
                <div class="property-group-title"><i class="fas fa-globe"></i> Global Entity</div>
                <div class="property-row"><span class="property-label">ID:</span><span class="property-value">${entity.id}</span></div>
                <div class="property-row"><span class="property-label">Type:</span><span class="property-value">${entity.type}</span></div>
                <div class="property-row"><span class="property-label">Name:</span><span class="property-value">${entity.name}</span></div>
                <div class="property-row"><span class="property-label">Scenes:</span><span class="property-value">${entity.scenes.join(', ') || 'None'}</span></div>
                <div class="property-row"><span class="property-label">Created:</span><span class="property-value">${new Date(entity.createdAt).toLocaleString()}</span></div>
            `;
            
            // إزالة العنصر القديم
            const oldDetails = propertiesGrid.querySelector('.entity-details');
            if (oldDetails) oldDetails.remove();
            detailsDiv.classList.add('entity-details');
            propertiesGrid.prepend(detailsDiv);
        }
    }

    /**
     * التركيز على كيان
     */
    focusEntity(entityId) {
        const entity = this.entities.get(entityId);
        if (!entity || !this.app) return;

        // محاولة التركيز على الكيان في المشهد
        if (entity.data && entity.data.position && this.app.camera) {
            // تحريك الكاميرا إلى موقع الكيان
            this.app.camera.position.set(
                entity.data.position.x + 5,
                entity.data.position.y + 3,
                entity.data.position.z + 5
            );
            this.app.controls.target.set(
                entity.data.position.x,
                entity.data.position.y,
                entity.data.position.z
            );
            this.app.controls.update();
            
            this.app.updateStatus(`🎯 Focused on: ${entity.name}`, 'success');
        } else if (entity.scenes.length > 0 && this.app.selectScene) {
            // الانتقال إلى المشهد
            this.app.selectScene(entity.scenes[0]);
            this.app.updateStatus(`📌 Switched to scene: ${entity.scenes[0]}`, 'info');
        }
    }

    /**
     * الحصول على لون الكيان حسب النوع
     */
    getEntityColor(type) {
        const colors = {
            'wall': '#ffaa44',
            'column': '#88aaff',
            'beam': '#44ff44',
            'slab': '#44aaff',
            'door': '#ff8844',
            'window': '#44aaff',
            'plant': '#44ff44',
            'tree': '#44ff44',
            'fountain': '#44aaff',
            'glass': '#88aaff',
            'stone': '#aaaaaa',
            'brick': '#cc8866',
            'pipe': '#44aaff',
            'cable': '#ffaa44',
            'element': '#ffffff'
        };
        return colors[type] || '#ffffff';
    }

    /**
     * الحصول على أيقونة الكيان
     */
    getEntityIcon(type) {
        const icons = {
            'wall': '🧱',
            'column': '🏛️',
            'beam': '📐',
            'slab': '🏢',
            'door': '🚪',
            'window': '🪟',
            'plant': '🌱',
            'tree': '🌳',
            'fountain': '⛲',
            'glass': '🪟',
            'stone': '🪨',
            'brick': '🧱',
            'pipe': '💧',
            'cable': '⚡',
            'element': '📦'
        };
        return icons[type] || '📦';
    }

    /**
     * تحديث قائمة الكيانات (للاستدعاء من النظام)
     */
    update() {
        this.refresh();
    }

    /**
     * الحصول على إحصائيات
     */
    getStats() {
        const byType = {};
        this.entities.forEach(entity => {
            byType[entity.type] = (byType[entity.type] || 0) + 1;
        });

        return {
            total: this.entities.size,
            byType: byType,
            byScene: Array.from(this.entities.values()).reduce((acc, e) => {
                e.scenes.forEach(s => { acc[s] = (acc[s] || 0) + 1; });
                return acc;
            }, {})
        };
    }
}
