#!/usr/bin/env python3
"""Verify guide URLs and submit IndexNow (Bing/Yandex/etc)."""
import json
import os
import secrets
import subprocess
import urllib.error
import urllib.parse
import urllib.request

URLS = [
    "https://theherbpusher.com/guides/best-focus-supplements-uk",
    "https://theherbpusher.com/guides/best-immunity-supplements-uk",
]
SITEMAP = "https://theherbpusher.com/sitemap.xml"
HOST = "theherbpusher.com"


def http_code(url):
    req = urllib.request.Request(url, method="GET", headers={"User-Agent": "HerbPusherBot/1.0"})
    try:
        with urllib.request.urlopen(req, timeout=20) as r:
            return r.status
    except urllib.error.HTTPError as e:
        return e.code
    except Exception as e:
        return str(e)


print("Live checks:")
for u in URLS + [SITEMAP]:
    print(f"  {http_code(u)}  {u}")

public_dir = "/opt/the_herb_pusher/apps/web/public"
os.makedirs(public_dir, exist_ok=True)

key_file = os.path.join(public_dir, "indexnow.key")
if os.path.isfile(key_file):
    key = open(key_file).read().strip()
else:
    key = secrets.token_hex(16)
    open(key_file, "w").write(key)
    print(f"Created IndexNow key in {public_dir}")

txt_path = os.path.join(public_dir, f"{key}.txt")
if not os.path.isfile(txt_path):
    open(txt_path, "w").write(key)

print(f"IndexNow key: {key[:8]}…")

subprocess.run(
    ["docker", "cp", txt_path, f"the_herb_pusher-app-1:/app/apps/web/public/{key}.txt"],
    check=False,
    capture_output=True,
)

key_url = f"https://{HOST}/{key}.txt"
print(f"Key URL check: {http_code(key_url)}  {key_url}")

payload = {
    "host": HOST,
    "key": key,
    "keyLocation": key_url,
    "urlList": URLS,
}
data = json.dumps(payload).encode()
req = urllib.request.Request(
    "https://api.indexnow.org/indexnow",
    data=data,
    headers={"Content-Type": "application/json; charset=utf-8"},
    method="POST",
)
try:
    with urllib.request.urlopen(req, timeout=30) as r:
        print(f"IndexNow: HTTP {r.status}")
except urllib.error.HTTPError as e:
    body = e.read().decode("utf-8", errors="ignore")
    print(f"IndexNow: HTTP {e.code} {body[:300]}")
except Exception as e:
    print(f"IndexNow error: {e}")

print("\nGoogle Search Console — open each and click Request indexing:")
for u in URLS:
    inspect = (
        "https://search.google.com/search-console/inspect"
        f"?resource_id=https%3A%2F%2Ftheherbpusher.com%2F"
        f"&id={urllib.parse.quote(u, safe='')}"
    )
    print(f"  {u}")
    print(f"    {inspect}")

print("\nSitemap:")
print("  https://search.google.com/search-console/sitemaps?resource_id=https%3A%2F%2Ftheherbpusher.com%2F")
