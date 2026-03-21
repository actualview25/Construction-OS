
// =======================================
// ACTUAL VIEW CONSTRUCTION OS - GLOBAL DATA EXPORTER
// =======================================
// نظام تصدير البيانات العالمية للمشروع
// =======================================

export class GlobalDataExporter {
    constructor(app) {
        this.app = app;
        this.formats = ['json', 'csv', 'dxf', 'ifc'];
        this.createdAt = new Date().toISOString();
        console.log('✅ GlobalDataExporter initialized');
    }

    /**
     * تصدير جميع بيانات المشروع
     * @param {string} format - صيغة التصدير (json, csv, dxf, ifc)
     * @param {Object} options - خيارات إضافية
     */
    async exportProject(format = 'json', options = {}) {
        console.log(`📤 Exporting project to ${format}...`);

        const projectData = this.collectProjectData();

        switch (format) {
            case 'json':
                return this.exportToJSON(projectData);
            case 'csv':
                return this.exportToCSV(projectData);
            case 'dxf':
                return this.exportToDXF(projectData);
            case 'ifc':
                return this.exportToIFC(projectData);
            default:
                console.error(`❌ Unsupported format: ${format}`);
                return null;
        }
    }

    /**
     * جمع بيانات المشروع
     */
    collectProjectData() {
        const data = {
            project: {
                name: this.app?.engine?.projectManager?.getCurrentProject()?.name || 'ACTUAL Project',
                version: '3.0.0',
                createdAt: this.createdAt,
                exportedAt: new Date().toISOString()
            },
            scenes: [],
            elements: [],
            calibration: {
                points: this.app?.state?.calibrationPoints || [],
                transformMatrix: this.app?.engine?.geoRef?.transformMatrix,
                gcpCount: this.app?.engine?.geoRef?.gcp?.length || 0
            },
            stats: this.app?.getSystemStatus?.() || {}
        };

        // جمع بيانات المشاهد
        if (this.app?.state?.scenes) {
            this.app.state.scenes.forEach((scene, id) => {
                data.scenes.push({
                    id: id,
                    name: scene.name,
                    elements: scene.elements?.length || 0,
                    anchors: scene.anchors?.length || 0
                });
            });
        }

        return data;
    }

    /**
     * تصدير بصيغة JSON
     */
    exportToJSON(data) {
        const json = JSON.stringify(data, null, 2);
        this.downloadFile('project_export.json', json, 'application/json');
        return json;
    }

    /**
     * تصدير بصيغة CSV
     */
    exportToCSV(data) {
        let csv = 'Type,Name,Value\n';

        // إضافة معلومات المشروع
        csv += `Project,Name,${data.project.name}\n`;
        csv += `Project,Version,${data.project.version}\n`;
        csv += `Project,Exported,${data.project.exportedAt}\n`;

        // إضافة المشاهد
        data.scenes.forEach(scene => {
            csv += `Scene,${scene.name},Elements: ${scene.elements}\n`;
        });

        // إضافة نقاط المعايرة
        data.calibration.points.forEach((point, i) => {
            csv += `Calibration,Point ${i + 1},(${point.imageX},${point.imageY}) → (${point.realX},${point.realY})\n`;
        });

        this.downloadFile('project_export.csv', csv, 'text/csv');
        return csv;
    }

    /**
     * تصدير بصيغة DXF (مخطط CAD)
     */
    exportToDXF(data) {
        let dxf = `0
SECTION
2
HEADER
0
ENDSEC
0
SECTION
2
ENTITIES
`;

        // إضافة عناصر المشهد
        if (this.app?.state?.scenes) {
            this.app.state.scenes.forEach((scene, id) => {
                if (scene.sphere) {
                    // تمثيل الكرة في DXF
                    dxf += `0
CIRCLE
8
${scene.name}
10
${scene.sphere.position.x}
20
${scene.sphere.position.z}
40
${scene.sphere.geometry.parameters.radius}
0
`;
                }
            });
        }

        dxf += `0
ENDSEC
0
EOF
`;

        this.downloadFile('project_export.dxf', dxf, 'application/dxf');
        return dxf;
    }

    /**
     * تصدير بصيغة IFC (BIM)
     */
    exportToIFC(data) {
        let ifc = `ISO-10303-21;
HEADER;
FILE_DESCRIPTION(('ViewDefinition [IfcProject]'), '2;1');
FILE_NAME('${data.project.name}.ifc', '${new Date().toISOString()}', ('ACTUAL VIEW CONSTRUCTION OS'), (''), 'ACTUAL VIEW', 'ACTUAL VIEW', '');
FILE_SCHEMA(('IFC4'));
ENDSEC;
DATA;
`;

        // إضافة مشروع IFC
        ifc += `#1=IFCPROJECT('${data.project.name}', $, $, $, $, $, $, $, $);
`;

        // إضافة عناصر
        ifc += `ENDSEC;
END-ISO-10303-21;
`;

        this.downloadFile('project_export.ifc', ifc, 'application/ifc');
        return ifc;
    }

    /**
     * تصدير التقرير كـ PDF (HTML مؤقت)
     */
    exportToPDF() {
        const data = this.collectProjectData();
        const html = this.generateReportHTML(data);
        const blob = new Blob([html], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const win = window.open(url, '_blank');
        win?.print();
        URL.revokeObjectURL(url);
        return html;
    }

    /**
     * إنشاء تقرير HTML للطباعة
     */
    generateReportHTML(data) {
        return `<!DOCTYPE html>
<html dir="rtl">
<head>
    <meta charset="UTF-8">
    <title>ACTUAL VIEW CONSTRUCTION OS - Project Report</title>
    <style>
        body { font-family: 'Segoe UI', sans-serif; margin: 40px; background: #f5f5f5; }
        .container { max-width: 1200px; margin: 0 auto; background: white; padding: 30px; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.1); }
        h1 { color: #ffaa44; border-bottom: 2px solid #ffaa44; padding-bottom: 10px; }
        h2 { color: #333; margin-top: 30px; }
        table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        th, td { border: 1px solid #ddd; padding: 10px; text-align: center; }
        th { background: #ffaa44; color: white; }
        .stats { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin: 20px 0; }
        .stat-card { background: #f9f9f9; padding: 15px; border-radius: 8px; text-align: center; }
        .stat-value { font-size: 28px; font-weight: bold; color: #ffaa44; }
        .stat-label { color: #666; }
        footer { margin-top: 30px; text-align: center; color: #999; font-size: 12px; }
    </style>
</head>
<body>
    <div class="container">
        <h1>🏗️ ACTUAL VIEW CONSTRUCTION OS</h1>
        <h2>Project: ${data.project.name}</h2>
        <p>Exported: ${new Date().toLocaleString()}</p>

        <div class="stats">
            <div class="stat-card">
                <div class="stat-value">${data.scenes.length}</div>
                <div class="stat-label">Scenes</div>
            </div>
            <div class="stat-card">
                <div class="stat-value">${data.calibration.gcpCount}</div>
                <div class="stat-label">GCP Points</div>
            </div>
            <div class="stat-card">
                <div class="stat-value">${data.stats.stats?.scenes || 0}</div>
                <div class="stat-label">Total Elements</div>
            </div>
        </div>

        <h2>📸 Scenes</h2>
        <table>
            <tr><th>Name</th><th>ID</th><th>Elements</th></tr>
            ${data.scenes.map(s => `<tr><td>${s.name}</td><td>${s.id}</td><td>${s.elements}</td></tr>`).join('')}
        </table>

        <h2>📍 Calibration Points</h2>
        <table>
            <tr><th>#</th><th>Image (X,Y)</th><th>Real (X,Y)</th></tr>
            ${data.calibration.points.map((p, i) => `<tr><td>${i + 1}</td><td>(${p.imageX}, ${p.imageY})</td><td>(${p.realX}, ${p.realY})</td></tr>`).join('')}
        </table>

        <footer>Generated by ACTUAL VIEW CONSTRUCTION OS v3.0</footer>
    </div>
</body>
</html>`;
    }

    /**
     * تحميل الملف
     */
    downloadFile(filename, content, type) {
        const blob = new Blob([content], { type });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = filename;
        link.click();
        URL.revokeObjectURL(link.href);
        console.log(`📥 File downloaded: ${filename}`);
    }

    /**
     * الحصول على قائمة الصيغ المدعومة
     */
    getSupportedFormats() {
        return this.formats;
    }

    /**
     * تصدير العناصر المحددة فقط
     */
    exportSelectedElements(elementIds, format = 'json') {
        const elements = [];
        if (this.app?.state?.elements) {
            this.app.state.elements.forEach(el => {
                if (elementIds.includes(el.id)) {
                    elements.push(el);
                }
            });
        }
        return this.exportToJSON(elements);
    }

    /**
     * تصدير الإعدادات الحالية
     */
    exportSettings() {
        const settings = {
            version: '3.0.0',
            app: {
                version: this.app?.getSystemStatus?.()?.version,
                state: this.app?.state
            },
            engine: {
                renderer: this.app?.engine?.renderer?.getContext?.()?.canvas?.width || 'unknown',
                controls: this.app?.engine?.controls?.target || null
            },
            exportedAt: new Date().toISOString()
        };
        return this.exportToJSON(settings);
    }
}
