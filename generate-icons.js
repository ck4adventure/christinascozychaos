const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const SVG_PATH = path.join(__dirname, 'public', 'ccc-logo.svg');
const OUT_DIR  = path.join(__dirname, 'public', 'icons');

if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

const icons = [
  { name: 'icon-32.png',           size: 32,  maskable: false },
  { name: 'icon-72.png',           size: 72,  maskable: false },
  { name: 'icon-96.png',           size: 96,  maskable: false },
  { name: 'icon-128.png',          size: 128, maskable: false },
  { name: 'icon-144.png',          size: 144, maskable: false },
  { name: 'icon-152.png',          size: 152, maskable: false },
  { name: 'icon-192.png',          size: 192, maskable: false },
  { name: 'icon-384.png',          size: 384, maskable: false },
  { name: 'icon-512.png',          size: 512, maskable: false },
  { name: 'icon-maskable-192.png', size: 192, maskable: true  },
  { name: 'icon-maskable-512.png', size: 512, maskable: true  },
];

async function generate() {
  for (const icon of icons) {
    if (icon.maskable) {
      const innerSize = Math.round(icon.size * 0.8);
      const padding   = Math.round(icon.size * 0.1);
      const resized = await sharp(SVG_PATH)
        .resize(innerSize, innerSize)
        .toBuffer();
      await sharp({
        create: {
          width: icon.size, height: icon.size,
          channels: 4,
          background: { r: 42, g: 14, b: 48, alpha: 1 }, // #2A0E30
        }
      })
        .composite([{ input: resized, top: padding, left: padding }])
        .png()
        .toFile(path.join(OUT_DIR, icon.name));
    } else {
      await sharp(SVG_PATH)
        .resize(icon.size, icon.size)
        .png()
        .toFile(path.join(OUT_DIR, icon.name));
    }
    console.log(`✓ ${icon.name}`);
  }
  console.log('\n🌙 All icons generated!');
}

generate().catch(console.error);
