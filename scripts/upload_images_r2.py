#!/usr/bin/env python3
"""
Download product images from retailer CDNs, upload to Cloudflare R2,
then create media records in Payload's PostgreSQL and link to products.

Usage: python3 /tmp/upload_images_r2.py
Env vars: R2_BUCKET, R2_ENDPOINT, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY,
          DATABASE_URI, NEXT_PUBLIC_SITE_URL
"""
import os
import sys
import io
import json
import urllib.request
import urllib.error
import traceback

import boto3
from botocore.config import Config
import psycopg2

SITE_URL = os.environ.get("NEXT_PUBLIC_SITE_URL", "https://theherbpusher.com")
R2_BUCKET = os.environ["R2_BUCKET"]
R2_ENDPOINT = os.environ["R2_ENDPOINT"]
R2_ACCESS_KEY_ID = os.environ["R2_ACCESS_KEY_ID"]
R2_SECRET_ACCESS_KEY = os.environ["R2_SECRET_ACCESS_KEY"]
DATABASE_URI = os.environ["DATABASE_URI"]

PRODUCT_IMAGES = [
    {
        "name": "Ashwagandha KSM-66",
        "image_url": "https://static.thcdn.com/productimg/original/12335319-3025340121678707.jpg",
        "filename": "ashwagandha-ksm66.jpg",
        "mime_type": "image/jpeg",
    },
    {
        "name": "Omega-3 Fish Oil 1000mg",
        "image_url": "https://static.thcdn.com/productimg/original/10529329-1665341487128614.jpg",
        "filename": "omega3-fish-oil.jpg",
        "mime_type": "image/jpeg",
    },
    {
        "name": "Vitamin C 1000mg",
        "image_url": "https://static.thcdn.com/productimg/original/14871340-2125346372712674.jpg",
        "filename": "vitamin-c-1000mg.jpg",
        "mime_type": "image/jpeg",
    },
    {
        "name": "Magnesium Glycinate 400mg",
        "image_url": "https://www.simplysupplements.co.uk/cdn/shop/files/Magnesium-Bisglycinate-1500mg-Front-Label1.jpg?v=1781090053",
        "filename": "magnesium-glycinate.jpg",
        "mime_type": "image/jpeg",
    },
    {
        "name": "Vitamin D3 1000 IU",
        "image_url": "https://www.simplysupplements.co.uk/cdn/shop/files/Vitamin-D3-1000iu-Gummies-Front-Label.jpg?v=1773422428",
        "filename": "vitamin-d3-1000iu.jpg",
        "mime_type": "image/jpeg",
    },
    {
        "name": "Vitamin B12 1000mcg",
        "image_url": "https://www.simplysupplements.co.uk/cdn/shop/files/Vitamin-B12-1000-Front-Label.jpg?v=1774440303",
        "filename": "vitamin-b12-1000mcg.jpg",
        "mime_type": "image/jpeg",
    },
    {
        "name": "Zinc Picolinate 15mg",
        "image_url": "https://images.hollandandbarrettimages.co.uk/productimages/HB/724/069996_B.png",
        "filename": "zinc-15mg.png",
        "mime_type": "image/png",
    },
    {
        "name": "Probiotics 10 Billion Live Cultures",
        "image_url": "https://images.hollandandbarrettimages.co.uk/productimages/HB/724/068006_A.png",
        "filename": "probiotics-10-billion.png",
        "mime_type": "image/png",
    },
    {
        "name": "Lion's Mane Mushroom Capsules",
        "image_url": "https://s3.images-iherb.com/now/now04789/l/11.jpg",
        "filename": "lions-mane-mushroom.jpg",
        "mime_type": "image/jpeg",
    },
    {
        "name": "Creatine Monohydrate Powder 500g",
        "image_url": "https://s3.images-iherb.com/now/now02031/l/11.jpg",
        "filename": "creatine-monohydrate.jpg",
        "mime_type": "image/jpeg",
    },
]


def get_image_dimensions(data, mime_type):
    """Try to get image dimensions from raw bytes."""
    try:
        from PIL import Image
        img = Image.open(io.BytesIO(data))
        return img.size  # (width, height)
    except Exception:
        return (None, None)


def download_image(url):
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
    with urllib.request.urlopen(req, timeout=30) as resp:
        return resp.read()


def main():
    # Connect to S3/R2
    s3 = boto3.client(
        "s3",
        endpoint_url=R2_ENDPOINT,
        aws_access_key_id=R2_ACCESS_KEY_ID,
        aws_secret_access_key=R2_SECRET_ACCESS_KEY,
        config=Config(signature_version="s3v4"),
        region_name="auto",
    )

    # Connect to PostgreSQL
    conn = psycopg2.connect(DATABASE_URI)
    cur = conn.cursor()

    for item in PRODUCT_IMAGES:
        name = item["name"]
        print(f"\nProcessing: {name}")

        # Check if product exists and has no image
        cur.execute(
            "SELECT id, image_id FROM products WHERE name = %s LIMIT 1", (name,)
        )
        row = cur.fetchone()
        if not row:
            print(f"  ✗ Product not found")
            continue
        product_id, existing_image_id = row
        if existing_image_id:
            print(f"  ✓ Already has image (id={existing_image_id}), skipping")
            continue

        # Download image
        print(f"  → Downloading {item['image_url']}")
        try:
            data = download_image(item["image_url"])
        except Exception as e:
            print(f"  ✗ Download failed: {e}")
            continue
        print(f"  → {len(data):,} bytes downloaded")

        # Get dimensions
        width, height = get_image_dimensions(data, item["mime_type"])

        # Upload to R2
        filename = item["filename"]
        print(f"  → Uploading to R2 as {filename}")
        try:
            s3.put_object(
                Bucket=R2_BUCKET,
                Key=filename,
                Body=data,
                ContentType=item["mime_type"],
            )
        except Exception as e:
            print(f"  ✗ R2 upload failed: {e}")
            continue

        # Payload's s3Storage stores the URL as the Payload server URL
        # Format: {SITE_URL}/api/media/file/{filename}
        media_url = f"{SITE_URL}/api/media/file/{filename}"

        # Insert media record
        cur.execute(
            """
            INSERT INTO media (alt, url, filename, mime_type, filesize, width, height, updated_at, created_at)
            VALUES (%s, %s, %s, %s, %s, %s, %s, NOW(), NOW())
            RETURNING id
            """,
            (name, media_url, filename, item["mime_type"], len(data), width, height),
        )
        media_id = cur.fetchone()[0]
        print(f"  → Created media record id={media_id}, url={media_url}")

        # Link to product
        cur.execute(
            "UPDATE products SET image_id = %s WHERE id = %s", (media_id, product_id)
        )
        conn.commit()
        print(f"  ✓ Linked to product id={product_id}")

    cur.close()
    conn.close()
    print("\nAll done!")


if __name__ == "__main__":
    main()
