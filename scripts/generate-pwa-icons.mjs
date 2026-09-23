import { mkdir } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import sharp from 'sharp';

const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const projectRoot = dirname(scriptDirectory);
const source = join(projectRoot, 'assets', 'app-icon.png');
const publicDirectory = join(projectRoot, 'public');

await mkdir(publicDirectory, { recursive: true });

await Promise.all(
  [192, 512].map((size) =>
    sharp(source)
      .resize(size, size, { fit: 'cover' })
      .png({ compressionLevel: 9 })
      .toFile(join(publicDirectory, `icon-${size}.png`)),
  ),
);

console.log('Generated PWA icons: public/icon-192.png, public/icon-512.png');
