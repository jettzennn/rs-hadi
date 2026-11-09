// @ts-nocheck

function createLabelSign(text, options = {}) {
  const {
    bgColor = "#E86A17",
    textColor = "#FFFFFF",
    width = 512,
    height = 128,
    fontSize = 52,
    planeW = 1.45,
    planeH = 0.34,
  } = options;

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");

  ctx.fillStyle = bgColor;
  ctx.fillRect(0, 0, width, height);

  ctx.fillStyle = textColor;
  ctx.font = `800 ${fontSize}px "Plus Jakarta Sans", sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(text, width / 2, height / 2 + 3);

  const texture = new THREE.CanvasTexture(canvas);
  const mat = new THREE.MeshBasicMaterial({ map: texture });
  return new THREE.Mesh(new THREE.BoxGeometry(planeW, planeH, 0.06), mat);
}

/**
 * FIGUR ARSITEKTUR RAMPING (Persis Video: Silinder Ramping Halus + Kepala Kecil Proporsional, BUKAN Chibi!)
 */
function createArchitecturalFigure({
  shirtColor = 0xe86a17,
  pantsColor = 0x1f1e1c,
  skinColor = 0xe8b892,
  hairColor = 0x181715,
  isSitting = false,
} = {}) {
  const fig = new THREE.Group();

  const matShirt = new THREE.MeshStandardMaterial({
    color: shirtColor,
    roughness: 0.65,
  });
  const matPants = new THREE.MeshStandardMaterial({
    color: pantsColor,
    roughness: 0.8,
  });
  const matSkin = new THREE.MeshStandardMaterial({
    color: skinColor,
    roughness: 0.55,
  });
  const matHair = new THREE.MeshStandardMaterial({
    color: hairColor,
    roughness: 0.75,
  });

  // 1. Bagian Bawah / Kaki Silinder Ramping
  const lowerH = isSitting ? 0.26 : 0.42;
  const lower = new THREE.Mesh(
    new THREE.CylinderGeometry(0.105, 0.085, lowerH, 20),
    matPants,
  );
  lower.position.y = lowerH / 2;
  lower.castShadow = true;
  fig.add(lower);

  // 2. Badan Atas / Baju Silinder Ramping Meruncing ke Bahu
  const torsoH = 0.42;
  const torso = new THREE.Mesh(
    new THREE.CylinderGeometry(0.095, 0.115, torsoH, 20),
    matShirt,
  );
  torso.position.y = lowerH + torsoH / 2;
  torso.castShadow = true;
  fig.add(torso);

  // Kubah Bahu Halus (Menyambung tanpa kotak lengan kasar)
  const shoulder = new THREE.Mesh(
    new THREE.SphereGeometry(0.112, 20, 12, 0, Math.PI * 2, 0, Math.PI * 0.5),
    matShirt,
  );
  shoulder.position.y = lowerH + torsoH - 0.04;
  fig.add(shoulder);

  // 3. Kepala Kecil Ramping Proporsional (Radius 0.092, bukan bola besar!)
  const headY = lowerH + torsoH + 0.12;
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.092, 20, 20), matSkin);
  head.position.y = headY;
  head.castShadow = true;
  fig.add(head);

  // Rambut Halus
  const hair = new THREE.Mesh(
    new THREE.SphereGeometry(0.096, 20, 14, 0, Math.PI * 2, 0, Math.PI * 0.55),
    matHair,
  );
  hair.position.y = headY + 0.008;
  hair.rotation.x = -0.18;
  fig.add(hair);

  return fig;
}

function createCounterDesk(width = 1.6, depth = 0.55, withMonitor = true) {
  const group = new THREE.Group();
  const matWood = new THREE.MeshStandardMaterial({
    color: 0xdfb17b,
    roughness: 0.7,
  });
  const matWhite = new THREE.MeshStandardMaterial({
    color: 0xfaf7f2,
    roughness: 0.5,
  });
  const matDark = new THREE.MeshStandardMaterial({
    color: 0x22201e,
    roughness: 0.6,
  });

  const base = new THREE.Mesh(
    new THREE.BoxGeometry(width, 0.58, depth),
    matWood,
  );
  base.position.y = 0.29;
  base.castShadow = true;
  base.receiveShadow = true;
  group.add(base);

  const top = new THREE.Mesh(
    new THREE.BoxGeometry(width + 0.04, 0.05, depth + 0.04),
    matWhite,
  );
  top.position.y = 0.6;
  top.castShadow = true;
  group.add(top);

  if (withMonitor) {
    const stand = new THREE.Mesh(
      new THREE.BoxGeometry(0.04, 0.12, 0.04),
      matDark,
    );
    stand.position.set(0, 0.66, 0);
    const screen = new THREE.Mesh(
      new THREE.BoxGeometry(0.32, 0.2, 0.03),
      matDark,
    );
    screen.position.set(0, 0.76, 0);
    screen.castShadow = true;
    group.add(stand, screen);
  }

  return group;
}

function createAmbulance() {
  const amb = new THREE.Group();
  const whiteMat = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    roughness: 0.35,
  });
  const orangeMat = new THREE.MeshStandardMaterial({
    color: 0xe86a17,
    roughness: 0.45,
  });
  const darkMat = new THREE.MeshStandardMaterial({
    color: 0x1a1917,
    roughness: 0.7,
  });

  const body = new THREE.Mesh(
    new THREE.BoxGeometry(1.35, 0.65, 0.75),
    whiteMat,
  );
  body.position.y = 0.42;
  body.castShadow = true;
  amb.add(body);

  const cab = new THREE.Mesh(new THREE.BoxGeometry(0.48, 0.48, 0.73), whiteMat);
  cab.position.set(-0.82, 0.34, 0);
  cab.castShadow = true;
  amb.add(cab);

  const glass = new THREE.Mesh(
    new THREE.BoxGeometry(0.08, 0.22, 0.68),
    darkMat,
  );
  glass.position.set(-1.03, 0.41, 0);
  amb.add(glass);

  const stripe = new THREE.Mesh(
    new THREE.BoxGeometry(1.37, 0.1, 0.77),
    orangeMat,
  );
  stripe.position.y = 0.34;
  amb.add(stripe);

  const siren = new THREE.Mesh(
    new THREE.BoxGeometry(0.18, 0.07, 0.28),
    orangeMat,
  );
  siren.position.set(-0.32, 0.78, 0);
  amb.add(siren);

  const wheelGeo = new THREE.CylinderGeometry(0.14, 0.14, 0.1, 16);
  wheelGeo.rotateX(Math.PI / 2);
  [
    [-0.75, 0.14, 0.38],
    [-0.75, 0.14, -0.38],
    [0.36, 0.14, 0.38],
    [0.36, 0.14, -0.38],
  ].forEach(([x, y, z]) => {
    const w = new THREE.Mesh(wheelGeo, darkMat);
    w.position.set(x, y, z);
    amb.add(w);
  });

  return amb;
}

export function buildHospitalWorld(scene) {
  const worldGroup = new THREE.Group();
  scene.add(worldGroup);

  const matFloorWarm = new THREE.MeshStandardMaterial({
    color: 0xeadfd0,
    roughness: 0.88,
  });
  const matWallCream = new THREE.MeshStandardMaterial({
    color: 0xfaf6f0,
    roughness: 0.75,
  });
  const matWallInner = new THREE.MeshStandardMaterial({
    color: 0xf2eae0,
    roughness: 0.8,
  });
  const matOrange = new THREE.MeshStandardMaterial({
    color: 0xe86a17,
    roughness: 0.55,
  });
  const matDark = new THREE.MeshStandardMaterial({
    color: 0x1f1e1c,
    roughness: 0.8,
  });
  const matWood = new THREE.MeshStandardMaterial({
    color: 0xdfb17b,
    roughness: 0.7,
  });
  const matGreen = new THREE.MeshStandardMaterial({
    color: 0x5e8c61,
    roughness: 0.8,
  });
  const matBlue = new THREE.MeshStandardMaterial({
    color: 0x4a90e2,
    roughness: 0.6,
  });

  // ============================================================================
  // 1. EKSTERIOR GEDUNG 7 LANTAI (Step 0)
  // ============================================================================
  const exteriorGroup = new THREE.Group();
  worldGroup.add(exteriorGroup);

  const extPlatform = new THREE.Mesh(
    new THREE.BoxGeometry(10, 0.25, 8.5),
    matFloorWarm,
  );
  extPlatform.position.y = -0.125;
  extPlatform.receiveShadow = true;
  exteriorGroup.add(extPlatform);

  const mainTower = new THREE.Mesh(
    new THREE.BoxGeometry(3.3, 4.8, 2.6),
    matWallCream,
  );
  mainTower.position.set(-0.6, 2.4, -0.4);
  mainTower.castShadow = true;
  mainTower.receiveShadow = true;
  exteriorGroup.add(mainTower);

  const orangeWing = new THREE.Mesh(
    new THREE.BoxGeometry(2.2, 4.2, 2.4),
    matOrange,
  );
  orangeWing.position.set(1.3, 2.1, -0.9);
  orangeWing.castShadow = true;
  orangeWing.receiveShadow = true;
  exteriorGroup.add(orangeWing);

  const lowWing = new THREE.Mesh(
    new THREE.BoxGeometry(3.6, 1.15, 1.9),
    matWallCream,
  );
  lowWing.position.set(1.9, 0.58, 1.15);
  lowWing.castShadow = true;
  lowWing.receiveShadow = true;
  exteriorGroup.add(lowWing);

  for (let r = 0; r < 5; r++) {
    for (let c = 0; c < 5; c++) {
      const win = new THREE.Mesh(
        new THREE.BoxGeometry(0.38, 0.38, 0.06),
        matDark,
      );
      win.position.set(-1.78 + c * 0.58, 1.45 + r * 0.6, 0.91);
      exteriorGroup.add(win);
    }
  }

  const roofLogo = createLabelSign("hadi.", {
    bgColor: "#FAF6F0",
    textColor: "#1A1917",
    fontSize: 84,
    planeW: 1.7,
    planeH: 0.48,
  });
  roofLogo.position.set(-1.05, 4.35, 0.92);
  exteriorGroup.add(roofLogo);

  const igdCanopy = createLabelSign("+ Gawat Darurat 24 Jam", {
    bgColor: "#E86A17",
    textColor: "#FFFFFF",
    fontSize: 40,
    planeW: 2.0,
    planeH: 0.3,
  });
  igdCanopy.position.set(-0.6, 0.85, 1.05);
  exteriorGroup.add(igdCanopy);

  const road = new THREE.Mesh(new THREE.BoxGeometry(8.5, 0.04, 1.15), matDark);
  road.position.set(0.5, 0.02, 2.45);
  road.receiveShadow = true;
  exteriorGroup.add(road);

  [
    [-2.8, 1.2],
    [-2.5, 2.2],
    [0.5, 1.4],
    [3.8, 2.3],
  ].forEach(([tx, tz]) => {
    const trunk = new THREE.Mesh(
      new THREE.CylinderGeometry(0.06, 0.08, 0.35, 8),
      matWood,
    );
    trunk.position.set(tx, 0.18, tz);
    const crown = new THREE.Mesh(
      new THREE.SphereGeometry(0.28, 14, 14),
      matGreen,
    );
    crown.position.set(tx, 0.52, tz);
    crown.castShadow = true;
    exteriorGroup.add(trunk, crown);
  });

  const ambulance = createAmbulance();
  ambulance.position.set(0.6, 0.04, 2.45);
  exteriorGroup.add(ambulance);

  // ============================================================================
  // 2. DENAH INTERIOR ISOMETRIK 5 RUANGAN (Step 1 s/d Step 5)
  // ============================================================================
  const interiorGroup = new THREE.Group();
  interiorGroup.position.set(0, -18, 0);
  worldGroup.add(interiorGroup);

  const floorRim = new THREE.Mesh(
    new THREE.BoxGeometry(11.4, 0.24, 7.6),
    matOrange,
  );
  floorRim.position.y = -0.14;
  interiorGroup.add(floorRim);

  const floorSlab = new THREE.Mesh(
    new THREE.BoxGeometry(11.1, 0.26, 7.3),
    matFloorWarm,
  );
  floorSlab.position.y = -0.12;
  floorSlab.receiveShadow = true;
  interiorGroup.add(floorSlab);

  const wallBack = new THREE.Mesh(
    new THREE.BoxGeometry(11.1, 2.0, 0.18),
    matWallInner,
  );
  wallBack.position.set(0, 1.0, -3.55);
  wallBack.receiveShadow = true;
  interiorGroup.add(wallBack);

  const wallLeft = new THREE.Mesh(
    new THREE.BoxGeometry(0.18, 2.0, 7.3),
    matWallInner,
  );
  wallLeft.position.set(-5.45, 1.0, 0);
  wallLeft.receiveShadow = true;
  interiorGroup.add(wallLeft);

  const divLeft = new THREE.Mesh(
    new THREE.BoxGeometry(0.16, 1.9, 7.3),
    matWallCream,
  );
  divLeft.position.set(-1.9, 0.95, 0);
  divLeft.castShadow = true;
  divLeft.receiveShadow = true;
  interiorGroup.add(divLeft);

  const divRight = new THREE.Mesh(
    new THREE.BoxGeometry(0.16, 1.9, 7.3),
    matWallCream,
  );
  divRight.position.set(1.9, 0.95, 0);
  divRight.castShadow = true;
  divRight.receiveShadow = true;
  interiorGroup.add(divRight);

  const divCenter = new THREE.Mesh(
    new THREE.BoxGeometry(11.1, 1.9, 0.16),
    matWallCream,
  );
  divCenter.position.set(0, 0.95, 0.1);
  divCenter.castShadow = true;
  divCenter.receiveShadow = true;
  interiorGroup.add(divCenter);

  const routeH = new THREE.Mesh(
    new THREE.BoxGeometry(8.2, 0.02, 0.1),
    matOrange,
  );
  routeH.position.set(0, 0.02, 2.15);
  const routeV = new THREE.Mesh(
    new THREE.BoxGeometry(0.1, 0.02, 4.3),
    matOrange,
  );
  routeV.position.set(0, 0.02, 0);
  interiorGroup.add(routeH, routeV);

  // RUANG 1: PENDAFTARAN
  const signPendaftaran = createLabelSign("+ PENDAFTARAN", {
    planeW: 1.6,
    planeH: 0.32,
  });
  signPendaftaran.position.set(-3.7, 1.68, 0.2);
  interiorGroup.add(signPendaftaran);

  const deskPendaftaran = createCounterDesk(1.9, 0.52, true);
  deskPendaftaran.position.set(-3.7, 0, 0.95);
  interiorGroup.add(deskPendaftaran);

  const tvQueue = createLabelSign("A-012", {
    bgColor: "#1A1917",
    textColor: "#FFFFFF",
    planeW: 0.8,
    planeH: 0.4,
    fontSize: 68,
  });
  tvQueue.position.set(-2.0, 1.32, 1.2);
  tvQueue.rotation.y = -Math.PI / 2;
  interiorGroup.add(tvQueue);

  for (let row = 0; row < 2; row++) {
    for (let col = 0; col < 3; col++) {
      const seat = new THREE.Mesh(
        new THREE.BoxGeometry(0.36, 0.25, 0.36),
        matOrange,
      );
      seat.position.set(-4.3 + col * 0.52, 0.125, 2.3 + row * 0.62);
      seat.castShadow = true;
      interiorGroup.add(seat);
    }
  }

  const staff1 = createArchitecturalFigure({ shirtColor: 0x1f1e1c });
  staff1.position.set(-4.1, 0, 0.45);
  const staff2 = createArchitecturalFigure({ shirtColor: 0x1f1e1c });
  staff2.position.set(-3.3, 0, 0.45);
  const waitP1 = createArchitecturalFigure({
    shirtColor: 0x3b7a57,
    isSitting: true,
  });
  waitP1.position.set(-3.78, 0.1, 2.3);
  const waitP2 = createArchitecturalFigure({
    shirtColor: 0xc85a32,
    isSitting: true,
  });
  waitP2.position.set(-4.3, 0.1, 2.92);
  interiorGroup.add(staff1, staff2, waitP1, waitP2);

  // RUANG 2: POLIKLINIK
  const signPoli = createLabelSign("+ POLIKLINIK", {
    planeW: 1.45,
    planeH: 0.32,
  });
  signPoli.position.set(0, 1.68, 0.2);
  interiorGroup.add(signPoli);

  const docDesk = createCounterDesk(1.15, 0.5, true);
  docDesk.position.set(0.65, 0, 1.15);
  interiorGroup.add(docDesk);

  const bedFrame = new THREE.Mesh(
    new THREE.BoxGeometry(0.7, 0.34, 1.45),
    matWallCream,
  );
  bedFrame.position.set(-1.1, 0.17, 1.4);
  bedFrame.castShadow = true;
  const blanket = new THREE.Mesh(
    new THREE.BoxGeometry(0.72, 0.06, 0.8),
    matOrange,
  );
  blanket.position.set(-1.1, 0.35, 1.7);
  interiorGroup.add(bedFrame, blanket);

  const doctorChar = createArchitecturalFigure({ shirtColor: 0xffffff });
  doctorChar.position.set(0.65, 0, 0.65);
  const walkingPatient = createArchitecturalFigure({ shirtColor: 0xe86a17 });
  walkingPatient.position.set(0.15, 0, 1.85);
  interiorGroup.add(doctorChar, walkingPatient);

  // RUANG 3: LABORATORIUM & RADIOLOGI
  const signLab = createLabelSign("+ LABORATORIUM", {
    planeW: 1.65,
    planeH: 0.32,
    fontSize: 40,
  });
  signLab.position.set(-0.85, 1.68, -3.42);
  const signRadio = createLabelSign("RADIOLOGI", {
    planeW: 1.3,
    planeH: 0.32,
    fontSize: 40,
  });
  signRadio.position.set(0.95, 1.68, -3.42);
  interiorGroup.add(signLab, signRadio);

  const labBench = createCounterDesk(1.25, 0.48, true);
  labBench.position.set(-0.95, 0, -2.1);
  interiorGroup.add(labBench);

  const ctGantry = new THREE.Mesh(
    new THREE.CylinderGeometry(0.62, 0.62, 0.38, 24),
    matWallCream,
  );
  ctGantry.rotation.x = Math.PI / 2;
  ctGantry.position.set(0.95, 0.65, -2.45);
  ctGantry.castShadow = true;

  const scannerCore = new THREE.Mesh(
    new THREE.BoxGeometry(0.46, 0.1, 1.25),
    matOrange,
  );
  scannerCore.position.set(0.95, 0.4, -2.1);
  interiorGroup.add(ctGantry, scannerCore);

  const labWorker = createArchitecturalFigure({ shirtColor: 0x4a90e2 });
  labWorker.position.set(-0.95, 0, -1.5);
  interiorGroup.add(labWorker);

  // RUANG 4 & 5: FARMASI & KASIR
  const signFarmasi = createLabelSign("+ FARMASI", {
    planeW: 1.4,
    planeH: 0.32,
  });
  signFarmasi.position.set(3.2, 1.68, 0.2);
  interiorGroup.add(signFarmasi);

  const signKasir = createLabelSign("KASIR", { planeW: 1.05, planeH: 0.3 });
  signKasir.position.set(4.65, 1.38, 1.3);
  interiorGroup.add(signKasir);

  const medRack = new THREE.Mesh(
    new THREE.BoxGeometry(1.65, 1.3, 0.24),
    matWallCream,
  );
  medRack.position.set(3.2, 0.65, 0.36);
  medRack.castShadow = true;
  interiorGroup.add(medRack);

  const boxColors = [matOrange, matBlue, matGreen];
  for (let r = 0; r < 3; r++) {
    for (let c = 0; c < 4; c++) {
      const medBox = new THREE.Mesh(
        new THREE.BoxGeometry(0.24, 0.16, 0.12),
        boxColors[(r + c) % boxColors.length],
      );
      medBox.position.set(2.68 + c * 0.34, 0.4 + r * 0.34, 0.46);
      interiorGroup.add(medBox);
    }
  }

  const deskFarmasi = createCounterDesk(1.45, 0.5, true);
  deskFarmasi.position.set(3.2, 0, 1.1);
  interiorGroup.add(deskFarmasi);

  const deskKasir = createCounterDesk(1.2, 0.5, true);
  deskKasir.position.set(4.65, 0, 1.98);
  interiorGroup.add(deskKasir);

  const pharmacist = createArchitecturalFigure({ shirtColor: 0xffffff });
  pharmacist.position.set(3.2, 0, 0.65);

  const cashierStaff = createArchitecturalFigure({ shirtColor: 0x1f1e1c });
  cashierStaff.position.set(4.65, 0, 1.48);

  const patientKasir = createArchitecturalFigure({ shirtColor: 0xe86a17 });
  patientKasir.position.set(4.25, 0, 2.58);

  interiorGroup.add(pharmacist, cashierStaff, patientKasir);

  return {
    worldGroup,
    exteriorGroup,
    interiorGroup,
    ambulance,
    walkingPatient,
    scannerCore,
  };
}
