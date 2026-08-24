/**
 * Turns the raw source photos in D:/site_pics into the web assets under
 * public/art. Run with `npm run art`. The outputs are committed, so this only
 * needs re-running when a source image changes.
 *
 * Sources:
 *   gesture.jpg      the fist-bump announcement graphic the hero art comes from
 * and the illustration pack in ART_PACK:
 *   3.png  the woman standing in the adey abeba
 *   4.png  a drift of small blue flowers
 *   5.png  a close-up cluster of blooms
 *   6.png  a tall field of adey abeba, cut out against transparency
 *   7.png  a single adey abeba, cut out
 */
import sharp from 'sharp';
import { mkdirSync } from 'node:fs';

const SRC = process.env.ART_SRC || 'D:/site_pics';
// The commissioned illustration pack: cut-out flowers, fields and the figure.
const PACK = process.env.ART_PACK || 'D:/Telegram Desktop/Adeweb Developer Africa';
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
   The cut-out flower, plus its blue twin for the halfway colour change. */
async function adey() {
  const SIZE = 320; // the sprite never renders above ~52px on the page

  const lit = await sharp(`${PACK}/7.png`)
    .trim({ threshold: 1 })
    .resize(SIZE, SIZE, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png({ compressionLevel: 9 })
    .toBuffer();
  log('adey.png', await sharp(lit).toFile(`${OUT}adey.png`));

  // Brightness remapped onto a blue ramp rather than hue-rotated. The petal is
  // so saturated that rotating its hue lands on a green nobody would call
  // Zemenay blue; mapping luminance keeps the shading and guarantees the brand
  // colour. The top of the ramp stops well short of white, because at the
  // petals' resting opacity a pale highlight reads as a grey snowflake.
  const SHADOW = [0x00, 0x22, 0x5c];
  const MID = [0x00, 0x54, 0xcc];
  const HI = [0x5c, 0x9b, 0xff];
  const { data, info } = await sharp(lit).raw().toBuffer({ resolveWithObject: true });
  for (let i = 0; i < data.length; i += 4) {
    const l = (0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2]) / 255;
    const [a, b, t] = l < 0.5 ? [SHADOW, MID, l * 2] : [MID, HI, (l - 0.5) * 2];
    for (let c = 0; c < 3; c++) data[i + c] = Math.round(a[c] + (b[c] - a[c]) * t);
  }
  const blue = await sharp(data, { raw: info })
    .png({ compressionLevel: 9 })
    .toFile(`${OUT}adey-blue.png`);
  log('adey-blue.png', blue);
}

/* ── 3. The growing meadow band ─────────────────────────────────────────────
   A cut-out field for the foot of the page, assembled wide from one tall
   source. The whole point of the image is the ragged top edge where stems and
   heads break into open sky, so it must never be stretched flat. */
async function meadow() {
  const W = 1920;
  const H = 640;

  const src = await sharp(`${PACK}/6.png`).trim({ threshold: 1 }).toBuffer();
  const { width, height } = await sharp(src).metadata();

  // Drop the bottom third first. Those huge out-of-focus foreground blooms are
  // single smooth shapes, so wherever a tile boundary cuts one the seam is
  // impossible to miss; the fine-grained field above tiles without a join.
  const body = await sharp(src)
    .extract({ left: 0, top: 0, width, height: Math.round(height * 0.66) })
    .toBuffer();

  // Every copy is anchored to the bottom so the ground line stays solid. The
  // varying scales and the flips are what stop the broken top edge from
  // visibly repeating across the width.
  const steps = [
    [0, 1.0, false],
    [250, 0.86, true],
    [520, 0.95, false],
    [790, 0.81, true],
    [1030, 0.92, false],
    [1320, 0.88, true],
    [1600, 0.97, false],
  ];
  const tiles = [];
  for (const [left, scale, flip] of steps) {
    let t = sharp(body).resize({ height: Math.round(H * scale) });
    if (flip) t = t.flop();
    const input = await t.png().toBuffer();
    const m = await sharp(input).metadata();
    tiles.push({ input, left, top: H - m.height });
  }

  const r = await sharp({
    create: { width: W, height: H, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } },
  })
    .composite(tiles)
    .webp({ quality: 82, alphaQuality: 100, effort: 6 })
    .toFile(`${OUT}meadow-grow.webp`);
  log('meadow-grow.webp', r);
}

/* ── 4. The figure, the drift, and the blur ─────────────────────────────────
   WebP throughout. These are large-format artwork carrying alpha, and PNG
   cannot compress photographic colour: the meadow band alone came to 4.7MB as
   a PNG, more than the rest of the page put together. */
async function extras() {
  log(
    'woman.webp',
    await sharp(`${PACK}/3.png`)
      .trim({ threshold: 1 })
      .resize({ height: 1150 })
      .webp({ quality: 90, alphaQuality: 100, effort: 6 })
      .toFile(`${OUT}woman.webp`),
  );

  log(
    'blue-drift.webp',
    await sharp(`${PACK}/4.png`)
      .trim({ threshold: 1 })
      .resize({ width: 1400 })
      .webp({ quality: 88, alphaQuality: 100, effort: 6 })
      .toFile(`${OUT}blue-drift.webp`),
  );

  // The close-up cluster thrown well out of focus, for behind the presenter.
  // Flattened onto brand blue before blurring, so its transparent ground does
  // not bleed grey haloes into the petals.
  log(
    'bloom-blur.webp',
    await sharp(`${PACK}/5.png`)
      .trim({ threshold: 1 })
      .resize(1400, 1000, { fit: 'cover' })
      .flatten({ background: '#00307a' })
      .blur(28)
      .modulate({ saturation: 0.9 })
      .webp({ quality: 72 })
      .toFile(`${OUT}bloom-blur.webp`),
  );
}

await fists();
await adey();
await meadow();
await extras();
