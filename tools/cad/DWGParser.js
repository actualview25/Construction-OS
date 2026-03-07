// =======================================
// ACTUAL CONSTRUCTION OS - DWG PARSER
// =======================================

export class DWGParser {
    constructor() {
        this.header = {};
        this.classes = {};
        this.objects = [];
        this.entities = [];
        this.layers = {};
        this.version = 'unknown';
        this.isBinary = false;
    }

    async parse(file) {
        console.log('📄 بدء تحليل ملف DWG...');
        
        const buffer = await file.arrayBuffer();
        const view = new DataView(buffer);
        
        // التحقق من توقيع DWG
        const signature = this.readString(view, 0, 6);
        if (signature === 'AC1032' || signature === 'AC1027' || signature === 'AC1024') {
            this.isBinary = true;
            return this.parseBinaryDWG(view);
        } else {
            // قد يكون DWG نصي (نادر جداً)
            return this.parseTextDWG(await file.text());
        }
    }

    parseBinaryDWG(view) {
        let offset = 0;
        
        // قراءة رأس الملف
        offset = this.readHeader(view, offset);
        
        // قراءة الفئات
        offset = this.readClasses(view, offset);
        
        // قراءة الكائنات
        offset = this.readObjects(view, offset);
        
        // قراءة الكيانات
        offset = this.readEntities(view, offset);
        
        // قراءة معلومات الطبقات
        this.extractLayers();
        
        console.log(`✅ تم تحليل ملف DWG بنجاح`);
        console.log(`📊 الإصدار: ${this.version}`);
        console.log(`📐 الكيانات: ${this.entities.length}`);
        console.log(`🎨 الطبقات: ${Object.keys(this.layers).length}`);
        
        return {
            format: 'dwg',
            version: this.version,
            header: this.header,
            layers: this.layers,
            entities: this.entities,
            objects: this.objects
        };
    }

    readHeader(view, offset) {
        // قراءة توقيع الملف
        this.header.signature = this.readString(view, offset, 6);
        offset += 6;
        
        // قراءة الإصدار
        const verByte = view.getUint8(offset);
        this.version = this.getVersionString(verByte);
        offset += 1;
        
        // قراءة معلومات الرأس الأخرى
        this.header.maintenanceVersion = view.getUint8(offset);
        offset += 1;
        
        this.header.startSectionLocation = view.getUint32(offset, true);
        offset += 4;
        
        this.header.sectionCount = view.getUint16(offset, true);
        offset += 2;
        
        this.header.projector = view.getUint32(offset, true);
        offset += 4;
        
        this.header.unknown1 = view.getUint16(offset, true);
        offset += 2;
        
        // قراءة الأقسام
        this.sections = [];
        for (let i = 0; i < this.header.sectionCount; i++) {
            const section = {
                type: view.getUint8(offset),
                size: view.getUint32(offset + 1, true),
                address: view.getUint32(offset + 5, true)
            };
            this.sections.push(section);
            offset += 9;
        }
        
        return offset;
    }

    readClasses(view, offset) {
        const classCount = view.getUint16(offset, true);
        offset += 2;
        
        for (let i = 0; i < classCount; i++) {
            const classData = {
                number: view.getUint16(offset, true),
                version: view.getUint16(offset + 2, true),
                appName: this.readString(view, offset + 4, 8),
                className: this.readString(view, offset + 12, 8),
                cppClassName: this.readString(view, offset + 20, 8),
                dwgVersion: view.getUint16(offset + 28, true),
                itemCount: view.getUint16(offset + 30, true)
            };
            this.classes[classData.number] = classData;
            offset += 32;
        }
        
        return offset;
    }

    readObjects(view, offset) {
        const objectCount = view.getUint32(offset, true);
        offset += 4;
        
        for (let i = 0; i < objectCount; i++) {
            const object = {
                type: view.getUint16(offset, true),
                size: view.getUint32(offset + 2, true),
                handle: view.getUint32(offset + 6, true)
            };
            
            // تحديد نوع الكائن من الفئات
            const classInfo = this.classes[object.type];
            if (classInfo) {
                object.className = classInfo.className;
            }
            
            this.objects.push(object);
            offset += 10;
        }
        
        return offset;
    }

    readEntities(view, offset) {
        const entityCount = view.getUint32(offset, true);
        offset += 4;
        
        for (let i = 0; i < entityCount; i++) {
            const entity = this.readEntity(view, offset);
            if (entity) {
                this.entities.push(entity);
            }
            offset = entity.nextOffset;
        }
        
        return offset;
    }

    readEntity(view, offset) {
        const startOffset = offset;
        
        // قراءة رأس الكيان
        const type = view.getUint16(offset, true);
        offset += 2;
        
        const size = view.getUint16(offset, true);
        offset += 2;
        
        const handle = view.getUint32(offset, true);
        offset += 4;
        
        // تحديد نوع الكيان
        const classInfo = this.classes[type];
        const entityType = classInfo ? classInfo.className : 'UNKNOWN';
        
        let entity = {
            type: entityType,
            handle: handle,
            layer: '0',
            color: 0xffffff,
            lineType: 'CONTINUOUS',
            points: []
        };
        
        // قراءة بيانات الكيان حسب نوعه
        switch (entityType) {
            case 'LINE':
                entity = this.readLineEntity(view, offset, entity);
                break;
            case 'CIRCLE':
                entity = this.readCircleEntity(view, offset, entity);
                break;
            case 'ARC':
                entity = this.readArcEntity(view, offset, entity);
                break;
            case 'LWPOLYLINE':
                entity = this.readLWPolylineEntity(view, offset, entity);
                break;
            case 'INSERT':
                entity = this.readInsertEntity(view, offset, entity);
                break;
            default:
                // تخطي البيانات غير المعروفة
                offset += size - 8;
        }
        
        return {
            ...entity,
            nextOffset: startOffset + 8 + (size - 8)
        };
    }

    readLineEntity(view, offset, entity) {
        // قراءة إحداثيات البداية والنهاية
        entity.start = {
            x: view.getFloat64(offset, true),
            y: view.getFloat64(offset + 8, true),
            z: view.getFloat64(offset + 16, true)
        };
        offset += 24;
        
        entity.end = {
            x: view.getFloat64(offset, true),
            y: view.getFloat64(offset + 8, true),
            z: view.getFloat64(offset + 16, true)
        };
        offset += 24;
        
        // قراءة خصائص إضافية
        entity = this.readCommonProperties(view, offset, entity);
        
        return entity;
    }

    readCircleEntity(view, offset, entity) {
        // قراءة مركز الدائرة
        entity.center = {
            x: view.getFloat64(offset, true),
            y: view.getFloat64(offset + 8, true),
            z: view.getFloat64(offset + 16, true)
        };
        offset += 24;
        
        // قراءة نصف القطر
        entity.radius = view.getFloat64(offset, true);
        offset += 8;
        
        // قراءة خصائص إضافية
        entity = this.readCommonProperties(view, offset, entity);
        
        return entity;
    }

    readArcEntity(view, offset, entity) {
        // قراءة مركز القوس
        entity.center = {
            x: view.getFloat64(offset, true),
            y: view.getFloat64(offset + 8, true),
            z: view.getFloat64(offset + 16, true)
        };
        offset += 24;
        
        // قراءة نصف القطر
        entity.radius = view.getFloat64(offset, true);
        offset += 8;
        
        // قراءة زاويتي البداية والنهاية
        entity.startAngle = view.getFloat64(offset, true);
        offset += 8;
        
        entity.endAngle = view.getFloat64(offset, true);
        offset += 8;
        
        // قراءة خصائص إضافية
        entity = this.readCommonProperties(view, offset, entity);
        
        return entity;
    }

    readLWPolylineEntity(view, offset, entity) {
        // قراءة عدد النقاط
        const pointCount = view.getUint16(offset, true);
        offset += 2;
        
        // قراءة العلم (مغلق أم لا)
        const flags = view.getUint16(offset, true);
        offset += 2;
        entity.closed = (flags & 1) !== 0;
        
        // قراءة النقاط
        entity.points = [];
        for (let i = 0; i < pointCount; i++) {
            const x = view.getFloat64(offset, true);
            const y = view.getFloat64(offset + 8, true);
            offset += 16;
            
            entity.points.push({ x, y, z: 0 });
        }
        
        // قراءة خصائص إضافية
        entity = this.readCommonProperties(view, offset, entity);
        
        return entity;
    }

    readInsertEntity(view, offset, entity) {
        // قراءة اسم الكتلة
        entity.blockName = this.readString(view, offset, 8);
        offset += 8;
        
        // قراءة نقطة الإدراج
        entity.insertPoint = {
            x: view.getFloat64(offset, true),
            y: view.getFloat64(offset + 8, true),
            z: view.getFloat64(offset + 16, true)
        };
        offset += 24;
        
        // قراءة مقياس الرسم
        entity.scale = {
            x: view.getFloat64(offset, true),
            y: view.getFloat64(offset + 8, true),
            z: view.getFloat64(offset + 16, true)
        };
        offset += 24;
        
        // قراءة زاوية الدوران
        entity.rotation = view.getFloat64(offset, true);
        offset += 8;
        
        // قراءة خصائص إضافية
        entity = this.readCommonProperties(view, offset, entity);
        
        return entity;
    }

    readCommonProperties(view, offset, entity) {
        // قراءة اسم الطبقة (عادةً 32 بايت)
        const layerName = this.readString(view, offset, 32).replace(/\0/g, '');
        if (layerName) entity.layer = layerName;
        offset += 32;
        
        // قراءة رقم اللون
        const colorNum = view.getUint16(offset, true);
        entity.color = this.dwgColorToHex(colorNum);
        offset += 2;
        
        // قراءة نوع الخط
        const lineType = this.readString(view, offset, 32).replace(/\0/g, '');
        if (lineType) entity.lineType = lineType;
        offset += 32;
        
        return entity;
    }

    readString(view, offset, length) {
        let str = '';
        for (let i = 0; i < length; i++) {
            const charCode = view.getUint8(offset + i);
            if (charCode !== 0) {
                str += String.fromCharCode(charCode);
            }
        }
        return str;
    }

    parseTextDWG(text) {
        // DWG نصي نادر جداً، قد يكون DXF بالخطأ
        console.warn('⚠️ الملف قد يكون DXF وليس DWG ثنائي');
        
        // محاولة تحليله كـ DXF
        const lines = text.split('\n');
        let inEntities = false;
        let currentEntity = null;
        
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i].trim();
            
            if (line === 'ENTITIES') {
                inEntities = true;
                continue;
            }
            
            if (line === 'ENDSEC') {
                inEntities = false;
                continue;
            }
            
            if (inEntities) {
                if (line === 'LINE' || line === 'CIRCLE' || line === 'ARC' || line === 'POLYLINE') {
                    if (currentEntity) this.entities.push(currentEntity);
                    currentEntity = { type: line, points: [] };
                } else if (currentEntity && line.startsWith('10')) {
                    currentEntity.startX = parseFloat(lines[++i]);
                } else if (currentEntity && line.startsWith('20')) {
                    currentEntity.startY = parseFloat(lines[++i]);
                } else if (currentEntity && line.startsWith('30')) {
                    currentEntity.startZ = parseFloat(lines[++i]);
                } else if (currentEntity && line.startsWith('11')) {
                    currentEntity.endX = parseFloat(lines[++i]);
                } else if (currentEntity && line.startsWith('21')) {
                    currentEntity.endY = parseFloat(lines[++i]);
                } else if (currentEntity && line.startsWith('31')) {
                    currentEntity.endZ = parseFloat(lines[++i]);
                }
            }
        }
        
        if (currentEntity) this.entities.push(currentEntity);
        
        return {
            format: 'dxf',
            entities: this.entities,
            layers: { '0': { name: '0', color: 0xffffff } }
        };
    }

    extractLayers() {
        // استخراج الطبقات من الكيانات
        this.entities.forEach(entity => {
            if (!this.layers[entity.layer]) {
                this.layers[entity.layer] = {
                    name: entity.layer,
                    color: entity.color,
                    entities: []
                };
            }
            this.layers[entity.layer].entities.push(entity);
        });
    }

    getVersionString(versionByte) {
        const versions = {
            0x1C: 'AC1018', // AutoCAD 2004
            0x1D: 'AC1021', // AutoCAD 2007
            0x1E: 'AC1024', // AutoCAD 2010
            0x1F: 'AC1027', // AutoCAD 2013
            0x20: 'AC1032'  // AutoCAD 2018
        };
        return versions[versionByte] || `UNKNOWN_${versionByte.toString(16)}`;
    }

    dwgColorToHex(colorNum) {
        // ألوان DWG الأساسية (مشابهة لـ DXF)
        const colors = {
            1: 0xff0000, // Red
            2: 0xffff00, // Yellow
            3: 0x00ff00, // Green
            4: 0x00ffff, // Cyan
            5: 0x0000ff, // Blue
            6: 0xff00ff, // Magenta
            7: 0xffffff, // White
            8: 0x808080, // Gray
            9: 0xc0c0c0, // Light Gray
            10: 0xff5500, // Orange
            11: 0xaa00aa, // Purple
            12: 0x00aa55, // Teal
            13: 0xaa5555, // Brown
            14: 0x5555ff, // Light Blue
            15: 0x55ff55, // Light Green
            16: 0xffff55, // Light Yellow
            17: 0x55ffff, // Light Cyan
            18: 0xff55ff, // Light Magenta
            19: 0xaaaaaa, // Gray 50%
            20: 0x555555  // Gray 30%
        };
        
        return colors[colorNum] || 0xcccccc;
    }

    getEntitiesByLayer(layerName) {
        return this.entities.filter(e => e.layer === layerName);
    }

    getLayerNames() {
        return Object.keys(this.layers);
    }

    getStatistics() {
        const stats = {
            totalEntities: this.entities.length,
            byType: {},
            byLayer: {}
        };
        
        this.entities.forEach(entity => {
            // حسب النوع
            stats.byType[entity.type] = (stats.byType[entity.type] || 0) + 1;
            
            // حسب الطبقة
            stats.byLayer[entity.layer] = (stats.byLayer[entity.layer] || 0) + 1;
        });
        
        return stats;
    }
}
