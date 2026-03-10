// =======================================
// ACTUAL CONSTRUCTION OS - ENHANCED MAIN ENTRY POINT
// =======================================
// الإصدار: 3.0.0 - النسخة الكاملة المتكاملة
// =======================================

import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { CSS2DRenderer, CSS2DObject } from 'three/addons/renderers/CSS2DRenderer.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { GlitchPass } from 'three/addons/postprocessing/GlitchPass.js';
import { FilmPass } from 'three/addons/postprocessing/FilmPass.js';
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';
import { RGBShiftShader } from 'three/addons/shaders/RGBShiftShader.js';

console.log('%c🚀 ACTUAL CONSTRUCTION OS v3.0.0 - نظام صور 360 المتكامل', 'color: #88aaff; font-size: 16px; font-weight: bold;');
console.log('%c🏗️ منصة متكاملة لربط الصور البانورامية بالمخططات الهندسية', 'color: #ffaa44; font-size: 14px;');

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

// ========== CLASH DETECTION ==========
import { ClashDetection } from '/Construction-OS/core/clash/ClashDetection.js';
import { AdvancedClashDetection } from '/Construction-OS/core/clash/AdvancedClashDetection.js';

// ========== FLOOR SYSTEMS ==========
import { FloorConnector } from '/Construction-OS/core/floors/FloorConnector.js';
import { FloorCopySystem } from '/Construction-OS/core/floors/FloorCopySystem.js';
import { FloorNavigation } from '/Construction-OS/core/floors/FloorNavigation.js';

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

// ========== WORKER MODES ==========
import { WorkerMode } from '/Construction-OS/player/WorkerMode.js';
import { ForemanMode } from '/Construction-OS/player/ForemanMode.js';
import { MobileWorkerMode } from '/Construction-OS/player/MobileWorkerMode.js';
import { WorkerMarkers } from '/Construction-OS/player/WorkerMarkers.js';

// ========== DEBUG & ANALYTICS ==========
import { DebugLayer } from '/Construction-OS/core/debug/DebugLayer.js';
import { AnalyticsDebugger } from '/Construction-OS/core/debug/AnalyticsDebugger.js';

// ========== RENDERING ==========
import { HybridRenderer } from '/Construction-OS/core/rendering/HybridRenderer.js';

// =======================================
// 🎯 MAIN CONSTRUCTION OS CLASS
// =======================================

class ActualConstructionOS {
    constructor() {
        console.log('%c========================================', 'color: #88aaff');
        console.log('%c🚀 ACTUAL CONSTRUCTION OS v3.0.0', 'color: #88aaff; font-size: 16px; font-weight: bold;');
        console.log('%c🏗️ محرك Reality-BIM المتكامل لصور 360', 'color: #ffaa44; font-size: 14px;');
        console.log('%c========================================', 'color: #88aaff');
        
        // ===== THREE.JS SETUP =====
        this.initThree();
        
        // ===== CORE SYSTEMS =====
        this.initCore();
        
        // ===== LOADING SYSTEMS =====
        this.initLoadingSystems();
        
        // ===== UNIVERSAL SYSTEMS =====
        this.initUniversalSystems();
        
        // ===== CLASH DETECTION =====
        this.initClashDetection();
        
        // ===== FLOOR SYSTEMS =====
        this.initFloorSystems();
        
        // ===== BRIDGE SYSTEMS =====
        this.initBridgeSystems();
        
        // ===== TOOLS =====
        this.initTools();
        
        // ===== UI =====
        this.initUI();
        
        // ===== DEBUG & ANALYTICS =====
        this.initDebugSystems();
        
        // ===== WORKER MODES =====
        this.initWorkerModes();
        
        // ===== SETUP =====
        this.setupLights();
        this.setupGrid();
        this.setupEvents();
        
        // ===== إنشاء مشهد تجريبي =====
        this.createDemoScene();
        
        // ===== بدء الحركة =====
        this.animate();
        
        console.log('%c✅ ACTUAL CONSTRUCTION OS جاهز للعمل', 'color: #44ff44; font-size: 14px;');
        console.log('%c📌 استخدم window.app للوصول إلى التطبيق', 'color: #88aaff');
    }

    // ==================== تهيئة Three.js مع مؤثرات متقدمة ====================

    initThree() {
        try {
            // المشهد
            this.scene = new THREE.Scene();
            this.scene.background = new THREE.Color(0x111122);
            this.scene.fog = new THREE.Fog(0x111122, 30, 100);
            
            // الكاميرا
            this.camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 10000);
            this.camera.position.set(10, 5, 15);
            
            // الريندرر الرئيسي
            this.renderer = new THREE.WebGLRenderer({ 
                antialias: true,
                powerPreference: "high-performance"
            });
            this.renderer.setSize(window.innerWidth, window.innerHeight);
            this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
            this.renderer.shadowMap.enabled = true;
            this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
            this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
            this.renderer.toneMappingExposure = 1.2;
            document.getElementById('container').appendChild(this.renderer.domElement);
            
            // ريندرر للنصوص ثنائية الأبعاد
            this.labelRenderer = new CSS2DRenderer();
            this.labelRenderer.setSize(window.innerWidth, window.innerHeight);
            this.labelRenderer.domElement.style.position = 'absolute';
            this.labelRenderer.domElement.style.top = '0px';
            this.labelRenderer.domElement.style.left = '0px';
            this.labelRenderer.domElement.style.pointerEvents = 'none';
            document.getElementById('container').appendChild(this.labelRenderer.domElement);
            
            // مؤثرات بصرية
            this.composer = new EffectComposer(this.renderer);
            const renderPass = new RenderPass(this.scene, this.camera);
            this.composer.addPass(renderPass);
            
            // Bloom effect
            const bloomPass = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 1.5, 0.4, 0.85);
            bloomPass.threshold = 0.1;
            bloomPass.strength = 0.6;
            bloomPass.radius = 0.5;
            this.composer.addPass(bloomPass);
            
            // Film effect
            const filmPass = new FilmPass(0.35, 0.025, 648, false);
            filmPass.renderToScreen = true;
            this.composer.addPass(filmPass);
            
            // التحكم
            this.controls = new OrbitControls(this.camera, this.renderer.domElement);
            this.controls.enableDamping = true;
            this.controls.dampingFactor = 0.05;
            this.controls.maxPolarAngle = Math.PI / 2;
            this.controls.minDistance = 5;
            this.controls.maxDistance = 50;
            
            console.log('✅ Three.js initialized with effects');
        } catch (error) {
            console.error('❌ فشل تهيئة Three.js:', error);
        }
    }

// ==================== تهيئة الأنظمة الأساسية ====================

    initCore() {
        try {
            // نظام الإسناد الجغرافي (لربط الصور بالواقع)
            this.geoRef = new GeoReferencing();
            this.geoRef.setCoordinateSystem('utm');
            this.geoRef.setOrigin(0, 0, 0);
            this.geoRef.setScale(1.0);
            
            // مدير المشاهد
            this.sceneManager = new SceneManager(this);
            
            // مدير المشروع
            this.projectManager = new ProjectManager();
            this.projectManager.createProject('مشروع جديد', 'وصف المشروع');
            
            // الرسم البياني للمشاهد
            this.sceneGraph = new SceneGraph();
            
            // نظام التخزين
            this.storage = new StorageManager();
            this.storage.init();
            
            // النظام العالمي للكيانات
            this.globalSystem = new GlobalEntitySystem(this.geoRef);
            
            // موصل المشاهد
            this.sceneConnector = new SceneConnector(this.geoRef);
            this.sceneConnector.setGlobalSystem(this.globalSystem);
            
            // محول الإحداثيات
            this.coordTransformer = new CoordinateTransformer(this.geoRef, this.sceneConnector);
            
            // أنظمة BOQ
            this.boqCalculator = new BOQCalculator(this);
            this.boqReporter = new BOQReporter(this.boqCalculator);
            this.boqExporter = new BOQExporter(this.boqReporter);
            
            // BOQ العالمية
            this.globalBOQ = new GlobalBOQCalculator(this.globalSystem);
            this.globalReporter = new GlobalReporter(this.globalBOQ);
            
            // مكتبة المواد
            this.materialLibrary = new MaterialLibrary();
            
            console.log('✅ Core systems initialized');
        } catch (error) {
            console.error('❌ فشل تهيئة Core systems:', error);
        }
    }

    // ==================== تهيئة أنظمة التحميل ====================

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
                this.lodManager
            );
            
            console.log('✅ Loading systems initialized');
        } catch (error) {
            console.error('❌ فشل تهيئة Loading systems:', error);
        }
    }

    // ==================== تهيئة الأنظمة العالمية ====================

    initUniversalSystems() {
        try {
            this.universalElement = new UniversalElement();
            this.universalImporter = new UniversalImporter(this.globalSystem, this.cadImporter);
            console.log('✅ Universal systems initialized');
        } catch (error) {
            console.error('❌ فشل تهيئة Universal systems:', error);
        }
    }

    // ==================== تهيئة كشف التعارضات ====================

    initClashDetection() {
        try {
            this.clashDetection = new ClashDetection(this.globalSystem, this.sceneConnector);
            this.advancedClashDetection = new AdvancedClashDetection(this.globalSystem, this.sceneConnector);
            console.log('✅ Clash detection initialized');
        } catch (error) {
            console.error('❌ فشل تهيئة Clash detection:', error);
        }
    }

    // ==================== تهيئة أنظمة الطوابق ====================

    initFloorSystems() {
        try {
            this.floorConnector = new FloorConnector(this.globalSystem, this.sceneConnector);
            this.floorCopySystem = new FloorCopySystem(this.globalSystem, this.sceneConnector);
            this.floorNavigation = new FloorNavigation(this.floorConnector);
            console.log('✅ Floor systems initialized');
        } catch (error) {
            console.error('❌ فشل تهيئة Floor systems:', error);
        }
    }

    // ==================== تهيئة Reality Bridge (جسر الواقع) ====================

    initBridgeSystems() {
        try {
            this.realityBridge = new RealityBridge(this.globalSystem, this.sceneConnector, this.sceneGraph);
            this.syncManager = new SyncManager(this.realityBridge);
            
            // إعداد نقاط الارتساء
            this.sceneAnchor = new SceneAnchor(this.geoRef, this.sceneConnector);
            this.entityMarker = new EntityMarker(this.scene);
            this.sceneLink = new SceneLink(this.realityBridge);
            
            this.realityBridge.setLoader(this.loader);
            
            console.log('✅ Reality Bridge initialized');
            console.log('   • يمكن ربط الصور 360 بالواقع الحقيقي');
            console.log('   • يمكن ربط المشاهد ببعضها');
        } catch (error) {
            console.error('❌ فشل تهيئة Bridge systems:', error);
        }
    }

    // ==================== تهيئة الأدوات ====================

    initTools() {
        try {
            // أدوات CAD
            this.cadImporter = new CADImporter(this.geoRef, this.sceneConnector);
            this.calibrationWizard = new CalibrationWizard(this.geoRef, this.sceneConnector);
            this.dwgParser = new DWGParser();
            this.dxfParser = new DXFParser();
            
            // أدوات القياس
            this.distanceTool = new DistanceTool(this);
            this.areaTool = new AreaTool(this);
            this.volumeTool = new VolumeTool(this);
            
            // أدوات التصدير
            this.constructionExporter = new ConstructionExporter(this);
            this.globalDataExporter = new GlobalDataExporter(this);
            
            console.log('✅ Tools initialized');
        } catch (error) {
            console.error('❌ فشل تهيئة Tools:', error);
        }
    }

    // ==================== تهيئة واجهة المستخدم ====================

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

    // ==================== تهيئة أنظمة التصحيح ====================

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

    // ==================== تهيئة أوضاع العمال ====================

    initWorkerModes() {
        try {
            this.workerMode = new WorkerMode(this);
            this.foremanMode = new ForemanMode(this);
            this.mobileWorkerMode = new MobileWorkerMode(this);
            this.workerMarkers = new WorkerMarkers(this.scene);
            console.log('✅ Worker modes initialized');
        } catch (error) {
            console.warn('⚠️ Worker modes not available');
        }
    }

    // ==================== الإضاءة ====================

    setupLights() {
        try {
            // إضاءة محيطة
            const ambientLight = new THREE.AmbientLight(0x404060);
            this.scene.add(ambientLight);
            
            // إضاءة شمسية رئيسية
            const sunLight = new THREE.DirectionalLight(0xfff5e6, 1.5);
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
            
            // نقاط إضاءة إضافية
            const pointLight1 = new THREE.PointLight(0xffaa44, 0.5, 30);
            pointLight1.position.set(5, 5, 5);
            this.scene.add(pointLight1);
            
            const pointLight2 = new THREE.PointLight(0x44aaff, 0.3, 30);
            pointLight2.position.set(-5, 3, -5);
            this.scene.add(pointLight2);
            
            console.log('✅ Lights setup');
        } catch (error) {
            console.error('❌ فشل إعداد الإضاءة:', error);
        }
    }

    // ==================== الشبكة الأرضية ====================

    setupGrid() {
        try {
            // شبكة رئيسية
            const gridHelper = new THREE.GridHelper(200, 40, 0x88aaff, 0x335588);
            gridHelper.position.y = 0;
            this.scene.add(gridHelper);
            
            // شبكة ثانوية دقيقة
            const detailGrid = new THREE.GridHelper(50, 50, 0x44aaff, 0x224466);
            detailGrid.position.y = 0.01;
            this.scene.add(detailGrid);
            
            // محاور الإحداثيات
            const axesHelper = new THREE.AxesHelper(20);
            this.scene.add(axesHelper);
            
            console.log('✅ Grid setup');
        } catch (error) {
            console.error('❌ فشل إعداد الشبكة:', error);
        }
    }

    // ==================== الأحداث ====================

    setupEvents() {
        window.addEventListener('resize', () => this.onResize());
        
        if (this.renderer?.domElement) {
            this.renderer.domElement.addEventListener('click', (e) => this.onClick(e));
            this.renderer.domElement.addEventListener('mousemove', (e) => this.onMouseMove(e));
            this.renderer.domElement.addEventListener('dblclick', (e) => this.onDoubleClick(e));
        }
        
        window.addEventListener('keydown', (e) => this.onKeyDown(e));
        window.addEventListener('keyup', (e) => this.onKeyUp(e));
        
        console.log('✅ Events setup');
    }

    onClick(e) {
        // حساب موقع النقر
        const mouse = new THREE.Vector2();
        mouse.x = (e.clientX / this.renderer.domElement.clientWidth) * 2 - 1;
        mouse.y = -(e.clientY / this.renderer.domElement.clientHeight) * 2 + 1;
        
        const raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(mouse, this.camera);
        
        // فحص العناصر
        const intersects = raycaster.intersectObjects(this.scene.children);
        
        if (intersects.length > 0) {
            const selected = intersects[0].object;
            
            if (selected.userData && selected.userData.type === '360image') {
                console.log('🖼️ صورة 360:', selected.userData);
                this.calibrationUI.show(selected.userData.sceneId);
            }
            
            if (selected.userData && selected.userData.data) {
                this.propertiesPanel.show(selected.userData.data);
            }
        }
    }

onDoubleClick(e) {
        // تكبير على العنصر
        const mouse = new THREE.Vector2();
        mouse.x = (e.clientX / this.renderer.domElement.clientWidth) * 2 - 1;
        mouse.y = -(e.clientY / this.renderer.domElement.clientHeight) * 2 + 1;
        
        const raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(mouse, this.camera);
        
        const intersects = raycaster.intersectObjects(this.scene.children);
        
        if (intersects.length > 0) {
            const point = intersects[0].point;
            this.camera.position.copy(point.clone().add(new THREE.Vector3(2, 1, 2)));
            this.controls.target.copy(point);
        }
    }

    onMouseMove(e) {
        // تحديث مؤشر الماوس
        if (this.distanceTool?.active) {
            this.distanceTool.onMouseMove(e);
        }
    }

    onKeyDown(e) {
        switch(e.key) {
            case 'Escape':
                this.calibrationUI?.hide();
                this.distanceTool?.deactivate();
                this.areaTool?.deactivate();
                break;
            case 'F2':
                this.debugLayer?.toggle();
                break;
            case 'F3':
                this.analytics?.toggle();
                break;
            case 'c':
                if (e.ctrlKey) {
                    this.calibrationUI?.show();
                }
                break;
            case 'm':
                this.distanceTool?.toggle();
                break;
        }
    }

    onKeyUp(e) {
        // يمكن إضافة منطق هنا
    }

    onResize() {
        if (this.camera) {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
        }
        if (this.renderer) {
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        }
        if (this.composer) {
            this.composer.setSize(window.innerWidth, window.innerHeight);
        }
        if (this.labelRenderer) {
            this.labelRenderer.setSize(window.innerWidth, window.innerHeight);
        }
    }

    // ==================== إنشاء مشهد تجريبي ====================

    createDemoScene() {
        try {
            // إنشاء بعض العناصر التجريبية
            this.createDemoElements();
            
            // إنشاء مشاهد افتراضية
            this.createDemoScenes();
            
            console.log('✅ Demo scene created');
        } catch (error) {
            console.warn('⚠️ Could not create demo scene:', error);
        }
    }

    createDemoElements() {
        // مكعب مركزي
        const geometry = new THREE.BoxGeometry(2, 2, 2);
        const material = new THREE.MeshStandardMaterial({ 
            color: 0xffaa44,
            emissive: 0x442200,
            roughness: 0.3,
            metalness: 0.1
        });
        const cube = new THREE.Mesh(geometry, material);
        cube.position.set(0, 1, 0);
        cube.castShadow = true;
        cube.receiveShadow = true;
        cube.userData = { type: 'demo', name: 'مكعب تجريبي' };
        this.scene.add(cube);
        
        // كرة زجاجية
        const sphereGeo = new THREE.SphereGeometry(0.5, 32, 32);
        const sphereMat = new THREE.MeshStandardMaterial({ 
            color: 0x44aaff,
            emissive: 0x112244,
            roughness: 0.2,
            metalness: 0.8,
            transparent: true,
            opacity: 0.9
        });
        const sphere = new THREE.Mesh(sphereGeo, sphereMat);
        sphere.position.set(2, 0.5, 2);
        sphere.castShadow = true;
        sphere.receiveShadow = true;
        this.scene.add(sphere);
        
        // أسطوانة
        const cylinderGeo = new THREE.CylinderGeometry(0.4, 0.4, 1.5, 16);
        const cylinderMat = new THREE.MeshStandardMaterial({ color: 0x88cc88 });
        const cylinder = new THREE.Mesh(cylinderGeo, cylinderMat);
        cylinder.position.set(-2, 0.75, -2);
        cylinder.castShadow = true;
        cylinder.receiveShadow = true;
        this.scene.add(cylinder);
    }

    createDemoScenes() {
        // إنشاء مشاهد افتراضية
        this.sceneConnector.addScene('scene_001', { x: 0, y: 0, z: 0 }, 0);
        this.sceneConnector.addScene('scene_002', { x: 20, y: 0, z: 0 }, 0);
        this.sceneConnector.addScene('scene_003', { x: 40, y: 0, z: 10 }, 0);
        
        // ربط المشاهد
        this.realityBridge.createLink('scene_001', 'scene_002', { x: 10, y: 0, z: 0 }, 'door');
        this.realityBridge.createLink('scene_002', 'scene_003', { x: 30, y: 0, z: 5 }, 'hallway');
        
        // بناء الرسم البياني
        this.sceneGraph.buildFromScenes();
    }

    // ==================== دوال استيراد الصور 360 ====================

    async import360Image(imageUrl, sceneName = 'مشهد جديد') {
        try {
            console.log(`🔄 جاري استيراد صورة 360: ${imageUrl}`);
            
            // إنشاء معرف للمشهد
            const sceneId = `scene-${Date.now()}`;
            
            // إضافة المشهد للنظام
            this.sceneConnector.addScene(sceneId, { x: 0, y: 0, z: 0 }, 0);
            
            // تحميل الصورة
            const texture = await this.loadTexture(imageUrl);
            
            // تكوين الصورة لعرض 360
            texture.wrapS = THREE.ClampToEdgeWrapping;
            texture.wrapT = THREE.ClampToEdgeWrapping;
            texture.minFilter = THREE.LinearFilter;
            texture.magFilter = THREE.LinearFilter;
            
            // إنشاء كرة لعرض الصورة
            const geometry = new THREE.SphereGeometry(500, 60, 40);
            const material = new THREE.MeshBasicMaterial({
                map: texture,
                side: THREE.BackSide
            });
            
            const sphere = new THREE.Mesh(geometry, material);
            sphere.userData = {
                type: '360image',
                sceneId: sceneId,
                sceneName: sceneName,
                imageUrl: imageUrl
            };
            
            // حفظ بيانات المشهد
            const sceneData = {
                id: sceneId,
                name: sceneName,
                sphere: sphere,
                texture: texture,
                imageUrl: imageUrl,
                elements: [],
                anchors: [],
                calibration: null,
                created: new Date().toISOString()
            };
            
            this.sceneConnector.setSceneData(sceneId, sceneData);
            
            // إضافة للمشهد
            this.scene.add(sphere);
            
            console.log(`✅ تم استيراد الصورة بنجاح: ${sceneName} (${sceneId})`);
            
            // فتح واجهة المعايرة تلقائياً
            setTimeout(() => {
                if (this.calibrationUI) {
                    this.calibrationUI.show(sceneId);
                }
            }, 500);
            
            return sceneId;
            
        } catch (error) {
            console.error('❌ فشل استيراد الصورة:', error);
            return null;
        }
    }

    loadTexture(imageUrl) {
        return new Promise((resolve, reject) => {
            const loader = new THREE.TextureLoader();
            loader.load(
                imageUrl,
                (texture) => resolve(texture),
                (progress) => console.log(`📥 تحميل: ${Math.round(progress.loaded / progress.total * 100)}%`),
                (error) => reject(error)
            );
        });
    }

    // ==================== دوال معايرة الصور ====================

    async calibrateScene(sceneId, calibrationPoints) {
        try {
            console.log(`🔄 معايرة المشهد ${sceneId}...`);
            
            const sceneData = this.sceneConnector.getSceneData(sceneId);
            if (!sceneData) {
                throw new Error('المشهد غير موجود');
            }
            
            // إضافة نقاط التحكم
            calibrationPoints.forEach(point => {
                this.geoRef.addGCP(
                    { x: point.imageX, y: point.imageY, z: 0 },
                    { x: point.realX, y: point.realY, z: point.realZ || 0 }
                );
            });
            
            // حساب مصفوفة التحويل
            this.geoRef.calculateTransform();
            
            // حفظ معلومات المعايرة
            sceneData.calibration = {
                points: calibrationPoints,
                transform: this.geoRef.transformMatrix,
                error: this.geoRef.calculateErrors ? this.geoRef.calculateErrors() : 0,
                date: new Date().toISOString()
            };
            
            // تحويل العناصر الموجودة
            this.transformSceneElements(sceneId);
            
            const report = this.geoRef.getCalibrationReport();
            console.log('✅ تمت المعايرة بنجاح', report);
            
            return report;
            
        } catch (error) {
            console.error('❌ فشل المعايرة:', error);
            return null;
        }
    }

    transformSceneElements(sceneId) {
        const sceneData = this.sceneConnector.getSceneData(sceneId);
        if (!sceneData || !sceneData.elements) return;
        
        sceneData.elements.forEach(element => {
            if (element.position) {
                const worldPos = this.geoRef.photoToWorld(element.position);
                element.worldPosition = worldPos;
                
                if (element.mesh) {
                    element.mesh.position.set(worldPos.x, worldPos.y, worldPos.z);
                }
            }
        });
    }

    // ==================== دوال ربط المشاهد ====================

    linkScenes(sceneId1, sceneId2, connectionPoint, linkType = 'door', options = {}) {
        try {
            // إنشاء الرابط
            const link = this.realityBridge.createLink(
                sceneId1,
                sceneId2,
                connectionPoint,
                linkType,
                options
            );
            
            // إنشاء تمثيل مرئي للرابط
            this.createLinkVisualization(link);
            
            console.log(`✅ تم ربط المشاهد: ${sceneId1} ↔ ${sceneId2} (${linkType})`);
            
            return link;
            
        } catch (error) {
            console.error('❌ فشل ربط المشاهد:', error);
            return null;
        }
    }

    createLinkVisualization(link) {
        const geometry = new THREE.SphereGeometry(0.3, 8, 8);
        const material = new THREE.MeshStandardMaterial({ 
            color: link.type === 'door' ? 0x44aa44 : 0xaaaa44,
            emissive: 0x112211
        });
        
        const marker = new THREE.Mesh(geometry, material);
        marker.position.set(link.position.x, link.position.y, link.position.z);
        marker.userData = { type: 'link', linkId: link.id };
        
        this.scene.add(marker);
        
        // إضافة نص
        const div = document.createElement('div');
        div.textContent = link.type === 'door' ? '🚪' : '🔗';
        div.style.color = 'white';
        div.style.fontSize = '24px';
        div.style.textShadow = '2px 2px 2px black';
        
        const label = new CSS2DObject(div);
        label.position.copy(marker.position.clone().add(new THREE.Vector3(0, 0.5, 0)));
        this.scene.add(label);
    }

    // ==================== دوال إنشاء العناصر على الصور ====================

    addElementToScene(sceneId, type, options = {}) {
        try {
            const sceneData = this.sceneConnector.getSceneData(sceneId);
            if (!sceneData) throw new Error('المشهد غير موجود');
            
            // إنشاء العنصر حسب النوع
            let element;
            let ElementClass;
            
            switch(type) {
                case 'wall':
                    ElementClass = Wall;
                    element = new ElementClass(options);
                    break;
                case 'door':
                    ElementClass = Door;
                    element = new ElementClass(options);
                    break;
                case 'window':
                    ElementClass = Window;
                    element = new ElementClass(options);
                    break;
                case 'column':
                    ElementClass = Column;
                    element = new ElementClass(options);
                    break;
                case 'beam':
                    ElementClass = Beam;
                    element = new ElementClass(options);
                    break;
                default:
                    throw new Error(`نوع عنصر غير معروف: ${type}`);
            }
            
            // إنشاء المجسم
            const mesh = element.createMesh();
            
            // حساب الموقع في العالم الحقيقي إذا كانت الصورة معايرة
            if (sceneData.calibration && options.position) {
                const worldPos = this.geoRef.photoToWorld(options.position);
                mesh.position.set(worldPos.x, worldPos.y, worldPos.z);
                options.worldPosition = worldPos;
            } else if (options.position) {
                mesh.position.set(options.position.x, options.position.y, options.position.z);
            }
            
            // إضافة للمشهد
            this.scene.add(mesh);
            
            // حفظ بيانات العنصر
            const elementData = {
                id: `element-${Date.now()}-${Math.random()}`,
                type: type,
                options: options,
                element: element,
                mesh: mesh,
                position: options.position,
                worldPosition: options.worldPosition,
                created: new Date().toISOString()
            };
            
            if (!sceneData.elements) sceneData.elements = [];
            sceneData.elements.push(elementData);
            
            // ربط مع النظام العالمي
            if (this.globalSystem) {
                const globalId = this.globalSystem.createEntity(type, options);
                this.globalSystem.addElementToScene(globalId, sceneId, elementData);
            }
            
            console.log(`✅ تم إضافة ${type} إلى المشهد ${sceneId}`);
            
            return elementData;
            
        } catch (error) {
            console.error('❌ فشل إضافة عنصر:', error);
            return null;
        }
    }

// ==================== دوال حساب الكميات ====================

    generateBOQ() {
        try {
            // حساب الكميات من جميع المشاهد
            const scenes = this.sceneConnector.getAllScenes();
            const boq = {
                project: this.projectManager?.getCurrentProject()?.name || 'مشروع غير مسمى',
                date: new Date().toLocaleDateString('ar-SA'),
                scenes: {},
                totals: {
                    walls: { count: 0, volume: 0, area: 0 },
                    doors: { count: 0, area: 0 },
                    windows: { count: 0, area: 0 },
                    columns: { count: 0, volume: 0 },
                    beams: { count: 0, volume: 0 }
                }
            };
            
            scenes.forEach(sceneId => {
                const sceneData = this.sceneConnector.getSceneData(sceneId);
                if (!sceneData || !sceneData.elements) return;
                
                boq.scenes[sceneId] = {
                    name: sceneData.name || sceneId,
                    elements: []
                };
                
                sceneData.elements.forEach(element => {
                    if (element.element && element.element.getBOQ) {
                        const elementBOQ = element.element.getBOQ();
                        boq.scenes[sceneId].elements.push(elementBOQ);
                        
                        // تحديث المجاميع
                        switch(element.type) {
                            case 'wall':
                                boq.totals.walls.count++;
                                boq.totals.walls.volume += parseFloat(elementBOQ.حجم) || 0;
                                boq.totals.walls.area += parseFloat(elementBOQ.مساحة) || 0;
                                break;
                            case 'door':
                                boq.totals.doors.count++;
                                break;
                            case 'column':
                                boq.totals.columns.count++;
                                boq.totals.columns.volume += parseFloat(elementBOQ.حجم_الخرسانة) || 0;
                                break;
                        }
                    }
                });
            });
            
            // تقرير مفصل
            const report = this.boqReporter.generateDetailed(boq);
            console.log('📊 تقرير الكميات:', boq);
            
            return boq;
            
        } catch (error) {
            console.error('❌ فشل حساب الكميات:', error);
            return null;
        }
    }

    // ==================== دوال التصدير ====================

    exportProject(format = 'json') {
        try {
            const projectData = {
                version: '3.0.0',
                project: this.projectManager?.getCurrentProject(),
                scenes: this.sceneConnector.getAllScenes().map(sceneId => {
                    const data = this.sceneConnector.getSceneData(sceneId);
                    return {
                        id: sceneId,
                        name: data.name,
                        imageUrl: data.imageUrl,
                        calibration: data.calibration,
                        elements: data.elements?.map(e => ({
                            type: e.type,
                            options: e.options,
                            position: e.position,
                            worldPosition: e.worldPosition
                        }))
                    };
                }),
                links: this.realityBridge?.getAllLinks(),
                boq: this.generateBOQ(),
                exportedAt: new Date().toISOString()
            };
            
            if (format === 'json') {
                const json = JSON.stringify(projectData, null, 2);
                this.downloadFile('project.json', json, 'application/json');
            } else if (format === 'csv') {
                const csv = this.boqExporter.exportToCSV();
                this.downloadFile('boq.csv', csv, 'text/csv');
            }
            
            console.log('✅ تم تصدير المشروع بنجاح');
            
            return projectData;
            
        } catch (error) {
            console.error('❌ فشل تصدير المشروع:', error);
            return null;
        }
    }

    downloadFile(filename, content, type) {
        const blob = new Blob([content], { type });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = filename;
        link.click();
        URL.revokeObjectURL(link.href);
    }

    // ==================== حلقة الحركة ====================

    animate() {
        requestAnimationFrame(() => this.animate());
        
        // تحديث التحكم
        if (this.controls) {
            this.controls.update();
        }
        
        // تحديث أنظمة LOD
        if (this.lodManager) {
            this.lodManager.update();
        }
        
        if (this.tileLODManager) {
            this.tileLODManager.update();
        }
        
        // تحديث أدوات القياس
        if (this.distanceTool?.active) {
            this.distanceTool.update();
        }
        
        // الرندر باستخدام المؤثرات
        if (this.composer && this.scene && this.camera) {
            this.composer.render();
        } else if (this.renderer && this.scene && this.camera) {
            this.renderer.render(this.scene, this.camera);
        }
        
        // رندر النصوص
        if (this.labelRenderer && this.scene && this.camera) {
            this.labelRenderer.render(this.scene, this.camera);
        }
    }

    // ==================== دوال مساعدة ====================

    getSystemStatus() {
        return {
            version: '3.0.0',
            name: 'ACTUAL CONSTRUCTION OS',
            type: 'Reality-BIM Engine for 360 Images',
            status: 'running',
            stats: {
                scenes: this.sceneConnector?.getAllScenes()?.length || 0,
                elements: this.scene?.children?.length || 0,
                loader: this.loader?.getDetailedStats?.() || {},
                bridge: {
                    anchors: this.realityBridge?.anchors?.size || 0,
                    markers: this.realityBridge?.markers?.size || 0,
                    links: this.realityBridge?.links?.size || 0
                },
                graph: {
                    nodes: this.sceneGraph?.nodes?.size || 0,
                    edges: this.sceneGraph?.edges?.length || 0
                },
                analytics: this.analytics?.getPerformanceReport?.() || {}
            }
        };
    }
}

// =======================================
// 🚀 تشغيل التطبيق
// =======================================

window.addEventListener('load', async () => {
    console.log('%c========================================', 'color: #ffaa44');
    console.log('%c🌟 ACTUAL CONSTRUCTION OS - Reality-BIM Engine v3.0', 'color: #ffaa44; font-size: 18px; font-weight: bold;');
    console.log('%c🏗️ منصة متكاملة لصور 360 والمخططات الهندسية', 'color: #88aaff; font-size: 14px;');
    console.log('%c========================================', 'color: #ffaa44');

    try {
        // إخفاء شاشة التحميل
        const loading = document.getElementById('loading');
        if (loading) {
            setTimeout(() => {
                loading.style.opacity = '0';
                setTimeout(() => {
                    loading.style.display = 'none';
                }, 500);
            }, 2000);
        }

        // إنشاء التطبيق
        console.log('🔄 جاري إنشاء التطبيق...');
        window.app = new ActualConstructionOS();

        if (!window.app) {
            throw new Error('فشل إنشاء التطبيق');
        }

        console.log('✅ تم إنشاء التطبيق بنجاح');
        
        // إضافة دوال مساعدة للـ Console
        window.importImage = (url, name) => window.app.import360Image(url, name);
        window.calibrate = (sceneId, points) => window.app.calibrateScene(sceneId, points);
        window.linkScenes = (id1, id2, point, type) => window.app.linkScenes(id1, id2, point, type);
        window.addWall = (sceneId, pos) => window.app.addElementToScene(sceneId, 'wall', { position: pos });
        window.addDoor = (sceneId, pos) => window.app.addElementToScene(sceneId, 'door', { position: pos });
        window.boq = () => window.app.generateBOQ();
        window.export = (format) => window.app.exportProject(format);
        window.status = () => window.app.getSystemStatus();
        
        console.log('');
        console.log('%c📋 الأوامر المتاحة:', 'color: #88aaff; font-weight: bold;');
        console.log('  📥 importImage("url.jpg", "اسم المشهد") - استيراد صورة 360');
        console.log('  📐 calibrate("sceneId", points) - معايرة المشهد');
        console.log('  🔗 linkScenes("id1", "id2", point, "door") - ربط مشاهد');
        console.log('  🧱 addWall("sceneId", {x,y,z}) - إضافة جدار');
        console.log('  🚪 addDoor("sceneId", {x,y,z}) - إضافة باب');
        console.log('  📊 boq() - عرض جدول الكميات');
        console.log('  💾 export("json") - تصدير المشروع');
        console.log('  📈 status() - حالة النظام');
        console.log('');
        console.log('%c🔧 اختصارات لوحة المفاتيح:', 'color: #ffaa44');
        console.log('  • F2 - إظهار/إخفاء Debug Layer');
        console.log('  • F3 - إظهار/إخفاء Analytics');
        console.log('  • Ctrl+C - فتح معالج المعايرة');
        console.log('  • M - تفعيل أداة القياس');

    } catch (error) {
        console.error('❌ فشل تشغيل التطبيق:', error);

        // عرض رسالة خطأ للمستخدم
        const errorDiv = document.createElement('div');
        errorDiv.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(200, 50, 50, 0.95);
            color: white;
            padding: 25px;
            border-radius: 15px;
            z-index: 10000;
            font-family: system-ui, sans-serif;
            text-align: center;
            box-shadow: 0 10px 30px rgba(0,0,0,0.5);
            border: 2px solid #ff8888;
            max-width: 400px;
            backdrop-filter: blur(5px);
        `;
        errorDiv.innerHTML = `
            <h2 style="margin:0 0 15px 0; color:#ffaa44;">❌ خطأ في التشغيل</h2>
            <p style="margin:10px 0;">${error.message}</p>
            <p style="font-size:12px; opacity:0.8; margin:15px 0;">تأكد من تحميل جميع الملفات بشكل صحيح</p>
            <button onclick="this.parentElement.remove(); location.reload()" style="
                background: #4a6c8f;
                color: white;
                border: none;
                padding: 8px 20px;
                border-radius: 5px;
                cursor: pointer;
                font-size: 14px;
                transition: 0.2s;
            ">إعادة تحميل</button>
        `;
        document.body.appendChild(errorDiv);
    }
});

// دوال مساعدة للـ Console
window.restartApp = () => {
    console.log('🔄 إعادة تشغيل التطبيق...');
    if (window.app?.dispose) {
        window.app.dispose();
    }
    delete window.app;
    location.reload();
};

window.getSystemInfo = () => ({
    version: '3.0.0',
    name: 'ACTUAL CONSTRUCTION OS',
    type: 'Reality-BIM Engine for 360 Images',
    browser: navigator.userAgent,
    url: window.location.href,
    timestamp: new Date().toISOString()
});

// تصدير للاستخدام
window.ActualConstructionOS = ActualConstructionOS;

console.log('📌 يمكنك استخدام:');
console.log('   • window.restartApp() - إعادة تشغيل التطبيق');
console.log('   • window.getSystemInfo() - معلومات النظام');
console.log('   • window.app - الوصول إلى التطبيق');

