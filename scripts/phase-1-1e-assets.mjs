import { copyFile, mkdir, readdir, rm, writeFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const scriptDir = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(scriptDir, "..");
const workspaceRoot = resolve(projectRoot, "..", "..");
const antecedentsRoot = join(workspaceRoot, "Antecedentes");
const publicRoot = join(projectRoot, "public");
const phaseRoot = join(publicRoot, "images", "phase-1-1e");
const priorPhaseRoot = join(publicRoot, "images", "phase-1-1d");
const reviewRoot = join(projectRoot, ".asset-review");

const photoDirName = (await readdir(antecedentsRoot, { withFileTypes: true })).find((entry) =>
  entry.isDirectory() && entry.name.toLowerCase().startsWith("fotograf"),
)?.name;

if (!photoDirName) {
  throw new Error("No se encontro Antecedentes/Fotografias.");
}

const photosRoot = join(antecedentsRoot, photoDirName);

const emojiPaths = {
  carita: join(photosRoot, "carita.png"),
  conejito: join(photosRoot, "conejito.png"),
  corazon: join(photosRoot, "corazon.png"),
};

const records = [];
const generatedAssets = [];
const contactItems = [];

const sourcePhoto = (name) => join(photosRoot, name);
const phaseFile = (...parts) => join(phaseRoot, ...parts);
const priorFile = (...parts) => join(priorPhaseRoot, ...parts);

async function ensureFolder(path) {
  await mkdir(path, { recursive: true });
}

function uniqueEmojiNames(overlays) {
  return [...new Set(overlays.map((overlay) => overlay.emoji))];
}

async function makeEmojiInput({ emoji, size }) {
  return sharp(emojiPaths[emoji])
    .resize(size, size, { fit: "contain" })
    .png()
    .toBuffer();
}

async function protectedMaster({ source, overlays = [] }) {
  const image = sharp(source).rotate();
  const metadata = await image.metadata();
  const composites = await Promise.all(
    overlays.map(async (overlay) => ({
      input: await makeEmojiInput(overlay),
      left: Math.max(0, Math.round(overlay.x - overlay.size / 2)),
      top: Math.max(0, Math.round(overlay.y - overlay.size / 2)),
    })),
  );

  const buffer = await sharp(source)
    .rotate()
    .composite(composites)
    .jpeg({ quality: 94, mozjpeg: true })
    .toBuffer();

  return {
    buffer,
    height: metadata.height,
    width: metadata.width,
  };
}

async function emitFormats(input, outputBase, resize) {
  const jpegPath = `${outputBase}.jpg`;
  const webpPath = `${outputBase}.webp`;
  const avifPath = `${outputBase}.avif`;

  await sharp(input).resize(resize).jpeg({ quality: 84, mozjpeg: true }).toFile(jpegPath);
  await sharp(input).resize(resize).webp({ quality: 78 }).toFile(webpPath);
  await sharp(input).resize(resize).avif({ quality: 55, effort: 4 }).toFile(avifPath);

  for (const file of [jpegPath, webpPath, avifPath]) {
    const metadata = await sharp(file).metadata();
    generatedAssets.push({
      file: file.replace(`${phaseRoot}\\`, "").replaceAll("\\", "/"),
      format: metadata.format,
      height: metadata.height,
      size: metadata.size,
      width: metadata.width,
    });
  }
}

async function emitPhoto({ folder, name, master, widths, resizeForWidth }) {
  await ensureFolder(phaseFile(folder));

  for (const width of widths) {
    const resize = resizeForWidth ? resizeForWidth(width) : { width };
    await emitFormats(master.buffer, phaseFile(folder, `${name}-${width}`), resize);
  }
}

async function emitFixedPhoto({ folder, name, master, variants }) {
  await ensureFolder(phaseFile(folder));

  for (const variant of variants) {
    await emitFormats(master.buffer, phaseFile(folder, variant.name), variant.resize);
  }
}

function addRecord({ section, source, overlays, finalFile, visual = "Pendiente de revision visual en build." }) {
  records.push({
    section,
    source,
    facesCovered: overlays.length,
    emojis: overlays.length ? uniqueEmojiNames(overlays).join(", ") : "No aplica",
    finalFile,
    visual,
  });
}

async function processPhotoAsset(asset) {
  const source = asset.sourceType === "public"
    ? priorFile(...asset.source)
    : sourcePhoto(asset.source);
  const overlays = asset.overlays ?? [];
  const master = await protectedMaster({ source, overlays });

  if (asset.fixedVariants) {
    await emitFixedPhoto({
      folder: asset.folder,
      name: asset.name,
      master,
      variants: asset.fixedVariants,
    });
  } else {
    await emitPhoto({
      folder: asset.folder,
      name: asset.name,
      master,
      widths: asset.widths,
      resizeForWidth: asset.resizeForWidth,
    });
  }

  addRecord({
    section: asset.section,
    source: asset.sourceType === "public" ? asset.source.join("/") : asset.source,
    overlays,
    finalFile: `/images/phase-1-1e/${asset.folder}/${asset.outputFile}`,
  });

  if (asset.hasPeople) {
    contactItems.push({
      label: `${asset.section} (${overlays.length})`,
      buffer: master.buffer,
    });
  }
}

async function copyBrandAndCertifications() {
  await ensureFolder(phaseFile("brand"));
  await ensureFolder(phaseFile("certifications"));
  await sharp(priorFile("brand", "semillita-logo.webp"))
    .resize({ width: 320 })
    .webp({ quality: 88 })
    .toFile(phaseFile("brand", "semillita-logo.webp"));
  await sharp(priorFile("brand", "semillita-favicon.png"))
    .resize(180, 180, { fit: "contain" })
    .png()
    .toFile(phaseFile("brand", "semillita-favicon.png"));

  for (const name of ["autorizacion-funcionamiento", "reconocimiento-oficial"]) {
    const source = priorFile("certifications", `${name}.png`);
    await sharp(source).png().toFile(phaseFile("certifications", `${name}.png`));
    for (const width of [320, 520]) {
      await sharp(source).resize({ width }).png().toFile(phaseFile("certifications", `${name}-${width}.png`));
      await sharp(source).resize({ width }).webp({ quality: 82 }).toFile(phaseFile("certifications", `${name}-${width}.webp`));
    }
  }

  generatedAssets.push({ file: "brand/semillita-logo.webp", note: "Reemitido desde fase 1.1D sin metadatos." });
  generatedAssets.push({ file: "brand/semillita-favicon.png", note: "Reemitido desde fase 1.1D sin metadatos." });
}

async function copyRemainingActivitySvg() {
  await ensureFolder(phaseFile("activities"));
  await copyFile(
    priorFile("activities", "dia-nino-nina.svg"),
    phaseFile("activities", "dia-nino-nina.svg"),
  );
}

async function makeContactSheet() {
  await ensureFolder(reviewRoot);

  const columns = 3;
  const thumbWidth = 420;
  const thumbHeight = 315;
  const labelHeight = 54;
  const rows = Math.ceil(contactItems.length / columns);
  const canvas = sharp({
    create: {
      width: columns * thumbWidth,
      height: rows * (thumbHeight + labelHeight),
      channels: 3,
      background: "#f7f2e8",
    },
  });

  const composites = [];
  for (const [index, item] of contactItems.entries()) {
    const x = (index % columns) * thumbWidth;
    const y = Math.floor(index / columns) * (thumbHeight + labelHeight);
    const thumb = await sharp(item.buffer)
      .resize(thumbWidth, thumbHeight, { fit: "inside", background: "#f7f2e8" })
      .extend({
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        background: "#f7f2e8",
      })
      .jpeg({ quality: 86 })
      .toBuffer();
    const metadata = await sharp(thumb).metadata();
    const labelSvg = Buffer.from(`
      <svg width="${thumbWidth}" height="${labelHeight}" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="#ffffff"/>
        <text x="12" y="23" font-family="Arial, sans-serif" font-size="16" font-weight="700" fill="#273044">${escapeXml(item.label)}</text>
        <text x="12" y="43" font-family="Arial, sans-serif" font-size="13" fill="#5e6977">Maestro protegido para revision humana</text>
      </svg>
    `);

    composites.push({
      input: thumb,
      left: x + Math.round((thumbWidth - metadata.width) / 2),
      top: y + Math.round((thumbHeight - metadata.height) / 2),
    });
    composites.push({
      input: labelSvg,
      left: x,
      top: y + thumbHeight,
    });
  }

  const output = join(projectRoot, "revision-privacidad-fase-1-1e.png");
  await canvas.composite(composites).png().toFile(output);
}

function escapeXml(text) {
  return text
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

const photoAssets = [
  {
    section: "Portada",
    source: "Foto_portada.jpeg",
    folder: "hero",
    name: "portada",
    outputFile: "portada-1600.jpg",
    hasPeople: true,
    overlays: [
      { emoji: "carita", size: 126, x: 478, y: 538 },
      { emoji: "carita", size: 112, x: 948, y: 518 },
    ],
    fixedVariants: [
      { name: "portada-640", resize: { width: 640 } },
      { name: "portada-960", resize: { width: 960 } },
      { name: "portada-1280", resize: { width: 1280 } },
      { name: "portada-1600", resize: { width: 1600 } },
      { name: "portada-mobile-820x1200", resize: { width: 820, height: 1200, fit: "cover", position: "center" } },
    ],
  },
  {
    section: "Metodologia",
    source: "WhatsApp Image 2026-08-16 at 17.08.47.jpeg",
    folder: "content",
    name: "metodologia",
    widths: [640, 960],
    outputFile: "metodologia-960.jpg",
    hasPeople: true,
    overlays: [
      { emoji: "corazon", size: 82, x: 726, y: 54 },
      { emoji: "carita", size: 164, x: 875, y: 515 },
    ],
  },
  {
    section: "Nuestras familias",
    source: "Nuestra_familia.jpeg",
    folder: "content",
    name: "nuestras-familias",
    widths: [640, 960],
    outputFile: "nuestras-familias-960.jpg",
    hasPeople: true,
    overlays: [
      { emoji: "corazon", size: 270, x: 760, y: 1620 },
      { emoji: "corazon", size: 240, x: 1815, y: 1085 },
      { emoji: "corazon", size: 310, x: 2870, y: 1035 },
    ],
  },
  {
    section: "Nuestro jardin - patio",
    source: "patio1.jpeg",
    folder: "facilities",
    name: "patio-1",
    widths: [480, 800],
    outputFile: "patio-1-800.jpg",
    hasPeople: false,
    overlays: [],
  },
  {
    section: "Nuestro jardin - patio techado",
    source: "patio3.jpeg",
    folder: "facilities",
    name: "patio-3",
    widths: [480, 800],
    outputFile: "patio-3-800.jpg",
    hasPeople: false,
    overlays: [],
  },
  ...[1, 2, 3, 4].map((number) => ({
    section: `Nuestro jardin - sala ${number}`,
    source: `sala${number}.jpeg`,
    folder: "facilities",
    name: `sala-${number}`,
    widths: [480, 800],
    outputFile: `sala-${number}-800.jpg`,
    hasPeople: false,
    overlays: [],
  })),
  {
    section: "Semana Bienvenida",
    source: "Bienvenida.jpeg",
    folder: "activities",
    name: "semana-bienvenida",
    widths: [560, 880],
    outputFile: "semana-bienvenida-880.jpg",
    hasPeople: true,
    overlays: [
      { emoji: "carita", size: 112, x: 760, y: 292 },
      { emoji: "carita", size: 122, x: 940, y: 410 },
    ],
  },
  {
    section: "Conejito de Pascua",
    source: "pascua.jpeg",
    folder: "activities",
    name: "conejito-pascua",
    widths: [560, 880],
    outputFile: "conejito-pascua-880.jpg",
    hasPeople: true,
    overlays: [
      { emoji: "conejito", size: 166, x: 260, y: 615 },
      { emoji: "conejito", size: 166, x: 524, y: 645 },
      { emoji: "conejito", size: 166, x: 865, y: 622 },
    ],
  },
  {
    section: "Disertacion La Familia",
    source: "disertacion la familia.jpeg",
    folder: "activities",
    name: "disertacion-familia",
    widths: [560, 880],
    outputFile: "disertacion-familia-880.jpg",
    hasPeople: true,
    overlays: [
      { emoji: "corazon", size: 150, x: 370, y: 1585 },
      { emoji: "carita", size: 140, x: 650, y: 1435 },
      { emoji: "corazon", size: 140, x: 760, y: 1400 },
      { emoji: "carita", size: 150, x: 980, y: 1320 },
      { emoji: "corazon", size: 142, x: 1185, y: 1280 },
      { emoji: "carita", size: 142, x: 1360, y: 1260 },
      { emoji: "corazon", size: 142, x: 1575, y: 1245 },
      { emoji: "carita", size: 142, x: 1815, y: 1250 },
      { emoji: "corazon", size: 132, x: 2070, y: 1235 },
      { emoji: "carita", size: 132, x: 2275, y: 1225 },
      { emoji: "corazon", size: 132, x: 2445, y: 1215 },
      { emoji: "carita", size: 180, x: 2795, y: 720 },
      { emoji: "corazon", size: 160, x: 3025, y: 775 },
      { emoji: "carita", size: 152, x: 3830, y: 1485 },
      { emoji: "corazon", size: 140, x: 3990, y: 1320 },
    ],
  },
  {
    section: "Dia del Libro",
    source: "dia del libro.jpeg",
    folder: "activities",
    name: "dia-libro",
    widths: [560, 880],
    outputFile: "dia-libro-880.jpg",
    hasPeople: false,
    overlays: [],
  },
  {
    section: "Dia de la Tierra",
    source: "dia de la tierra.jpeg",
    folder: "activities",
    name: "dia-tierra",
    widths: [560, 880],
    outputFile: "dia-tierra-880.jpg",
    hasPeople: true,
    overlays: [
      { emoji: "carita", size: 120, x: 40, y: 590 },
      { emoji: "corazon", size: 122, x: 1060, y: 125 },
      { emoji: "carita", size: 136, x: 1350, y: 465 },
      { emoji: "corazon", size: 132, x: 525, y: 1030 },
      { emoji: "carita", size: 144, x: 1010, y: 1125 },
      { emoji: "corazon", size: 144, x: 1415, y: 910 },
    ],
  },
  {
    section: "Dia de la Mama",
    source: "WhatsApp Image 2026-08-16 at 17.17.34 (2).jpeg",
    folder: "activities",
    name: "dia-mama",
    widths: [560, 880],
    outputFile: "dia-mama-880.jpg",
    hasPeople: true,
    overlays: [
      { emoji: "carita", size: 62, x: 78, y: 358 },
      { emoji: "corazon", size: 62, x: 160, y: 360 },
      { emoji: "carita", size: 70, x: 220, y: 300 },
      { emoji: "corazon", size: 58, x: 230, y: 360 },
      { emoji: "carita", size: 54, x: 305, y: 370 },
      { emoji: "corazon", size: 56, x: 365, y: 365 },
      { emoji: "carita", size: 56, x: 420, y: 365 },
      { emoji: "corazon", size: 58, x: 478, y: 362 },
      { emoji: "carita", size: 60, x: 528, y: 360 },
      { emoji: "corazon", size: 66, x: 592, y: 352 },
      { emoji: "carita", size: 72, x: 680, y: 346 },
      { emoji: "corazon", size: 76, x: 760, y: 345 },
      { emoji: "carita", size: 82, x: 885, y: 365 },
      { emoji: "corazon", size: 86, x: 1035, y: 362 },
    ],
  },
  {
    section: "Dia del Papa",
    source: "dia del papa.jpeg",
    folder: "activities",
    name: "dia-papa",
    widths: [560, 880],
    outputFile: "dia-papa-880.jpg",
    hasPeople: true,
    overlays: [
      { emoji: "carita", size: 112, x: 600, y: 42 },
      { emoji: "corazon", size: 116, x: 112, y: 480 },
      { emoji: "carita", size: 126, x: 950, y: 442 },
    ],
  },
  {
    section: "Talleres de Invierno",
    sourceType: "public",
    source: ["activities", "talleres-invierno-880.jpg"],
    folder: "activities",
    name: "talleres-invierno",
    widths: [560, 880],
    outputFile: "talleres-invierno-880.jpg",
    hasPeople: false,
    overlays: [],
  },
  {
    section: "Fiestas Patrias",
    source: "Fiestas patrias.jpeg",
    folder: "activities",
    name: "fiestas-patrias",
    widths: [560, 880],
    outputFile: "fiestas-patrias-880.jpg",
    hasPeople: true,
    overlays: [
      { emoji: "carita", size: 220, x: 640, y: 600 },
      { emoji: "corazon", size: 142, x: 1000, y: 1010 },
      { emoji: "carita", size: 142, x: 1285, y: 1010 },
      { emoji: "corazon", size: 150, x: 2155, y: 965 },
      { emoji: "carita", size: 150, x: 2360, y: 955 },
      { emoji: "corazon", size: 170, x: 2675, y: 460 },
      { emoji: "carita", size: 170, x: 3780, y: 530 },
    ],
  },
  {
    section: "Disertacion Mis animales preferidos",
    source: "animales.jpeg",
    folder: "activities",
    name: "animales-preferidos",
    widths: [560, 880],
    outputFile: "animales-preferidos-880.jpg",
    hasPeople: false,
    overlays: [],
  },
  {
    section: "Graduacion",
    source: "graduacion.jpeg",
    folder: "activities",
    name: "graduacion",
    widths: [560, 880],
    outputFile: "graduacion-880.jpg",
    hasPeople: true,
    overlays: [
      { emoji: "carita", size: 152, x: 435, y: 1260 },
      { emoji: "corazon", size: 152, x: 690, y: 1295 },
      { emoji: "carita", size: 152, x: 950, y: 1260 },
      { emoji: "corazon", size: 152, x: 1275, y: 1240 },
      { emoji: "carita", size: 152, x: 1585, y: 1250 },
      { emoji: "corazon", size: 152, x: 1830, y: 1250 },
      { emoji: "carita", size: 152, x: 2110, y: 1245 },
      { emoji: "corazon", size: 152, x: 2370, y: 1235 },
      { emoji: "carita", size: 152, x: 2660, y: 1235 },
      { emoji: "corazon", size: 152, x: 2860, y: 1240 },
      { emoji: "corazon", size: 152, x: 3050, y: 1250 },
      { emoji: "carita", size: 152, x: 3370, y: 1260 },
      { emoji: "corazon", size: 152, x: 3695, y: 1270 },
    ],
  },
  {
    section: "Navidad en Familia",
    source: "navidad.jpeg",
    folder: "activities",
    name: "navidad-familia",
    widths: [560, 880],
    outputFile: "navidad-familia-880.jpg",
    hasPeople: true,
    overlays: [
      { emoji: "carita", size: 58, x: 200, y: 305 },
      { emoji: "corazon", size: 58, x: 315, y: 285 },
      { emoji: "carita", size: 58, x: 405, y: 285 },
      { emoji: "corazon", size: 58, x: 500, y: 275 },
      { emoji: "carita", size: 58, x: 550, y: 295 },
      { emoji: "corazon", size: 58, x: 735, y: 285 },
      { emoji: "carita", size: 58, x: 815, y: 275 },
      { emoji: "corazon", size: 62, x: 890, y: 240 },
      { emoji: "carita", size: 64, x: 205, y: 455 },
      { emoji: "corazon", size: 64, x: 295, y: 450 },
      { emoji: "carita", size: 64, x: 365, y: 455 },
      { emoji: "corazon", size: 64, x: 450, y: 430 },
      { emoji: "carita", size: 64, x: 530, y: 440 },
      { emoji: "corazon", size: 64, x: 600, y: 405 },
      { emoji: "carita", size: 64, x: 665, y: 410 },
      { emoji: "corazon", size: 64, x: 720, y: 450 },
      { emoji: "carita", size: 64, x: 790, y: 370 },
      { emoji: "corazon", size: 64, x: 815, y: 515 },
      { emoji: "carita", size: 64, x: 900, y: 505 },
      { emoji: "corazon", size: 64, x: 515, y: 560 },
      { emoji: "carita", size: 64, x: 625, y: 570 },
    ],
  },
  {
    section: "Talleres de Verano",
    sourceType: "public",
    source: ["activities", "talleres-verano-880.jpg"],
    folder: "activities",
    name: "talleres-verano",
    widths: [560, 880],
    outputFile: "talleres-verano-880.jpg",
    hasPeople: false,
    overlays: [],
  },
];

export async function run() {
  await rm(phaseRoot, { recursive: true, force: true });
  await ensureFolder(phaseRoot);

  await copyBrandAndCertifications();
  await copyRemainingActivitySvg();

  for (const asset of photoAssets) {
    await processPhotoAsset(asset);
  }

  await writeFile(
    join(reviewRoot, "phase-1-1e-assets.json"),
    JSON.stringify({ generatedAssets, records }, null, 2),
    "utf8",
  );
  await makeContactSheet();

  return {
    phaseRoot,
    photos: photoAssets.length,
    records,
  };
}
