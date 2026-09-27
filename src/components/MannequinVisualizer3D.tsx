import React, { useState, useRef, useEffect, useCallback } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { OutfitConfig } from '../types/vietphuc';
import { HERITAGE_COLORS, GARMENTS } from '../data/heritageData';
import { ReadyPlayerMeModal } from './ReadyPlayerMeModal';
import { 
  IconViet3D, 
  IconVietOrbit, 
  IconVietLighting, 
  IconVietFocus,
  IconVietGarment
} from './VietIcons';
import { Bot, Sparkles, RotateCw, ZoomIn, ZoomOut, Check, Compass, Eye, Sun, Moon, Flame, Maximize2, ShieldCheck, UserPlus, RefreshCw } from 'lucide-react';

export type LightingMode = 'studio' | 'sunset' | 'lantern' | 'moonlight';
export type StudioAngle = 0 | 45 | 180 | -45;
export type MacroFocus = 'full' | 'collar' | 'sleeves' | 'belt' | 'back';

export interface AIActionDirective {
  type: 'rotate' | 'focus' | 'lighting' | 'pose' | 'apply';
  value: any;
  message?: string;
  source?: 'ai' | 'offline';
}

interface MannequinVisualizer3DProps {
  config: OutfitConfig;
  className?: string;
  isZoomed?: boolean;
  onUpdateConfig?: (patch: Partial<OutfitConfig>) => void;
  aiDirective?: AIActionDirective | null;
  onClearDirective?: () => void;
  onRequestAISuggestion?: (topic: string) => void;
}

// Cultural Annotation Guide for Macro Focus in 3D Space
const CULTURAL_ANNOTATIONS: Record<MacroFocus, { title: string; subtitle: string; desc: string; source: string }> = {
  full: {
    title: 'Avatar 3D Đa Giác Thực Tế (Three.js WebGL)',
    subtitle: 'Nhân vật 3D chân thực tôn vinh Cổ Phục',
    desc: 'Mô hình 3D thực với khung xương và lưới đa giác, hỗ trợ xoay tự do 360 độ, nguồn sáng đổ bóng động và chất liệu lụa PBR Việt Nam.',
    source: 'Ready Player Me 3D Avatar Engine & Bảo tàng Cổ vật Cung đình Huế'
  },
  collar: {
    title: 'Cận Cảnh 3D: Cổ Áo & Hàng 5 Khuy Ngũ Thường',
    subtitle: 'Nẹp Hữu Nhậm Lượn Cánh Cung Chuẩn Việt',
    desc: 'Ống kính 3D hội tụ vào nẹp cổ áo Lập Lĩnh. Hàng 5 khuy cúc đồng (Nhân, Nghĩa, Lễ, Trí, Tín) uốn lượn sang nách phải theo đúng phong cách may đo Đại Việt.',
    source: 'Trần Quang Đức, "Ngàn năm áo mũ" (2013)'
  },
  sleeves: {
    title: 'Cận Cảnh 3D: Ống Tay Thụng & Nếp Gấp Lụa Vạn Phúc',
    subtitle: 'Chiều sâu khối thể tích 3D của tay áo',
    desc: 'Không gian 3D thể hiện rõ độ rủ của ống tay thụng Áo Tấc, viền ngũ sắc triều Nguyễn trên Áo Nhật Bình và nếp gấp lụa tơ tằm mềm mại.',
    source: 'Đoàn Thị Tình, "Trang phục Việt Nam" (2006)'
  },
  belt: {
    title: 'Cận Cảnh 3D: Đai Ngọc Hoàng Triều & Bao Ruột Tượng',
    subtitle: 'Phụ kiện thắt lưng cung đình và dân gian',
    desc: 'Khối 3D của đai ngọc đính các phiến ngọc chữ nhật thời Lý - Trần và dải lụa thắt buông rủ phía trước bụng.',
    source: 'Hoàng thành Thăng Long & Chùa Phật Tích'
  },
  back: {
    title: 'Cận Cảnh 3D: Đường Sống Lưng Áo & Búi Tóc Cài Trâm',
    subtitle: 'Khảo sát mặt sau của trang phục di sản',
    desc: 'Camera 3D xoay 180 độ ra phía sau lưng để chiêm ngưỡng đường sống lưng áo thẳng tắp và búi tóc củ tỏi cổ truyền.',
    source: 'Hội Di Sản Văn Hóa Việt Nam'
  }
};

export const MannequinVisualizer3D: React.FC<MannequinVisualizer3DProps> = ({
  config,
  className = '',
  isZoomed = false,
  onUpdateConfig,
  aiDirective,
  onClearDirective,
  onRequestAISuggestion
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const selectedColor = HERITAGE_COLORS.find(c => c.id === config.colorId) || HERITAGE_COLORS[0];
  const selectedGarment = GARMENTS.find(g => g.id === config.garmentId) || GARMENTS[0];

  // State
  const [avatarUrl, setAvatarUrl] = useState<string>('/models/avatar-default.glb');
  const [isRPMModalOpen, setIsRPMModalOpen] = useState(false);
  const [isLoadingModel, setIsLoadingModel] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [currentAngle, setCurrentAngle] = useState<StudioAngle>(0);
  const [macroFocus, setMacroFocus] = useState<MacroFocus>('full');
  const [lightingMode, setLightingMode] = useState<LightingMode>('sunset');
  const [activeSpeech, setActiveSpeech] = useState<string | null>(null);
  const [isAutoOrbit, setIsAutoOrbit] = useState(false);

  // Three.js instances ref
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const avatarModelRef = useRef<THREE.Group | null>(null);
  const pedestalGroupRef = useRef<THREE.Group | null>(null);
  const lightsRef = useRef<{
    dirLight: THREE.DirectionalLight;
    ambientLight: THREE.AmbientLight;
    rimLight: THREE.DirectionalLight;
    pointLight1: THREE.PointLight;
    pointLight2: THREE.PointLight;
    hemiLight: THREE.HemisphereLight;
  } | null>(null);
  const animFrameIdRef = useRef<number | null>(null);

  // Helper colors
  const primaryHex = config.customColorHex || selectedColor.hex;

  // 1. Initialize Three.js WebGL Scene
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth || 480;
    const height = container.clientHeight || 640;

    // Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Camera framed on full avatar
    const camera = new THREE.PerspectiveCamera(36, width / height, 0.05, 30);
    camera.position.set(0, 1.10, 2.35);
    cameraRef.current = camera;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    rendererRef.current = renderer;
    renderer.domElement.style.position = 'absolute';
    renderer.domElement.style.inset = '0';
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    container.appendChild(renderer.domElement);

    // OrbitControls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.target.set(0, 0.95, 0);
    controls.maxPolarAngle = Math.PI / 2 + 0.15;
    controls.minDistance = 0.35;
    controls.maxDistance = 4.0;
    controlsRef.current = controls;

    // 3D BRONZE DRUM PEDESTAL (Bục Đồng Đông Sơn 3D)
    const pedestalGroup = new THREE.Group();
    pedestalGroupRef.current = pedestalGroup;

    const cylGeo = new THREE.CylinderGeometry(0.50, 0.54, 0.08, 64);
    const cylMat = new THREE.MeshStandardMaterial({
      color: 0x92400e,
      roughness: 0.32,
      metalness: 0.85
    });
    const pedestalMesh = new THREE.Mesh(cylGeo, cylMat);
    pedestalMesh.position.y = -0.04;
    pedestalMesh.receiveShadow = true;
    pedestalGroup.add(pedestalMesh);

    // Golden ring border
    const ringGeo = new THREE.TorusGeometry(0.50, 0.012, 16, 64);
    const ringMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.2, metalness: 0.9 });
    const ringMesh = new THREE.Mesh(ringGeo, ringMat);
    ringMesh.rotation.x = Math.PI / 2;
    ringMesh.position.y = 0;
    pedestalGroup.add(ringMesh);

    // Ground Shadow Plane
    const shadowGeo = new THREE.PlaneGeometry(2.5, 2.5);
    const shadowMat = new THREE.ShadowMaterial({ opacity: 0.4 });
    const shadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
    shadowMesh.rotation.x = -Math.PI / 2;
    shadowMesh.position.y = -0.041;
    shadowMesh.receiveShadow = true;
    pedestalGroup.add(shadowMesh);

    pedestalGroup.position.set(0, 0, 0);
    scene.add(pedestalGroup);

    // Bright Studio Lighting
    const ambientLight = new THREE.AmbientLight(0xfff8ee, 2.2);
    scene.add(ambientLight);

    const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444, 1.5);
    scene.add(hemiLight);

    const dirLight = new THREE.DirectionalLight(0xfffbeb, 3.2);
    dirLight.position.set(1.2, 2.8, 2.2);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 1024;
    dirLight.shadow.mapSize.height = 1024;
    scene.add(dirLight);

    const rimLight = new THREE.DirectionalLight(0xfef08a, 2.0);
    rimLight.position.set(-1.0, 2.2, -1.8);
    scene.add(rimLight);

    const pointLight1 = new THREE.PointLight(0xf59e0b, 1.8, 5);
    pointLight1.position.set(-0.8, 1.5, 1.2);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0xef4444, 1.0, 5);
    pointLight2.position.set(0.8, 1.2, 1.2);
    scene.add(pointLight2);

    lightsRef.current = { dirLight, ambientLight, rimLight, pointLight1, pointLight2, hemiLight };

    // Resize Handler
    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      const w = container.clientWidth || 480;
      const h = container.clientHeight || 640;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    // Render loop
    const animate = () => {
      animFrameIdRef.current = requestAnimationFrame(animate);
      controls.update();

      // Subtle breathing motion
      if (avatarModelRef.current) {
        const time = Date.now() * 0.0018;
        avatarModelRef.current.position.y = Math.sin(time) * 0.002;
      }

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current);
      renderer.dispose();
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  // 2. Load 3D Model when avatarUrl changes
  useEffect(() => {
    if (!sceneRef.current) return;
    setIsLoadingModel(true);
    setLoadingProgress(20);

    const loader = new GLTFLoader();
    loader.load(
      avatarUrl,
      (gltf) => {
        if (!sceneRef.current) return;

        // Remove old model if present
        if (avatarModelRef.current) {
          sceneRef.current.remove(avatarModelRef.current);
        }

        const model = gltf.scene;
        avatarModelRef.current = model;

        // Position avatar feet directly onto the Bronze Drum pedestal top (Y = 0)
        model.position.set(0, 0, 0);

        // Enable shadows, hide modern accessories, and apply PBR Silk shader to garments
        model.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            const mesh = child as THREE.Mesh;
            mesh.castShadow = true;
            mesh.receiveShadow = true;

            // Hide modern accessories like glasses
            if (mesh.name === 'Wolf3D_Glasses') {
              mesh.visible = false;
              return;
            }

            // Upper Garment (Áo Cổ Phục / Top Outfit)
            if (mesh.name === 'Wolf3D_Outfit_Top') {
              const silkMat = new THREE.MeshStandardMaterial({
                color: new THREE.Color(primaryHex),
                roughness: 0.42,
                metalness: 0.08,
                map: (mesh.material as any)?.map || null,
              });
              mesh.material = silkMat;
              mesh.material.needsUpdate = true;
            } else if (mesh.name === 'Wolf3D_Outfit_Bottom') {
              // Traditional White/Cream Silk Trousers (Quần Bạch La)
              const lowerMat = new THREE.MeshStandardMaterial({
                color: new THREE.Color(0xf5f5f4),
                roughness: 0.48,
                metalness: 0.04,
                map: (mesh.material as any)?.map || null,
              });
              mesh.material = lowerMat;
              mesh.material.needsUpdate = true;
            } else if (mesh.material) {
              // Natural Skin / Hair / Eyes - preserve photo textures
              const mat = mesh.material as THREE.MeshStandardMaterial;
              mat.roughness = 0.55;
              mat.metalness = 0.02;
              mat.needsUpdate = true;
            }
          }
        });

        sceneRef.current.add(model);
        setIsLoadingModel(false);
      },
      (xhr) => {
        if (xhr.total > 0) {
          setLoadingProgress(Math.round((xhr.loaded / xhr.total) * 100));
        }
      },
      (err) => {
        console.error('Error loading 3D avatar:', err);
        setIsLoadingModel(false);
      }
    );
  }, [avatarUrl, primaryHex]);

  // 3. Update Heritage Lighting & Dynamic Garment Colors
  useEffect(() => {
    if (!lightsRef.current) return;
    const { dirLight, ambientLight, rimLight, pointLight1, pointLight2, hemiLight } = lightsRef.current;

    // Apply primaryHex to rim and accent light
    rimLight.color.set(primaryHex);
    pointLight1.color.set(primaryHex);

    // Dynamically update upper garment color when user selects another heritage shade
    if (avatarModelRef.current) {
      avatarModelRef.current.traverse((child) => {
        if ((child as THREE.Mesh).isMesh && child.name === 'Wolf3D_Outfit_Top') {
          const mesh = child as THREE.Mesh;
          const mat = mesh.material as THREE.MeshStandardMaterial;
          if (mat && mat.color) {
            mat.color.set(primaryHex);
            mat.needsUpdate = true;
          }
        }
      });
    }

    switch (lightingMode) {
      case 'sunset':
        ambientLight.color.setHex(0xfef3c7);
        ambientLight.intensity = 2.0;
        hemiLight.color.setHex(0xfef08a);
        dirLight.color.setHex(0xf59e0b);
        dirLight.intensity = 3.4;
        rimLight.intensity = 2.2;
        break;
      case 'lantern':
        ambientLight.color.setHex(0xffedd5);
        ambientLight.intensity = 1.8;
        hemiLight.color.setHex(0xfecdd3);
        dirLight.color.setHex(0xf97316);
        dirLight.intensity = 2.8;
        rimLight.intensity = 2.5;
        pointLight2.color.setHex(0xdc2626);
        pointLight2.intensity = 2.0;
        break;
      case 'moonlight':
        ambientLight.color.setHex(0xe0f2fe);
        ambientLight.intensity = 2.0;
        hemiLight.color.setHex(0xbae6fd);
        dirLight.color.setHex(0x38bdf8);
        dirLight.intensity = 2.6;
        rimLight.intensity = 1.8;
        break;
      case 'studio':
      default:
        ambientLight.color.setHex(0xffffff);
        ambientLight.intensity = 2.2;
        hemiLight.color.setHex(0xffffff);
        dirLight.color.setHex(0xffffff);
        dirLight.intensity = 3.2;
        rimLight.intensity = 1.4;
        break;
    }
  }, [lightingMode, primaryHex]);

  // 4. Smooth Camera Movement Helper (3D Interpolation)
  const tweenCameraTo = useCallback((targetPos: THREE.Vector3, targetLookAt: THREE.Vector3, duration = 600) => {
    const camera = cameraRef.current;
    const controls = controlsRef.current;
    if (!camera || !controls) return;

    const startPos = camera.position.clone();
    const startLookAt = controls.target.clone();
    const startTime = performance.now();

    const updateTween = (time: number) => {
      const elapsed = time - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const ease = progress < 0.5 ? 4 * progress * progress * progress : 1 - Math.pow(-2 * progress + 2, 3) / 2;

      camera.position.lerpVectors(startPos, targetPos, ease);
      controls.target.lerpVectors(startLookAt, targetLookAt, ease);
      controls.update();

      if (progress < 1) {
        requestAnimationFrame(updateTween);
      }
    };
    requestAnimationFrame(updateTween);
  }, []);

  // 5. Handle Preset Angles and Macro Zoom for Full 3D Body
  const applyStudioAngle = useCallback((angle: StudioAngle) => {
    setCurrentAngle(angle);
    setMacroFocus('full');
    setIsAutoOrbit(false);

    switch (angle) {
      case 0:
        tweenCameraTo(new THREE.Vector3(0, 1.10, 2.35), new THREE.Vector3(0, 0.95, 0));
        break;
      case 45:
        tweenCameraTo(new THREE.Vector3(1.65, 1.10, 1.65), new THREE.Vector3(0, 0.95, 0));
        break;
      case 180:
        tweenCameraTo(new THREE.Vector3(0, 1.10, -2.35), new THREE.Vector3(0, 0.95, 0));
        break;
      case -45:
        tweenCameraTo(new THREE.Vector3(-1.65, 1.10, 1.65), new THREE.Vector3(0, 0.95, 0));
        break;
    }
  }, [tweenCameraTo]);

  const applyMacroFocus = useCallback((focus: MacroFocus) => {
    setMacroFocus(focus);
    setIsAutoOrbit(false);

    switch (focus) {
      case 'collar':
        setCurrentAngle(0);
        tweenCameraTo(new THREE.Vector3(0, 1.50, 0.70), new THREE.Vector3(0, 1.45, 0));
        break;
      case 'sleeves':
        setCurrentAngle(45);
        tweenCameraTo(new THREE.Vector3(0.55, 1.18, 0.80), new THREE.Vector3(0.35, 1.18, 0));
        break;
      case 'belt':
        setCurrentAngle(0);
        tweenCameraTo(new THREE.Vector3(0, 1.02, 0.75), new THREE.Vector3(0, 0.98, 0));
        break;
      case 'back':
        setCurrentAngle(180);
        tweenCameraTo(new THREE.Vector3(0, 1.40, -0.80), new THREE.Vector3(0, 1.35, 0));
        break;
      case 'full':
      default:
        applyStudioAngle(currentAngle);
        break;
    }
  }, [applyStudioAngle, currentAngle, tweenCameraTo]);

  // 6. Handle AI Stylist Directives
  useEffect(() => {
    if (!aiDirective) return;
    if (aiDirective.type === 'rotate') {
      const val = Number(aiDirective.value);
      if (val === 180) applyStudioAngle(180);
      else if (val > 0 && val <= 90) applyStudioAngle(45);
      else if (val < 0) applyStudioAngle(-45);
      else applyStudioAngle(0);
      if (aiDirective.message) setActiveSpeech(aiDirective.message);
    } else if (aiDirective.type === 'lighting') {
      setLightingMode(aiDirective.value);
      if (aiDirective.message) setActiveSpeech(aiDirective.message);
    } else if (aiDirective.type === 'focus') {
      applyMacroFocus(aiDirective.value as MacroFocus);
      if (aiDirective.message) setActiveSpeech(aiDirective.message);
    } else if (aiDirective.type === 'pose') {
      if (aiDirective.value === 'cung-dinh') {
        applyStudioAngle(45);
        setLightingMode('sunset');
      } else if (aiDirective.value === 'si-tu') {
        applyStudioAngle(-45);
        setLightingMode('lantern');
      } else if (aiDirective.value === 'kinh-bac') {
        applyStudioAngle(180);
        setLightingMode('moonlight');
      }
      if (aiDirective.message) setActiveSpeech(aiDirective.message);
    }
  }, [aiDirective, applyMacroFocus, applyStudioAngle]);

  // Auto-Orbit toggle
  useEffect(() => {
    if (controlsRef.current) {
      controlsRef.current.autoRotate = isAutoOrbit;
      controlsRef.current.autoRotateSpeed = 2.0;
    }
  }, [isAutoOrbit]);

  return (
    <div className={`relative w-full aspect-[3/4] max-w-[540px] mx-auto overflow-hidden rounded-2xl shadow-xl border border-stone-200/90 bg-gradient-to-b from-[#1c1917] via-[#141210] to-[#0c0a09] transition-all duration-500 select-none ${className}`}>
      {/* 1. Top Bar: Open Ready Player Me Modal Button */}
      <div className="absolute top-3 left-3 z-20 flex items-center gap-1.5 pointer-events-auto">
        <button
          onClick={() => setIsRPMModalOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-stone-900/90 hover:bg-stone-800 text-amber-300 text-xs font-semibold shadow-md transition-all border border-amber-500/30 hover:scale-105 active:scale-95 cursor-pointer backdrop-blur-md"
          title="Mở trình tạo nhân vật 3D Ready Player Me để tạo mặt/tóc 3D riêng"
        >
          <UserPlus className="w-3.5 h-3.5 text-amber-400" />
          <span className="text-[11px] font-bold">Đổi Avatar 3D</span>
        </button>
      </div>

      {/* 2. Loading Spinner Overlay */}
      {isLoadingModel && (
        <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-stone-950/90 text-white backdrop-blur-sm">
          <RefreshCw className="w-9 h-9 text-amber-400 animate-spin mb-3" />
          <p className="text-sm font-bold text-amber-200">Đang khởi tạo Mô Hình 3D Đa Giác...</p>
          <p className="text-xs text-stone-400 mt-1">Nạp khung xương và chất liệu lụa PBR ({loadingProgress}%)</p>
        </div>
      )}

      {/* 3. AI Stylist Interactive Directive Speech Overlay */}
      {activeSpeech && (
        <div className="absolute top-14 left-3 right-3 z-20 animate-in fade-in slide-in-from-top-2 duration-300 pointer-events-auto">
          <div className="bg-stone-900/90 backdrop-blur-md text-white p-3 rounded-xl border border-amber-500/40 shadow-lg flex items-start gap-2.5">
            <div className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400 shrink-0 mt-0.5">
              <Bot className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold text-amber-300 uppercase tracking-wider">AI Stylist Hướng Dẫn Di Sản</span>
                <button
                  onClick={() => setActiveSpeech(null)}
                  className="text-stone-400 hover:text-white text-xs px-1"
                >
                  ✕
                </button>
              </div>
              <p className="text-xs text-stone-200 mt-0.5 leading-relaxed">
                {activeSpeech}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 4. Cultural Macro Annotation Modal Banner (When Focused) */}
      {macroFocus !== 'full' && (
        <div className="absolute top-14 left-3 right-3 z-20 animate-in fade-in slide-in-from-top-2 duration-300 pointer-events-auto">
          <div className="bg-amber-950/90 backdrop-blur-md text-amber-100 p-3 rounded-xl border border-amber-500/50 shadow-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-amber-400" />
                <span className="text-xs font-bold text-amber-300">{CULTURAL_ANNOTATIONS[macroFocus].title}</span>
              </div>
              <button
                onClick={() => applyMacroFocus('full')}
                className="text-[11px] px-2 py-0.5 rounded-md bg-amber-900/60 hover:bg-amber-800 text-amber-200 border border-amber-700/50"
              >
                Thu Về Toàn Cảnh
              </button>
            </div>
            <p className="text-[11px] text-amber-100/90 mt-1 leading-relaxed">
              {CULTURAL_ANNOTATIONS[macroFocus].desc}
            </p>
            <div className="mt-1.5 pt-1 border-t border-amber-800/40 text-[9px] text-amber-400/80 font-mono flex items-center justify-between">
              <span>{CULTURAL_ANNOTATIONS[macroFocus].source}</span>
              <span className="text-amber-300 font-semibold">{selectedGarment.name}</span>
            </div>
          </div>
        </div>
      )}

      {/* 5. Three.js WebGL Canvas Mount Container */}
      <div
        ref={containerRef}
        className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing flex items-center justify-center touch-none"
      />

      {/* 6. Bottom Floating Toolbar: Macro Focus Tabs, Lighting Modes & 3D Angles */}
      <div className="absolute bottom-3 left-3 right-3 z-20 flex flex-col gap-2 pointer-events-none">
        {/* Row A: Macro Focus Tabs */}
        <div className="flex items-center justify-between gap-1 bg-stone-900/85 backdrop-blur-md p-1 rounded-xl border border-white/15 shadow-lg pointer-events-auto">
          <span className="text-[10px] text-amber-300 font-semibold px-2 flex items-center gap-1">
            <Eye className="w-3 h-3 text-amber-400" />
            Soi 3D:
          </span>
          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
            <button
              onClick={() => applyMacroFocus('full')}
              className={`px-2 py-1 rounded-lg text-[10px] font-medium transition-all shrink-0 ${
                macroFocus === 'full' ? 'bg-amber-500 text-stone-950 font-bold shadow-xs' : 'text-stone-300 hover:text-white hover:bg-white/10'
              }`}
            >
              Toàn Cảnh
            </button>
            <button
              onClick={() => applyMacroFocus('collar')}
              className={`px-2 py-1 rounded-lg text-[10px] font-medium transition-all shrink-0 ${
                macroFocus === 'collar' ? 'bg-amber-500 text-stone-950 font-bold shadow-xs' : 'text-stone-300 hover:text-white hover:bg-white/10'
              }`}
            >
              Cổ Áo & 5 Khuy
            </button>
            <button
              onClick={() => applyMacroFocus('sleeves')}
              className={`px-2 py-1 rounded-lg text-[10px] font-medium transition-all shrink-0 ${
                macroFocus === 'sleeves' ? 'bg-amber-500 text-stone-950 font-bold shadow-xs' : 'text-stone-300 hover:text-white hover:bg-white/10'
              }`}
            >
              Ống Tay
            </button>
            <button
              onClick={() => applyMacroFocus('belt')}
              className={`px-2 py-1 rounded-lg text-[10px] font-medium transition-all shrink-0 ${
                macroFocus === 'belt' ? 'bg-amber-500 text-stone-950 font-bold shadow-xs' : 'text-stone-300 hover:text-white hover:bg-white/10'
              }`}
            >
              Đai Lưng
            </button>
            <button
              onClick={() => applyMacroFocus('back')}
              className={`px-2 py-1 rounded-lg text-[10px] font-medium transition-all shrink-0 ${
                macroFocus === 'back' ? 'bg-amber-500 text-stone-950 font-bold shadow-xs' : 'text-stone-300 hover:text-white hover:bg-white/10'
              }`}
            >
              Sống Lưng
            </button>
          </div>
        </div>

        {/* Row B: 3D Camera Angles & Lighting Modes */}
        <div className="flex items-center justify-between gap-1.5 bg-white/90 backdrop-blur-md px-2.5 py-1.5 rounded-xl border border-stone-200/90 shadow-md pointer-events-auto">
          {/* Angles */}
          <div className="flex items-center gap-1">
            <span className="text-[10px] font-semibold text-stone-500 uppercase tracking-wider pr-1 border-r border-stone-300">
              Góc Xoay:
            </span>
            <button
              onClick={() => applyStudioAngle(0)}
              className={`px-2 py-0.5 rounded-lg text-xs font-medium transition-all ${
                currentAngle === 0 && macroFocus === 'full' ? 'bg-stone-900 text-white shadow-xs' : 'text-stone-700 hover:bg-stone-100'
              }`}
            >
              0°
            </button>
            <button
              onClick={() => applyStudioAngle(45)}
              className={`px-2 py-0.5 rounded-lg text-xs font-medium transition-all ${
                currentAngle === 45 && macroFocus === 'full' ? 'bg-stone-900 text-white shadow-xs' : 'text-stone-700 hover:bg-stone-100'
              }`}
            >
              45°
            </button>
            <button
              onClick={() => applyStudioAngle(180)}
              className={`px-2 py-0.5 rounded-lg text-xs font-medium transition-all ${
                currentAngle === 180 && macroFocus === 'full' ? 'bg-stone-900 text-white shadow-xs' : 'text-stone-700 hover:bg-stone-100'
              }`}
            >
              180°
            </button>
            <button
              onClick={() => applyStudioAngle(-45)}
              className={`px-2 py-0.5 rounded-lg text-xs font-medium transition-all ${
                currentAngle === -45 && macroFocus === 'full' ? 'bg-stone-900 text-white shadow-xs' : 'text-stone-700 hover:bg-stone-100'
              }`}
            >
              -45°
            </button>
          </div>

          {/* Lighting & Auto-Orbit Controls */}
          <div className="flex items-center gap-1 pl-1 border-l border-stone-200">
            <button
              onClick={() => setLightingMode('sunset')}
              className={`p-1 rounded-md transition-colors ${lightingMode === 'sunset' ? 'bg-amber-100 text-amber-900' : 'text-stone-600 hover:bg-stone-100'}`}
              title="Hoàng hôn Cố Đô"
            >
              <Sun className="w-3.5 h-3.5 text-amber-600" />
            </button>
            <button
              onClick={() => setLightingMode('lantern')}
              className={`p-1 rounded-md transition-colors ${lightingMode === 'lantern' ? 'bg-rose-100 text-rose-900' : 'text-stone-600 hover:bg-stone-100'}`}
              title="Đèn lồng Phố Cổ"
            >
              <Flame className="w-3.5 h-3.5 text-rose-600" />
            </button>
            <button
              onClick={() => setLightingMode('moonlight')}
              className={`p-1 rounded-md transition-colors ${lightingMode === 'moonlight' ? 'bg-sky-100 text-sky-900' : 'text-stone-600 hover:bg-stone-100'}`}
              title="Ánh trăng Thăng Long"
            >
              <Moon className="w-3.5 h-3.5 text-sky-600" />
            </button>
            <button
              onClick={() => setIsAutoOrbit(!isAutoOrbit)}
              className={`flex items-center gap-0.5 px-1.5 py-0.5 rounded-md text-[11px] font-semibold transition-colors ${
                isAutoOrbit ? 'bg-emerald-600 text-white' : 'text-stone-700 hover:bg-stone-100'
              }`}
              title="Bật/Tắt xoay tự động"
            >
              <IconVietOrbit size={12} className={isAutoOrbit ? 'animate-spin' : ''} />
              <span>{isAutoOrbit ? 'Dừng' : 'Xoay'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 7. Ready Player Me Customization Modal */}
      <ReadyPlayerMeModal
        isOpen={isRPMModalOpen}
        onClose={() => setIsRPMModalOpen(false)}
        onSelectAvatarUrl={(url) => setAvatarUrl(url)}
        currentAvatarUrl={avatarUrl}
      />
    </div>
  );
};
