import { useEffect, useRef, useState } from 'react';
import { LAND_MASK, LAND_W, LAND_H } from '../data/landMask';
import styles from './Hero.module.css';

/*
 * Particle globe — raw WebGL1 (no three.js), one draw call of GL_POINTS.
 * Land = coral/peach dots from an embedded 1-bit equirectangular mask,
 * ocean = sparse soft dots, plus a thin halo of dust. Rotation, twinkle,
 * parallax and the intro zoom all happen in the vertex shader (uniforms only).
 */

const VERT = `
attribute vec3 aPos;
attribute vec3 aData; // x: kind (0 ocean, 1 land, 2 dust), y: phase, z: rand
uniform float uTime;
uniform float uRot;
uniform vec2 uTilt;
uniform float uScale;
uniform vec2 uCenter;
uniform float uRadius;
uniform float uAspect;
uniform float uPx;
uniform float uIntro;
varying vec3 vColor;
varying float vAlpha;

void main() {
  vec3 p = aPos;
  float c = cos(uRot), s = sin(uRot);
  p = vec3(c * p.x + s * p.z, p.y, -s * p.x + c * p.z);
  // axial tilt + mouse parallax (x = pitch, y = roll)
  float tx = 0.38 + uTilt.x;
  float ct = cos(tx), st = sin(tx);
  p = vec3(p.x, ct * p.y - st * p.z, st * p.y + ct * p.z);
  float tz = -0.18 + uTilt.y;
  float cz = cos(tz), sz = sin(tz);
  p = vec3(cz * p.x - sz * p.y, sz * p.x + cz * p.y, p.z);

  float persp = 3.2 / (3.2 - p.z * uScale);
  vec2 xy = p.xy * uScale * persp * uRadius;
  gl_Position = vec4(uCenter.x + xy.x / uAspect, uCenter.y + xy.y, 0.0, 1.0);

  float front = smoothstep(-0.85, 0.75, p.z);
  float tw = 0.55 + 0.45 * sin(uTime * (0.8 + aData.z * 2.2) + aData.y * 6.2831);
  float spark = step(0.86, fract(aData.y * 13.7)) * pow(max(0.0, sin(uTime * (0.35 + aData.z * 0.5) + aData.y * 37.0)), 30.0);

  vec3 coral = vec3(0.878, 0.471, 0.314);
  vec3 peach = vec3(0.98, 0.78, 0.66);
  vec3 mist = vec3(0.62, 0.66, 0.74);
  vec3 dust = vec3(0.93, 0.90, 0.86);
  float size;
  if (aData.x > 1.5) {
    vColor = dust;
    vAlpha = 0.35 * tw;
    size = 1.4;
  } else if (aData.x > 0.5) {
    vColor = mix(coral, peach, aData.z * 0.65);
    vAlpha = (0.55 + 0.45 * tw) * mix(0.18, 1.0, front);
    size = 2.1;
  } else {
    vColor = mist;
    vAlpha = (0.28 + 0.22 * tw) * mix(0.12, 0.9, front);
    size = 1.5;
  }
  vColor = mix(vColor, vec3(1.0, 0.95, 0.9), spark);
  vAlpha = min(1.0, vAlpha + spark * front) * uIntro;
  gl_PointSize = uPx * size * (1.0 + spark * 1.2) * mix(0.7, 1.15, front) * persp * (0.6 + 0.4 * uScale);
}
`;

const FRAG = `
precision mediump float;
varying vec3 vColor;
varying float vAlpha;
void main() {
  vec2 d = gl_PointCoord - 0.5;
  float r = dot(d, d);
  if (r > 0.25) discard;
  float a = vAlpha * smoothstep(0.25, 0.02, r);
  gl_FragColor = vec4(vColor * a, a);
}
`;

function decodeMask() {
  const bin = atob(LAND_MASK);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return (lat, lon) => {
    const r = Math.min(LAND_H - 1, Math.max(0, Math.floor(((90 - lat) / 180) * LAND_H)));
    const c = Math.min(LAND_W - 1, Math.max(0, Math.floor(((lon + 180) / 360) * LAND_W)));
    const i = r * LAND_W + c;
    return (bytes[i >> 3] >> (i & 7)) & 1;
  };
}

// Deterministic PRNG so the globe looks identical on every load.
function mulberry32(a) {
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function buildPoints(samples) {
  const isLand = decodeMask();
  const rnd = mulberry32(7);
  const pos = [];
  const data = [];
  const golden = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < samples; i++) {
    const y = 1 - (i / (samples - 1)) * 2;
    const rad = Math.sqrt(1 - y * y);
    const th = golden * i;
    const x = Math.cos(th) * rad;
    const z = Math.sin(th) * rad;
    const lat = (Math.asin(y) * 180) / Math.PI;
    const lon = (Math.atan2(x, z) * 180) / Math.PI;
    const land = isLand(lat, lon);
    if (!land && rnd() > 0.2) continue;
    const j = 1 + (rnd() - 0.5) * 0.012;
    pos.push(x * j, y * j, z * j);
    data.push(land ? 1 : 0, rnd(), rnd());
  }
  const dust = Math.round(samples * 0.02);
  for (let i = 0; i < dust; i++) {
    const u = rnd() * 2 - 1;
    const t = rnd() * Math.PI * 2;
    const r = 1.06 + rnd() * 0.32;
    const s = Math.sqrt(1 - u * u);
    pos.push(Math.cos(t) * s * r, u * r, Math.sin(t) * s * r);
    data.push(2, rnd(), rnd());
  }
  return { pos: new Float32Array(pos), data: new Float32Array(data), count: pos.length / 3 };
}

function compile(gl, type, src) {
  const sh = gl.createShader(type);
  gl.shaderSource(sh, src);
  gl.compileShader(sh);
  if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
    gl.deleteShader(sh);
    return null;
  }
  return sh;
}

const easeOutExpo = (t) => (t >= 1 ? 1 : 1 - Math.pow(2, -10 * t));

export function HeroGlobe({ ready }) {
  const canvasRef = useRef(null);
  const readyRef = useRef(ready);
  const startRef = useRef(null);
  const [fallback, setFallback] = useState(false);

  useEffect(() => {
    readyRef.current = ready;
    if (ready && startRef.current === null) startRef.current = performance.now();
  }, [ready]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const mobile = window.matchMedia('(max-width: 768px)').matches;
    let gl = null;
    try {
      gl = canvas.getContext('webgl', { alpha: true, antialias: false, premultipliedAlpha: true, powerPreference: 'low-power' });
    } catch {
      gl = null;
    }
    if (!gl) {
      const id = requestAnimationFrame(() => setFallback(true));
      return () => cancelAnimationFrame(id);
    }

    const vs = compile(gl, gl.VERTEX_SHADER, VERT);
    const fs = compile(gl, gl.FRAGMENT_SHADER, FRAG);
    const prog = gl.createProgram();
    if (vs && fs) {
      gl.attachShader(prog, vs);
      gl.attachShader(prog, fs);
      gl.linkProgram(prog);
    }
    if (!vs || !fs || !gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      const id = requestAnimationFrame(() => setFallback(true));
      return () => cancelAnimationFrame(id);
    }
    gl.useProgram(prog);

    const { pos, data, count } = buildPoints(mobile ? 14000 : 36000);
    const bufP = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, bufP);
    gl.bufferData(gl.ARRAY_BUFFER, pos, gl.STATIC_DRAW);
    const aPos = gl.getAttribLocation(prog, 'aPos');
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 3, gl.FLOAT, false, 0, 0);
    const bufD = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, bufD);
    gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
    const aData = gl.getAttribLocation(prog, 'aData');
    gl.enableVertexAttribArray(aData);
    gl.vertexAttribPointer(aData, 3, gl.FLOAT, false, 0, 0);

    const U = {};
    ['uTime', 'uRot', 'uTilt', 'uScale', 'uCenter', 'uRadius', 'uAspect', 'uPx', 'uIntro'].forEach((n) => {
      U[n] = gl.getUniformLocation(prog, n);
    });

    gl.disable(gl.DEPTH_TEST);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
    gl.clearColor(0, 0, 0, 0);

    const dprCap = mobile ? 1.5 : 1.75;
    let layout = { cx: 0.4, cy: 0, radius: 0.8, aspect: 1, px: 1.5 };
    const resize = () => {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, dprCap);
      canvas.width = Math.max(1, Math.round(w * dpr));
      canvas.height = Math.max(1, Math.round(h * dpr));
      gl.viewport(0, 0, canvas.width, canvas.height);
      const aspect = w / h;
      const narrow = w <= 768;
      // radius in NDC-y units (fraction of half the height)
      const radius = narrow ? Math.min(0.62, 0.86 * aspect) : Math.min(0.82, 0.46 * aspect);
      const cx = narrow ? 0.12 : 0.44;
      const cy = narrow ? 0.3 : -0.01;
      layout = { cx, cy, radius, aspect, px: dpr * (narrow ? 1.15 : 1.3) * Math.max(0.85, Math.min(1.25, h / 820)) };
    };
    resize();

    let raf = 0;
    let running = false;
    let visible = true;
    let pageVisible = !document.hidden;
    let rot = 0.15; // lands with the Americas / Atlantic facing the viewer
    let last = performance.now();
    const tilt = { x: 0, y: 0, tx: 0, ty: 0 };

    const draw = (now) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      let intro = 1;
      let scale = 1;
      if (!reduced) {
        if (!readyRef.current || startRef.current === null) {
          intro = 0;
        } else {
          const k = easeOutExpo(Math.min(1, (now - startRef.current) / 1700));
          intro = Math.min(1, k * 1.4);
          scale = 0.35 + 0.65 * k;
          rot += dt * (1 - k) * 2.4; // spins in while arriving
        }
        rot += dt * 0.07;
        tilt.x += (tilt.tx - tilt.x) * Math.min(1, dt * 3);
        tilt.y += (tilt.ty - tilt.y) * Math.min(1, dt * 3);
      }
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.uniform1f(U.uTime, reduced ? 1.0 : now / 1000);
      gl.uniform1f(U.uRot, rot);
      gl.uniform2f(U.uTilt, tilt.x, tilt.y);
      gl.uniform1f(U.uScale, scale);
      gl.uniform2f(U.uCenter, layout.cx + tilt.y * 0.08, layout.cy - tilt.x * 0.08);
      gl.uniform1f(U.uRadius, layout.radius);
      gl.uniform1f(U.uAspect, layout.aspect);
      gl.uniform1f(U.uPx, layout.px);
      gl.uniform1f(U.uIntro, intro);
      gl.drawArrays(gl.POINTS, 0, count);
    };

    const loop = (now) => {
      draw(now);
      raf = requestAnimationFrame(loop);
    };
    const update = () => {
      const should = visible && pageVisible && !reduced;
      if (should && !running) {
        running = true;
        last = performance.now();
        raf = requestAnimationFrame(loop);
      } else if (!should && running) {
        running = false;
        cancelAnimationFrame(raf);
      }
    };

    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      update();
    });
    io.observe(canvas);
    const onVis = () => {
      pageVisible = !document.hidden;
      update();
    };
    document.addEventListener('visibilitychange', onVis);
    const onResize = () => {
      resize();
      if (!running) draw(performance.now());
    };
    window.addEventListener('resize', onResize);
    const onMove = (e) => {
      tilt.ty = ((e.clientX / window.innerWidth) - 0.5) * 0.22;
      tilt.tx = ((e.clientY / window.innerHeight) - 0.5) * 0.18;
    };
    if (!reduced && !mobile) window.addEventListener('pointermove', onMove, { passive: true });
    const onLost = (e) => {
      e.preventDefault();
      running = false;
      cancelAnimationFrame(raf);
      setFallback(true);
    };
    canvas.addEventListener('webglcontextlost', onLost);

    if (reduced) draw(performance.now());
    update();

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      io.disconnect();
      document.removeEventListener('visibilitychange', onVis);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('pointermove', onMove);
      canvas.removeEventListener('webglcontextlost', onLost);
      gl.deleteBuffer(bufP);
      gl.deleteBuffer(bufD);
      gl.deleteProgram(prog);
    };
  }, []);

  return (
    <div className={styles.globe} aria-hidden="true">
      {fallback ? (
        <div className={styles.globeFallback} />
      ) : (
        <canvas ref={canvasRef} className={styles.canvas} />
      )}
    </div>
  );
}
