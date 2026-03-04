// =======================================
// 🏗️ ACTUAL CONSTRUCTION OS v1.0
// =======================================
// "منصة متكاملة لتصميم وإدارة المشاريع"
// =======================================

import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// ========== UI MODULES ==========
import { Dashboard } from './ui/Dashboard.js';
import { Toolbar } from './ui/Toolbar.js';
import { PropertiesPanel } from './ui/PropertiesPanel.js';

// ========== MATERIALS LIBRARY ==========
import { MaterialLibrary } from './materials/MaterialLibrary.js';

// ========== EARTHWORKS MODULES ==========
import { Excavation } from './modules/Earthworks/Excavation.js';
import { Compaction } from './modules/Earthworks/Compaction.js';
import { SoilMaterial } from './modules/Earthworks/SoilMaterial.js';

// ========== CONCRETE MODULES ==========
import { Foundation } from './modules/Concrete/Foundation.js';
import { Column } from './modules/Concrete/Column.js';
import { Beam } from './modules/Concrete/Beam.js';
import { Slab } from './modules/Concrete/Slab.js';
import { Rebar, RebarLayout } from './modules/Concrete/Rebar.js';
import { ConcreteMaterial } from './modules/Concrete/ConcreteMaterial.js';

// ========== ARCHITECTURE MODULES ==========
import { Wall } from './modules/Architecture/Wall.js';
import { Door } from './modules/Architecture/Door.js';
import { Window } from './modules/Architecture/Window.js';
import { Floor } from './modules/Architecture/Floor.js';
import { Finish } from './modules/Architecture/Finish.js';
import { BuildingMaterial } from './modules/Architecture/Material.js';

// ========== MEP MODULES ==========
import { ElectricalCircuit } from './modules/MEP/Electrical.js';
import { PlumbingSystem } from './modules/MEP/Plumbing.js';
import { HVACSystem } from './modules/MEP/HVAC.js';
import { DrainageSystem } from './modules/MEP/Drainage.js';
import { Pipe } from './modules/MEP/Pipe.js';
import { MEPMaterial } from './modules/MEP/Material.js';

// ========== BOQ MODULES ==========
import { BOQCalculator } from './modules/BOQ/Calculator.js';
import { BOQReporter } from './modules/BOQ/Reporter.js';
import { BOQExporter } from './modules/BOQ/Exporter.js';

// ========== GEO REFERENCING ==========
import { ReferencePolyline } from './core/GeoReferencing.js';

// ========== CORE MANAGERS ==========
import { SceneManager } from './core/SceneManager.js';
import { ProjectManager } from './core/ProjectManager.js';

// =======================================
// 🎯 MAIN CONSTRUCTION OS CLASS
// =======================================

class ConstructionOS {
    constructor() {
        console.log('🚀 بدء تشغيل ACTUAL CONSTRUCTION OS...');
        
        // ===== THREE.JS SETUP =====
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x111122);
        
        this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.camera.position.set(30, 20, 30);
        this.camera.lookAt(0, 5, 0);
        
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        document.getElementById('container').appendChild(this.renderer.domElement);
        
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;
        this.controls.maxPolarAngle = Math.PI / 2;
        
        // ===== CORE MANAGERS =====
        this.sceneManager = new SceneManager(this);
        this.projectManager = new ProjectManager(this);
        
        // ===== SYSTEM COMPONENTS =====
        this.project = {
            name: 'مشروع جديد',
            location: '',
            date: new Date().toISOString(),
            scale: 1.0
        };
        
        this.boundary = null;
        this.allElements = [];
        this.concreteElements = [];
        this.archElements = [];
        this.mepSystems = [];
        
        // ===== BOQ SYSTEM =====
        this.boqCalculator = new BOQCalculator(this);
        this.boqReporter = new BOQReporter(this.boqCalculator);
        this.boqExporter = new BOQExporter(this.boqReporter);
        
        // ===== UI COMPONENTS =====
        this.materialLibrary = new MaterialLibrary();
        this.dashboard = new Dashboard(this);
        this.toolbar = new Toolbar(this);
        this.propertiesPanel = new PropertiesPanel(this);
        
        // ===== SETUP =====
        this.setupLights();
        this.setupGrid();
        this.setupHelpers();
        this.setupSelection();
        this.setupUI();
        
        // بدء الحركة
        this.animate();
        
        // تحديث شريط الحالة
        this.updateStatus('✅ المنصة جاهزة للعمل');
        
        console.log('✅ ACTUAL CONSTRUCTION OS جاهز للتشغيل');
    }
    
    // ===== الإضاءة =====
    setupLights() {
        // إضاءة محيطية
        const ambientLight = new THREE.AmbientLight(0x404060);
        this.scene.add(ambientLight);
        
        // إضاءة رئيسية (شمس)
        const sunLight = new THREE.DirectionalLight(0xfff5e6, 1.2);
        sunLight.position.set(20, 30, 20);
        sunLight.castShadow = true;
        sunLight.shadow.mapSize.width = 2048;
        sunLight.shadow.mapSize.height = 2048;
        sunLight.shadow.camera.near = 0.5;
        sunLight.shadow.camera.far = 50;
        sunLight.shadow.camera.left = -20;
        sunLight.shadow.camera.right = 20;
        sunLight.shadow.camera.top = 20;
        sunLight.shadow.camera.bottom = -20;
        this.scene.add(sunLight);
        
        // إضاءة خلفية
        const backLight = new THREE.DirectionalLight(0x446688, 0.5);
        backLight.position.set(-20, 10, -20);
        this.scene.add(backLight);
        
        // إضاءة جانبية
        const fillLight = new THREE.DirectionalLight(0x88aaff, 0.3);
        fillLight.position.set(-10, 5, 20);
        this.scene.add(fillLight);
    }
    
    // ===== الشبكة الأرضية =====
    setupGrid() {
        // شبكة رئيسية
        const gridHelper = new THREE.GridHelper(100, 20, 0x88aaff, 0x335588);
        gridHelper.position.y = 0;
        this.scene.add(gridHelper);
        
        // محاور
        const axesHelper = new THREE.AxesHelper(10);
        this.scene.add(axesHelper);
        
        // أرضية شفافة للظلال
        const groundGeometry = new THREE.PlaneGeometry(100, 100);
        const groundMaterial = new THREE.ShadowMaterial({ opacity: 0.3 });
        const ground = new THREE.Mesh(groundGeometry, groundMaterial);
        ground.rotation.x = -Math.PI / 2;
        ground.position.y = 0;
        ground.receiveShadow = true;
        this.scene.add(ground);
    }
    
    // ===== مساعدات إضافية =====
    setupHelpers() {
        // كرة للإشارة إلى المركز
        const centerSphere = new THREE.Mesh(
            new THREE.SphereGeometry(0.5, 16),
            new THREE.MeshStandardMaterial({ color: 0xffaa44, emissive: 0x442200 })
        );
        centerSphere.position.set(0, 0.5, 0);
        this.scene.add(centerSphere);
    }
    
    // ===== واجهة المستخدم =====
    setupUI() {
        // إنشاء لوحة التحكم
        const panel = document.createElement('div');
        panel.id = 'control-panel';
        panel.className = 'control-panel'; // للتأكد من تطبيق الأنماط من CSS
        panel.innerHTML = `
            <div class="panel-header">
                <h2>🏗️ ACTUAL OS</h2>
            </div>
            <div class="panel-section">
                <input type="text" id="project-name" class="input-field" value="${this.project.name}" placeholder="اسم المشروع">
            </div>
            <div class="panel-section" style="display: grid; gap: 10px;">
                <button id="btn-excavation" class="btn">⛏️ حفريات</button>
                <button id="btn-foundation" class="btn">🧱 قواعد</button>
                <button id="btn-column" class="btn">📏 أعمدة</button>
                <button id="btn-wall" class="btn">🏛️ جدران</button>
                <button id="btn-mep" class="btn">🔌 تمديدات</button>
                <button id="btn-boq" class="btn btn-success">📊 جدول الكميات</button>
                <button id="btn-export" class="btn btn-warning">📤 تصدير CSV</button>
            </div>
        `;
        
        document.body.appendChild(panel);
        
        // ربط الأحداث
        document.getElementById('btn-excavation').onclick = () => this.createExcavation();
        document.getElementById('btn-foundation').onclick = () => this.createFoundation();
        document.getElementById('btn-column').onclick = () => this.createColumn();
        document.getElementById('btn-wall').onclick = () => this.createWall();
        document.getElementById('btn-mep').onclick = () => this.createMEP();
        document.getElementById('btn-boq').onclick = () => this.showBOQ();
        document.getElementById('btn-export').onclick = () => this.exportBOQ('csv');
        
        // تغيير اسم المشروع
        document.getElementById('project-name').onchange = (e) => {
            this.project.name = e.target.value;
            this.updateStatus(`📋 مشروع: ${this.project.name}`);
        };
    }
    
    // ===== تحديث شريط الحالة =====
    updateStatus(message) {
        const statusBar = document.getElementById('statusBar');
        if (statusBar) {
            statusBar.innerHTML = message;
        }
    }
// ===== تحديد العناصر =====
    setupSelection() {
        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();
        
        this.renderer.domElement.addEventListener('click', (e) => {
            // حساب موقع النقر
            this.mouse.x = (e.clientX / this.renderer.domElement.clientWidth) * 2 - 1;
            this.mouse.y = -(e.clientY / this.renderer.domElement.clientHeight) * 2 + 1;
            
            this.raycaster.setFromCamera(this.mouse, this.camera);
            
            // تجميع جميع العناصر
            const meshes = [];
            this.scene.traverse(obj => {
                if (obj.isMesh && obj !== this.gridHelper) {
                    meshes.push(obj);
                }
            });
            
            const intersects = this.raycaster.intersectObjects(meshes);
            
            if (intersects.length > 0) {
                const selectedMesh = intersects[0].object;
                
                // إيجاد العنصر المقابل في allElements
                const element = this.allElements.find(el => 
                    el.mesh === selectedMesh || el.meshes?.includes(selectedMesh)
                );
                
                if (element) {
                    if (this.propertiesPanel) {
                        this.propertiesPanel.showForElement(element);
                    }
                    this.updateStatus(`✅ تم تحديد: ${element.constructor.name}`);
                }
            } else {
                if (this.propertiesPanel) {
                    this.propertiesPanel.hide();
                }
            }
        });
    }
    
    // ===== إضافة عنصر =====
    addElement(element, category) {
        this.allElements.push(element);
        this.boqCalculator.addItem(element, category);
        
        if (element.createMesh) {
            const mesh = element.createMesh();
            if (mesh) {
                this.scene.add(mesh);
                element.mesh = mesh;
            }
        }
        
        // تصنيف إضافي
        if (category === 'concrete') {
            this.concreteElements.push(element);
        } else if (category === 'architecture') {
            this.archElements.push(element);
        } else if (category === 'mep') {
            this.mepSystems.push(element);
        }
        
        this.updateStatus(`✅ تم إضافة ${element.constructor.name}`);
        return element;
    }
    
    // ===== إنشاء حفرية =====
    createExcavation() {
        const points = [
            new THREE.Vector3(-10, 0, -10),
            new THREE.Vector3(10, 0, -10),
            new THREE.Vector3(10, 0, 10),
            new THREE.Vector3(-10, 0, 10),
            new THREE.Vector3(-10, 0, -10)
        ];
        
        this.boundary = new ReferencePolyline(points);
        this.boundary.calibrate(20, 10); // 20 متر حقيقي = 10 وحدات
        
        const depth = parseFloat(prompt('عمق الحفر (متر):', '3')) || 3;
        const soilType = prompt('نوع التربة (topsoil/sand/gravel/rock):', 'topsoil') || 'topsoil';
        
        const excavation = new Excavation(this.boundary, depth, soilType);
        this.addElement(excavation, 'earthworks');
    }
    
    // ===== إنشاء قاعدة =====
    createFoundation() {
        const width = parseFloat(prompt('عرض القاعدة (متر):', '1.2')) || 1.2;
        const length = parseFloat(prompt('طول القاعدة (متر):', '1.2')) || 1.2;
        const height = parseFloat(prompt('ارتفاع القاعدة (متر):', '0.6')) || 0.6;
        
        const foundation = new Foundation({
            type: 'isolated',
            width: width,
            length: length,
            height: height,
            position: { x: 2, y: 0, z: 2 }
        });
        
        this.addElement(foundation, 'concrete');
    }
    
    // ===== إنشاء عمود =====
    createColumn() {
        const height = parseFloat(prompt('ارتفاع العمود (متر):', '3.0')) || 3.0;
        
        const column = new Column({
            shape: 'rectangular',
            width: 0.3,
            depth: 0.3,
            height: height,
            position: { x: 2, y: 0, z: 2 }
        });
        
        this.addElement(column, 'concrete');
    }
    
    // ===== إنشاء جدار =====
    createWall() {
        const length = parseFloat(prompt('طول الجدار (متر):', '4.0')) || 4.0;
        const height = parseFloat(prompt('ارتفاع الجدار (متر):', '3.0')) || 3.0;
        
        const wall = new Wall({
            start: { x: 0, y: 0, z: 0 },
            end: { x: length, y: 0, z: 0 },
            height: height,
            thickness: 0.2,
            material: 'concrete_block'
        });
        
        this.addElement(wall, 'architecture');
    }
    
    // ===== إنشاء تمديدات =====
    createMEP() {
        const circuit = new ElectricalCircuit({
            type: 'lighting',
            voltage: 220
        });
        
        circuit.addPoint({ x: 2, y: 2.5, z: 2 }, 'light');
        circuit.addPoint({ x: -2, y: 2.5, z: -2 }, 'light');
        
        this.addElement(circuit, 'mep');
    }
    
    // ===== عرض جدول الكميات =====
    showBOQ() {
        this.boqCalculator.calculateAll();
        const report = this.boqReporter.generateDetailed();
        
        // إزالة أي نافذة سابقة
        const oldModal = document.querySelector('.boq-modal');
        if (oldModal) oldModal.remove();
        
        // إنشاء نافذة جديدة
        const modal = document.createElement('div');
        modal.className = 'boq-modal';
        modal.innerHTML = `
            <h2>📊 جدول الكميات</h2>
            <div class="boq-content">${report}</div>
            <button class="btn btn-success" onclick="this.parentElement.remove()">إغلاق</button>
        `;
        
        document.body.appendChild(modal);
    }
    
    // ===== تصدير التقارير =====
    exportBOQ(format = 'csv') {
        this.boqCalculator.calculateAll();
        let content, filename;
        
        switch(format) {
            case 'csv':
                content = this.boqExporter.exportToCSV();
                filename = `${this.project.name}_boq.csv`;
                break;
            case 'json':
                content = this.boqExporter.exportToJSON();
                filename = `${this.project.name}_boq.json`;
                break;
            default:
                content = this.boqReporter.generateHTML();
                filename = `${this.project.name}_boq.html`;
        }
        
        this.boqExporter.download(filename, content);
        this.updateStatus(`📥 تم تصدير ${filename}`);
    }

// ===== حساب إجمالي الخرسانة =====
    calculateTotalConcreteBOQ() {
        let totalVolume = 0;
        let totalSteel = 0;
        
        this.concreteElements.forEach(element => {
            const boq = element.getBOQ();
            totalVolume += parseFloat(boq.حجم_الخرسانة || 0);
            totalSteel += parseFloat(boq.وزن_الحديد || 0);
        });
        
        return {
            إجمالي_الخرسانة: totalVolume.toFixed(2) + ' م³',
            إجمالي_الحديد: totalSteel.toFixed(2) + ' كجم',
            عدد_العناصر: this.concreteElements.length
        };
    }
    
    // ===== حلقة الحركة =====
    animate() {
        requestAnimationFrame(() => this.animate());
        
        this.controls.update();
        this.renderer.render(this.scene, this.camera);
    }
    
    // ===== تغيير حجم النافذة =====
    onResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }
}

// =======================================
// 🚀 تشغيل التطبيق
// =======================================

// انتظار تحميل الصفحة
window.addEventListener('load', () => {
    // إنشاء التطبيق
    const app = new ConstructionOS();
    
    // إضافة بعض العناصر الافتراضية
    setTimeout(() => {
        // حفريات
        const points = [
            new THREE.Vector3(-10, 0, -10),
            new THREE.Vector3(10, 0, -10),
            new THREE.Vector3(10, 0, 10),
            new THREE.Vector3(-10, 0, 10),
            new THREE.Vector3(-10, 0, -10)
        ];
        
        app.boundary = new ReferencePolyline(points);
        app.boundary.calibrate(20, 10);
        
        const excavation = new Excavation(app.boundary, 2.5, 'topsoil');
        app.addElement(excavation, 'earthworks');
        
        // قاعدة
        const foundation = new Foundation({
            type: 'isolated',
            width: 1.5,
            length: 1.5,
            height: 0.7,
            position: { x: 3, y: 0, z: 3 }
        });
        app.addElement(foundation, 'concrete');
        
        // عمود
        const column = new Column({
            shape: 'rectangular',
            width: 0.4,
            depth: 0.4,
            height: 3.2,
            position: { x: 3, y: 0, z: 3 }
        });
        app.addElement(column, 'concrete');
        
        // جدار
        const wall = new Wall({
            start: { x: -5, y: 0, z: -5 },
            end: { x: 5, y: 0, z: -5 },
            height: 3.0,
            thickness: 0.25,
            material: 'concrete_block'
        });
        app.addElement(wall, 'architecture');
        
        console.log('🏗️ تم إضافة العناصر الافتراضية');
        app.updateStatus('✅ تم تحميل المشروع التجريبي');
        
    }, 1000);
    
    // ربط حدث تغيير حجم النافذة
    window.addEventListener('resize', () => app.onResize());
    
    // جعل التطبيق متاحاً عالمياً للتجربة
    window.app = app;
});

// تصدير الكلاس للاستخدام العام
window.ConstructionOS = ConstructionOS;



