// =======================================
// ACTUAL CONSTRUCTION OS - UNIVERSAL ELEMENT
// =======================================
// نظام موحد لجميع عناصر البناء

export class UniversalElement {
    constructor(globalSystem, sceneConnector, type, options = {}) {
        this.globalSystem = globalSystem;
        this.sceneConnector = sceneConnector;
        
        // كل عنصر له نفس البنية الأساسية
        this.type = type;           // column, beam, wall, pipe, cable, door, ...
        this.category = this.getCategory(type);  // structural, architectural, mep, earthworks
        this.id = `elem_${type}_${Date.now()}_${Math.random()}`;
        
        // الخصائص الأساسية
        this.properties = {
            name: options.name || `${type}_${Date.now()}`,
            material: options.material || this.getDefaultMaterial(type),
            dimensions: options.dimensions || this.getDefaultDimensions(type),
            position: options.position || { x: 0, y: 0, z: 0 },
            rotation: options.rotation || 0,
            metadata: options.metadata || {}
        };
        
        // خصائص التصنيع
        this.manufacturing = {
            prefab: options.prefab || false,
            supplier: options.supplier || null,
            cost: options.cost || this.getDefaultCost(type),
            leadTime: options.leadTime || 0
        };
        
        // خصائص التثبيت
        this.installation = {
            date: null,
            status: 'pending', // pending, installed, inspected
            inspector: null,
            notes: []
        };
        
        // نظام استيراد/تصدير
        this.importMethods = this.getImportMethods(type);
    }

    // تحديد الفئة تلقائياً
    getCategory(type) {
        const categories = {
            // هيكل خرساني
            'column': 'structural',
            'beam': 'structural',
            'slab': 'structural',
            'foundation': 'structural',
            
            // عمارة
            'wall': 'architectural',
            'door': 'architectural',
            'window': 'architectural',
            'floor': 'architectural',
            'finish': 'architectural',
            
            // تمديدات
            'pipe': 'mep',
            'cable': 'mep',
            'duct': 'mep',
            'fixture': 'mep',
            
            // أعمال ترابية
            'excavation': 'earthworks',
            'compaction': 'earthworks',
            'layer': 'earthworks'
        };
        
        return categories[type] || 'other';
    }

    // مواد افتراضية حسب النوع
    getDefaultMaterial(type) {
        const materials = {
            'column': 'C30',
            'beam': 'C30',
            'slab': 'C30',
            'wall': 'concrete_block',
            'pipe': 'PVC',
            'cable': 'copper',
            'door': 'wood',
            'window': 'aluminum'
        };
        
        return materials[type] || 'standard';
    }

    // أبعاد افتراضية
    getDefaultDimensions(type) {
        const dimensions = {
            'column': { width: 0.3, depth: 0.3, height: 3.0 },
            'beam': { width: 0.2, depth: 0.5, length: 4.0 },
            'slab': { thickness: 0.15 },
            'wall': { thickness: 0.2, height: 3.0 },
            'pipe': { diameter: 0.05, length: 6.0 }
        };
        
        return dimensions[type] || {};
    }

    // تكلفة افتراضية
    getDefaultCost(type) {
        const costs = {
            'column': 500,
            'beam': 300,
            'slab': 200,
            'wall': 150,
            'door': 800,
            'window': 600,
            'pipe': 50,
            'cable': 30
        };
        
        return costs[type] || 100;
    }

    // طرق الاستيراد المتاحة
    getImportMethods(type) {
        return {
            cad: this.canImportFromCAD(type),
            manual: true,
            copy: true,
            template: this.hasTemplate(type)
        };
    }

    canImportFromCAD(type) {
        const cadTypes = ['column', 'beam', 'wall', 'slab', 'pipe'];
        return cadTypes.includes(type);
    }

    hasTemplate(type) {
        const templateTypes = ['column', 'beam', 'wall', 'door', 'window'];
        return templateTypes.includes(type);
    }
}
