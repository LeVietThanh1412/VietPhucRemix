import * as THREE from 'three';
import { OutfitConfig } from '../types/vietphuc';
import { GARMENTS, HERITAGE_COLORS, PATTERNS } from '../data/heritageData';

/**
 * Procedural PBR Silk Texture Generator for Vietnamese Heritage Motifs
 */
export function createVietSilkTexture(
  baseHex: string,
  patternId: string
): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    const fallbackCanvas = document.createElement('canvas');
    fallbackCanvas.width = 16;
    fallbackCanvas.height = 16;
    return new THREE.CanvasTexture(fallbackCanvas);
  }

  // 1. Base silk gradient with fabric grain
  ctx.fillStyle = baseHex;
  ctx.fillRect(0, 0, 512, 512);

  // Subtle silk weave grain
  ctx.fillStyle = 'rgba(255, 255, 255, 0.04)';
  for (let y = 0; y < 512; y += 4) {
    ctx.fillRect(0, y, 512, 1.5);
  }
  ctx.fillStyle = 'rgba(0, 0, 0, 0.03)';
  for (let x = 0; x < 512; x += 4) {
    ctx.fillRect(x, 0, 1.5, 512);
  }

  // 2. Overlay Vietnamese Heritage Patterns (Jacquard Damask effect)
  ctx.save();
  ctx.strokeStyle = 'rgba(255, 230, 180, 0.18)';
  ctx.fillStyle = 'rgba(255, 230, 180, 0.12)';
  ctx.lineWidth = 2.5;

  if (patternId === 'cuc-day-ly') {
    // Ly Dynasty Interlocking Chrysanthemum Vine (Hoa cúc dây uốn lượn thời Lý)
    for (let row = 0; row < 4; row++) {
      const y = row * 128 + 64;
      ctx.beginPath();
      for (let x = 0; x <= 512; x += 32) {
        const offset = Math.sin((x / 64) * Math.PI) * 28;
        if (x === 0) ctx.moveTo(x, y + offset);
        else ctx.lineTo(x, y + offset);
      }
      ctx.stroke();

      // Chrysanthemum rosettes along the vine
      for (let col = 0; col < 4; col++) {
        const cx = col * 128 + 64;
        const cy = y;
        ctx.beginPath();
        ctx.arc(cx, cy, 14, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // 8 petals
        for (let p = 0; p < 8; p++) {
          const angle = (p * Math.PI) / 4;
          const px = cx + Math.cos(angle) * 22;
          const py = cy + Math.sin(angle) * 22;
          ctx.beginPath();
          ctx.arc(px, py, 6, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }
  } else if (patternId === 'rong-thoi-tran') {
    // Tran Dynasty Coiled Dragon Roundels (Đồ án rồng cuộn thời Trần)
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 3; col++) {
        const cx = col * 170 + 85;
        const cy = row * 170 + 85;
        // Outer beaded circle
        ctx.beginPath();
        ctx.arc(cx, cy, 52, 0, Math.PI * 2);
        ctx.stroke();

        // Coiled body spiral
        ctx.beginPath();
        for (let a = 0; a < Math.PI * 4; a += 0.2) {
          const r = 10 + a * 8;
          const x = cx + Math.cos(a) * r;
          const y = cy + Math.sin(a) * r;
          if (a === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }
    }
  } else if (patternId === 'hac-may-le') {
    // Early Le Dynasty Crane & Clouds (Hạc mây thời Lê sơ)
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        const cx = col * 128 + ((row % 2) * 64);
        const cy = row * 128 + 64;

        // Auspicious cloud curls
        ctx.beginPath();
        ctx.arc(cx - 16, cy, 12, 0, Math.PI * 2);
        ctx.arc(cx + 16, cy, 12, 0, Math.PI * 2);
        ctx.arc(cx, cy - 10, 16, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Flying crane silhouette wings
        ctx.beginPath();
        ctx.moveTo(cx, cy + 18);
        ctx.lineTo(cx - 28, cy - 6);
        ctx.lineTo(cx, cy + 2);
        ctx.lineTo(cx + 28, cy - 6);
        ctx.closePath();
        ctx.stroke();
      }
    }
  } else if (patternId === 'bat-buu' || patternId === 'chu-tho') {
    // Stylized Tho / Bat Buu Medallions (Chữ Thọ đỉnh đồng & Bát Bửu)
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        const cx = col * 128 + 64;
        const cy = row * 128 + 64;
        ctx.beginPath();
        ctx.rect(cx - 24, cy - 24, 48, 48);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(cx, cy, 18, 0, Math.PI * 2);
        ctx.stroke();
        ctx.fillRect(cx - 12, cy - 12, 24, 24);
      }
    }
  }

  ctx.restore();

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(3, 3);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

/**
 * Main 3D Vietnamese Traditional Garment Builder
 * Constructs authentic 3D robe volume, sleeves, collars, belts, and ornaments
 */
export function buildVietGarment3D(config: OutfitConfig): THREE.Group {
  const root = new THREE.Group();
  root.name = 'VietGarment3D_Root';

  const garment = GARMENTS.find(g => g.id === config.garmentId) || GARMENTS[0];
  const color = HERITAGE_COLORS.find(c => c.id === config.colorId) || HERITAGE_COLORS[0];
  const primaryHex = config.customColorHex || color.hex;
  const patternId = config.patternId || 'plain-silk';

  const silkTexture = createVietSilkTexture(primaryHex, patternId);

  // Primary Silk PBR Material
  const primarySilkMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color(primaryHex),
    map: silkTexture,
    roughness: 0.42,
    metalness: 0.08,
    side: THREE.DoubleSide
  });
  primarySilkMat.userData = { isPrimarySilk: true };

  // Inner White Silk Material (Bạch la)
  const whiteLiningMat = new THREE.MeshStandardMaterial({
    color: 0xfafaf9,
    roughness: 0.48,
    metalness: 0.04,
    side: THREE.DoubleSide
  });

  // Brass / Gold Button Material (Đồng / Khuy Vàng)
  const brassMat = new THREE.MeshStandardMaterial({
    color: 0xf59e0b,
    roughness: 0.22,
    metalness: 0.92
  });

  // Imperial Jade Material (Ngọc Bích Cung Đình)
  const jadeMat = new THREE.MeshStandardMaterial({
    color: 0x34d399,
    roughness: 0.16,
    metalness: 0.15
  });

  // 1. BUILD LOWER GARMENT (Quần Lụa Thụng / Chân Váy Xếp Ly 3D)
  const bottomGroup = new THREE.Group();
  bottomGroup.name = 'VietBottom_3D';

  const isDarkBottom = config.bottomId === 'quan-lua-den';
  const bottomMat = new THREE.MeshStandardMaterial({
    color: isDarkBottom ? 0x1c1917 : 0xf5f5f4,
    roughness: 0.52,
    metalness: 0.04,
    side: THREE.DoubleSide
  });

  if (config.bottomId === 'vay-xep-ly') {
    // Flared Pleated Skirt (Chân váy xếp ly thời Lê - Nguyễn)
    const skirtGeo = new THREE.CylinderGeometry(0.18, 0.44, 0.72, 48, 8, true);
    const skirtMesh = new THREE.Mesh(skirtGeo, bottomMat);
    skirtMesh.position.set(0, 0.62, 0);
    skirtMesh.castShadow = true;
    skirtMesh.receiveShadow = true;
    bottomGroup.add(skirtMesh);
  } else {
    // Traditional Wide-Legged Silk Trousers (Quần thụng lụa trắng / lụa đen)
    // Left Leg
    const legGeo = new THREE.CylinderGeometry(0.10, 0.15, 0.88, 32);
    const leftLeg = new THREE.Mesh(legGeo, bottomMat);
    leftLeg.position.set(-0.11, 0.52, 0.01);
    leftLeg.castShadow = true;
    leftLeg.receiveShadow = true;
    bottomGroup.add(leftLeg);

    // Right Leg
    const rightLeg = new THREE.Mesh(legGeo, bottomMat);
    rightLeg.position.set(0.11, 0.52, 0.01);
    rightLeg.castShadow = true;
    rightLeg.receiveShadow = true;
    bottomGroup.add(rightLeg);
  }
  root.add(bottomGroup);

  // 2. BUILD UPPER GARMENT (Thân Áo, Cổ Áo, Ống Tay & Khuy Cúc 3D)
  const garmentGroup = new THREE.Group();
  garmentGroup.name = 'VietUpperGarment_3D';

  switch (garment.id) {
    case 'ao-tac': {
      // ===== 1. ÁO TẤC (Áo Thụ Thụ Triều Nguyễn) =====
      // Thân Áo Chữ A (Main Robe Body)
      const robeGeo = new THREE.CylinderGeometry(0.185, 0.32, 0.88, 48, 8, true);
      const robeMesh = new THREE.Mesh(robeGeo, primarySilkMat);
      robeMesh.position.set(0, 0.94, 0.01);
      robeMesh.castShadow = true;
      robeMesh.receiveShadow = true;
      garmentGroup.add(robeMesh);

      // Cổ Lập Lĩnh Đứng (Standing Collar)
      const collarGeo = new THREE.CylinderGeometry(0.088, 0.092, 0.05, 32, 1, true);
      const collarMesh = new THREE.Mesh(collarGeo, primarySilkMat);
      collarMesh.position.set(0, 1.42, 0);
      garmentGroup.add(collarMesh);

      // Cổ Lót Trắng (White inner rim)
      const innerCollarGeo = new THREE.CylinderGeometry(0.086, 0.089, 0.055, 32, 1, true);
      const innerCollarMesh = new THREE.Mesh(innerCollarGeo, whiteLiningMat);
      innerCollarMesh.position.set(0, 1.425, 0);
      garmentGroup.add(innerCollarMesh);

      // Ống Tay Thụng Rộng 3D (Signature Wide Drooping Sleeves 35-50cm)
      const sleeveLeftGeo = new THREE.BoxGeometry(0.24, 0.36, 0.16);
      sleeveLeftGeo.translate(0, -0.12, 0);
      const sleeveLeft = new THREE.Mesh(sleeveLeftGeo, primarySilkMat);
      sleeveLeft.position.set(-0.30, 1.25, 0);
      sleeveLeft.rotation.z = 0.28;
      sleeveLeft.castShadow = true;
      garmentGroup.add(sleeveLeft);

      const sleeveRight = new THREE.Mesh(sleeveLeftGeo, primarySilkMat);
      sleeveRight.position.set(0.30, 1.25, 0);
      sleeveRight.rotation.z = -0.28;
      sleeveRight.castShadow = true;
      garmentGroup.add(sleeveRight);

      // Hàng 5 Khuy Đồng Ngũ Thường (Curved 5 Brass Buttons Trajectory)
      const buttonCoords = [
        [0.02, 1.42, 0.09],   // Khuy 1: Cổ áo
        [0.06, 1.37, 0.10],   // Khuy 2: Xương quai xanh
        [0.12, 1.30, 0.12],   // Khuy 3: Khép nách phải
        [0.15, 1.22, 0.12],   // Khuy 4: Sườn trên
        [0.16, 1.12, 0.13]    // Khuy 5: Thắt lưng
      ];
      buttonCoords.forEach(([x, y, z]) => {
        const btnMesh = new THREE.Mesh(new THREE.SphereGeometry(0.009, 16, 16), brassMat);
        btnMesh.position.set(x, y, z);
        btnMesh.castShadow = true;
        garmentGroup.add(btnMesh);
      });
      break;
    }

    case 'ao-nhat-binh': {
      // ===== 2. ÁO NHẬT BÌNH (Cung Đình Triều Nguyễn) =====
      // Thân Áo Đối Khâm Thẳng
      const robeGeo = new THREE.CylinderGeometry(0.185, 0.30, 0.82, 48, 8, true);
      const robeMesh = new THREE.Mesh(robeGeo, primarySilkMat);
      robeMesh.position.set(0, 0.98, 0.01);
      robeMesh.castShadow = true;
      robeMesh.receiveShadow = true;
      garmentGroup.add(robeMesh);

      // Nẹp Cổ Chữ Nhật Lớn (Rectangular Neckband with Imperial Trim)
      const neckbandGeo = new THREE.BoxGeometry(0.24, 0.28, 0.035);
      const neckbandMat = new THREE.MeshStandardMaterial({
        color: 0xfef08a,
        roughness: 0.3,
        metalness: 0.6
      });
      const neckbandMesh = new THREE.Mesh(neckbandGeo, neckbandMat);
      neckbandMesh.position.set(0, 1.30, 0.095);
      neckbandMesh.castShadow = true;
      garmentGroup.add(neckbandMesh);

      // Đôi Dải Kết Lụa Thả Trước Bụng
      const ribbonGeo = new THREE.BoxGeometry(0.04, 0.42, 0.01);
      const ribbonMat = new THREE.MeshStandardMaterial({ color: 0xef4444, roughness: 0.4 });
      const ribbonLeft = new THREE.Mesh(ribbonGeo, ribbonMat);
      ribbonLeft.position.set(-0.04, 0.95, 0.13);
      ribbonLeft.castShadow = true;
      garmentGroup.add(ribbonLeft);

      const ribbonRight = new THREE.Mesh(ribbonGeo, ribbonMat);
      ribbonRight.position.set(0.04, 0.95, 0.13);
      ribbonRight.castShadow = true;
      garmentGroup.add(ribbonRight);

      // Ống Tay Rộng có Viền Ngũ Sắc
      const sleeveLeftGeo = new THREE.BoxGeometry(0.22, 0.30, 0.16);
      sleeveLeftGeo.translate(0, -0.10, 0);
      const sleeveLeft = new THREE.Mesh(sleeveLeftGeo, primarySilkMat);
      sleeveLeft.position.set(-0.29, 1.25, 0);
      sleeveLeft.rotation.z = 0.22;
      sleeveLeft.castShadow = true;
      garmentGroup.add(sleeveLeft);

      const sleeveRight = new THREE.Mesh(sleeveLeftGeo, primarySilkMat);
      sleeveRight.position.set(0.29, 1.25, 0);
      sleeveRight.rotation.z = -0.22;
      sleeveRight.castShadow = true;
      garmentGroup.add(sleeveRight);

      // Vòng Ngũ Sắc Đầu Ống Tay (Rainbow Cuffs)
      const cuffColors = [0x3b82f6, 0xeab308, 0xffffff, 0xef4444, 0x1c1917];
      cuffColors.forEach((hex, i) => {
        const ringGeo = new THREE.TorusGeometry(0.075, 0.006, 12, 32);
        const ringMat = new THREE.MeshStandardMaterial({ color: hex });
        const ringL = new THREE.Mesh(ringGeo, ringMat);
        ringL.position.set(-0.35, 1.08 - i * 0.012, 0);
        ringL.rotation.y = Math.PI / 2;
        garmentGroup.add(ringL);

        const ringR = new THREE.Mesh(ringGeo, ringMat);
        ringR.position.set(0.35, 1.08 - i * 0.012, 0);
        ringR.rotation.y = Math.PI / 2;
        garmentGroup.add(ringR);
      });
      break;
    }

    case 'ao-giao-linh': {
      // ===== 3. ÁO GIAO LĨNH (Hậu Lê - Vạt Chéo Chữ V) =====
      const robeGeo = new THREE.CylinderGeometry(0.185, 0.32, 0.86, 48, 8, true);
      const robeMesh = new THREE.Mesh(robeGeo, primarySilkMat);
      robeMesh.position.set(0, 0.95, 0.01);
      robeMesh.castShadow = true;
      garmentGroup.add(robeMesh);

      // Cổ Chéo Hữu Nhậm Hình Chữ V (Crossing V-Neck Lapels)
      const lapelLeft = new THREE.Mesh(new THREE.BoxGeometry(0.045, 0.28, 0.02), primarySilkMat);
      lapelLeft.position.set(-0.06, 1.30, 0.10);
      lapelLeft.rotation.z = -0.42;
      garmentGroup.add(lapelLeft);

      const lapelRight = new THREE.Mesh(new THREE.BoxGeometry(0.045, 0.32, 0.02), primarySilkMat);
      lapelRight.position.set(0.04, 1.28, 0.11);
      lapelRight.rotation.z = 0.42;
      garmentGroup.add(lapelRight);

      // Cổ Lót Trắng (Bạch La bên trong)
      const innerV = new THREE.Mesh(new THREE.BoxGeometry(0.025, 0.22, 0.015), whiteLiningMat);
      innerV.position.set(-0.04, 1.32, 0.09);
      innerV.rotation.z = -0.42;
      garmentGroup.add(innerV);

      // Dải Thắt Lưng Lụa Ngang Eo
      const sashMesh = new THREE.Mesh(new THREE.TorusGeometry(0.18, 0.022, 16, 48), primarySilkMat);
      sashMesh.position.set(0, 1.02, 0);
      sashMesh.rotation.x = Math.PI / 2;
      garmentGroup.add(sashMesh);

      // Ống Tay Rộng Rủ
      const sleeveLeft = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.32, 0.16), primarySilkMat);
      sleeveLeft.position.set(-0.29, 1.24, 0);
      sleeveLeft.rotation.z = 0.25;
      garmentGroup.add(sleeveLeft);

      const sleeveRight = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.32, 0.16), primarySilkMat);
      sleeveRight.position.set(0.29, 1.24, 0);
      sleeveRight.rotation.z = -0.25;
      garmentGroup.add(sleeveRight);
      break;
    }

    case 'ao-vien-linh': {
      // ===== 4. ÁO VIÊN LĨNH (Thời Lý - Trần, Cổ Tròn & Đai Ngọc) =====
      const robeGeo = new THREE.CylinderGeometry(0.19, 0.33, 0.90, 48, 8, true);
      const robeMesh = new THREE.Mesh(robeGeo, primarySilkMat);
      robeMesh.position.set(0, 0.93, 0.01);
      robeMesh.castShadow = true;
      garmentGroup.add(robeMesh);

      // Cổ Tròn Ôm Sát Chân Cổ (Viên Lĩnh)
      const roundCollar = new THREE.Mesh(new THREE.TorusGeometry(0.088, 0.018, 16, 48), primarySilkMat);
      roundCollar.position.set(0, 1.41, 0.01);
      roundCollar.rotation.x = Math.PI / 2;
      garmentGroup.add(roundCollar);

      // Khuy Chốt Vai Phải
      const shoulderBtn = new THREE.Mesh(new THREE.SphereGeometry(0.011, 16, 16), brassMat);
      shoulderBtn.position.set(0.09, 1.41, 0.06);
      garmentGroup.add(shoulderBtn);

      // Đai Ngọc Hoàng Triều Thời Lý - Trần (Leather Belt Studded with Jade Plaques)
      const beltRing = new THREE.Mesh(
        new THREE.CylinderGeometry(0.19, 0.19, 0.045, 48, 1, true),
        new THREE.MeshStandardMaterial({ color: 0x27272a, roughness: 0.4 })
      );
      beltRing.position.set(0, 1.00, 0);
      garmentGroup.add(beltRing);

      // Đính 10 phiến ngọc chữ nhật quanh đai
      for (let i = 0; i < 10; i++) {
        const angle = (i * Math.PI * 2) / 10;
        const jx = Math.sin(angle) * 0.192;
        const jz = Math.cos(angle) * 0.192;
        const jadePlaque = new THREE.Mesh(new THREE.BoxGeometry(0.024, 0.038, 0.008), jadeMat);
        jadePlaque.position.set(jx, 1.00, jz);
        jadePlaque.rotation.y = angle;
        jadePlaque.castShadow = true;
        garmentGroup.add(jadePlaque);
      }

      // Ống Tay Rộng Thụ Thụ Thời Trần
      const sleeveLeft = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.35, 0.16), primarySilkMat);
      sleeveLeft.position.set(-0.30, 1.25, 0);
      sleeveLeft.rotation.z = 0.28;
      garmentGroup.add(sleeveLeft);

      const sleeveRight = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.35, 0.16), primarySilkMat);
      sleeveRight.position.set(0.30, 1.25, 0);
      sleeveRight.rotation.z = -0.28;
      garmentGroup.add(sleeveRight);
      break;
    }

    case 'ao-tu-than': {
      // ===== 5. ÁO TỨ THÂN & YẾM ĐÀO BẮC BỘ =====
      // Yếm Đào Che Ngực (Inner Bodice)
      const yemGeo = new THREE.BoxGeometry(0.18, 0.28, 0.015);
      const yemMat = new THREE.MeshStandardMaterial({ color: 0xf43f5e, roughness: 0.38, side: THREE.DoubleSide });
      const yemMesh = new THREE.Mesh(yemGeo, yemMat);
      yemMesh.position.set(0, 1.26, 0.09);
      garmentGroup.add(yemMesh);

      // Tà Áo Tứ Thân Bên Ngoài (Open flowing panels)
      const leftFlap = new THREE.Mesh(new THREE.BoxGeometry(0.11, 0.78, 0.01), primarySilkMat);
      leftFlap.position.set(-0.11, 0.95, 0.08);
      leftFlap.rotation.y = 0.2;
      garmentGroup.add(leftFlap);

      const rightFlap = new THREE.Mesh(new THREE.BoxGeometry(0.11, 0.78, 0.01), primarySilkMat);
      rightFlap.position.set(0.11, 0.95, 0.08);
      rightFlap.rotation.y = -0.2;
      garmentGroup.add(rightFlap);

      // Tà Sau Khép Liền
      const backPanel = new THREE.Mesh(new THREE.CylinderGeometry(0.185, 0.30, 0.82, 32, 4, true, 0, Math.PI), primarySilkMat);
      backPanel.position.set(0, 0.96, 0);
      backPanel.rotation.y = Math.PI / 2;
      garmentGroup.add(backPanel);

      // Dải Thắt Lưng Bao Xanh Lá Sen
      const baoMat = new THREE.MeshStandardMaterial({ color: 0x10b981, roughness: 0.45 });
      const baoMesh = new THREE.Mesh(new THREE.TorusGeometry(0.18, 0.024, 16, 48), baoMat);
      baoMesh.position.set(0, 1.02, 0);
      baoMesh.rotation.x = Math.PI / 2;
      garmentGroup.add(baoMesh);
      break;
    }

    case 'ao-ngu-than':
    default: {
      // ===== 6. ÁO NGŨ THÂN (Tay Chẽn Triều Nguyễn) =====
      const robeGeo = new THREE.CylinderGeometry(0.18, 0.28, 0.80, 48, 8, true);
      const robeMesh = new THREE.Mesh(robeGeo, primarySilkMat);
      robeMesh.position.set(0, 0.98, 0.01);
      robeMesh.castShadow = true;
      garmentGroup.add(robeMesh);

      // Cổ Lập Lĩnh Đứng
      const collarMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.088, 0.092, 0.045, 32, 1, true), primarySilkMat);
      collarMesh.position.set(0, 1.42, 0);
      garmentGroup.add(collarMesh);

      // Tay Chẽn Gọn Gàng (Tapered fitted sleeves)
      const sleeveLeft = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.045, 0.42, 24), primarySilkMat);
      sleeveLeft.position.set(-0.25, 1.18, 0);
      sleeveLeft.rotation.z = 0.45;
      garmentGroup.add(sleeveLeft);

      const sleeveRight = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.045, 0.42, 24), primarySilkMat);
      sleeveRight.position.set(0.25, 1.18, 0);
      sleeveRight.rotation.z = -0.45;
      garmentGroup.add(sleeveRight);

      // 5 Khuy Đồng
      const buttonCoords = [
        [0.02, 1.42, 0.09],
        [0.05, 1.37, 0.095],
        [0.10, 1.31, 0.11],
        [0.13, 1.23, 0.11],
        [0.14, 1.14, 0.12]
      ];
      buttonCoords.forEach(([x, y, z]) => {
        const btnMesh = new THREE.Mesh(new THREE.SphereGeometry(0.008, 16, 16), brassMat);
        btnMesh.position.set(x, y, z);
        btnMesh.castShadow = true;
        garmentGroup.add(btnMesh);
      });
      break;
    }
  }

  root.add(garmentGroup);

  // 3. BUILD HEADWEAR 3D (Khăn Đóng / Khăn Vấn / Nón Lá 3D)
  if (config.headwearId && config.headwearId !== 'none') {
    const headwearGroup = new THREE.Group();
    headwearGroup.name = 'VietHeadwear_3D';

    if (config.headwearId === 'khan-dong' || config.headwearId === 'khan-van') {
      // Khăn Đóng / Khăn Vấn Quấn Tròn Xếp Nếp
      const turbanMat = new THREE.MeshStandardMaterial({
        color: config.headwearId === 'khan-dong' ? new THREE.Color(0x18181b) : new THREE.Color(primaryHex),
        roughness: 0.55,
        metalness: 0.02
      });

      // 4 tiered fabric folds
      for (let f = 0; f < 4; f++) {
        const foldRadius = 0.108 + f * 0.004;
        const foldTorus = new THREE.Mesh(new THREE.TorusGeometry(foldRadius, 0.014, 16, 48), turbanMat);
        foldTorus.position.set(0, 1.63 + f * 0.015, -0.01);
        foldTorus.rotation.x = Math.PI / 2 + 0.15; // Tilted slightly backwards
        foldTorus.castShadow = true;
        headwearGroup.add(foldTorus);
      }
    } else if (config.headwearId === 'non-la') {
      // Nón Lá Truyền Thống
      const nonMat = new THREE.MeshStandardMaterial({
        color: 0xfef08a,
        roughness: 0.6,
        metalness: 0.05,
        side: THREE.DoubleSide
      });
      const nonGeo = new THREE.ConeGeometry(0.28, 0.14, 36, 1, true);
      const nonMesh = new THREE.Mesh(nonGeo, nonMat);
      nonMesh.position.set(0, 1.76, -0.02);
      nonMesh.castShadow = true;
      headwearGroup.add(nonMesh);
    }

    root.add(headwearGroup);
  }

  return root;
}

/**
 * Updates color and silk texture of an existing 3D Vietnamese Garment group
 */
export function updateVietGarmentColors(
  garmentGroup: THREE.Group,
  primaryHex: string,
  patternId: string
): void {
  const newTexture = createVietSilkTexture(primaryHex, patternId);

  garmentGroup.traverse((child) => {
    if ((child as THREE.Mesh).isMesh) {
      const mesh = child as THREE.Mesh;
      if (mesh.material) {
        const mat = mesh.material as THREE.MeshStandardMaterial;
        if (mat.userData?.isPrimarySilk) {
          mat.color.set(primaryHex);
          mat.map = newTexture;
          mat.needsUpdate = true;
        }
      }
    }
  });
}
