import fs from 'fs';
import zlib from 'zlib';

function createPNG(width, height, getPixel) {
  // width and height are 32-bit big-endian
  const header = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]); // PNG signature

  // IHDR chunk
  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(width, 0);
  ihdrData.writeUInt32BE(height, 4);
  ihdrData.writeUInt8(8, 8); // bit depth 8
  ihdrData.writeUInt8(6, 9); // color type 6 (RGBA)
  ihdrData.writeUInt8(0, 10); // compression method 0
  ihdrData.writeUInt8(0, 11); // filter method 0
  ihdrData.writeUInt8(0, 12); // interlace method 0
  const ihdrChunk = createChunk('IHDR', ihdrData);

  // Raw image scanlines
  const rowBytes = 1 + width * 4;
  const rawData = Buffer.alloc(height * rowBytes);

  for (let y = 0; y < height; y++) {
    const rowOffset = y * rowBytes;
    rawData[rowOffset] = 0; // Filter type 0 (None)
    for (let x = 0; x < width; x++) {
      const [r, g, b, a] = getPixel(x, y, width, height);
      const pixelOffset = rowOffset + 1 + x * 4;
      rawData[pixelOffset] = r;
      rawData[pixelOffset + 1] = g;
      rawData[pixelOffset + 2] = b;
      rawData[pixelOffset + 3] = a;
    }
  }

  const compressedData = zlib.deflateSync(rawData);
  const idatChunk = createChunk('IDAT', compressedData);
  const iendChunk = createChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([header, ihdrChunk, idatChunk, iendChunk]);
}

function createChunk(type, data) {
  const length = data.length;
  const chunk = Buffer.alloc(12 + length);
  chunk.writeUInt32BE(length, 0);
  chunk.write(type, 4, 4, 'ascii');
  data.copy(chunk, 8);

  const crc = crc32(chunk.subarray(4, 8 + length));
  chunk.writeUInt32BE(crc, 8 + length);
  return chunk;
}

// Standard CRC32 table
const crcTable = new Uint32Array(256);
for (let i = 0; i < 256; i++) {
  let c = i;
  for (let k = 0; k < 8; k++) {
    c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  }
  crcTable[i] = c;
}

function crc32(buf) {
  let crc = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    crc = crcTable[(crc ^ buf[i]) & 0xff] ^ (crc >>> 8);
  }
  return (crc ^ 0xffffffff) >>> 0;
}

// Generator function for elegant JW gold and navy icon
function jwPixelGenerator(isMaskable) {
  return function (x, y, w, h) {
    const nx = x / w;
    const ny = y / h;

    // Background: Deep Slate Navy (#0f172a to #1e293b)
    let bgR = Math.round(15 + 15 * ny);
    let bgG = Math.round(23 + 18 * ny);
    let bgB = Math.round(42 + 25 * ny);

    const safeMargin = isMaskable ? 0.22 : 0.18;
    const isInsidePlaque =
      nx >= safeMargin &&
      nx <= 1 - safeMargin &&
      ny >= safeMargin &&
      ny <= 1 - safeMargin;

    if (isInsidePlaque) {
      // Golden plaque (#f59e0b to #d97706)
      const grad = (nx - safeMargin) / (1 - 2 * safeMargin);
      let r = Math.round(245 - 30 * grad);
      let g = Math.round(158 - 35 * grad);
      let b = Math.round(11 + 5 * grad);

      // Border highlight
      const distToEdgeX = Math.min(nx - safeMargin, 1 - safeMargin - nx);
      const distToEdgeY = Math.min(ny - safeMargin, 1 - safeMargin - ny);
      const distToEdge = Math.min(distToEdgeX, distToEdgeY);

      if (distToEdge < 0.02) {
        // Gold/white highlight border
        return [255, 235, 170, 255];
      }

      // Draw stylized 'JW' letters in center
      // Center is at 0.5, 0.5
      const cx = (nx - 0.5) / 0.3;
      const cy = (ny - 0.5) / 0.3;

      // 'J' shape (left side cx ~ -0.4 to -0.1, cy ~ -0.4 to 0.4)
      const inJStem = cx >= -0.22 && cx <= -0.12 && cy >= -0.35 && cy <= 0.25;
      const inJBar = cx >= -0.32 && cx <= -0.10 && cy >= -0.35 && cy <= -0.28;
      const inJCurve = (cx >= -0.32 && cx <= -0.12 && cy >= 0.20 && cy <= 0.35) &&
                       ((cx - -0.22)**2 + (cy - 0.20)**2 < 0.025);

      // 'W' shape (right side cx ~ 0.05 to 0.45, cy ~ -0.35 to 0.35)
      const inW1 = Math.abs((cy - -0.35) - (cx - 0.05) * 2.3) < 0.1 && cy >= -0.35 && cy <= 0.35;
      const inW2 = Math.abs((cy - 0.35) + (cx - 0.18) * 2.3) < 0.1 && cy >= -0.35 && cy <= 0.35;
      const inW3 = Math.abs((cy - -0.35) - (cx - 0.28) * 2.3) < 0.1 && cy >= -0.35 && cy <= 0.35;
      const inW4 = Math.abs((cy - 0.35) + (cx - 0.40) * 2.3) < 0.1 && cy >= -0.35 && cy <= 0.35;

      if (inJStem || inJBar || inJCurve || inW1 || inW2 || inW3 || inW4) {
        // Deep navy text inside gold
        return [15, 23, 42, 255];
      }

      return [r, g, b, 255];
    }

    // Outer area
    return [bgR, bgG, bgB, 255];
  };
}

// Generate 192x192, 512x512, maskable 512x512, apple-touch 180x180
fs.writeFileSync('public/pwa-192x192.png', createPNG(192, 192, jwPixelGenerator(false)));
fs.writeFileSync('public/pwa-512x512.png', createPNG(512, 512, jwPixelGenerator(false)));
fs.writeFileSync('public/pwa-maskable-512x512.png', createPNG(512, 512, jwPixelGenerator(true)));
fs.writeFileSync('public/apple-touch-icon.png', createPNG(180, 180, jwPixelGenerator(false)));

console.log('PWA PNG assets successfully generated in public/ directory!');
