#!/usr/bin/env node
/**
 * Downloads product images from retailer CDNs and uploads them via Payload.
 * Run on the production server inside the app container:
 *   docker exec -it the_herb_pusher-app-1 node /tmp/upload_product_images.mjs
 *
 * Or via tsx for TypeScript config:
 *   docker run --rm --network the_herb_pusher_default \
 *     -e DATABASE_URI=... -e PAYLOAD_SECRET=... \
 *     the_herb_pusher-app node /tmp/upload_product_images.mjs
 */
import { createRequire } from 'module'
import { fileURLToPath } from 'url'
import path from 'path'
import https from 'https'
import http from 'http'
import fs from 'fs'
import os from 'os'

Error.stackTraceLimit = 50

// ── Patch Payload's own copy of @next/env ────────────────────────────────────
const payloadEntryUrl = import.meta.resolve('payload')
const payloadEntryPath = fileURLToPath(payloadEntryUrl)
const payloadDir = path.resolve(path.dirname(payloadEntryPath), '..')
const requireFromPayload = createRequire(path.join(payloadDir, 'package.json'))
const nextEnv = requireFromPayload('@next/env')
if (!nextEnv.default) {
  Object.defineProperty(nextEnv, 'default', { value: nextEnv, enumerable: false })
}

// ── Product → image URL mapping ───────────────────────────────────────────────
const PRODUCT_IMAGES = [
  {
    name: 'Ashwagandha KSM-66',
    imageUrl: 'https://static.thcdn.com/productimg/original/12335319-3025340121678707.jpg',
    filename: 'ashwagandha-ksm66.jpg',
  },
  {
    name: 'Omega-3 Fish Oil 1000mg',
    imageUrl: 'https://static.thcdn.com/productimg/original/10529329-1665341487128614.jpg',
    filename: 'omega3-fish-oil.jpg',
  },
  {
    name: 'Vitamin C 1000mg',
    imageUrl: 'https://static.thcdn.com/productimg/original/14871340-2125346372712674.jpg',
    filename: 'vitamin-c-1000mg.jpg',
  },
  {
    name: 'Magnesium Glycinate 400mg',
    imageUrl: 'https://www.simplysupplements.co.uk/cdn/shop/files/Magnesium-Bisglycinate-1500mg-Front-Label1.jpg?v=1781090053',
    filename: 'magnesium-glycinate.jpg',
  },
  {
    name: 'Vitamin D3 1000 IU',
    imageUrl: 'https://www.simplysupplements.co.uk/cdn/shop/files/Vitamin-D3-1000iu-Gummies-Front-Label.jpg?v=1773422428',
    filename: 'vitamin-d3-1000iu.jpg',
  },
  {
    name: 'Vitamin B12 1000mcg',
    imageUrl: 'https://www.simplysupplements.co.uk/cdn/shop/files/Vitamin-B12-1000-Front-Label.jpg?v=1774440303',
    filename: 'vitamin-b12-1000mcg.jpg',
  },
  {
    name: 'Zinc Picolinate 15mg',
    imageUrl: 'https://images.hollandandbarrettimages.co.uk/productimages/HB/724/069996_B.png',
    filename: 'zinc-15mg.png',
  },
  {
    name: 'Probiotics 10 Billion Live Cultures',
    imageUrl: 'https://images.hollandandbarrettimages.co.uk/productimages/HB/724/068006_A.png',
    filename: 'probiotics-10-billion.png',
  },
  {
    name: "Lion's Mane Mushroom Capsules",
    imageUrl: 'https://s3.images-iherb.com/now/now04789/l/11.jpg',
    filename: 'lions-mane-mushroom.jpg',
  },
  {
    name: 'Creatine Monohydrate Powder 500g',
    imageUrl: 'https://s3.images-iherb.com/now/now02031/l/11.jpg',
    filename: 'creatine-monohydrate.jpg',
  },
]

function downloadFile(url, destPath) {
  return new Promise((resolve, reject) => {
    const proto = url.startsWith('https') ? https : http
    const file = fs.createWriteStream(destPath)
    proto.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        file.close()
        fs.unlinkSync(destPath)
        return downloadFile(res.headers.location, destPath).then(resolve).catch(reject)
      }
      if (res.statusCode !== 200) {
        file.close()
        fs.unlinkSync(destPath)
        return reject(new Error(`HTTP ${res.statusCode} for ${url}`))
      }
      res.pipe(file)
      file.on('finish', () => { file.close(); resolve() })
    }).on('error', (err) => {
      file.close()
      if (fs.existsSync(destPath)) fs.unlinkSync(destPath)
      reject(err)
    })
  })
}

// ── Main ──────────────────────────────────────────────────────────────────────
console.log('[images] Loading Payload…')
const { getPayload } = await import('payload')
const { default: config } = await import('./src/payload.config.ts')
const payload = await getPayload({ config })

const tmpDir = os.tmpdir()

for (const { name, imageUrl, filename } of PRODUCT_IMAGES) {
  console.log(`\n[images] Processing: ${name}`)

  // 1. Find product
  const productRes = await payload.find({
    collection: 'products',
    where: { name: { equals: name } },
    limit: 1,
    depth: 0,
  })
  const product = productRes.docs[0]
  if (!product) {
    console.warn(`  ✗ Product not found: ${name}`)
    continue
  }
  if (product.image) {
    console.log(`  ✓ Already has image (id=${typeof product.image === 'object' ? product.image.id : product.image}), skipping`)
    continue
  }

  // 2. Download image
  const tmpPath = path.join(tmpDir, filename)
  console.log(`  → Downloading ${imageUrl}`)
  try {
    await downloadFile(imageUrl, tmpPath)
  } catch (err) {
    console.warn(`  ✗ Download failed: ${err.message}`)
    continue
  }

  const stat = fs.statSync(tmpPath)
  const mimeType = filename.endsWith('.png') ? 'image/png' : 'image/jpeg'

  // 3. Upload to Payload media collection
  console.log(`  → Uploading to Payload media (${(stat.size / 1024).toFixed(1)} KB)`)
  let mediaDoc
  try {
    mediaDoc = await payload.create({
      collection: 'media',
      data: {
        alt: name,
      },
      file: {
        data: fs.readFileSync(tmpPath),
        mimetype: mimeType,
        name: filename,
        size: stat.size,
      },
    })
  } catch (err) {
    console.warn(`  ✗ Upload failed: ${err.message}`)
    if (fs.existsSync(tmpPath)) fs.unlinkSync(tmpPath)
    continue
  }

  // 4. Link media to product
  console.log(`  → Linking media ${mediaDoc.id} to product ${product.id}`)
  await payload.update({
    collection: 'products',
    id: product.id,
    data: { image: mediaDoc.id },
  })

  fs.unlinkSync(tmpPath)
  console.log(`  ✓ Done`)
}

console.log('\n[images] All done!')
process.exit(0)
