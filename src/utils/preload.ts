import { Cache } from 'three';

/**
 * One fetch per 3D file per page load, shared by the preloader and the scenes. Each file lands in
 * three.js's own cache under the key its loaders look up, so a scene that awaits it parses from memory:
 * raw bytes for models and the decoder, text for the decoder's script, decoded images for textures.
 */
type Progress = (loaded: number, total: number) => void;
const jobs = new Map<string, Promise<void>>();

async function store(url: string, bytes: Uint8Array) {
  Cache.enabled = true;
  if (/\.js(\?|$)/.test(url)) Cache.add(`file:${url}`, new TextDecoder().decode(bytes));
  else if (/\.(webp|png|jpe?g)(\?|$)/.test(url)) {
    const img = new window.Image();
    const src = URL.createObjectURL(new Blob([bytes.buffer as ArrayBuffer]));
    img.src = src;
    try {
      await img.decode();
      Cache.add(`image:${url}`, img);
    } catch {
      // Left to the loader, which will fetch it again from the HTTP cache.
    } finally {
      URL.revokeObjectURL(src);
    }
  } else Cache.add(`file:${url}`, bytes.buffer);
}

async function download(url: string, onProgress?: Progress, priority: RequestPriority = 'auto') {
  try {
    const res = await fetch(url, { priority });
    if (!res.ok) return;
    const total = Number(res.headers.get('content-length')) || 0;
    const chunks: Uint8Array[] = [];
    let got = 0;
    if (res.body) {
      const reader = res.body.getReader();
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        chunks.push(value);
        got += value.byteLength;
        onProgress?.(got, total || got);
      }
    } else {
      const buf = new Uint8Array(await res.arrayBuffer());
      chunks.push(buf);
      got = buf.byteLength;
    }
    const bytes = new Uint8Array(got);
    let at = 0;
    for (const c of chunks) {
      bytes.set(c, at);
      at += c.byteLength;
    }
    await store(url, bytes);
  } catch {
    // A failed file is the scene's to report; its loader will try again and say so.
  } finally {
    onProgress?.(1, 1);
  }
}

/** Starts (or joins) the fetch of one file. */
export function fetchAsset(url: string, onProgress?: Progress, priority?: RequestPriority) {
  let job = jobs.get(url);
  if (!job) {
    job = download(url, onProgress, priority);
    jobs.set(url, job);
  }
  return job;
}

/** Resolves when every listed file that has been asked for is in memory; files never asked for resolve at once. */
export function assetsReady(...urls: string[]) {
  return Promise.all(urls.map((u) => jobs.get(u) ?? Promise.resolve())).then(() => undefined);
}

/** Drops parsed files from memory; the scene keeps what it built from them. */
export function releaseAssets(...urls: string[]) {
  for (const u of urls) {
    Cache.remove(`file:${u}`);
    Cache.remove(`image:${u}`);
  }
}
