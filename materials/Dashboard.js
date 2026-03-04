// ui/Dashboard.js

export class Dashboard {
    constructor(app) {
        this.app = app;
        this.elements = {};
        this.createDashboard();
    }
    
    createDashboard() {
        // الخلفية المظللة
        const overlay = document.createElement('div');
        overlay.className = 'dashboard-overlay';
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0,0,0,0.5);
            backdrop-filter: blur(5px);
            z-index: 9998;
            opacity: 0;
            transition: opacity 0.3s;
            pointer-events: none;
        `;
        document.body.appendChild(overlay);
        this.elements.overlay = overlay;
        
        // لوحة التحكم الرئيسية
        const panel = document.createElement('div');
        panel.className = 'dashboard-panel';
        panel.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) scale(0.9);
            width: 900px;
            max-width: 95vw;
            max-height: 80vh;
            background: rgba(20, 30, 40, 0.95);
            backdrop-filter: blur(12px);
            border: 2px solid #4a6c8f;
            border-radius: 16px;
            color: white;
            z-index: 9999;
            opacity: 0;
            transition: all 0.3s;
            pointer-events: none;
            overflow: hidden;
            display: flex;
            flex-direction: column;
        `;
        
        panel.innerHTML = `
            <div style="padding: 20px; border-bottom: 1px solid #4a6c8f; display: flex; justify-content: space-between; align-items: center;">
                <h2 style="margin: 0; color: #88aaff;">🏗️ لوحة التحكم</h2>
                <button class="close-btn" style="background: none; border: none; color: white; font-size: 24px; cursor: pointer;">✕</button>
            </div>
            
            <div style="padding: 20px; overflow-y: auto; flex: 1;">
                <!-- معلومات المشروع -->
                <div style="margin-bottom: 20px; background: rgba(0,0,0,0.2); padding: 15px; border-radius: 8px;">
                    <h3 style="color: #88aaff; margin-top: 0;">📋 معلومات المشروع</h3>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
                        <div>
                            <label style="color: #aaa; display: block; margin-bottom: 5px;">اسم المشروع</label>
                            <input type="text" id="project-name-dash" value="${this.app.project.name}" style="width: 100%; padding: 8px; background: #1a2a3a; border: 1px solid #4a6c8f; color: white; border-radius: 4px;">
                        </div>
                        <div>
                            <label style="color: #aaa; display: block; margin-bottom: 5px;">الموقع</label>
                            <input type="text" id="project-location" value="${this.app.project.location}" style="width: 100%; padding: 8px; background: #1a2a3a; border: 1px solid #4a6c8f; color: white; border-radius: 4px;">
                        </div>
                    </div>
                </div>
                
                <!-- إحصائيات -->
                <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; margin-bottom: 20px;">
                    <div style="background: #1a2a3a; padding: 15px; border-radius: 8px; text-align: center;">
                        <div style="font-size: 24px; color: #88aaff;">${this.app.allElements.length}</div>
                        <div style="color: #aaa; font-size: 12px;">إجمالي العناصر</div>
                    </div>
                    <div style="background: #1a2a3a; padding: 15px; border-radius: 8px; text-align: center;">
                        <div style="font-size: 24px; color: #27ae60;">${this.app.boqCalculator.totals.volume.toFixed(1)}</div>
                        <div style="color: #aaa; font-size: 12px;">خرسانة (م³)</div>
                    </div>
                    <div style="background: #1a2a3a; padding: 15px; border-radius: 8px; text-align: center;">
                        <div style="font-size: 24px; color: #e67e22;">${this.app.boqCalculator.totals.weight.toFixed(1)}</div>
                        <div style="color: #aaa; font-size: 12px;">حديد (كجم)</div>
                    </div>
                    <div style="background: #1a2a3a; padding: 15px; border-radius: 8px; text-align: center;">
                        <div style="font-size: 24px; color: #e74c3c;">${this.app.boqCalculator.totals.cost.toFixed(0)}</div>
                        <div style="color: #aaa; font-size: 12px;">تكلفة (ريال)</div>
                    </div>
                </div>
                
                <!-- فئات المواد -->
                <div style="margin-bottom: 20px;">
                    <h3 style="color: #88aaff;">🧱 مكتبة المواد</h3>
                    <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px;">
                        <button class="material-cat" data-cat="concrete" style="background: #2a3a4a; border: 1px solid #4a6c8f; border-radius: 8px; padding: 15px; color: white; cursor: pointer;">
                            <div style="font-size: 24px;">🧱</div>
                            <div>خرسانة</div>
                        </button>
                        <button class="material-cat" data-cat="steel" style="background: #2a3a4a; border: 1px solid #4a6c8f; border-radius: 8px; padding: 15px; color: white; cursor: pointer;">
                            <div style="font-size: 24px;">⚙️</div>
                            <div>حديد</div>
                        </button>
                        <button class="material-cat" data-cat="masonry" style="background: #2a3a4a; border: 1px solid #4a6c8f; border-radius: 8px; padding: 15px; color: white; cursor: pointer;">
                            <div style="font-size: 24px;">🧱</div>
                            <div>طوب</div>
                        </button>
                        <button class="material-cat" data-cat="finishing" style="background: #2a3a4a; border: 1px solid #4a6c8f; border-radius: 8px; padding: 15px; color: white; cursor: pointer;">
                            <div style="font-size: 24px;">🎨</div>
                            <div>تشطيبات</div>
                        </button>
                    </div>
                </div>
                
                <!-- قائمة العناصر -->
                <div>
                    <h3 style="color: #88aaff;">📋 عناصر المشروع</h3>
                    <div id="elements-list" style="max-height: 200px; overflow-y: auto; background: #1a2a3a; border-radius: 8px; padding: 10px;">
                        ${this.generateElementsList()}
                    </div>
                </div>
            </div>
            
            <div style="padding: 15px; border-top: 1px solid #4a6c8f; display: flex; justify-content: flex-end; gap: 10px;">
                <button id="export-pdf" style="background: #e67e22; border: none; color: white; padding: 10px 20px; border-radius: 6px; cursor: pointer;">📥 تصدير PDF</button>
                <button id="export-csv" style="background: #27ae60; border: none; color: white; padding: 10px 20px; border-radius: 6px; cursor: pointer;">📊 تصدير CSV</button>
            </div>
        `;
        
        document.body.appendChild(panel);
        this.elements.panel = panel;
        
        // ربط الأحداث
        this.bindEvents();
    }
    
    generateElementsList() {
        return this.app.allElements.map((el, i) => `
            <div style="display: flex; justify-content: space-between; padding: 8px; border-bottom: 1px solid #2a3a4a;">
                <span>${i+1}. ${el.constructor.name}</span>
                <span style="color: #88aaff;">${el.getBOQ?.().حجم || ''}</span>
            </div>
        `).join('');
    }
    
    bindEvents() {
        // زر الإغلاق
        this.elements.panel.querySelector('.close-btn').onclick = () => this.hide();
        
        // أزرار المواد
        this.elements.panel.querySelectorAll('.material-cat').forEach(btn => {
            btn.onclick = () => this.showMaterialCategory(btn.dataset.cat);
        });
        
        // أزرار التصدير
        this.elements.panel.querySelector('#export-pdf').onclick = () => {
            this.app.exportBOQ('pdf');
        };
        
        this.elements.panel.querySelector('#export-csv').onclick = () => {
            this.app.exportBOQ('csv');
        };
        
        // تحديث اسم المشروع
        this.elements.panel.querySelector('#project-name-dash').onchange = (e) => {
            this.app.project.name = e.target.value;
        };
    }
    
    show() {
        this.elements.overlay.style.opacity = '1';
        this.elements.overlay.style.pointerEvents = 'all';
        this.elements.panel.style.opacity = '1';
        this.elements.panel.style.transform = 'translate(-50%, -50%) scale(1)';
        this.elements.panel.style.pointerEvents = 'all';
    }
    
    hide() {
        this.elements.overlay.style.opacity = '0';
        this.elements.overlay.style.pointerEvents = 'none';
        this.elements.panel.style.opacity = '0';
        this.elements.panel.style.transform = 'translate(-50%, -50%) scale(0.9)';
        this.elements.panel.style.pointerEvents = 'none';
    }
    
    showMaterialCategory(category) {
        const materials = this.app.materialLibrary.getMaterialList(category);
        // عرض المواد في نافذة منبثقة
        console.log('📦 مواد', category, materials);
    }
}