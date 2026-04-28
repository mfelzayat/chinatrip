// Retry pass for missing photos with longer delays. Also handles the
// xian-muslim-quarter slug separately (no Wikipedia article exists; use
// Commons category instead).

import { writeFileSync, mkdirSync, readFileSync } from "node:fs";
import { setTimeout as sleep } from "node:timers/promises";

const OUTDIR = "/opt/mfz-pa/projects/chinatrip/assets/images";
mkdirSync(OUTDIR, { recursive: true });
const UA = "MFZ-PA chinatrip itinerary builder (mfelzayat@gmail.com)";

async function fetchJson(url) {
  const res = await fetch(url, { headers: { "User-Agent": UA } });
  if (!res.ok) throw new Error(`${url} → ${res.status}`);
  return res.json();
}

async function downloadThumb(filename, outPath, width = 1400, attempt = 1) {
  const url = `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(filename)}?width=${width}`;
  const res = await fetch(url, { headers: { "User-Agent": UA }, redirect: "follow" });
  if (res.status === 429 && attempt <= 4) {
    const wait = 4000 * attempt;
    console.log(`    429, waiting ${wait}ms (attempt ${attempt})`);
    await sleep(wait);
    return downloadThumb(filename, outPath, width, attempt + 1);
  }
  if (!res.ok) throw new Error(`thumb ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  writeFileSync(outPath, buf);
  return { bytes: buf.length, finalUrl: res.url };
}

const sources = JSON.parse(readFileSync(`${OUTDIR}/_sources.json`, "utf8"));

// Use Commons API to search for Muslim Quarter Xi'an photos
async function searchCommons(query, n = 5) {
  const url = `https://commons.wikimedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(query)}&srnamespace=6&format=json&srlimit=${n}`;
  const j = await fetchJson(url);
  return (j.query?.search || []).map(r => r.title);
}

// 1) handle missing xian-muslim-quarter via Commons search
console.log("\n── xian-muslim-quarter (Commons search) ──");
try {
  const titles = await searchCommons("Muslim Quarter Xi'an", 8);
  console.log(`  found ${titles.length} commons matches`);
  // Filter out non-images, maps, etc.
  const goodTitles = titles
    .map(t => t.replace(/^File:/, ""))
    .filter(f => /\.(jpe?g|png)$/i.test(f))
    .filter(f => !/map|diagram|chart|svg|logo/i.test(f))
    .slice(0, 3);
  const slugResults = [];
  for (let i = 0; i < goodTitles.length; i++) {
    const filename = goodTitles[i];
    const outName = `xian-muslim-quarter-${i + 1}.jpg`;
    const outPath = `${OUTDIR}/${outName}`;
    try {
      await sleep(1500);
      const { bytes, finalUrl } = await downloadThumb(filename, outPath);
      const kb = (bytes / 1024).toFixed(0);
      console.log(`  ✓ ${outName} (${kb} KB) ← ${filename}`);
      slugResults.push({ outName, status: "ok", filename, bytes, source: finalUrl, wikipediaTitle: "Commons:Muslim_Quarter_Xi'an" });
    } catch (e) {
      console.log(`  ✗ ${outName}: ${e.message}`);
      slugResults.push({ outName, status: "error", filename, error: e.message });
    }
  }
  const idx = sources.findIndex(s => s.slug === "xian-muslim-quarter");
  const entry = { slug: "xian-muslim-quarter", wikipediaTitle: "Commons:Muslim_Quarter_Xi'an", photos: slugResults };
  if (idx >= 0) sources[idx] = entry;
  else sources.push(entry);
} catch (e) {
  console.log(`  ✗ search: ${e.message}`);
}

// 2) Retry all entries with status=error in the existing manifest
for (const slugEntry of sources) {
  if (!slugEntry.photos) continue;
  for (const photo of slugEntry.photos) {
    if (photo.status === "error" && photo.filename) {
      const outPath = `${OUTDIR}/${photo.outName}`;
      console.log(`\nRetry: ${photo.outName} ← ${photo.filename}`);
      try {
        await sleep(2500);
        const { bytes, finalUrl } = await downloadThumb(photo.filename, outPath);
        const kb = (bytes / 1024).toFixed(0);
        if (bytes < 8000) {
          console.log(`  ⚠ too small (${kb} KB), still error`);
          continue;
        }
        console.log(`  ✓ ${photo.outName} (${kb} KB)`);
        photo.status = "ok";
        photo.bytes = bytes;
        photo.source = finalUrl;
        delete photo.error;
      } catch (e) {
        console.log(`  ✗ ${e.message}`);
        photo.error = e.message;
      }
    }
  }
}

writeFileSync(`${OUTDIR}/_sources.json`, JSON.stringify(sources, null, 2));
console.log("\n── retry done ──");
const allPhotos = sources.flatMap(s => s.photos || []);
const ok = allPhotos.filter(p => p.status === "ok").length;
console.log(`Total: ${ok}/${allPhotos.length} succeeded across ${sources.length} landmarks`);
