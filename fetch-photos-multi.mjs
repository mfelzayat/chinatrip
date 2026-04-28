// Fetch 3-5 real photos per landmark from Wikipedia/Wikimedia Commons.
// Strategy:
//   1. For each landmark, GET https://en.wikipedia.org/api/rest_v1/page/media-list/<title>
//   2. Filter to image/* (skip SVGs, maps, diagrams, audio/video)
//   3. Pick first N "good" candidates
//   4. Download 1200px thumb via Special:FilePath?width=1200 (small + fast)
//   5. Save to assets/images/<slug>-N.jpg, write _sources.json with attribution.
//
// Run: node fetch-photos-multi.mjs

import { writeFileSync, mkdirSync, existsSync, statSync } from "node:fs";
import { setTimeout as sleep } from "node:timers/promises";

const OUTDIR = "/opt/mfz-pa/projects/chinatrip/assets/images";
mkdirSync(OUTDIR, { recursive: true });

const UA = "MFZ-PA chinatrip itinerary builder (mfelzayat@gmail.com)";

// slug → wikipedia titles to try (in order). N = number of photos wanted.
const TARGETS = [
  // Beijing
  { slug: "forbidden-city",       titles: ["Forbidden_City"], n: 4 },
  { slug: "tiananmen-square",     titles: ["Tiananmen_Square"], n: 3 },
  { slug: "great-wall-mutianyu",  titles: ["Mutianyu", "Great_Wall_of_China"], n: 4 },
  { slug: "beijing-hutong",       titles: ["Hutong"], n: 3 },
  { slug: "wangfujing-night",     titles: ["Wangfujing"], n: 3 },
  { slug: "summer-palace",        titles: ["Summer_Palace"], n: 4 },
  { slug: "temple-of-heaven",     titles: ["Temple_of_Heaven"], n: 3 },
  // Xi'an
  { slug: "xian-terracotta",      titles: ["Terracotta_Army"], n: 4 },
  { slug: "xian-city-wall",       titles: ["Fortifications_of_Xi%27an", "City_Wall_of_Xi%27an"], n: 3 },
  { slug: "xian-muslim-quarter",  titles: ["Muslim_Quarter,_Xi%27an", "Beiyuanmen"], n: 3 },
  { slug: "xian-pagoda",          titles: ["Giant_Wild_Goose_Pagoda"], n: 3 },
  { slug: "xian-tang-paradise",   titles: ["Tang_Paradise"], n: 3 },
  { slug: "xian-bell-tower",      titles: ["Bell_Tower_of_Xi%27an"], n: 3 },
  { slug: "xian-shaanxi-museum",  titles: ["Shaanxi_History_Museum"], n: 3 },
  // Shanghai
  { slug: "the-bund-shanghai",    titles: ["The_Bund"], n: 4 },
  { slug: "yu-garden-shanghai",   titles: ["Yu_Garden"], n: 3 },
  { slug: "pudong-skyline",       titles: ["Pudong", "Oriental_Pearl_Tower"], n: 4 },
  { slug: "shanghai-disney",      titles: ["Shanghai_Disneyland_Park", "Shanghai_Disney_Resort"], n: 3 },
  { slug: "nanjing-road",         titles: ["Nanjing_Road"], n: 3 },
];

const BAD_NAME_PATTERNS = [
  /\.svg$/i, /\.ogg$/i, /\.ogv$/i, /\.webm$/i,
  /map/i, /diagram/i, /chart/i, /coat[-_ ]of[-_ ]arms/i,
  /flag/i, /logo/i, /icon/i, /seal/i,
  /location/i, /locator/i, /compass/i,
  /signature/i, /handwriting/i,
  /question_mark/i, /commons-logo/i, /wiki/i,
];

async function fetchJson(url) {
  const res = await fetch(url, { headers: { "User-Agent": UA } });
  if (!res.ok) throw new Error(`${url} → ${res.status}`);
  return res.json();
}

async function getMediaList(title) {
  const url = `https://en.wikipedia.org/api/rest_v1/page/media-list/${title}`;
  return fetchJson(url);
}

function filenameFromTitle(t) {
  // titles look like "File:Foo Bar.jpg"
  if (t.startsWith("File:")) return t.slice(5);
  return t;
}

function looksGood(item) {
  const t = item.title || "";
  const fname = filenameFromTitle(t);
  if (item.type !== "image") return false;
  // skip non-jpeg/png
  if (!/\.(jpe?g|png)$/i.test(fname)) return false;
  for (const re of BAD_NAME_PATTERNS) {
    if (re.test(fname)) return false;
  }
  return true;
}

async function downloadThumb(filename, outPath, width = 1400) {
  // Use Special:FilePath which serves any size on demand
  const url = `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(filename)}?width=${width}`;
  const res = await fetch(url, {
    headers: { "User-Agent": UA },
    redirect: "follow",
  });
  if (!res.ok) throw new Error(`thumb ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  writeFileSync(outPath, buf);
  return { bytes: buf.length, finalUrl: res.url };
}

const results = [];

for (const target of TARGETS) {
  console.log(`\n── ${target.slug} (want ${target.n}) ──`);
  let mediaItems = [];
  let usedTitle = null;
  for (const title of target.titles) {
    try {
      const data = await getMediaList(title);
      const good = (data.items || []).filter(looksGood);
      if (good.length >= 1) {
        mediaItems = good;
        usedTitle = title;
        console.log(`  source: ${title} → ${good.length} candidate images`);
        break;
      } else {
        console.log(`  ${title}: no usable images`);
      }
    } catch (e) {
      console.log(`  ${title}: ${e.message}`);
    }
    await sleep(400);
  }

  if (!mediaItems.length) {
    console.log(`  ✗ no images for ${target.slug}`);
    results.push({ slug: target.slug, status: "no-images" });
    continue;
  }

  const picks = mediaItems.slice(0, target.n);
  const slugResults = [];

  for (let i = 0; i < picks.length; i++) {
    const item = picks[i];
    const filename = filenameFromTitle(item.title);
    const outName = `${target.slug}-${i + 1}.jpg`;
    const outPath = `${OUTDIR}/${outName}`;
    try {
      const { bytes, finalUrl } = await downloadThumb(filename, outPath, 1400);
      const kb = (bytes / 1024).toFixed(0);
      // Sanity: skip tiny (<8KB) files — probably error pages
      if (bytes < 8000) {
        console.log(`  ⚠ ${outName} suspiciously small (${kb} KB), skipping`);
        slugResults.push({ outName, status: "too-small", filename });
        continue;
      }
      console.log(`  ✓ ${outName} (${kb} KB) ← ${filename}`);
      slugResults.push({
        outName,
        status: "ok",
        filename,
        bytes,
        source: finalUrl,
        wikipediaTitle: usedTitle,
      });
    } catch (e) {
      console.log(`  ✗ ${outName}: ${e.message}`);
      slugResults.push({ outName, status: "error", filename, error: e.message });
    }
    await sleep(500); // avoid 429
  }

  results.push({ slug: target.slug, wikipediaTitle: usedTitle, photos: slugResults });
}

console.log("\n── done ──");
const allPhotos = results.flatMap(r => r.photos || []);
const ok = allPhotos.filter(p => p.status === "ok").length;
console.log(`Total: ${ok}/${allPhotos.length} succeeded across ${results.length} landmarks`);

writeFileSync(`${OUTDIR}/_sources.json`, JSON.stringify(results, null, 2));
console.log(`Manifest: ${OUTDIR}/_sources.json`);
