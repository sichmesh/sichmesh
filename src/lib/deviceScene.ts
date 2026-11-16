/**
 * SICH device — real-geometry 3D scene.
 *
 * Ported from the standalone `sich-3d` study and adapted for embedding:
 * container-sized (not fullscreen), transparent background, framing that
 * fits the product to whatever aspect ratio the layout gives it, and a
 * render loop that can be parked while the canvas is off-screen.
 *
 * All dimensions are the real product's, in millimetres.
 */
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

export type ViewKey = "front" | "back" | "edge" | "iso";

export interface DeviceScene {
  setView(view: ViewKey): void;
  setAutoRotate(on: boolean): void;
  setActive(on: boolean): void;
  dispose(): void;
}

interface Options {
  view?: ViewKey;
  autoRotate?: boolean;
  interactive?: boolean;
  /** Fired when the user grabs the model (used to drop auto-rotation). */
  onUserInput?: () => void;
}

/* ---------- реальні розміри виробу, мм ---------- */
const W = 92.996;
const H = 103.788; // габарит панелі
const T_FRONT = 4.003;
const T_BACK = 14.15; // передня панель / піддон
const T_PLATE = 2.5; // плита батарейного модуля
const TUBE_R = 15.0;
const TUBE_X = [15.0, 77.996];
const TUBE_Y0 = 3.874;
const TUBE_Y1 = 103.788;
const Z_BACK = -(T_FRONT + T_BACK); // зовнішня площина піддона
const Z_AXIS = Z_BACK - T_PLATE - (TUBE_R - 1.0);
const CAP_Y0 = 0.0;
const CAP_Y1 = 16.0;
const Z_ANT = -(T_FRONT + T_BACK) / 2; // SMA по центру товщини корпусу

const SCREEN = { x0: 23.47, x1: 64.67, y0: 66.24, y1: 97.24 };
const LOGO = { x0: 4.879, x1: 15.179, y0: 35.874, y1: 45.844 };
const WORD = { x0: 4.879, x1: 15.179, y0: 29.754, y1: 32.384 };
const SCREWS: [number, number][] = [
  [84.429, 99.668], [6.999, 99.668], [84.429, 63.284],
  [6.999, 63.284], [84.429, 4.234], [6.999, 4.234],
];

const XA = [84.789, 78.849, 72.939, 66.919, 61.049, 55.109, 49.189, 43.239, 37.309, 31.429, 25.499];
const XB = [84.789, 78.849, 72.919, 66.919, 61.049, 55.109, 49.199, 43.239, 37.309, 31.429, 25.499];
const XC = [84.789, 78.849, 72.919, 66.939, 61.089, 55.109, 49.179, 43.239, 37.309, 31.449, 25.499, 19.529];
const XD = [84.789, 78.879, 72.919, 66.919, 61.059, 55.109, 49.179, 43.239, 37.309, 31.429, 25.499, 19.509];

const ROWS = [
  { y: 48.374, xs: [...XD].reverse(), keys: ["⎋", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "⌫"] },
  { y: 36.674, xs: [...XC].reverse(), keys: ["⇥", "Й", "Ц", "У", "К", "Е", "Н", "Г", "Ш", "Щ", "З", "Х"] },
  { y: 24.774, xs: [...XB].reverse(), keys: ["Ф", "І", "В", "А", "П", "Р", "О", "Л", "Д", "Ж", "Є"] },
  { y: 12.974, xs: [...XA].reverse(), keys: ["Я", "Ч", "С", "М", "И", "Т", "Ь", "Б", "Ю", "↵", "␣"] },
];
const DPAD: [string, number, number][] = [
  ["↑", 13.749, 21.274], ["↓", 13.749, 12.074],
  ["←", 8.259, 16.474], ["→", 19.329, 16.474],
];

const ANT = [
  { x: 60.5, len: 110, r: 3.6, col: 0xe05c5c }, // LoRa 433
  { x: 73.0, len: 90, r: 3.6, col: 0xe0a04c }, // LoRa 868
  { x: 85.5, len: 50, r: 3.0, col: 0x4ca8e0 }, // Wi-Fi / BLE
];

/* 0.91" I2C OLED SSD1306 — на верхньому торці, зліва */
const OLED = { cx: 25.0, w: 32.0, d: 3.5, aw: 22.4, ah: 5.6, modD: 13.95, modT: 3.2 };
const NOTCH = { x0: OLED.cx - OLED.w / 2 - W / 2, x1: OLED.cx + OLED.w / 2 - W / 2, d: OLED.d };

/* ---------- напрямки камери для кнопок ---------- */
const VIEWS: Record<ViewKey, THREE.Vector3> = {
  front: new THREE.Vector3(0, 0.1, 1),
  back: new THREE.Vector3(0, 0.1, -1),
  edge: new THREE.Vector3(0, 1, 0.34),
  iso: new THREE.Vector3(0.55, 0.4, 1),
};

export function createDeviceScene(container: HTMLElement, opts: Options = {}): DeviceScene {
  /* ---------- матеріали ---------- */
  const matBody = new THREE.MeshStandardMaterial({ color: 0x4a5340, roughness: 0.94, metalness: 0.02 });
  const matBack = new THREE.MeshStandardMaterial({ color: 0x424a38, roughness: 0.95, metalness: 0.02 });
  const matGrip = new THREE.MeshStandardMaterial({ color: 0x39412f, roughness: 0.97, metalness: 0.02 });
  const matCapM = new THREE.MeshStandardMaterial({ color: 0x323a2a, roughness: 0.93, metalness: 0.04 });
  const matKey = new THREE.MeshStandardMaterial({ color: 0x2e352a, roughness: 0.9, metalness: 0.03 });
  const matBezel = new THREE.MeshStandardMaterial({ color: 0x12150f, roughness: 0.85, metalness: 0.03 });
  const matScreen = new THREE.MeshPhysicalMaterial({
    color: 0x03040a, roughness: 0.05, metalness: 0.0,
    clearcoat: 1, clearcoatRoughness: 0.02, reflectivity: 0.6,
  });
  const matSMA = new THREE.MeshStandardMaterial({ color: 0x8f8a72, roughness: 0.55, metalness: 0.75 });
  const matWhip = new THREE.MeshStandardMaterial({ color: 0x1b1e18, roughness: 0.85, metalness: 0.05 });

  /* ---------- helpers ---------- */
  function roundedShape(w: number, h: number, r: number, notch?: typeof NOTCH) {
    const s = new THREE.Shape();
    const hw = w / 2;
    const hh = h / 2;
    s.moveTo(-hw + r, -hh);
    s.lineTo(hw - r, -hh);
    s.quadraticCurveTo(hw, -hh, hw, -hh + r);
    s.lineTo(hw, hh - r);
    s.quadraticCurveTo(hw, hh, hw - r, hh);
    if (notch) {
      // проріз під OLED у верхньому торці
      s.lineTo(notch.x1, hh);
      s.lineTo(notch.x1, hh - notch.d);
      s.lineTo(notch.x0, hh - notch.d);
      s.lineTo(notch.x0, hh);
    }
    s.lineTo(-hw + r, hh);
    s.quadraticCurveTo(-hw, hh, -hw, hh - r);
    s.lineTo(-hw, -hh + r);
    s.quadraticCurveTo(-hw, -hh, -hw + r, -hh);
    return s;
  }

  function slab(w: number, h: number, r: number, d: number, mat: THREE.Material, notch?: typeof NOTCH) {
    const g = new THREE.ExtrudeGeometry(roundedShape(w, h, r, notch), {
      depth: d, bevelEnabled: true, bevelThickness: 0.35, bevelSize: 0.35,
      bevelSegments: 2, curveSegments: 14,
    });
    g.computeBoundingBox();
    g.translate(0, 0, -g.boundingBox!.max.z); // лице деталі рівно на z=0
    const m = new THREE.Mesh(g, mat);
    m.castShadow = m.receiveShadow = true;
    return m;
  }

  function keyTexture(ch: string) {
    const S = 128;
    const c = document.createElement("canvas");
    c.width = c.height = S;
    const x = c.getContext("2d")!;
    x.fillStyle = "#333c2d";
    x.fillRect(0, 0, S, S);
    const gr = x.createLinearGradient(0, 0, 0, S);
    gr.addColorStop(0, "rgba(255,255,255,.09)");
    gr.addColorStop(1, "rgba(0,0,0,.22)");
    x.fillStyle = gr;
    x.fillRect(0, 0, S, S);
    x.fillStyle = "#dbcda6";
    x.textAlign = "center";
    x.textBaseline = "middle";
    x.font = '600 74px system-ui,"Segoe UI",sans-serif';
    x.fillText(ch, S / 2, S / 2 + 3);
    const t = new THREE.CanvasTexture(c);
    t.anisotropy = 8;
    t.colorSpace = THREE.SRGBColorSpace;
    return t;
  }

  function logoTexture() {
    const S = 512;
    const c = document.createElement("canvas");
    c.width = c.height = S;
    const x = c.getContext("2d")!;
    x.clearRect(0, 0, S, S);
    x.strokeStyle = "#dbcda6";
    x.fillStyle = "#dbcda6";
    x.lineCap = "round";
    x.lineJoin = "round";
    // розірване коло
    x.lineWidth = 26;
    x.beginPath();
    x.arc(S / 2, S / 2, 190, -Math.PI * 0.42, Math.PI * 0.42);
    x.stroke();
    x.beginPath();
    x.arc(S / 2, S / 2, 190, Math.PI * 0.58, Math.PI * 1.42);
    x.stroke();
    // центральний стрижень зі стрілою
    x.lineWidth = 30;
    x.beginPath();
    x.moveTo(S / 2, 86);
    x.lineTo(S / 2, 430);
    x.stroke();
    x.beginPath();
    x.moveTo(S / 2, 60);
    x.lineTo(S / 2 - 40, 132);
    x.lineTo(S / 2 + 40, 132);
    x.closePath();
    x.fill();
    // бічні зубці
    for (const s of [-1, 1]) {
      x.lineWidth = 28;
      x.beginPath();
      x.moveTo(S / 2 + s * 96, 150);
      x.lineTo(S / 2 + s * 96, 286);
      x.lineTo(S / 2 + s * 22, 372);
      x.stroke();
      x.beginPath();
      x.moveTo(S / 2 + s * 96, 126);
      x.lineTo(S / 2 + s * 56, 192);
      x.lineTo(S / 2 + s * 136, 192);
      x.closePath();
      x.fill();
    }
    // нижнє вістря
    x.beginPath();
    x.moveTo(S / 2, 452);
    x.lineTo(S / 2 - 34, 392);
    x.lineTo(S / 2 + 34, 392);
    x.closePath();
    x.fill();
    const t = new THREE.CanvasTexture(c);
    t.anisotropy = 8;
    t.colorSpace = THREE.SRGBColorSpace;
    return t;
  }

  function wordTexture() {
    const w = 512;
    const h = 128;
    const c = document.createElement("canvas");
    c.width = w;
    c.height = h;
    const x = c.getContext("2d") as CanvasRenderingContext2D & { letterSpacing?: string };
    x.clearRect(0, 0, w, h);
    x.fillStyle = "#dbcda6";
    x.textAlign = "center";
    x.textBaseline = "middle";
    x.font = '700 82px system-ui,"Segoe UI",sans-serif';
    x.letterSpacing = "14px";
    x.fillText("SICH", w / 2, h / 2 + 4);
    const t = new THREE.CanvasTexture(c);
    t.anisotropy = 8;
    t.colorSpace = THREE.SRGBColorSpace;
    return t;
  }

  let oledCtx: CanvasRenderingContext2D | null = null;
  let oledTex: THREE.CanvasTexture | null = null;
  let oledMsgs = 2;
  let oledPct = 82;

  function oledTexture() {
    const w = 1024;
    const h = 256;
    const c = document.createElement("canvas");
    c.width = w;
    c.height = h;
    oledCtx = c.getContext("2d");
    oledTex = new THREE.CanvasTexture(c);
    oledTex.anisotropy = 8;
    oledTex.colorSpace = THREE.SRGBColorSpace;
    drawOled();
    return oledTex;
  }

  function drawOled() {
    const x = oledCtx;
    if (!x || !oledTex) return;
    const w = 1024;
    const h = 256;
    const C = "#3ee0ff";
    const d = new Date();
    x.fillStyle = "#000";
    x.fillRect(0, 0, w, h);
    x.fillStyle = C;
    x.textBaseline = "middle";
    x.textAlign = "left";

    // годинник, двокрапка блимає раз на секунду
    const hh = String(d.getHours()).padStart(2, "0");
    const mm = String(d.getMinutes()).padStart(2, "0");
    x.font = "700 116px ui-monospace,Menlo,Consolas,monospace";
    const X0 = 16;
    const Y0 = h / 2 - 4;
    const wHH = x.measureText(hh).width;
    const wCol = x.measureText(":").width;
    x.fillText(hh, X0, Y0); // місце під двокрапку тримається завжди
    if (d.getSeconds() % 2 === 0) {
      x.textAlign = "center";
      x.fillText(":", X0 + wHH + wCol / 2, Y0);
      x.textAlign = "left";
    }
    x.fillText(mm, X0 + wHH + wCol, Y0);

    // конверт: блимає, поки є непрочитані
    const bx = 442;
    const by = h / 2 - 44;
    const bw = 92;
    const bh = 68;
    if (oledMsgs === 0 || d.getSeconds() % 2 === 0) {
      x.lineWidth = 8;
      x.strokeStyle = C;
      x.strokeRect(bx, by, bw, bh);
      x.beginPath();
      x.moveTo(bx, by);
      x.lineTo(bx + bw / 2, by + 38);
      x.lineTo(bx + bw, by);
      x.stroke();
    }
    if (oledMsgs > 0) {
      x.font = "700 68px ui-monospace,Menlo,Consolas,monospace";
      x.fillText(String(oledMsgs), bx + bw + 16, h / 2 - 2);
    }

    // відсоток заряду
    x.font = "700 66px ui-monospace,Menlo,Consolas,monospace";
    x.textAlign = "right";
    x.fillText(oledPct + "%", 866, h / 2 - 2);
    x.textAlign = "left";

    // батарея
    const gx = 884;
    const gy = h / 2 - 40;
    const gw = 100;
    const gh = 80;
    x.lineWidth = 8;
    x.strokeStyle = C;
    x.strokeRect(gx, gy, gw, gh);
    x.fillRect(gx + gw, gy + 24, 12, 32);
    const n = Math.max(0, Math.min(4, Math.round(oledPct / 25)));
    for (let i = 0; i < n; i++) x.fillRect(gx + 11 + i * 21, gy + 13, 15, 54);

    oledTex.needsUpdate = true;
  }

  /* ---------- збірка ---------- */
  const device = new THREE.Group();

  // передня панель: z від -T_FRONT до 0
  const front = slab(W, H, 6, T_FRONT, matBody);
  front.position.set(W / 2, H / 2, 0);
  device.add(front);

  // піддон
  const back = slab(W, H, 6, T_BACK, matBack, NOTCH);
  back.position.set(W / 2, H / 2, -T_FRONT);
  device.add(back);

  // плита батарейного модуля
  const plate = slab(W, H, 6, T_PLATE, matGrip);
  plate.position.set(W / 2, H / 2, Z_BACK);
  device.add(plate);

  // тубуси 18650 + корки
  for (const tx of TUBE_X) {
    const len = TUBE_Y1 - TUBE_Y0;
    const tube = new THREE.Mesh(new THREE.CylinderGeometry(TUBE_R, TUBE_R, len, 48, 1, false), matGrip);
    tube.position.set(tx, (TUBE_Y0 + TUBE_Y1) / 2, Z_AXIS);
    tube.castShadow = tube.receiveShadow = true;
    device.add(tube);
    const cap = new THREE.Mesh(new THREE.CylinderGeometry(TUBE_R, TUBE_R, CAP_Y1 - CAP_Y0, 48), matCapM);
    cap.position.set(tx, (CAP_Y0 + CAP_Y1) / 2, Z_AXIS);
    cap.castShadow = true;
    device.add(cap);
    // флейти на корку
    for (let i = 0; i < 12; i++) {
      const a = (i / 12) * Math.PI * 2;
      const f = new THREE.Mesh(new THREE.CylinderGeometry(1.3, 1.3, CAP_Y1 - CAP_Y0 - 1, 10), matBack);
      f.position.set(tx + TUBE_R * Math.cos(a), (CAP_Y0 + CAP_Y1) / 2, Z_AXIS + TUBE_R * Math.sin(a));
      device.add(f);
    }
  }

  // екран
  {
    const w = SCREEN.x1 - SCREEN.x0;
    const h = SCREEN.y1 - SCREEN.y0;
    const bez = new THREE.Mesh(new THREE.BoxGeometry(w + 3.0, h + 3.0, 0.9), matBezel);
    bez.position.set((SCREEN.x0 + SCREEN.x1) / 2, (SCREEN.y0 + SCREEN.y1) / 2, 0.3);
    device.add(bez);
    const sc = new THREE.Mesh(new THREE.PlaneGeometry(w, h), matScreen);
    sc.position.set((SCREEN.x0 + SCREEN.x1) / 2, (SCREEN.y0 + SCREEN.y1) / 2, 0.78);
    device.add(sc);
  }

  // клавіші
  const KEY = 4.8;
  const KEY_H = 1.86;
  const keyGeo = new THREE.BoxGeometry(KEY, KEY, KEY_H);
  function addKey(ch: string, x: number, y: number) {
    const mats = [
      matKey, matKey, matKey, matKey,
      new THREE.MeshStandardMaterial({ map: keyTexture(ch), roughness: 0.88, metalness: 0.03 }),
      matKey,
    ];
    const m = new THREE.Mesh(keyGeo, mats);
    m.position.set(x, y, KEY_H / 2);
    m.castShadow = true;
    device.add(m);
  }
  for (const r of ROWS) r.keys.forEach((ch, i) => addKey(ch, r.xs[i], r.y));
  for (const [ch, x, y] of DPAD) addKey(ch, x, y);

  // логотип і напис (смоляна інкрустація)
  {
    const lw = LOGO.x1 - LOGO.x0;
    const lh = LOGO.y1 - LOGO.y0;
    const lm = new THREE.MeshStandardMaterial({
      map: logoTexture(), transparent: true, roughness: 0.32, metalness: 0.3,
    });
    const l = new THREE.Mesh(new THREE.PlaneGeometry(lw, lh), lm);
    l.position.set((LOGO.x0 + LOGO.x1) / 2, (LOGO.y0 + LOGO.y1) / 2, 0.12);
    device.add(l);
    const ww = WORD.x1 - WORD.x0;
    const wh = WORD.y1 - WORD.y0;
    const wm = new THREE.MeshStandardMaterial({
      map: wordTexture(), transparent: true, roughness: 0.32, metalness: 0.3,
    });
    const t = new THREE.Mesh(new THREE.PlaneGeometry(ww, wh * 1.6), wm);
    t.position.set((WORD.x0 + WORD.x1) / 2, (WORD.y0 + WORD.y1) / 2, 0.12);
    device.add(t);
  }

  // гвинти
  const screwGeo = new THREE.CylinderGeometry(1.3, 1.3, 0.6, 20);
  for (const [x, y] of SCREWS) {
    const s = new THREE.Mesh(screwGeo, matCapM);
    s.rotation.x = Math.PI / 2;
    s.position.set(x, y, 0.1);
    device.add(s);
  }

  // 0.91" OLED — у неглибокій виїмці піддона, під козирком передньої панелі
  {
    const zc = -(T_FRONT + T_BACK / 2);
    const hs = new THREE.Mesh(new THREE.BoxGeometry(OLED.w - 0.3, OLED.modT, OLED.modD), matBezel);
    hs.position.set(OLED.cx, H - 0.3 - OLED.modT / 2, zc);
    hs.castShadow = true;
    device.add(hs);
    const pcb = new THREE.Mesh(
      new THREE.BoxGeometry(OLED.w - 0.3, 1.2, OLED.modD),
      new THREE.MeshStandardMaterial({ color: 0x1b3f6b, roughness: 0.8, metalness: 0.05 })
    );
    pcb.position.set(OLED.cx, H - 0.3 - OLED.modT - 0.6, zc);
    device.add(pcb);
    const px = new THREE.Mesh(
      new THREE.PlaneGeometry(OLED.aw, OLED.ah),
      new THREE.MeshBasicMaterial({ map: oledTexture(), side: THREE.DoubleSide })
    );
    px.rotation.x = -Math.PI / 2;
    px.position.set(OLED.cx, H - 0.26, zc);
    device.add(px);
  }

  // антени
  for (const a of ANT) {
    const base = new THREE.Mesh(new THREE.CylinderGeometry(4.5, 4.5, 7, 24), matSMA);
    base.position.set(a.x, H + 3.5, Z_ANT);
    device.add(base);
    const nut = new THREE.Mesh(new THREE.CylinderGeometry(5, 5, 3, 6), matSMA);
    nut.position.set(a.x, H + 1.5, Z_ANT);
    device.add(nut);
    const whip = new THREE.Mesh(new THREE.CylinderGeometry(a.r * 0.72, a.r, a.len, 24), matWhip);
    whip.position.set(a.x, H + 7 + a.len / 2, Z_ANT);
    whip.castShadow = true;
    device.add(whip);
    const tip = new THREE.Mesh(
      new THREE.SphereGeometry(a.r * 0.72, 20, 14),
      new THREE.MeshStandardMaterial({
        color: a.col, roughness: 0.4, metalness: 0.3,
        emissive: a.col, emissiveIntensity: 0.25,
      })
    );
    tip.position.set(a.x, H + 7 + a.len, Z_ANT);
    device.add(tip);
  }

  device.position.set(-W / 2, -H / 2, 0);
  const root = new THREE.Group();
  root.add(device);

  /* ---------- сцена ---------- */
  const renderer = new THREE.WebGLRenderer({
    antialias: true, alpha: true, powerPreference: "high-performance",
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearAlpha(0);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  renderer.domElement.style.display = "block";
  renderer.domElement.style.width = "100%";
  renderer.domElement.style.height = "100%";
  container.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  scene.add(root);

  const camera = new THREE.PerspectiveCamera(34, 1, 1, 3000);

  const hemi = new THREE.HemisphereLight(0xcfe0c0, 0x181c12, 1.7);
  scene.add(hemi);
  const key = new THREE.DirectionalLight(0xffffff, 2.4);
  key.position.set(-140, 190, 240);
  key.castShadow = true;
  key.shadow.mapSize.set(1024, 1024);
  Object.assign(key.shadow.camera, {
    left: -190, right: 190, top: 230, bottom: -230, near: 1, far: 900,
  });
  key.shadow.camera.updateProjectionMatrix();
  scene.add(key);
  const fill = new THREE.DirectionalLight(0x9fb488, 0.9);
  fill.position.set(210, 60, -160);
  scene.add(fill);
  const rim = new THREE.DirectionalLight(0xe8d9b0, 1.15);
  rim.position.set(60, -120, -220);
  scene.add(rim);

  const controls = new OrbitControls(camera, renderer.domElement);
  // OrbitControls sets touch-action: none on the canvas, which blocks page
  // scrolling on phones. Set it back after: a vertical swipe scrolls the page,
  // a horizontal drag rotates the device, two fingers zoom.
  renderer.domElement.style.touchAction = "pan-y";
  controls.enableDamping = true;
  controls.dampingFactor = 0.07;
  controls.enablePan = false;
  controls.autoRotateSpeed = 1.6;
  controls.enabled = opts.interactive !== false;
  controls.autoRotate = !!opts.autoRotate;
  // The device sits inside a scrolling page, so the wheel must keep scrolling
  // it. Zoom is armed only for Ctrl/⌘ + wheel and for touch (pinch). Both
  // listeners sit on the container in the capture phase so they run before
  // OrbitControls' own handlers on the canvas.
  controls.enableZoom = false;
  const armWheelZoom = (e: WheelEvent) => {
    controls.enableZoom = controls.enabled && (e.ctrlKey || e.metaKey);
  };
  const armTouchZoom = (e: PointerEvent) => {
    if (e.pointerType === "touch") controls.enableZoom = controls.enabled;
  };
  container.addEventListener("wheel", armWheelZoom, { capture: true, passive: true });
  container.addEventListener("pointerdown", armTouchZoom, true);

  /* ---------- кадрування під контейнер ---------- */
  // The whole product is framed, antennas included — nothing is ever cut off
  // by the canvas edge. Room for the whips comes from the canvas itself: the
  // component lets it bleed above its layout box (see Device3D `bleedTop`),
  // so the antennas rise behind the surrounding text instead of being cropped.
  const box = new THREE.Box3().setFromObject(root);
  const center = box.getCenter(new THREE.Vector3());
  const corners: THREE.Vector3[] = [];
  for (const cx of [box.min.x, box.max.x])
    for (const cy of [box.min.y, box.max.y])
      for (const cz of [box.min.z, box.max.z]) corners.push(new THREE.Vector3(cx, cy, cz));

  const WORLD_UP = new THREE.Vector3(0, 1, 0);
  const PAD = 1.02;

  /** Distance at which the whole product fits the container's aspect ratio. */
  function fitDistance(dir: THREE.Vector3) {
    const forward = dir.clone().normalize();
    const right = new THREE.Vector3().crossVectors(forward, WORLD_UP);
    if (right.lengthSq() < 1e-6) right.set(1, 0, 0);
    right.normalize();
    const up = new THREE.Vector3().crossVectors(right, forward).normalize();
    let halfW = 0;
    let halfH = 0;
    let halfD = 0;
    const v = new THREE.Vector3();
    for (const c of corners) {
      v.copy(c).sub(center);
      halfW = Math.max(halfW, Math.abs(v.dot(right)));
      halfH = Math.max(halfH, Math.abs(v.dot(up)));
      halfD = Math.max(halfD, Math.abs(v.dot(forward)));
    }
    const vt = Math.tan(((camera.fov / 2) * Math.PI) / 180);
    const ht = vt * camera.aspect;
    return Math.max(halfH / vt, halfW / ht) * PAD + halfD;
  }

  let view: ViewKey = opts.view ?? "iso";
  let target: { pos: THREE.Vector3; tgt: THREE.Vector3 } | null = null;

  function viewPosition(v: ViewKey) {
    const dir = VIEWS[v].clone().normalize();
    return center.clone().add(dir.multiplyScalar(fitDistance(VIEWS[v])));
  }

  function applyView(v: ViewKey, animate: boolean) {
    view = v;
    const pos = viewPosition(v);
    const d = pos.distanceTo(center);
    controls.minDistance = d * 0.35;
    controls.maxDistance = d * 2.0;
    if (animate) {
      target = { pos, tgt: center.clone() };
    } else {
      camera.position.copy(pos);
      controls.target.copy(center);
      controls.update();
    }
  }

  function resize() {
    const w = Math.max(1, container.clientWidth);
    const h = Math.max(1, container.clientHeight);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h, false);
    // the fit depends on the aspect ratio — re-frame on every resize
    const d = fitDistance(VIEWS[view]);
    controls.minDistance = d * 0.35;
    controls.maxDistance = d * 2.0;
    if (target) {
      target.pos.copy(viewPosition(view));
    } else {
      const dir = camera.position.clone().sub(controls.target);
      const cur = dir.length();
      if (cur > 0 && Math.abs(cur - d) > 1) {
        camera.position.copy(controls.target).add(dir.multiplyScalar(d / cur));
      }
    }
  }

  resize();
  applyView(view, false);

  const ro = new ResizeObserver(resize);
  ro.observe(container);

  const onStart = () => opts.onUserInput?.();
  controls.addEventListener("start", onStart);

  /* ---------- цикл ---------- */
  let raf = 0;
  let active = true;
  let lastSec = -1;
  let tMsg = 0;
  let tBat = 0;

  function loop() {
    raf = requestAnimationFrame(loop);
    const now = performance.now();
    const sec = new Date().getSeconds();
    if (sec !== lastSec) {
      lastSec = sec;
      drawOled();
    }
    if (now - tMsg > 9000) {
      tMsg = now;
      oledMsgs = (oledMsgs + 1) % 6;
      drawOled();
    }
    if (now - tBat > 6000) {
      tBat = now;
      oledPct = Math.max(12, oledPct - 1);
      drawOled();
    }
    if (target) {
      camera.position.lerp(target.pos, 0.08);
      controls.target.lerp(target.tgt, 0.08);
      if (camera.position.distanceTo(target.pos) < 0.5) target = null;
    }
    controls.update();
    renderer.render(scene, camera);
  }
  loop();

  return {
    setView(v) {
      applyView(v, true);
    },
    setAutoRotate(on) {
      controls.autoRotate = on;
    },
    setActive(on) {
      if (on === active) return;
      active = on;
      if (on) {
        tMsg = tBat = performance.now();
        loop();
      } else {
        cancelAnimationFrame(raf);
      }
    },
    dispose() {
      cancelAnimationFrame(raf);
      ro.disconnect();
      container.removeEventListener("wheel", armWheelZoom, true);
      container.removeEventListener("pointerdown", armTouchZoom, true);
      controls.removeEventListener("start", onStart);
      controls.dispose();
      scene.traverse((o) => {
        const m = o as THREE.Mesh;
        if (m.geometry) m.geometry.dispose();
        const mat = m.material as THREE.Material | THREE.Material[] | undefined;
        if (!mat) return;
        for (const one of Array.isArray(mat) ? mat : [mat]) {
          const rec = one as unknown as Record<string, unknown>;
          for (const k of ["map", "emissiveMap", "normalMap", "roughnessMap"]) {
            const tex = rec[k] as THREE.Texture | undefined;
            if (tex && typeof tex.dispose === "function") tex.dispose();
          }
          one.dispose();
        }
      });
      renderer.dispose();
      renderer.domElement.remove();
    },
  };
}
