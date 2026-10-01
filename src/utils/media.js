// Small helpers for the carousel preview videos.

const AV1 = 'video/webm; codecs="av01.0.05M.08"';
const cache = {};

// AV1 (smaller files) when the device decodes it efficiently; phones without hardware AV1 get
// H.264, which every phone decodes in hardware. Desktops may decode AV1 in software.
// Resolves once per mode and is cached.
export function prefersAv1(allowSoftware = false) {
  const key = allowSoftware ? 'sw' : 'hw';
  if (cache[key]) return cache[key];
  cache[key] = (async () => {
    if (typeof document === 'undefined') return false;
    const probe = document.createElement('video');
    if (!probe.canPlayType(AV1)) return false;
    try {
      const info = await navigator.mediaCapabilities?.decodingInfo({
        type: 'file',
        video: { contentType: AV1, width: 768, height: 432, bitrate: 200000, framerate: 30 },
      });
      return Boolean(info?.supported && (info.powerEfficient || allowSoftware));
    } catch {
      return false;
    }
  })();
  return cache[key];
}

// Data saver / slow connections: don't autoplay; show posters until the user opens a project.
export function shouldLimitData() {
  const c = typeof navigator !== 'undefined' ? navigator.connection : null;
  if (!c) return false;
  return Boolean(c.saveData) || /(^|-)2g$/.test(c.effectiveType || '');
}
