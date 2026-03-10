// =======================================
// ACTUAL CONSTRUCTION OS - MAIN ENTRY POINT
// =======================================
// الإصدار: 3.0.0 - النسخة الكاملة
// =======================================

import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

console.log('🚀 بدء تشغيل ACTUAL CONSTRUCTION OS...');

// ========== CORE SYSTEMS ==========
import { GeoReferencing } from '/Construction-OS/core/Georeferencing.js';
import { SceneManager } from '/Construction-OS/core/SceneManager.js';
import { ProjectManager } from '/Construction-OS/core/ProjectManager.js';
import { GlobalEntitySystem } from '/Construction-OS/core/global/GlobalEntitySystem.js';
import { SceneConnector } from '/Construction-OS/core/global/SceneConnector.js';
import { CoordinateTransformer } from '/Construction-OS/core/global/CoordinateTransformer.js';
import { SceneGraph } from '/Construction-OS/core/bridge/SceneGraph.js';
import { StorageManager } from '/Construction-OS/core/storage/StorageManager.js';

// ========== REALITY BRIDGE SYSTEMS ==========
import { RealityBridge } from '/Construction-OS/core/bridge/RealityBridge.js';
import { SceneAnchor } from '/Construction-OS/core/bridge/SceneAnchor.js';
import { EntityMarker } from '/Construction-OS/core/bridge/EntityMarker.js';
import { SceneLink } from '/Construction-OS/core/bridge/SceneLink.js';
import { SyncManager } from '/Construction-OS/core/bridge/SyncManager.js';

// ========== LOADING SYSTEMS ==========
import { IntegratedLoader } from '/Construction-OS/core/loading/IntegratedLoader.js';
import { LazySceneLoader } from '/Construction-OS/core/loading/LazySceneLoader.js';
import { SegmentedSceneLoader } from '/Construction-OS/core/loading/SegmentedSceneLoader.js';
import { LODManager } from '/Construction-OS/core/rendering/LODManager.js';
import { TileLODManager } from '/Construction-OS/core/loading/TileLODManager.js';
import { PriorityQueue } from '/Construction-OS/core/loading/PriorityQueue.js';
import { LoadingStrategy } from '/Construction-OS/core/loading/LoadingStrategy.js';

// ========== UNIVERSAL SYSTEMS ==========
import { UniversalElement } from '/Construction-OS/core/elements/UniversalElement.js';
import { UniversalImporter } from '/Construction-OS/core/import/UniversalImporter.js';

// ========== ARCHITECTURE MODULES ==========
import { Wall } from '/Construction-OS/Modules/Architecture/Wall.js';
import { Door } from '/Construction-OS/Modules/Architecture/Door.js';
import { Window } from '/Construction-OS/Modules/Architecture/Window.js';
import { Floor } from '/Construction-OS/Modules/Architecture/Floor.js';
import { Finish } from '/Construction-OS/Modules/Architecture/Finish.js';
import { Opening } from '/Construction-OS/Modules/Architecture/Opening.js';
import { BuildingMaterial } from '/Construction-OS/Modules/Architecture/Material.js';

// ========== ARCHITECTURE GLOBAL MODULES ==========
import { GlobalWall } from '/Construction-OS/Modules/Architecture/global/GlobalWall.js';
import { GlobalFloor } from '/Construction-OS/Modules/Architecture/global/GlobalFloor.js';

// ========== CONCRETE MODULES ==========
import { Foundation } from '/Construction-OS/Modules/Concrete/Foundation.js';
import { Column } from '/Construction-OS/Modules/Concrete/Column.js';
import { Beam } from '/Construction-OS/Modules/Concrete/Beam.js';
import { Slab } from '/Construction-OS/Modules/Concrete/Slab.js';
import { Rebar, RebarLayout } from '/Construction-OS/Modules/Concrete/Rebar.js';
import { ConcreteMaterial } from '/Construction-OS/Modules/Concrete/ConcreteMaterial.js';

// ========== CONCRETE GLOBAL MODULES ==========
import { GlobalBeam } from '/Construction-OS/Modules/Concrete/global/GlobalBeam.js';
import { GlobalColumn } from '/Construction-OS/Modules/Concrete/global/GlobalColumn.js';
import { GlobalSlab } from '/Construction-OS/Modules/Concrete/global/GlobalSlab.js';

// ========== EARTHWORKS MODULES ==========
import { Excavation } from '/Construction-OS/Modules/Earthworks/Excavation.js';
import { Compaction } from '/Construction-OS/Modules/Earthworks/Compaction.js';
import { Layer } from '/Construction-OS/Modules/Earthworks/Layer.js';
import { SoilMaterial } from '/Construction-OS/Modules/Earthworks/SoilMaterial.js';

// ========== EARTHWORKS GLOBAL MODULES ==========
import { GlobalExcavation } from '/Construction-OS/Modules/Earthworks/global/GlobalExcavation.js';
import { GlobalCompaction } from '/Construction-OS/Modules/Earthworks/global/GlobalCompaction.js';

// ========== MEP MODULES ==========
import { ElectricalCircuit } from '/Construction-OS/Modules/MEP/Electrical.js';
import { PlumbingSystem } from '/Construction-OS/Modules/MEP/Plumbing.js';
import { HVACSystem } from '/Construction-OS/Modules/MEP/HVAC.js';
import { DrainageSystem } from '/Construction-OS/Modules/MEP/Drainage.js';
import { Pipe } from '/Construction-OS/Modules/MEP/Pipe.js';
import { Cable } from '/Construction-OS/Modules/MEP/Cable.js';
import { Fixture } from '/Construction-OS/Modules/MEP/Fixture.js';
import { MEPMaterial } from '/Construction-OS/Modules/MEP/Material.js';

// ========== MEP GLOBAL MODULES ==========
import { GlobalElectrical } from '/Construction-OS/Modules/MEP/global/GlobalElectrical.js';
import { GlobalPlumbing } from '/Construction-OS/Modules/MEP/global/GlobalPlumbing.js';
import { GlobalHVAC } from '/Construction-OS/Modules/MEP/global/GlobalHVAC.js';

// ========== BOQ MODULES ==========
import { BOQCalculator } from '/Construction-OS/Modules/BOQ/Calculator.js';
import { BOQReporter } from '/Construction-OS/Modules/BOQ/Reporter.js';
import { BOQExporter } from '/Construction-OS/Modules/BOQ/Exporter.js';

// ========== BOQ GLOBAL MODULES ==========
import { GlobalBOQCalculator } from '/Construction-OS/Modules/BOQ/global/GlobalBOQCalculator.js';
import { GlobalReporter } from '/Construction-OS/Modules/BOQ/global/GlobalReporter.js';
import { GlobalEarthworksBOQ } from '/Construction-OS/Modules/BOQ/global/GlobalEarthworksBOQ.js';

// ========== CAD TOOLS ==========
import { CADImporter } from '/Construction-OS/tools/cad/CADImporter.js';
import { CalibrationWizard } from '/Construction-OS/tools/cad/CalibrationWizard.js';
import { DWGParser } from '/Construction-OS/tools/cad/DWGParser.js';
import { DXFParser } from '/Construction-OS/tools/cad/DXFParser.js';

// ========== MEASUREMENT TOOLS ==========
import { DistanceTool } from '/Construction-OS/tools/measurement/DistanceTool.js';
import { AreaTool } from '/Construction-OS/tools/measurement/AreaTool.js';
import { VolumeTool } from '/Construction-OS/tools/measurement/VolumeTool.js';

// ========== EXPORT TOOLS ==========
import { ConstructionExporter } from '/Construction-OS/tools/export/ConstructionExporter.js';
import { GlobalDataExporter } from '/Construction-OS/tools/export/GlobalDataExporter.js';

// ========== MATERIALS LIBRARY ==========
import { MaterialLibrary } from '/Construction-OS/materials/MaterialLibrary.js';

// ========== UI MODULES ==========
import { Dashboard } from '/Construction-OS/ui/Dashboard.js';
import { PropertiesPanel } from '/Construction-OS/ui/PropertiesPanel.js';
import { Toolbar } from '/Construction-OS/ui/Toolbar.js';
import { GlobalEntitiesPanel } from '/Construction-OS/ui/global/GlobalEntitiesPanel.js';
import { SceneConnectorUI } from '/Construction-OS/ui/global/SceneConnectorUI.js';
import { CalibrationUI } from '/Construction-OS/ui/cad/CalibrationUI.js';
import { UniversalPropertiesPanel } from '/Construction-OS/ui/UniversalPropertiesPanel.js';

// ========== DEBUG & ANALYTICS ==========
import { DebugLayer } from '/Construction-OS/core/debug/DebugLayer.js';
import { AnalyticsDebugger } from '/Construction-OS/core/debug/AnalyticsDebugger.js';

// ========== RENDERING ==========
// استيراد WebGLRenderer مباشرة بدلاً من HybridRenderer
// import { HybridRenderer } from '/Construction-OS/core/rendering/HybridRenderer.js';

// =======================================
// 🎯 MAIN CONSTRUCTION OS CLASS
// =======================================

class ActualConstructionOS {
    constructor() {
        console.log('%c🚀 ACTUAL CONSTRUCTION OS v3.0.0', 'color: #88aaff; font-size: 16px; font-weight: bold;');
        console.log('%c🏗️ محرك Reality-BIM المتكامل', 'color: #ffaa44; font-size: 14px;');
        
        // ===== THREE.JS SETUP (مباشر) =====
        this.initThree();
        
        // ===== CORE SYSTEMS =====
        this.initCore();
        
        // ===== LOADING SYSTEMS =====
        this.initLoadingSystems();
        
        // ===== UNIVERSAL SYSTEMS =====
        this.initUniversalSystems();
        
        // ===== BRIDGE SYSTEMS =====
        this.initBridgeSystems();
        
        // ===== TOOLS =====
        this.initTools();
        
        // ===== UI =====
        this.initUI();
        
        // ===== DEBUG & ANALYTICS =====
        this.initDebugSystems();
        
        // ===== SETUP =====
        this.setupLights();
        this.setupGrid();
        this.setupEvents();
        
        // ✅ إضافة مكعب اختبار فوراً
        this.addTestCube();
        
        // بدء الحركة
        this.animate();
        
        console.log('%c✅ ACTUAL CONSTRUCTION OS جاهز', 'color: #44ff44; font-size: 14px;');
    }
   initThree() {
        try {
            // إنشاء المشهد
            this.scene = new THREE.Scene();
            this.scene.background = new THREE.Color(0x111122);
            
            // إنشاء الكاميرا
            this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 10000);
            this.camera.position.set(30, 20, 30);
            this.camera.lookAt(0, 5, 0);
            
            // إنشاء الـ Renderer مباشرة (بدون HybridRenderer)
            this.renderer = new THREE.WebGLRenderer({ antialias: true });
            this.renderer.setSize(window.innerWidth, window.innerHeight);
            this.renderer.shadowMap.enabled = true;
            this.renderer.setPixelRatio(window.devicePixelRatio);
            
            // إضافة الـ Renderer إلى الصفحة
            const container = document.getElementById('container');
            if (container) {
                container.appendChild(this.renderer.domElement);
                console.log('✅ تم إضافة Renderer إلى container');
            } else {
                console.error('❌ عنصر container غير موجود');
                document.body.appendChild(this.renderer.domElement);
            }
            
            // التحكم بالكاميرا
            this.controls = new OrbitControls(this.camera, this.renderer.domElement);
            this.controls.enableDamping = true;
            this.controls.dampingFactor = 0.05;
            
            console.log('✅ Three.js initialized');
        } catch (error) {
            console.error('❌ فشل تهيئة Three.js:', error);
        }
    }

    initCore() {
        try {
            this.geoRef = new GeoReferencing();
            this.sceneManager = new SceneManager(this);
            this.projectManager = new ProjectManager();
            this.sceneGraph = new SceneGraph();
            
            this.storage = new StorageManager();
            
            this.globalSystem = new GlobalEntitySystem(this.geoRef);
            this.sceneConnector = new SceneConnector(this.geoRef);
            this.sceneConnector.setGlobalSystem(this.globalSystem);
            
            this.coordTransformer = new CoordinateTransformer(this.geoRef, this.sceneConnector);
            
            this.boqCalculator = new BOQCalculator(this);
            this.boqReporter = new BOQReporter(this.boqCalculator);
            this.boqExporter = new BOQExporter(this.boqReporter);
            
            this.globalBOQ = new GlobalBOQCalculator(this.globalSystem);
            this.globalReporter = new GlobalReporter(this.globalBOQ);
            
            this.materialLibrary = new MaterialLibrary();
            
            console.log('✅ Core systems initialized');
        } catch (error) {
            console.error('❌ فشل تهيئة Core systems:', error);
        }
    }

    initLoadingSystems() {
        try {
            this.lazyLoader = new LazySceneLoader(this.sceneGraph, this.storage);
            this.segmentedLoader = new SegmentedSceneLoader();
            this.lodManager = new LODManager(this.camera);
            this.tileLODManager = new TileLODManager(this.camera);
            this.priorityQueue = new PriorityQueue(this);
            this.loadingStrategy = new LoadingStrategy(this.sceneGraph);
            
            this.loader = new IntegratedLoader(
                this.sceneGraph,
                this.storage,
                this.camera,
                null
            );
            
            console.log('✅ Loading systems initialized');
        } catch (error) {
            console.error('❌ فشل تهيئة Loading systems:', error);
        }
    }

    initUniversalSystems() {
        try {
            this.universalImporter = new UniversalImporter(this.globalSystem, this.cadImporter);
            console.log('✅ Universal systems initialized');
        } catch (error) {
            console.error('❌ فشل تهيئة Universal systems:', error);
        }
    }

    initBridgeSystems() {
        try {
            this.realityBridge = new RealityBridge(this.globalSystem, this.sceneConnector, this.sceneGraph);
            this.syncManager = new SyncManager(this.realityBridge);
            
            this.realityBridge.setLoader(this.loader);
            
            this.setupDemoScenes();
            
            console.log('✅ Bridge systems initialized');
        } catch (error) {
            console.error('❌ فشل تهيئة Bridge systems:', error);
        }
    }

    setupDemoScenes() {
        try {
            this.sceneConnector.addScene('scene_001', { x: 0, y: 0, z: 0 }, 0);
            this.sceneConnector.addScene('scene_002', { x: 20, y: 0, z: 0 }, 0);
            this.sceneConnector.addScene('scene_003', { x: 40, y: 0, z: 10 }, 0);
            
            this.realityBridge.createLink('scene_001', 'scene_002', { x: 10, y: 0, z: 0 }, 'door');
            this.realityBridge.createLink('scene_002', 'scene_003', { x: 30, y: 0, z: 5 }, 'hallway');
            
            this.sceneGraph.buildFromScenes();
            
            console.log('✅ Demo scenes created');
        } catch (error) {
            console.warn('⚠️ فشل إنشاء المشاهد التجريبية:', error);
        }
    }

    initTools() {
        try {
            this.cadImporter = new CADImporter(this.geoRef, this.sceneConnector);
            this.calibrationWizard = new CalibrationWizard(this.geoRef, this.sceneConnector);
            this.dwgParser = new DWGParser();
            this.dxfParser = new DXFParser();
            
            this.distanceTool = new DistanceTool(this);
            this.areaTool = new AreaTool(this);
            this.volumeTool = new VolumeTool(this);
            
            this.constructionExporter = new ConstructionExporter(this);
            this.globalDataExporter = new GlobalDataExporter(this);
            
            console.log('✅ Tools initialized');
        } catch (error) {
            console.error('❌ فشل تهيئة Tools:', error);
        }
    }

    initUI() {
        try {
            this.dashboard = new Dashboard(this);
            this.propertiesPanel = new PropertiesPanel(this);
            this.toolbar = new Toolbar(this);
            this.universalPropertiesPanel = new UniversalPropertiesPanel();
            
            this.globalEntitiesPanel = new GlobalEntitiesPanel(this);
            this.sceneConnectorUI = new SceneConnectorUI(this);
            this.calibrationUI = new CalibrationUI(this, this.calibrationWizard);
            
            console.log('✅ UI initialized');
        } catch (error) {
            console.error('❌ فشل تهيئة UI:', error);
        }
    }

    initDebugSystems() {
        try {
            this.analytics = new AnalyticsDebugger(this.loader, this.realityBridge);
            this.loader.analytics = this.analytics;
            
            this.debugLayer = new DebugLayer(this.sceneGraph, this.realityBridge, this.loader, this.lodManager);
            this.debugLayer.setupKeyboardShortcut();
            
            this.analytics.startTracking();
            
            console.log('✅ Debug systems initialized');
        } catch (error) {
            console.error('❌ فشل تهيئة Debug systems:', error);
        }
    }

    addTestCube() {
        try {
            console.log('🧪 إضافة مكعب اختبار...');
            
            // مكعب كبير
            const geometry = new THREE.BoxGeometry(5, 5, 5);
            const material = new THREE.MeshStandardMaterial({ 
                color: 0xffaa44,
                emissive: 0x442200
            });
            this.testCube = new THREE.Mesh(geometry, material);
            this.testCube.position.set(0, 2.5, 0);
            this.scene.add(this.testCube);
            
            console.log('✅ تم إضافة مكعب الاختبار');
        } catch (error) {
            console.error('❌ فشل إضافة مكعب الاختبار:', error);
        }
    }

    setupLights() {
        try {
            const ambientLight = new THREE.AmbientLight(0x404060);
            this.scene.add(ambientLight);
            
            const sunLight = new THREE.DirectionalLight(0xfff5e6, 1.5);
            sunLight.position.set(20, 30, 20);
            sunLight.castShadow = true;
            this.scene.add(sunLight);
            
            const pointLight = new THREE.PointLight(0xffaa44, 1);
            pointLight.position.set(5, 10, 5);
            this.scene.add(pointLight);
            
            console.log('✅ Lights setup');
        } catch (error) {
            console.error('❌ فشل إعداد الإضاءة:', error);
        }
    }

    setupGrid() {
        try {
            const gridHelper = new THREE.GridHelper(200, 40, 0x88aaff, 0x335588);
            gridHelper.position.y = 0;
            this.scene.add(gridHelper);
            
            const axesHelper = new THREE.AxesHelper(20);
            this.scene.add(axesHelper);
            
            console.log('✅ Grid setup');
        } catch (error) {
            console.error('❌ فشل إعداد الشبكة:', error);
        }
    }

    setupEvents() {
        window.addEventListener('resize', () => this.onResize());
        console.log('✅ Events setup');
    }

    onResize() {
        if (this.camera) {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
        }
        if (this.renderer) {
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        }
    }

    animate() {
        requestAnimationFrame(() => this.animate());
        
        if (this.controls) {
            this.controls.update();
        }
        
        if (this.testCube) {
            this.testCube.rotation.y += 0.01;
            this.testCube.rotation.x += 0.005;
        }
        
        if (this.renderer && this.scene && this.camera) {
            this.renderer.render(this.scene, this.camera);
        }
        
        if (this.lodManager) {
            this.lodManager.update();
        }
        if (this.tileLODManager) {
            this.tileLODManager.update();
        }
    }

    async loadScene(sceneId) {
        if (!this.loader) {
            console.error('❌ المحمل غير موجود');
            return null;
        }
        
        try {
            console.log(`🔄 تحميل المشهد ${sceneId}...`);
            
            const sceneData = await this.loader.loadScene(sceneId, {
                viewport: { x: this.camera?.position?.x || 0, y: this.camera?.position?.z || 0 }
            });
            
            this.loader.setCurrentScene(sceneId);
            console.log(`✅ تم تحميل المشهد ${sceneId}`);
            
            return sceneData;
        } catch (error) {
            console.error(`❌ فشل تحميل المشهد ${sceneId}:`, error);
            return null;
        }
    }
}

// =======================================
// 🚀 تشغيل التطبيق
// =======================================

window.addEventListener('load', () => {
    console.log('%c🌟 ACTUAL CONSTRUCTION OS - Reality-BIM Engine v3.0', 'color: #ffaa44; font-size: 18px; font-weight: bold;');

    try {
        // إخفاء شاشة التحميل
        const loading = document.getElementById('loading');
        if (loading) {
            setTimeout(() => {
                loading.style.opacity = '0';
                setTimeout(() => loading.style.display = 'none', 500);
            }, 2000);
        }

        // إنشاء التطبيق
        console.log('🔄 جاري إنشاء التطبيق...');
        window.app = new ActualConstructionOS();

        if (!window.app) {
            throw new Error('فشل إنشاء التطبيق');
        }

        console.log('✅ تم إنشاء التطبيق بنجاح');

        // تحميل المشهد التجريبي
        setTimeout(() => {
            if (window.app?.loadScene) {
                console.log('🔄 تحميل المشهد التجريبي...');
                window.app.loadScene('scene_001').catch(err => {
                    console.warn('⚠️ فشل تحميل المشهد التجريبي:', err?.message);
                });
            }
        }, 3000);

    } catch (error) {
        console.error('❌ فشل تشغيل التطبيق:', error);
    }
});

// دوال مساعدة
window.restartApp = () => {
    console.log('🔄 إعادة تشغيل التطبيق...');
    location.reload();
};

window.ActualConstructionOS = ActualConstructionOS;

console.log('📌 يمكنك استخدام:');
console.log('   • window.restartApp() - إعادة تشغيل التطبيق'); 
