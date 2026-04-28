// Fetch real photographs from Wikipedia/Wikimedia Commons for each landmark.
// Uses Wikipedia's REST summary API which returns the page's lead image URL.

import { writeFileSync, mkdirSync } from "node:fs";
import { Readable } from "node:stream";

const OUTDIR = "/opt/mfz-pa/projects/chinatrip/assets/images";
mkdirSync(OUTDIR, { recursive: true });

// title-on-wikipedia → output-filename
const TARGETS = [
  ["Forbidden_City", "forbidden-city.jpg"],
  ["Mutianyu", "great-wall-mutianyu.jpg"],
  ["Tiananmen_Square", "tiananmen-square.jpg"],
  ["Hutong", "beijing-hutong.jpg"],
  ["Peking_duck", "peking-duck.jpg"],
  ["Wangfujing", "wangfujing-night.jpg"],
  ["Summer_Palace", "summer-palace.jpg"],
  ["Zhangjiajie_National_Forest_Park", "zhangjiajie-avatar.jpg"],
  ["Tianmen_Mountain", "tianmen-mountain.jpg"],
  ["Heaven%27s_Gate_(Tianmen_Mountain)", "tianmen-heavens-gate.jpg"],
  ["Bailong_Elevator", "bailong-elevator.jpg"],
  ["West_Lake", "west-lake-hangzhou.jpg"],
  ["Lingyin_Temple", "lingyin-temple.jpg"],
  ["Longjing_tea", "longjing-tea-fields.jpg"],
  ["The_Bund", "the-bund-shanghai.jpg"],
  ["Yu_Garden", "yu-garden-shanghai.jpg"],
  ["Shanghai_Disneyland_Park", "shanghai-disney-castle.jpg"],
  ["Oriental_Pearl_Tower", "pudong-skyline.jpg"],
  ["China_Railway_High-speed", "bullet-train-crh.jpg"],
];

async function getWikiImage(title) {
  const summaryUrl = `https://en.wikipedia.org/api/rest_v1/page/summary/${title}`;
  const res = await fetch(summaryUrl, {
    headers: { "User-Agent": "MFZ-PA chinatrip itinerary builder (mfelzayat@gmail.com)" },
  });
  if (!res.ok) throw new Error(`summary ${res.status}`);
  const j = await res.json();
  return j.originalimage?.source || j.thumbnail?.source || null;
}

async function downloadTo(url, path) {
  const res = await fetch(url, {
    headers: { "User-Agent": "MFZ-PA chinatrip itinerary builder (mfelzayat@gmail.com)" },
  });
  if (!res.ok) throw new Error(`fetch ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  writeFileSync(path, buf);
  return buf.length;
}

console.log("Fetching real photos from Wikipedia/Wikimedia…\n");
const results = [];
for (const [title, outName] of TARGETS) {
  try {
    const imgUrl = await getWikiImage(title);
    if (!imgUrl) {
      console.log(`  · ${outName}: no image on Wikipedia`);
      results.push({ outName, status: "no-image", title });
      continue;
    }
    const outPath = `${OUTDIR}/${outName}`;
    const bytes = await downloadTo(imgUrl, outPath);
    const kb = (bytes / 1024).toFixed(0);
    console.log(`  ✓ ${outName} (${kb} KB) ← ${title}`);
    results.push({ outName, status: "ok", title, bytes, source: imgUrl });
  } catch (e) {
    console.log(`  ✗ ${outName}: ${e.message}`);
    results.push({ outName, status: "error", title, error: e.message });
  }
}

console.log(`\nDone. ${results.filter(r => r.status === "ok").length}/${TARGETS.length} succeeded.`);
writeFileSync(`${OUTDIR}/_sources.json`, JSON.stringify(results, null, 2));
console.log(`Source manifest: ${OUTDIR}/_sources.json`);
