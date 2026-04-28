// Fetch Disney-specific Wikipedia photos for Day 10/11/12
// Reuses pattern from fetch-photos-multi.mjs

import { writeFileSync, mkdirSync } from "node:fs";
import { setTimeout as sleep } from "node:timers/promises";

const OUTDIR = "/opt/mfz-pa/projects/chinatrip/assets/images";
mkdirSync(OUTDIR, { recursive: true });

const UA = "MFZ-PA chinatrip itinerary builder (mfelzayat@gmail.com)";

const TARGETS = [
  { slug: "disney-tron",      titles: ["TRON_Lightcycle_Power_Run", "Tron_Lightcycle_Power_Run"], n: 3 },
  { slug: "disney-pirates",   titles: ["Pirates_of_the_Caribbean:_Battle_for_the_Sunken_Treasure", "Pirates_of_the_Caribbean_Battle_for_the_Sunken_Treasure"], n: 3 },
  { slug: "disney-castle",    titles: ["Enchanted_Storybook_Castle"], n: 3 },
  { slug: "disney-soaring",   titles: ["Soaring_(ride)", "Soaring_Over_the_Horizon"], n: 2 },
  { slug: "disney-zootopia",  titles: ["Zootopia_(Shanghai_Disneyland)", "Shanghai_Disneyland_Park"], n: 2 },
  { slug: "disney-toystory",  titles: ["Toy_Story_Land_(Shanghai_Disneyland)", "Toy_Story_Land"], n: 2 },
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
  if (t.startsWith("File:")) return t.slice(5);
  return t;
}

function looksGood(item) {
  const t = item.title || "";
  const fname = filenameFromTitle(t);
  if (item.type !== "image") return false;
  if (!/\.(jpe?g|png)$/i.test(fname)) return false;
  for (const re of BAD_NAME_PATTERNS) {
    if (re.test(fname)) return false;
  }
  return true;
}

async function downloadThumb(filename, outPath, width = 1400) {
  const url = `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(filename)}?width=${width}`;
  const res = await fetch(url, { headers: { "User-Agent": UA }, redirect: "follow" });
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
      if (bytes < 8000) {
        console.log(`  ⚠ ${outName} too small (${kb} KB), skip`);
        slugResults.push({ outName, status: "too-small", filename });
        continue;
      }
      console.log(`  ✓ ${outName} (${kb} KB) ← ${filename}`);
      slugResults.push({ outName, status: "ok", filename, bytes, source: finalUrl, wikipediaTitle: usedTitle });
    } catch (e) {
      console.log(`  ✗ ${outName}: ${e.message}`);
      slugResults.push({ outName, status: "error", filename, error: e.message });
    }
    await sleep(500);
  }

  results.push({ slug: target.slug, wikipediaTitle: usedTitle, photos: slugResults });
}

console.log("\n── done ──");
const allPhotos = results.flatMap(r => r.photos || []);
const ok = allPhotos.filter(p => p.status === "ok").length;
console.log(`Total: ${ok}/${allPhotos.length} succeeded across ${results.length} targets`);

writeFileSync(`${OUTDIR}/_disney_sources.json`, JSON.stringify(results, null, 2));
console.log(`Manifest: ${OUTDIR}/_disney_sources.json`);
