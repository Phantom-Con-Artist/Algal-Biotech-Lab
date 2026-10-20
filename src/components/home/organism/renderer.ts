import { BALL_COUNT, bodyBalls } from './body';
import { FRAGMENT, VERTEX } from './shader';
import { paintTreeField } from './treeField';

interface Options {
  canvas: HTMLCanvasElement;
  /** The element the canvas covers; pointer positions are measured against it. */
  frame: HTMLElement;
  /** An invisible square placed by CSS: its centre and width set where the organism sits and how large it is. */
  anchor: HTMLElement;
  onLost: () => void;
}

function compile(gl: WebGLRenderingContext, type: number, source: string) {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  return gl.getShaderParameter(shader, gl.COMPILE_STATUS) ? shader : null;
}

function link(gl: WebGLRenderingContext) {
  const vs = compile(gl, gl.VERTEX_SHADER, VERTEX);
  const fs = compile(gl, gl.FRAGMENT_SHADER, FRAGMENT);
  const program = gl.createProgram();
  if (!vs || !fs || !program) return null;
  gl.attachShader(program, vs);
  gl.attachShader(program, fs);
  gl.linkProgram(program);
  return gl.getProgramParameter(program, gl.LINK_STATUS) ? program : null;
}

/** Starts the organism on `canvas`. Returns null when WebGL is unavailable, so the caller can show the SVG instead. */
export function createOrganism({ canvas, frame, anchor, onLost }: Options): { destroy: () => void } | null {
  const gl = canvas.getContext('webgl', { alpha: true, premultipliedAlpha: true, antialias: false, depth: false, stencil: false, powerPreference: 'low-power' });
  if (!gl) return null;
  const program = link(gl);
  if (!program) return null;
  gl.useProgram(program);

  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
  const aPos = gl.getAttribLocation(program, 'a_pos');
  gl.enableVertexAttribArray(aPos);
  gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

  const coarse = window.matchMedia('(pointer: coarse)').matches;
  const texSize = Math.min(coarse ? 1024 : 2048, gl.getParameter(gl.MAX_TEXTURE_SIZE) as number);
  gl.bindTexture(gl.TEXTURE_2D, gl.createTexture());
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, paintTreeField(texSize));

  const u = (name: string) => gl.getUniformLocation(program, name);
  const loc = {
    center: u('u_center'), unit: u('u_unit'), time: u('u_time'), grow: u('u_grow'),
    balls: u('u_balls'), light: u('u_light'), lightAngle: u('u_lightAngle'), tree: u('u_tree'),
  };
  gl.uniform1i(loc.tree, 0);

  const balls = new Float32Array(BALL_COUNT * 3);
  const light = { x: 500, y: 500, presence: 0, target: 0 };
  const view = { scale: 1, centerX: 0, centerY: 0, size: 1 };
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let quality = coarse ? 0.8 : 1;
  let raf = 0;
  let visible = true;
  let start = 0;
  let last = 0;
  let slowFrames = 0;
  let frames = 0;
  let halfRate = false;
  let odd = false;
  let shown = false;

  function resize() {
    const box = frame.getBoundingClientRect();
    const a = anchor.getBoundingClientRect();
    view.scale = Math.min(window.devicePixelRatio || 1, 1.5) * quality;
    canvas.width = Math.max(1, Math.round(box.width * view.scale));
    canvas.height = Math.max(1, Math.round(box.height * view.scale));
    view.centerX = a.left + a.width / 2 - box.left;
    view.centerY = a.top + a.height / 2 - box.top;
    view.size = Math.max(a.width, 1);
    gl!.viewport(0, 0, canvas.width, canvas.height);
    if (reduced) draw(7.5, 1);
  }

  function draw(t: number, grow: number) {
    const lean = [(light.x - 500) * 0.03 * light.presence, (light.y - 500) * 0.03 * light.presence] as const;
    bodyBalls(t, [Math.max(-18, Math.min(18, lean[0])), Math.max(-18, Math.min(18, lean[1]))], balls);
    gl!.uniform2f(loc.center, view.centerX * view.scale, canvas.height - view.centerY * view.scale);
    gl!.uniform1f(loc.unit, 1000 / (view.size * view.scale));
    gl!.uniform1f(loc.time, t);
    gl!.uniform1f(loc.grow, grow);
    gl!.uniform3fv(loc.balls, balls);
    gl!.uniform3f(loc.light, light.x, light.y, light.presence);
    gl!.uniform1f(loc.lightAngle, Math.atan2(light.y - 500, light.x - 500));
    gl!.clearColor(0, 0, 0, 0);
    gl!.clear(gl!.COLOR_BUFFER_BIT);
    gl!.drawArrays(gl!.TRIANGLE_STRIP, 0, 4);
    if (!shown) {
      shown = true;
      canvas.style.opacity = '1';
    }
  }

  function tick(now: number) {
    raf = requestAnimationFrame(tick);
    if (!start) start = last = now;
    const dt = now - last;
    last = now;
    // Governor: if frames keep running long, render fewer pixels; at the floor, render every other frame.
    if (dt > 0 && dt < 250) {
      frames++;
      if (dt > (halfRate ? 40 : 24)) slowFrames++;
      if (frames >= 45) {
        if (slowFrames > 20 && quality > 0.5) {
          quality *= 0.8;
          resize();
        } else if (slowFrames > 20) {
          halfRate = true;
        }
        frames = slowFrames = 0;
      }
    }
    odd = !odd;
    if (halfRate && odd) return;
    light.presence += (light.target - light.presence) * 0.05;
    const elapsed = (now - start) / 1000;
    const grow = Math.min(1, elapsed / 2.6);
    draw(elapsed + 4, 1 - (1 - grow) ** 3);
  }

  const play = () => {
    if (!raf && visible && !reduced) {
      last = performance.now();
      raf = requestAnimationFrame(tick);
    }
  };
  const pause = () => {
    cancelAnimationFrame(raf);
    raf = 0;
  };

  function onPointer(e: PointerEvent) {
    const box = frame.getBoundingClientRect();
    const x = e.clientX - box.left;
    const y = e.clientY - box.top;
    const inside = x >= 0 && y >= 0 && x <= box.width && y <= box.height;
    light.target = inside ? 1 : 0;
    if (inside) {
      light.x = (x - view.centerX) * (1000 / view.size) + 500;
      light.y = (y - view.centerY) * (1000 / view.size) + 500;
    }
  }
  const onLeave = () => (light.target = 0);
  const onContextLost = (e: Event) => {
    e.preventDefault();
    pause();
    onLost();
  };

  const io = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    if (visible) play();
    else pause();
  });
  const ro = new ResizeObserver(resize);
  io.observe(frame);
  ro.observe(frame);
  canvas.addEventListener('webglcontextlost', onContextLost);
  if (!reduced) {
    window.addEventListener('pointermove', onPointer, { passive: true });
    document.documentElement.addEventListener('pointerleave', onLeave);
  }
  resize();
  play();

  return {
    destroy() {
      pause();
      io.disconnect();
      ro.disconnect();
      canvas.removeEventListener('webglcontextlost', onContextLost);
      window.removeEventListener('pointermove', onPointer);
      document.documentElement.removeEventListener('pointerleave', onLeave);
      gl.getExtension('WEBGL_lose_context')?.loseContext();
    },
  };
}
