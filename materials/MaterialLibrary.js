// materials/MaterialLibrary.js

export class MaterialLibrary {
    constructor() {
        this.materials = {
            // خرسانة
            concrete: {
                'C20': { name: 'خرسانة C20', strength: 20, density: 2.4, cost: 850, color: 0x7a7a7a },
                'C25': { name: 'خرسانة C25', strength: 25, density: 2.4, cost: 900, color: 0x7f8c8d },
                'C30': { name: 'خرسانة C30', strength: 30, density: 2.4, cost: 950, color: 0x5d6d7e },
                'C35': { name: 'خرسانة C35', strength: 35, density: 2.4, cost: 1000, color: 0x4a5b6b },
                'C40': { name: 'خرسانة C40', strength: 40, density: 2.4, cost: 1100, color: 0x3a4b5a }
            },
            
            // حديد
            steel: {
                'grade40': { name: 'حديد 40', yield: 280, density: 7.85, cost: 3200, color: 0x708090 },
                'grade60': { name: 'حديد 60', yield: 420, density: 7.85, cost: 3400, color: 0x5a6b7a },
                'grade75': { name: 'حديد 75', yield: 520, density: 7.85, cost: 3600, color: 0x4a5b6a }
            },
            
            // طوب وبلوك
            masonry: {
                'red_brick': { name: 'طوب أحمر', size: '25×12×6', density: 1.8, cost: 850, color: 0xb22222 },
                'white_brick': { name: 'طوب أبيض', size: '40×20×20', density: 1.2, cost: 1200, color: 0xf5f5f5 },
                'concrete_block': { name: 'بلوك اسمنتي', size: '40×20×20', density: 1.3, cost: 950, color: 0x808080 },
                'gypsum_block': { name: 'بلوك جبس', size: '66×50×7', density: 0.8, cost: 750, color: 0xe8e8e8 }
            },
            
            // تشطيبات
            finishing: {
                'paint_white': { name: 'دهان أبيض', type: 'paint', coverage: 10, cost: 45, color: 0xffffff },
                'paint_cream': { name: 'دهان كريمي', type: 'paint', coverage: 10, cost: 48, color: 0xfffdd0 },
                'ceramic_30x30': { name: 'سيراميك 30×30', size: '30×30', cost: 65, color: 0xd2b48c },
                'porcelain_60x60': { name: 'بورسلين 60×60', size: '60×60', cost: 120, color: 0xc0c0c0 },
                'marble_cream': { name: 'رخام كريمي', size: 'custom', cost: 350, color: 0xf0e68c },
                'wood_oak': { name: 'باركيه بلوط', size: '15×90', cost: 280, color: 0x8b4513 }
            },
            
            // مواسير
            pipes: {
                'pvc_20': { name: 'ماسورة PVC 20 مم', diameter: 20, pressure: 6, cost: 15, color: 0x4682b4 },
                'pvc_25': { name: 'ماسورة PVC 25 مم', diameter: 25, pressure: 6, cost: 18, color: 0x4682b4 },
                'ppr_20': { name: 'ماسورة PPR 20 مم', diameter: 20, pressure: 20, cost: 22, color: 0x4169e1 },
                'ppr_25': { name: 'ماسورة PPR 25 مم', diameter: 25, pressure: 20, cost: 26, color: 0x4169e1 },
                'steel_2inch': { name: 'ماسورة حديد 2 بوصة', diameter: 50, pressure: 40, cost: 95, color: 0x708090 }
            },
            
            // كابلات
            cables: {
                'cu_1.5': { name: 'كابل نحاس 1.5 مم²', current: 15, cost: 8, color: 0xb87333 },
                'cu_2.5': { name: 'كابل نحاس 2.5 مم²', current: 20, cost: 12, color: 0xb87333 },
                'cu_4': { name: 'كابل نحاس 4 مم²', current: 27, cost: 18, color: 0xb87333 },
                'al_16': { name: 'كابل ألمنيوم 16 مم²', current: 60, cost: 22, color: 0xc0c0c0 }
            }
        };
        
        this.textures = new Map();
        this.loadTextures();
    }
    
    loadTextures() {
        // تحميل الخامات (سيتم تطويرها لاحقاً)
        const texturePaths = {
            'concrete': 'textures/concrete.jpg',
            'brick': 'textures/brick.jpg',
            'wood': 'textures/wood.jpg',
            'marble': 'textures/marble.jpg',
            'tile': 'textures/tile.jpg'
        };
    }
    
    getMaterial(category, key) {
        return this.materials[category]?.[key] || null;
    }
    
    getMaterialList(category) {
        return Object.entries(this.materials[category] || {}).map(([key, value]) => ({
            id: key,
            ...value
        }));
    }
    
    searchMaterials(query) {
        const results = [];
        Object.keys(this.materials).forEach(category => {
            Object.entries(this.materials[category]).forEach(([key, material]) => {
                if (material.name.includes(query) || key.includes(query)) {
                    results.push({ category, id: key, ...material });
                }
            });
        });
        return results;
    }
    
    calculatePrice(category, key, quantity) {
        const material = this.getMaterial(category, key);
        return material ? material.cost * quantity : 0;
    }
}