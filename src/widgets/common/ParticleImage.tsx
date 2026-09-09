// SVG Particle Image — adapted from Originkit for Sparkz 2K26
"use client";
import { useEffect, useRef } from "react";

// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────

function containRect(
  iW: number, iH: number, cW: number, cH: number
) {
  const a = iW / iH, b = cW / cH;
  return a > b
    ? { x: 0, y: Math.round((cH - cW / a) / 2), w: cW, h: Math.round(cW / a) }
    : { x: Math.round((cW - cH * a) / 2), y: 0, w: Math.round(cH * a), h: cH };
}

function parseColor(c: string) {
  if (!c) return { r: 200, g: 200, b: 200, a: 255 };
  const m = c.match(
    /rgba?\(\s*([\d.]+),\s*([\d.]+),\s*([\d.]+)(?:,\s*([\d.]+))?\s*\)/
  );
  if (m) {
    return {
      r: +m[1] | 0,
      g: +m[2] | 0,
      b: +m[3] | 0,
      a: m[4] != null ? Math.round(+m[4] * 255) : 255,
    };
  }
  const h = c.replace("#", "");
  if (h.length >= 6) {
    return {
      r: parseInt(h.slice(0, 2), 16),
      g: parseInt(h.slice(2, 4), 16),
      b: parseInt(h.slice(4, 6), 16),
      a: h.length === 8 ? parseInt(h.slice(6, 8), 16) : 255,
    };
  }
  return { r: 200, g: 200, b: 200, a: 255 };
}

function shuffle<T>(a: T[]) {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
}

function randomInShape(
  shape: string,
  bx: number, by: number, bw: number, bh: number
): [number, number] {
  const cx = bx + bw / 2, cy = by + bh / 2;
  if (shape === "circle") {
    const r = bw / 2;
    const a = Math.random() * Math.PI * 2;
    const d = Math.sqrt(Math.random()) * r;
    return [cx + Math.cos(a) * d, cy + Math.sin(a) * d];
  }
  if (shape === "oval") {
    const rx = bw / 2, ry = bh / 2;
    const a = Math.random() * Math.PI * 2;
    const d = Math.sqrt(Math.random());
    return [cx + d * rx * Math.cos(a), cy + d * ry * Math.sin(a)];
  }
  return [bx + Math.random() * bw, by + Math.random() * bh];
}

type EaseName = "easeOut" | "easeInOut" | "easeIn" | "backOut" | "circOut" | "linear";
const EASE: Record<EaseName, (t: number) => number> = {
  easeOut:  (t) => 1 - (1 - t) * (1 - t),
  easeInOut:(t) => t < 0.5 ? 2 * t * t : 1 - 2 * (1 - t) * (1 - t),
  easeIn:   (t) => t * t,
  backOut:  (t) => {
    const c = 1.70158 + 1;
    return 1 + c * (t - 1) ** 3 + 1.70158 * (t - 1) ** 2;
  },
  circOut:  (t) => Math.sqrt(1 - (t - 1) * (t - 1)),
  linear:   (t) => t,
};

interface Transition {
  type?: "spring";
  stiffness?: number;
  damping?: number;
  mass?: number;
  ease?: EaseName;
  duration?: number;
}

function getTransitionParams(tr?: Transition) {
  if (!tr) return { easeFn: EASE.easeOut, durMs: 800 };
  if (tr.type === "spring") {
    const k = tr.stiffness ?? 100, d = tr.damping ?? 15, m = tr.mass ?? 1;
    const durMs = Math.min(3000, Math.max(300, (d / (2 * Math.sqrt(k * m))) * 2000));
    return { easeFn: EASE.backOut, durMs };
  }
  return {
    easeFn: EASE[tr.ease ?? "easeOut"] ?? EASE.easeOut,
    durMs: (tr.duration ?? 0.8) * 1000,
  };
}

interface SrcParticle {
  homeX: number; homeY: number;
  r: number; g: number; b: number; a: number;
}

interface Particle extends SrcParticle {
  x: number; y: number;
  vx: number; vy: number;
  startX: number; startY: number;
  repX: number; repY: number;
  repVX: number; repVY: number;
  idleX: number; idleY: number;
  totalDist: number;
  isPadding: boolean;
  isExtra: boolean;
  inZone: boolean;
  roamTargetX: number; roamTargetY: number;
  colorIdx: number;
  repTargetX: number; repTargetY: number;
}

function mkParticle(
  src: SrcParticle, x: number, y: number,
  idleX: number, idleY: number, isExtra = false
): Particle {
  return {
    x, y,
    vx: 0, vy: 0,
    startX: x, startY: y,
    repX: 0, repY: 0,
    repVX: 0, repVY: 0,
    homeX: src.homeX, homeY: src.homeY,
    idleX, idleY,
    r: src.r, g: src.g, b: src.b, a: src.a,
    totalDist: Math.max(1, Math.sqrt((src.homeX - x) ** 2 + (src.homeY - y) ** 2)),
    isPadding: false, isExtra, inZone: false,
    roamTargetX: 0, roamTargetY: 0,
    colorIdx: Math.floor(Math.random() * 10),
    repTargetX: 0, repTargetY: 0,
  };
}

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────

export interface ParticleImageProps {
  imageConfig?: {
    image?: string;
    mode?: "fit" | "px" | "%";
    sizeUnit?: "px" | "%";
    widthPx?: number;
    heightPx?: number;
    widthPct?: number;
    heightPct?: number;
    scale?: number;
  };
  particleShape?: "circle" | "square" | "cube" | "both";
  particleColor?: "original" | "single" | "multi" | "dark";
  singleColor?: string;
  multiColors?: string[];
  particleCount?: number;
  particleSize?: number;
  hoverEnabled?: boolean;
  hoverConfig?: {
    hoverType?: "roam" | "hide" | "scatter";
    transition?: Transition;
    roamWidth?: number;
    roamHeight?: number;
    roamShape?: string;
    roamOpacity?: number;
    hideType?: string;
  };
  repulsionEnabled?: boolean;
  repulsionConfig?: {
    repulsionMode?: "outside" | "random";
    repulsionForce?: number;
    repulsionRadius?: number;
  };
  autoCycle?: boolean;
  cycleInterval?: number;
  holdDuration?: number;
  width?: string | number;
  height?: string | number;
  style?: React.CSSProperties;
  className?: string;
}

// ─────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────

export default function ParticleImage(props: ParticleImageProps) {
  const {
    imageConfig,
    particleCount  = 35,
    particleSize   = 6,
    particleShape  = "circle",
    particleColor  = "original",
    singleColor    = "#C89C4A",
    multiColors    = ["#ECCB7D", "#C89C4A", "#8C6322", "#FBE8B5", "#ECCB7D"],
    hoverEnabled   = true,
    hoverConfig    = {},
    repulsionEnabled = true,
    repulsionConfig  = {},
    autoCycle      = true,
    cycleInterval  = 4500,
    holdDuration   = 2200,
    width  = "100%",
    height = "100%",
    style,
    className = "",
  } = props;

  const hover = hoverEnabled;
  const {
    hoverType   = "roam",
    transition,
    roamWidth   = 0,
    roamHeight  = 0,
    roamOpacity = 0.85,
    roamShape   = "rectangle",
    hideType    = "scatter",
  } = hoverConfig;

  const repulsion = repulsionEnabled;
  const {
    repulsionForce  = 8,
    repulsionRadius = 65,
    repulsionMode   = "outside",
  } = repulsionConfig;

  const image    = imageConfig?.image    ?? "/sparkz.svg";
  const mode     = imageConfig?.mode     ?? "fit";
  const sizeUnit = imageConfig?.sizeUnit ?? "%";
  const widthPx  = imageConfig?.widthPx  ?? 400;
  const heightPx = imageConfig?.heightPx ?? 400;
  const widthPct = imageConfig?.widthPct ?? 100;
  const heightPct= imageConfig?.heightPct?? 100;
  const scale    = imageConfig?.scale    ?? 9;

  const containerRef  = useRef<HTMLDivElement>(null);
  const canvasRef     = useRef<HTMLCanvasElement>(null);
  const mouseRef      = useRef({ x: -99999, y: -99999, active: false });
  const prevMouseRef  = useRef({ x: -99999, y: -99999 });
  const mouseSpeedRef = useRef(0);
  const smoothMouseRef= useRef({ x: -99999, y: -99999 });

  const physicsRef = useRef({
    hover, hoverType, transition, roamWidth, roamHeight,
    roamOpacity, roamShape, hideType,
    repulsion, repulsionForce, repulsionRadius, repulsionMode,
    particleSize, particleShape, particleColor, singleColor, multiColors,
  });
  physicsRef.current = {
    hover, hoverType, transition, roamWidth, roamHeight,
    roamOpacity, roamShape, hideType,
    repulsion, repulsionForce, repulsionRadius, repulsionMode,
    particleSize, particleShape, particleColor, singleColor, multiColors,
  };

  const sceneRef  = useRef<{ particles: Particle[] }>({ particles: [] });
  const dimsRef   = useRef({ W: 0, H: 0 });

  const samplingRef = useRef({
    image, mode, sizeUnit, widthPx, heightPx, widthPct, heightPct,
    scale, particleCount, hover, hoverType,
    roamWidth, roamHeight, roamShape, hideType,
  });
  samplingRef.current = {
    image, mode, sizeUnit, widthPx, heightPx, widthPct, heightPct,
    scale, particleCount, hover, hoverType,
    roamWidth, roamHeight, roamShape, hideType,
  };

  const animStateRef     = useRef<string>("active");
  const animRef          = useRef<number | null>(null);
  const animStartTimeRef = useRef(0);
  const animTimerRef     = useRef<ReturnType<typeof setTimeout> | null>(null);
  const roamFadeStartRef = useRef(0);
  const roamFadeFromRef  = useRef(1);
  const roamFadeToRef    = useRef(1);

  const startAnimRef = useRef<((s: string) => void) | null>(null);
  startAnimRef.current = (newState: string) => {
    const { particles } = sceneRef.current;
    const { W, H } = dimsRef.current;
    const {
      hoverType: ht, roamWidth: rw, roamHeight: rh,
      roamShape: rs, roamOpacity: rOp, transition: tr,
    } = physicsRef.current;
    const { durMs: _dur } = getTransitionParams(tr);
    const bw = Math.max(80, rw || W), bh = Math.max(80, rh || H);
    const bx = (W - bw) / 2, by = (H - bh) / 2;

    particles.forEach((p) => {
      if (p.isPadding) return;
      p.startX = p.x;
      p.startY = p.y;
      if (newState === "scattering" && ht === "roam") {
        const [tx, ty] = randomInShape(rs, bx, by, bw, bh);
        p.roamTargetX = tx; p.roamTargetY = ty;
        p.idleX = tx;       p.idleY = ty;
      }
    });

    const _rOp = rOp ?? 0.7;
    if (ht === "roam") {
      if (newState === "scattering") {
        roamFadeStartRef.current = Date.now();
        roamFadeFromRef.current  = 1;
        roamFadeToRef.current    = _rOp;
      } else if (newState === "assembling") {
        roamFadeStartRef.current = Date.now();
        roamFadeFromRef.current  = _rOp;
        roamFadeToRef.current    = 1;
      }
    }

    if (newState === "scattering" && ht === "roam") {
      if (animTimerRef.current) clearTimeout(animTimerRef.current);
      animStateRef.current = "idle";
      return;
    }

    animStartTimeRef.current = Date.now();
    animStateRef.current = newState;
    if (animTimerRef.current) clearTimeout(animTimerRef.current);
    const next = newState === "assembling" ? "active" : "idle";
    animTimerRef.current = setTimeout(() => {
      if (animStateRef.current === newState) animStateRef.current = next;
    }, _dur);
  };

  // ── Init particles ──────────────────────────
  const initParticles = () => {
    const {
      image: url, mode: md, sizeUnit: sU,
      widthPx: wPx, heightPx: hPx, widthPct: wPct, heightPct: hPct,
      scale: sc, particleCount: count,
      hover: hOn, hoverType: ht, roamWidth: rw, roamHeight: rh,
      roamShape: rs, hideType: hT,
    } = samplingRef.current;
    const { W, H } = dimsRef.current;
    if (!url || !W || !H) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    if (animTimerRef.current) clearTimeout(animTimerRef.current);

    const gap = Math.max(1, Math.round(300 / Math.max(1, count)));
    const dpr = window.devicePixelRatio || 1;
    canvas.width  = Math.round(W * dpr);
    canvas.height = Math.round(H * dpr);
    mouseRef.current = { x: -99999, y: -99999, active: false };
    sceneRef.current = { particles: [] };

    const tryLoad = (cors: boolean) => {
      const img = new window.Image();
      if (cors) img.crossOrigin = "anonymous";
      img.onerror = () => { if (cors) tryLoad(false); };
      img.onload = () => {
        let rect: { x: number; y: number; w: number; h: number };
        if (md === "fit") {
          const base = containRect(
            img.naturalWidth || img.width,
            img.naturalHeight || img.height, W, H
          );
          const f = Math.max(1, Math.min(20, sc)) / 10;
          const w = base.w * f, h = base.h * f;
          rect = { x: (W - w) / 2, y: (H - h) / 2, w, h };
        } else if (sU === "px") {
          const w = Math.min(wPx, W), h = Math.min(hPx, H);
          rect = { x: (W - w) / 2, y: (H - h) / 2, w, h };
        } else {
          const w = (W * wPct) / 100, h = (H * hPct) / 100;
          rect = { x: (W - w) / 2, y: (H - h) / 2, w, h };
        }

        const off = document.createElement("canvas");
        off.width  = W;
        off.height = H;
        const oc = off.getContext("2d")!;
        oc.drawImage(img, rect.x, rect.y, rect.w, rect.h);

        let px: Uint8ClampedArray;
        try { px = oc.getImageData(0, 0, W, H).data; }
        catch (_) { return; }

        const src: SrcParticle[] = [];
        for (let y = 0; y < H; y += gap) {
          for (let x = 0; x < W; x += gap) {
            const i = (y * W + x) * 4;
            if (px[i + 3] >= 20) {
              src.push({ homeX: x, homeY: y, r: px[i], g: px[i+1], b: px[i+2], a: px[i+3] });
            }
          }
        }
        shuffle(src);

        let particles: Particle[] = [];

        const hidePos = (homeX: number, homeY: number): [number, number] => {
          const range = hT === "in-place" ? 1 : 10;
          const maxD = Math.max(W, H);
          const d = (range / 10) * 0.5 * maxD;
          const angle = Math.random() * Math.PI * 2;
          return [homeX + Math.cos(angle) * d, homeY + Math.sin(angle) * d];
        };

        if (!hOn) {
          animStateRef.current = "active";
          particles = src.map((p) => mkParticle(p, p.homeX, p.homeY, p.homeX, p.homeY));
        } else if (ht === "roam") {
          const bw2 = Math.max(80, rw || W), bh2 = Math.max(80, rh || H);
          const bx2 = (W - bw2) / 2, by2 = (H - bh2) / 2;
          particles = src.map((p) => {
            const [rx, ry] = randomInShape(rs, bx2, by2, bw2, bh2);
            const pt = mkParticle(p, rx, ry, rx, ry);
            const [tx, ty] = randomInShape(rs, bx2, by2, bw2, bh2);
            pt.roamTargetX = tx; pt.roamTargetY = ty;
            pt.vx = (Math.random() - 0.5) * 1.2;
            pt.vy = (Math.random() - 0.5) * 1.2;
            return pt;
          });
          animStateRef.current = "idle";
        } else {
          particles = src.map((p) => {
            const [ox, oy] = hidePos(p.homeX, p.homeY);
            return mkParticle(p, ox, oy, ox, oy);
          });
          animStateRef.current = "idle";
        }
        sceneRef.current = { particles };
      };
      img.src = url;
    };
    tryLoad(true);
  };

  // ── Resize observer ─────────────────────────
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver((entries) => {
      const r = entries[0]?.contentRect;
      if (!r) return;
      const W = Math.round(r.width), H = Math.round(r.height);
      if (!W || !H) return;
      dimsRef.current = { W, H };
      initParticles();
    });
    ro.observe(el);
    return () => ro.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Re-init when sampling params change ─────
  useEffect(() => {
    initParticles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [image, mode, sizeUnit, widthPx, heightPx, widthPct, heightPct, scale,
      particleCount, hover, hoverType, roamWidth, roamHeight, roamShape, hideType]);

  // ── Render loop ─────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    let idata: ImageData | null = null, bW = 0, bH = 0;

    const draw = () => {
      animRef.current = requestAnimationFrame(draw);
      const PW = canvas.width, PH = canvas.height;
      if (!PW || !PH) return;
      const dpr = window.devicePixelRatio || 1;
      const { particles } = sceneRef.current;
      if (!particles.length) return;

      if (!idata || PW !== bW || PH !== bH) {
        idata = ctx.createImageData(PW, PH);
        bW = PW; bH = PH;
      }
      idata.data.fill(0);
      const buf = idata.data;

      const {
        hover: hOn, hoverType: ht, transition: tr,
        roamWidth: rw, roamHeight: rh, roamOpacity: rOp, roamShape: rs,
        repulsion: repOn, repulsionForce: rF, repulsionRadius: rR, repulsionMode: rMode,
        particleSize: pSz, particleShape: pShape, particleColor: pColor,
        singleColor: scColor, multiColors: mcColors,
      } = physicsRef.current;

      const state = animStateRef.current;
      const { x: rawMx, y: rawMy, active } = mouseRef.current;
      const hitSpeed = mouseSpeedRef.current;
      mouseSpeedRef.current *= 0.88;

      const sm = smoothMouseRef.current;
      if (active) {
        const lerpFactor = Math.max(0.08, 0.3 - hitSpeed * 0.006);
        if (sm.x < -9000) { sm.x = rawMx; sm.y = rawMy; }
        else { sm.x += (rawMx - sm.x) * lerpFactor; sm.y += (rawMy - sm.y) * lerpFactor; }
      } else { sm.x = -99999; sm.y = -99999; }
      const mx = sm.x, my = sm.y;

      const ps = Math.max(1, Math.ceil((pSz / 4) * dpr));
      const { easeFn, durMs } = getTransitionParams(tr);
      const elapsed = Date.now() - animStartTimeRef.current;
      const animT = easeFn(Math.min(1, elapsed / durMs));
      const { W: DW, H: DH } = dimsRef.current;
      const bw = Math.max(80, rw || DW), bh = Math.max(80, rh || DH);
      const bx = (DW - bw) / 2, by = (DH - bh) / 2;
      const half = ps / 2;
      const repCutoff = Math.max(1, rR);
      const repCutoffSq = repCutoff * repCutoff;
      let pIdx = 0;

      const drawParticle = (
        cx: number, cy: number,
        r: number, g: number, b: number, a: number,
        shapeType: string
      ) => {
        const px0 = Math.round(cx) - (ps >> 1);
        const py0 = Math.round(cy) - (ps >> 1);
        const s = Math.max(2, ps);
        const halfS = s >> 1;

        if (shapeType === "cube") {
          const rTop = Math.min(255, Math.round(r * 1.35) + 30);
          const gTop = Math.min(255, Math.round(g * 1.35) + 30);
          const bTop = Math.min(255, Math.round(b * 1.35) + 30);
          const rRight = Math.round(r * 0.6);
          const gRight = Math.round(g * 0.6);
          const bRight = Math.round(b * 0.6);
          for (let dy = 0; dy < s; dy++) {
            const iy = py0 + dy;
            if (iy < 0 || iy >= PH) continue;
            const row = iy * PW;
            for (let dx = 0; dx < s; dx++) {
              const ix = px0 + dx;
              if (ix < 0 || ix >= PW) continue;
              const i = (row + ix) * 4;
              if (dy < Math.max(1, halfS * 0.75)) {
                buf[i] = rTop; buf[i+1] = gTop; buf[i+2] = bTop;
              } else if (dx < halfS) {
                buf[i] = r; buf[i+1] = g; buf[i+2] = b;
              } else {
                buf[i] = rRight; buf[i+1] = gRight; buf[i+2] = bRight;
              }
              buf[i+3] = a;
            }
          }
          return;
        }

        for (let dy = 0; dy < ps; dy++) {
          const iy = py0 + dy;
          if (iy < 0 || iy >= PH) continue;
          const row = iy * PW;
          for (let dx = 0; dx < ps; dx++) {
            if (shapeType === "circle") {
              const ddx = dx - half + 0.5, ddy = dy - half + 0.5;
              if (ddx * ddx + ddy * ddy > half * half) continue;
            }
            const ix = px0 + dx;
            if (ix < 0 || ix >= PW) continue;
            const i = (row + ix) * 4;
            buf[i] = r; buf[i+1] = g; buf[i+2] = b; buf[i+3] = a;
          }
        }
      };

      for (const p of particles) {
        const pCurrentShape =
          pShape === "both" ? (pIdx % 2 === 1 ? "circle" : "cube") : pShape;
        pIdx++;
        if (p.isPadding) continue;

        let baseX = p.x, baseY = p.y;
        if (state === "assembling") {
          baseX = p.startX + (p.homeX - p.startX) * animT;
          baseY = p.startY + (p.homeY - p.startY) * animT;
        } else if (state === "scattering") {
          baseX = p.startX + (p.idleX - p.startX) * animT;
          baseY = p.startY + (p.idleY - p.startY) * animT;
        } else if (state === "active") {
          baseX = p.homeX; baseY = p.homeY;
        } else if (state === "idle") {
          if (ht === "roam") {
            const dtx = p.roamTargetX - p.x, dty = p.roamTargetY - p.y;
            if (Math.sqrt(dtx * dtx + dty * dty) < 3) {
              const [tx, ty] = randomInShape(rs, bx, by, bw, bh);
              p.roamTargetX = tx; p.roamTargetY = ty;
            }
            p.vx = (p.vx || 0) * 0.98 + (p.roamTargetX - p.x) * 0.003;
            p.vy = (p.vy || 0) * 0.98 + (p.roamTargetY - p.y) * 0.003;
            const sp2 = Math.sqrt(p.vx ** 2 + p.vy ** 2);
            if (sp2 > 1.5) { p.vx = (p.vx / sp2) * 1.5; p.vy = (p.vy / sp2) * 1.5; }
            p.x += p.vx; p.y += p.vy;
            baseX = p.x; baseY = p.y;
          } else {
            baseX = p.idleX; baseY = p.idleY;
          }
        }

        // Repulsion
        if (repOn) {
          if (rMode === "random") {
            const dx = baseX - rawMx, dy = baseY - rawMy;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < repCutoff) {
              if (!p.inZone) {
                const angle = Math.random() * Math.PI * 2;
                const d = Math.random() * rF * 5;
                p.repTargetX = Math.cos(angle) * d;
                p.repTargetY = Math.sin(angle) * d;
                p.inZone = true;
              }
              p.repX += (p.repTargetX - p.repX) * 0.15;
              p.repY += (p.repTargetY - p.repY) * 0.15;
            } else {
              p.inZone = false;
            }
          } else {
            if (active) {
              const dx = baseX - mx, dy = baseY - my;
              const distSq = dx * dx + dy * dy;
              if (distSq > 0 && distSq < repCutoffSq) {
                const dist = Math.sqrt(distSq);
                const nx = dx / dist, ny = dy / dist;
                const falloff = 1 - dist / repCutoff;
                const push = falloff * hitSpeed * rF * 0.05;
                p.repX += nx * push;
                p.repY += ny * push;
                const targetRepX = nx * (repCutoff - dist);
                const targetRepY = ny * (repCutoff - dist);
                p.repX += (targetRepX - p.repX) * 0.06;
                p.repY += (targetRepY - p.repY) * 0.06;
                p.inZone = true;
              } else {
                p.inZone = false;
              }
            } else {
              p.inZone = false;
            }
          }
        } else {
          p.inZone = false;
        }

        if (!p.inZone) { p.repX *= 0.97; p.repY *= 0.97; }
        p.x = baseX + p.repX;
        p.y = baseY + p.repY;

        // Colour resolve
        let dr = p.r, dg = p.g, db = p.b, da = p.a;
        if (state !== "active") {
          if (p.isExtra) {
            if (state === "assembling")  da = Math.round(p.a * animT);
            else if (state === "scattering") da = Math.round(p.a * (1 - animT));
            else da = 0;
          } else if (ht === "roam" && hOn) {
            let alphaMul: number;
            if (roamFadeStartRef.current === 0) {
              alphaMul = rOp ?? 0.85;
            } else {
              const fadeElapsed = Date.now() - roamFadeStartRef.current;
              const fadeT = Math.min(1, Math.max(0, fadeElapsed / durMs));
              alphaMul = roamFadeFromRef.current +
                (roamFadeToRef.current - roamFadeFromRef.current) * easeFn(fadeT);
            }
            da = Math.round(p.a * alphaMul);
          } else if (ht === "hide" && hOn) {
            let alphaMul = 1;
            if (state === "idle") alphaMul = 0;
            else if (state === "assembling")  alphaMul = animT;
            else if (state === "scattering")  alphaMul = 1 - animT;
            da = Math.round(p.a * alphaMul);
          }
        }

        if (da < 1) continue;

        // Colour mode
        if (pColor === "single") {
          const sc2 = parseColor(scColor);
          dr = sc2.r; dg = sc2.g; db = sc2.b;
        } else if (pColor === "multi" || pColor === "dark") {
          const cols = (mcColors || ["#C89C4A"]).filter(Boolean);
          if (cols.length > 0) {
            const mc = parseColor(cols[p.colorIdx % cols.length]);
            dr = mc.r; dg = mc.g; db = mc.b;
          }
        } else if (pColor === "original") {
          /*
           * Sparkz vibrant metallic-gold high-contrast grading:
           * Smooth luminance-to-gold mapping with deep burnished bronze shadows,
           * rich 24K warm gold body, and gleaming golden highlights.
           */
          const lum = (0.299 * dr + 0.587 * dg + 0.114 * db) / 255;
          let t = (lum - 0.20) / 0.75;
          t = t < 0 ? 0 : t > 1 ? 1 : t;
          t = t * t * (3 - 2 * t); // smoothstep S-curve for punchy contrast

          if (t < 0.28) {
            const f = t / 0.28;
            dr = Math.round(50 + 85 * f);
            dg = Math.round(28 + 52 * f);
            db = Math.round(3 + 7 * f);
          } else if (t < 0.58) {
            const f = (t - 0.28) / 0.30;
            dr = Math.round(135 + 85 * f);
            dg = Math.round(80 + 72 * f);
            db = Math.round(10 + 14 * f);
          } else if (t < 0.84) {
            const f = (t - 0.58) / 0.26;
            dr = Math.round(220 + 35 * f);
            dg = Math.round(152 + 53 * f);
            db = Math.round(24 + 21 * f);
          } else {
            const f = (t - 0.84) / 0.16;
            dr = 255;
            dg = Math.round(205 + 33 * f);
            db = Math.round(45 + 90 * f);
          }
        }

        drawParticle(p.x * dpr, p.y * dpr, dr, dg, db, da, pCurrentShape);
      }
      ctx.putImageData(idata, 0, 0);
    };

    draw();
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, []);

  // ── Auto-cycle ──────────────────────────────
  useEffect(() => {
    if (!autoCycle) return;
    let intervalTimer: ReturnType<typeof setInterval> | null = null;
    let holdTimer:     ReturnType<typeof setTimeout>  | null = null;

    const triggerAssembleAndDisperse = () => {
      if (mouseRef.current.active) return;
      startAnimRef.current?.("assembling");
      holdTimer = setTimeout(() => {
        if (!mouseRef.current.active) startAnimRef.current?.("scattering");
      }, holdDuration);
    };

    const initTimer = setTimeout(() => {
      triggerAssembleAndDisperse();
      intervalTimer = setInterval(triggerAssembleAndDisperse, cycleInterval);
    }, 1200);

    return () => {
      clearTimeout(initTimer);
      if (holdTimer) clearTimeout(holdTimer);
      if (intervalTimer) clearInterval(intervalTimer);
    };
  }, [autoCycle, cycleInterval, holdDuration]);

  // ── Mouse handlers ──────────────────────────
  const onMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const { W, H } = dimsRef.current;
    const scaleX = rect.width  > 0 ? W / rect.width  : 1;
    const scaleY = rect.height > 0 ? H / rect.height : 1;
    const mx = (e.clientX - rect.left) * scaleX;
    const my = (e.clientY - rect.top)  * scaleY;
    const prev = prevMouseRef.current;
    if (prev.x > -9999) {
      const ddx = mx - prev.x, ddy = my - prev.y;
      mouseSpeedRef.current = Math.sqrt(ddx * ddx + ddy * ddy);
    }
    prevMouseRef.current = { x: mx, y: my };
    mouseRef.current = { x: mx, y: my, active: true };
    if (physicsRef.current.hover) {
      const s = animStateRef.current;
      if (s === "idle" || s === "scattering") startAnimRef.current?.("assembling");
    }
  };

  const onMouseLeave = () => {
    mouseRef.current = { x: -99999, y: -99999, active: false };
    if (physicsRef.current.hover && !autoCycle) {
      const s = animStateRef.current;
      if (s === "assembling" || s === "active") startAnimRef.current?.("scattering");
    }
  };

  return (
    <div
      ref={containerRef}
      className={className}
      style={{ position: "relative", width, height, overflow: "hidden", ...style }}
    >
      <canvas
        ref={canvasRef}
        style={{ display: "block", width: "100%", height: "100%" }}
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseLeave}
      />
    </div>
  );
}
