// Retry failed photos with delays + alternative titles.
import { writeFileSync } from "node:fs";

const OUTDIR = "/opt/mfz-pa/projects/chinatrip/assets/images";

const TARGETS = [
  ["Tianmen_Cave", "tianmen-heavens-gate.jpg"],         // alternative: the cave/arch is called Tianmen Cave
  ["Longjing_tea", "longjing-tea-fields.jpg"],
  ["The_Bund", "the-bund-shanghai.jpg"],
  ["Yu_Garden", "yu-garden-shanghai.jpg"],
  ["Pudong", "pudong-skyline.jpg"],                     // try Pudong directly
  ["Fuxing_(train)", "bullet-train-crh.jpg"],            // CRH high-speed train
  ["Shanghai_Disney_Resort", "shanghai-disney-castle.jpg"], // try resort instead of park
];

async function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

async function getWikiImage(title) {
  const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${title}`;
  const res = await fetch(url, { headers: { "User-Agent": "MFZ-PA chinatrip builder (mfelzayat@gmail.com)" } });
  if (!res.ok) throw new Error(`summary ${res.status}`);
  const j = await res.json();
  return j.originalimage?.source || j.thumbnail?.source || null;
}

async function downloadTo(url, path) {
  const res = await fetch(url, { headers: { "User-Agent": "MFZ-PA chinatrip builder" } });
  if (!res.ok) throw new Error(`fetch ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  writeFileSync(path, buf);
  return buf.length;
}

console.log("Retrying with 2s delays…\n");
for (const [title, outName] of TARGETS) {
  try {
    await sleep(2000);
    const imgUrl = await getWikiImage(title);
    if (!imgUrl) { console.log(`  · ${outName}: no image (${title})`); continue; }
    await sleep(1000);
    const bytes = await downloadTo(imgUrl, `${OUTDIR}/${outName}`);
    console.log(`  ✓ ${outName} (${(bytes/1024).toFixed(0)} KB) ← ${title}`);
  } catch (e) {
    console.log(`  ✗ ${outName}: ${e.message}`);
  }
}
console.log("\ndone");
