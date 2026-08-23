/**
 * Turns the raw source photos in D:/site_pics into the web assets under
 * public/art. Run with `npm run art`. The outputs are committed, so this only
 * needs re-running when a source image changes.
 *
 * Sources:
 *   gesture.jpg      the fist-bump announcement graphic the hero art comes from
 *   transparent.png  an adey abeba already cut out against transparency
 *   JOB OFFER LETTER.png / download.jpg   adey abeba meadow photographs
 */
import sharp from 'sharp';
import { mkdirSync } from 'node:fs';

const SRC = process.env.ART_SRC || 'D:/site_pics';
const OUT = new URL('../public/art/', import.meta.url).pathname.replace(/^\//, '');
mkdirSync(OUT, { recursive: true });

const log = (name, r) =>
  console.log(`  ${name.padEnd(20)} ${r.width}x${r.height}  ${(r.size / 1024).toFixed(0)}kb`);

/* ── 1. The two fists ───────────────────────────────────────────────────────
   The artwork sits on flat charcoal. A luminance key would eat the
   illustration's own black outlines, so we flood fill inward from the border
   instead: only charcoal CONNECTED to an edge goes transparent, and dark
   pixels enclosed by the drawing survive. */
async function fists() {
  const REGION = { left: 0, top: 424, width: 676, height: 289 };
  const SEAM = 338; // x inside the region where the two fists meet
  const BG = [36, 32, 33];
  // Total per-channel distance that still counts as background. Deliberately
  // tight: the fists' own near-black shading touches the charcoal at the wrist,
  // so anything looser floods through and punches holes in the hands.
  const TOL = 18;
  const SCALE = 2; // export at 2x so the hero stays crisp on retina

  const { data, info } = await sharp(`${SRC}/gesture.jpg`)
    .extract(REGION)
    .raw()
    .toBuffer({ resolveWithObject: true });
  const { width: W, height: H, channels: C } = info;

  const isBg = (i) =>
    Math.abs(data[i] - BG[0]) + Math.abs(data[i + 1] - BG[1]) + Math.abs(data[i + 2] - BG[2]) <= TOL;

  const alpha = new Uint8Array(W * H).fill(255);
  const seen = new Uint8Array(W * H);
  const stack = [];
  const push = (x, y) => {
    const p = y * W + x;
    if (seen[p] || !isBg(p * C)) return;
    seen[p] = 1;
    stack.push(p);
  };
  for (let x = 0; x < W; x++) { push(x, 0); push(x, H - 1); }
  for (let y = 0; y < H; y++) { push(0, y); push(W - 1, y); }
  while (stack.length) {
    const p = stack.pop();
    alpha[p] = 0;
    const x = p % W, y = (p / W) | 0;
    if (x > 0) push(x - 1, y);
    if (x < W - 1) push(x + 1, y);
    if (y > 0) push(x, y - 1);
    if (y < H - 1) push(x, y + 1);
  }

  // Feather the cutout: blurring the mask alone (never the colour) removes the
  // jaggies the hard fill leaves, and the contrast curve pulls the resulting
  // halo back in so the fists do not glow against the deep blue page.
  // toColourspace('b-w') is load-bearing here. Sharp otherwise promotes a
  // 1-channel raw input to 3-channel sRGB on output, and reading that back one
  // byte per pixel shears the mask diagonally against the colour data.
  const mask = await sharp(Buffer.from(alpha), { raw: { width: W, height: H, channels: 1 } })
    .blur(1.1)
    .linear(1.6, -76)
    .toColourspace('b-w')
    .raw()
    .toBuffer();

  const rgba = Buffer.alloc(W * H * 4);
  for (let p = 0; p < W * H; p++) {
    rgba[p * 4] = data[p * C];
    rgba[p * 4 + 1] = data[p * C + 1];
    rgba[p * 4 + 2] = data[p * C + 2];
    rgba[p * 4 + 3] = mask[p];
  }

  // Both halves keep the full region height and split exactly on the seam, so
  // the two <img> elements reassemble into the original drawing when their
  // inner edges touch.
  for (const [name, box] of [
    ['fist-left', { left: 0, top: 0, width: SEAM, height: H }],
    ['fist-right', { left: SEAM, top: 0, width: W - SEAM, height: H }],
  ]) {
    const r = await sharp(rgba, { raw: { width: W, height: H, channels: 4 } })
      .extract(box)
      .resize({ width: box.width * SCALE, kernel: 'lanczos3' })
      .png({ compressionLevel: 9, palette: true, quality: 92 })
      .toFile(`${OUT}${name}.png`);
    log(`${name}.png`, r);
  }
}

/* ── 2. The falling adey abeba ──────────────────────────────────────────────
   Trimmed to its own bounding box, then padded back to a square so CSS
   rotation spins around the flower's centre instead of drifting. */
async function adey() {
  // fit:'contain' pads the trimmed bounding box back out to a square in one
  // step, so CSS rotation spins around the flower's centre instead of drifting.
  const r = await sharp(`${SRC}/transparent.png`)
    .trim({ threshold: 8 })
    .resize(256, 256, {
      fit: 'contain',
      kernel: 'lanczos3',
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .png({ compressionLevel: 9 })
    .toFile(`${OUT}adey.png`);
  log('adey.png', r);

  /* The same flower in Zemenay blue, for the halfway colour change.
     Doing this here rather than with a CSS hue-rotate is the difference
     between landing on the brand blue and landing near it: hue-rotate is a
     matrix approximation that drags a saturated yellow through green on the
     way out and overshoots into violet on the way in. Mapping luminance onto a
     fixed three-stop blue ramp hits the exact colour and never passes through
     anything else, because the page cross-fades between two finished images
     instead of interpolating a filter. */
  const lit = await sharp(`${OUT}adey.png`).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width: W, height: H } = lit.info;
  const SHADOW = [0, 34, 96];
  const MID = [0, 91, 219];
  const LIGHT = [150, 190, 255];
  const out = Buffer.alloc(W * H * 4);
  for (let p = 0; p < W * H; p++) {
    const i = p * 4;
    // Rec. 601 luma. The flower is mostly yellow, so its green and red
    // channels carry nearly all the modelling.
    const t = (0.299 * lit.data[i] + 0.587 * lit.data[i + 1] + 0.114 * lit.data[i + 2]) / 255;
    const [a, b, k] = t < 0.5 ? [SHADOW, MID, t * 2] : [MID, LIGHT, (t - 0.5) * 2];
    out[i] = a[0] + (b[0] - a[0]) * k;
    out[i + 1] = a[1] + (b[1] - a[1]) * k;
    out[i + 2] = a[2] + (b[2] - a[2]) * k;
    out[i + 3] = lit.data[i + 3];
  }
  const blue = await sharp(out, { raw: { width: W, height: H, channels: 4 } })
    .png({ compressionLevel: 9 })
    .toFile(`${OUT}adey-blue.png`);
  log('adey-blue.png', blue);
}

/* ── 3. Meadow band ─────────────────────────────────────────────────────────
   The real adey abeba field, left in its own yellows and greens rather than
   pushed into the brand blue. All the processing does is lift it slightly and
   fade the top edge to nothing, so the photograph dissolves up into the page
   instead of sitting in a hard-edged box. */
async function meadow() {
  const W = 1600, H = 700;
  const src = await sharp(`${SRC}/JOB OFFER LETTER.png`)
    .resize(W, H, { fit: 'cover', position: 'bottom' })
    .modulate({ saturation: 1.12, brightness: 1.02 })
    .raw()
    .toBuffer({ resolveWithObject: true });

  const ch = src.info.channels;
  const rgba = Buffer.alloc(W * H * 4);
  for (let p = 0; p < W * H; p++) {
    rgba[p * 4] = src.data[p * ch];
    rgba[p * 4 + 1] = src.data[p * ch + 1];
    rgba[p * 4 + 2] = src.data[p * ch + 2];
    const y = (p / W) | 0;
    rgba[p * 4 + 3] = Math.round(255 * Math.min(1, Math.max(0, (y / H - 0.1) / 0.55)));
  }

  const r = await sharp(rgba, { raw: { width: W, height: H, channels: 4 } })
    .png({ compressionLevel: 9, palette: true, quality: 82 })
    .toFile(`${OUT}meadow.png`);
  log('meadow.png', r);
}

/* ── 4. Video-section backdrop ──────────────────────────────────────────────
   The macro bloom thrown out of focus, so the transparent presenter video has
   something with depth behind it. Kept in its own colour and darkened rather
   than tinted blue: the page reads warmer for having one real photograph in it,
   and the section's own low opacity does the blending. */
async function bokeh() {
  const r = await sharp(`${SRC}/Happy New year 2016 Ethiopian calendar.jpg`)
    .resize(1200, 800, { fit: 'cover' })
    .blur(26)
    .modulate({ saturation: 0.95, brightness: 0.7 })
    .jpeg({ quality: 72, mozjpeg: true })
    .toFile(`${OUT}bokeh.jpg`);
  log('bokeh.jpg', r);
}

console.log(`building art from ${SRC} into ${OUT}`);
await fists();
await adey();
await meadow();
await bokeh();
console.log('done');
