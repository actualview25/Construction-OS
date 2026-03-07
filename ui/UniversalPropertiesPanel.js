// =======================================
// ACTUAL CONSTRUCTION OS - UNIVERSAL PROPERTIES
// =======================================

export class UniversalPropertiesPanel {
    constructor() {
        this.panel = null;
        this.currentElement = null;
    }

    showForElement(element) {
        this.currentElement = element;
        
        this.panel = document.createElement('div');
        this.panel.className = 'universal-properties';
        
        // عنوان حسب النوع
        this.panel.innerHTML = `
            <h3>${this.getIcon(element.type)} ${this.getTypeName(element.type)}</h3>
            
            <div class="property-tabs">
                <button class="tab-btn active" onclick="showTab('basic')">أساسي</button>
                <button class="tab-btn" onclick="showTab('dimensions')">أبعاد</button>
                <button class="tab-btn" onclick="showTab('material')">مادة</button>
                <button class="tab-btn" onclick="showTab('cost')">تكلفة</button>
                <button class="tab-btn" onclick="showTab('installation')">تنفيذ</button>
            </div>
            
            <div id="basic-tab" class="tab-content active">
                ${this.renderBasicTab(element)}
            </div>
            
            <div id="dimensions-tab" class="tab-content">
                ${this.renderDimensionsTab(element)}
            </div>
            
            <div id="material-tab" class="tab-content">
                ${this.renderMaterialTab(element)}
            </div>
            
            <div id="cost-tab" class="tab-content">
                ${this.renderCostTab(element)}
            </div>
            
            <div id="installation-tab" class="tab-content">
                ${this.renderInstallationTab(element)}
            </div>
            
            <div class="property-actions">
                <button onclick="applyChanges()">تطبيق</button>
                <button onclick="deleteElement()">حذف</button>
                <button onclick="duplicateElement()">نسخ</button>
            </div>
        `;
        
        document.body.appendChild(this.panel);
    }

    getIcon(type) {
        const icons = {
            'column': '🏛️',
            'beam': '📐',
            'slab': '🏢',
            'wall': '🧱',
            'door': '🚪',
            'window': '🪟',
            'pipe': '🔧',
            'cable': '⚡',
            'excavation': '⛏️'
        };
        return icons[type] || '📦';
    }

    getTypeName(type) {
        const names = {
            'column': 'عمود',
            'beam': 'كمرة',
            'slab': 'سقف',
            'wall': 'جدار',
            'door': 'باب',
            'window': 'شباك',
            'pipe': 'ماسورة',
            'cable': 'كابل',
            'excavation': 'حفرية'
        };
        return names[type] || type;
    }

    renderBasicTab(element) {
        return `
            <div class="property-group">
                <label>المعرف:</label>
                <span>${element.id}</span>
            </div>
            <div class="property-group">
                <label>النوع:</label>
                <span>${this.getTypeName(element.type)}</span>
            </div>
            <div class="property-group">
                <label>الفئة:</label>
                <span>${element.category}</span>
            </div>
            <div class="property-group">
                <label>الموقع (X,Y,Z):</label>
                <input type="number" value="${element.position.x}" step="0.01">,
                <input type="number" value="${element.position.y}" step="0.01">,
                <input type="number" value="${element.position.z}" step="0.01">
            </div>
            <div class="property-group">
                <label>الدوران:</label>
                <input type="number" value="${element.rotation}" step="1">°
            </div>
        `;
    }

    renderDimensionsTab(element) {
        let html = '';
        
        for (const [key, value] of Object.entries(element.dimensions)) {
            html += `
                <div class="property-group">
                    <label>${key}:</label>
                    <input type="number" value="${value}" step="0.01"> م
                </div>
            `;
        }
        
        return html;
    }

    renderMaterialTab(element) {
        return `
            <div class="property-group">
                <label>المادة:</label>
                <select>
                    ${this.getMaterialOptions(element.type).map(opt => 
                        `<option value="${opt}" ${opt === element.material ? 'selected' : ''}>${opt}</option>`
                    ).join('')}
                </select>
            </div>
            <div class="property-group">
                <label>المورد:</label>
                <input type="text" value="${element.supplier || ''}">
            </div>
        `;
    }

    getMaterialOptions(type) {
        const materials = {
            'column': ['C25', 'C30', 'C35', 'C40'],
            'beam': ['C25', 'C30', 'C35'],
            'wall': ['concrete_block', 'brick', 'gypsum'],
            'door': ['wood', 'metal', 'glass'],
            'window': ['aluminum', 'PVC', 'wood'],
            'pipe': ['PVC', 'PPR', 'steel', 'copper'],
            'cable': ['copper', 'aluminum']
        };
        return materials[type] || ['standard'];
    }

    renderCostTab(element) {
        return `
            <div class="property-group">
                <label>التكلفة:</label>
                <input type="number" value="${element.cost}" step="10"> $
            </div>
            <div class="property-group">
                <label>وقت التوريد:</label>
                <input type="number" value="${element.leadTime}" step="1"> يوم
            </div>
            <div class="property-group">
                <label>مصنع مسبق:</label>
                <input type="checkbox" ${element.prefab ? 'checked' : ''}>
            </div>
        `;
    }

    renderInstallationTab(element) {
        return `
            <div class="property-group">
                <label>الحالة:</label>
                <select>
                    <option ${element.status === 'pending' ? 'selected' : ''}>قيد الانتظار</option>
                    <option ${element.status === 'installed' ? 'selected' : ''}>تم التركيب</option>
                    <option ${element.status === 'inspected' ? 'selected' : ''}>تم الفحص</option>
                </select>
            </div>
            <div class="property-group">
                <label>تاريخ التركيب:</label>
                <input type="date" value="${element.installation.date || ''}">
            </div>
            <div class="property-group">
                <label>الملاحظات:</label>
                <textarea rows="3">${element.installation.notes.join('\n')}</textarea>
            </div>
        `;
    }
}
