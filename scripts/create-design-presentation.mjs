import { spawn } from "node:child_process";
import { createHash, randomBytes } from "node:crypto";
import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import http from "node:http";
import net from "node:net";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outputRoot = "C:\\Users\\felix\\OneDrive - Universität Würzburg\\PPP_Funeral-Compass";
const outputDir = path.join(outputRoot, "Designpraesentation");
const screenshotsDir = path.join(outputDir, "screenshots");
const pdfPath = path.join(outputDir, "Funeral-Compass-Designpraesentation.pdf");
const htmlPath = path.join(outputDir, "design-presentation.html");
const chromePath = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const appUrl = "http://127.0.0.1:5173/";
const storageKey = "funeral-compass:v3";
const designFile = path.join(root, "src", "design.css");

const themes = [
  { id: "himmelblau", name: "Himmelblau inspiriert", file: "himmelblau-inspired.css", note: "hell, freundlich, wolkige Himmelsflaechen, Poppins" },
  { id: "schoeneberg", name: "Schoeneberg inspiriert", file: "schoeneberg-inspired.css", note: "warm, kontrastreich, Seitenband, Merriweather + Barlow" },
  { id: "memorial-gallery", name: "Memorial Gallery", file: "memorial-gallery.css", note: "galerieartig, moderne Panel-Flaechen, Space Grotesk" },
  { id: "calm-editorial", name: "Calm Editorial", file: "calm-editorial.css", note: "editorial, ruhige Satzlinien, Source Serif + IBM Plex Sans" },
  { id: "soft-luxury", name: "Soft Luxury", file: "soft-luxury.css", note: "dunkel, hochwertig, Lichtvignette, Cormorant Garamond" },
  { id: "minimal-ritual", name: "Minimal Ritual", file: "minimal-ritual.css", note: "monochrom, streng, Kreuzlinien, Roboto Condensed" },
  { id: "nature-modern", name: "Nature Modern", file: "nature-modern.css", note: "organische Flaechen, Gruen-/Steintoene, Afacad" },
];

const baseState = {
  mode: "bereavement",
  deceasedName: "M. Schneider",
  deceasedLocation: "Wuerzburg",
  prePlanningFor: null,
  prePlanningName: "",
  burialType: "cremation",
  locationType: "cemetery",
  cemeteryName: "Hauptfriedhof",
  friedwaldName: "",
  seaRegion: null,
  finalGoodbye: "urn",
  cemeteryCeremony: "combined",
  cemeteryNoCeremonyFollowup: null,
  friedwaldCeremony: null,
  friedwaldTreeCeremony: null,
  seaMainCeremony: null,
  seaShipMode: null,
  ceremonyVenue: "cemetery",
  ceremonyPlace: "Trauerhalle",
  ceremonyFinalGoodbye: "Persoenlicher Abschied im kleinen Kreis",
  ceremonySpeaker: "free_speaker",
  ceremonyMusic: "live",
  ceremonyMusicWishes: "Ruhige Klaviermusik",
  ceremonyDecoration: "simple",
  ceremonyPicture: true,
  ceremonyPersonalItems: true,
  ceremonyPersonalItemsText: "Fotos und ein Erinnerungsbuch",
  ceremonyFlowers: true,
  ceremonyFlowerType: "bouquet",
  ceremonyDecorationText: "Dezente helle Blumen",
  ceremonyRituals: "Kerze und kurze Abschiedsworte",
  ceremonyMemorialCards: true,
  subSpeaker: null,
  subSeaSpeaker: null,
  subMusic: null,
  subPicture: null,
  subFlowersAtUrn: null,
  coffinSelection: "catalogue",
  coffinCatalogue: "pine_natural",
  coffinOther: "",
  publicViewing: false,
  clothing: "own",
  pillows: "catalogue",
  graveGoods: true,
  graveGoodsText: "Brief und kleine Erinnerung",
  urnSelection: "catalogue",
  urnCatalogue: "bio_natural",
  urnOther: "",
  graveTypeKind: "single",
  existingGrave: "no",
  graveNumber: "",
  graveFuturePeople: false,
  cemeteryEarthGrave: null,
  cemeteryCremationGrave: "gardened_field",
  graveCross: false,
  friedwaldExisting: null,
  friedwaldTreeNumber: "",
  friedwaldGraveOption: null,
  friedwaldNamePlate: null,
  obituaryBefore: true,
  obituaryBeforeMode: "region",
  obituaryBeforeWhere: "Wuerzburg",
  obituaryAfter: true,
  obituaryAfterMode: "region",
  obituaryAfterWhere: "Wuerzburg",
  sympathyBefore: true,
  sympathyBeforeAmount: "50",
  sympathyAfter: true,
  sympathyAfterAmount: "50",
  assistanceWanted: true,
};

const positions = [
  { id: "intro", name: "Einstieg", step: 0 },
  { id: "ceremony", name: "Zeremonie", step: 4 },
  { id: "assistance", name: "Assistance", step: 9 },
  { id: "summary", name: "Summary", step: 10 },
];

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function requestText(url) {
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      let body = "";
      res.setEncoding("utf8");
      res.on("data", (chunk) => (body += chunk));
      res.on("end", () => resolve(body));
    }).on("error", reject);
  });
}

async function waitForHttp(url, timeoutMs = 20000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try {
      await requestText(url);
      return;
    } catch {
      await wait(350);
    }
  }
  throw new Error(`Timed out waiting for ${url}`);
}

async function isServing(url) {
  try {
    await requestText(url);
    return true;
  } catch {
    return false;
  }
}

async function startVite() {
  if (await isServing(appUrl)) return null;
  const child = spawn("npm.cmd", ["run", "dev", "--", "--host", "127.0.0.1", "--port", "5173"], {
    cwd: root,
    stdio: "ignore",
    windowsHide: true,
    detached: false,
  });
  await waitForHttp(appUrl, 30000);
  return child;
}

function websocketAccept(key) {
  return createHash("sha1")
    .update(key + "258EAFA5-E914-47DA-95CA-C5AB0DC85B11")
    .digest("base64");
}

class CdpClient {
  constructor(socket) {
    this.socket = socket;
    this.nextId = 1;
    this.pending = new Map();
    this.buffer = Buffer.alloc(0);
    socket.on("data", (chunk) => this.onData(chunk));
    socket.on("close", () => {
      for (const { reject } of this.pending.values()) reject(new Error("CDP socket closed"));
      this.pending.clear();
    });
  }

  static async connect(wsUrl) {
    const parsed = new URL(wsUrl);
    const key = randomBytes(16).toString("base64");
    const socket = net.connect(Number(parsed.port), parsed.hostname);
    await new Promise((resolve, reject) => {
      socket.once("connect", resolve);
      socket.once("error", reject);
    });
    const request = [
      `GET ${parsed.pathname}${parsed.search} HTTP/1.1`,
      `Host: ${parsed.host}`,
      "Upgrade: websocket",
      "Connection: Upgrade",
      `Sec-WebSocket-Key: ${key}`,
      "Sec-WebSocket-Version: 13",
      "",
      "",
    ].join("\r\n");
    socket.write(request);
    let header = Buffer.alloc(0);
    while (!header.includes("\r\n\r\n")) {
      const chunk = await new Promise((resolve) => socket.once("data", resolve));
      header = Buffer.concat([header, chunk]);
    }
    const text = header.toString("utf8");
    if (!text.startsWith("HTTP/1.1 101")) throw new Error(`WebSocket handshake failed: ${text}`);
    const accept = text.match(/sec-websocket-accept:\s*(.+)\r/i)?.[1]?.trim();
    if (accept !== websocketAccept(key)) throw new Error("Invalid WebSocket accept header");
    const client = new CdpClient(socket);
    const rest = header.subarray(header.indexOf("\r\n\r\n") + 4);
    if (rest.length) client.onData(rest);
    return client;
  }

  onData(chunk) {
    this.buffer = Buffer.concat([this.buffer, chunk]);
    while (this.buffer.length >= 2) {
      const b1 = this.buffer[0];
      const b2 = this.buffer[1];
      let offset = 2;
      let len = b2 & 0x7f;
      if (len === 126) {
        if (this.buffer.length < offset + 2) return;
        len = this.buffer.readUInt16BE(offset);
        offset += 2;
      } else if (len === 127) {
        if (this.buffer.length < offset + 8) return;
        const high = this.buffer.readUInt32BE(offset);
        const low = this.buffer.readUInt32BE(offset + 4);
        len = high * 2 ** 32 + low;
        offset += 8;
      }
      const masked = Boolean(b2 & 0x80);
      const maskOffset = masked ? 4 : 0;
      if (this.buffer.length < offset + maskOffset + len) return;
      let payload = this.buffer.subarray(offset + maskOffset, offset + maskOffset + len);
      if (masked) {
        const mask = this.buffer.subarray(offset, offset + 4);
        payload = Buffer.from(payload.map((byte, index) => byte ^ mask[index % 4]));
      }
      this.buffer = this.buffer.subarray(offset + maskOffset + len);
      const opcode = b1 & 0x0f;
      if (opcode === 1) this.onMessage(payload.toString("utf8"));
      if (opcode === 8) this.socket.end();
    }
  }

  onMessage(text) {
    const message = JSON.parse(text);
    if (!message.id) return;
    const pending = this.pending.get(message.id);
    if (!pending) return;
    this.pending.delete(message.id);
    if (message.error) pending.reject(new Error(message.error.message));
    else pending.resolve(message.result);
  }

  send(method, params = {}) {
    const id = this.nextId++;
    const payload = Buffer.from(JSON.stringify({ id, method, params }), "utf8");
    let header;
    if (payload.length < 126) {
      header = Buffer.alloc(2);
      header[1] = payload.length | 0x80;
    } else if (payload.length < 65536) {
      header = Buffer.alloc(4);
      header[1] = 126 | 0x80;
      header.writeUInt16BE(payload.length, 2);
    } else {
      header = Buffer.alloc(10);
      header[1] = 127 | 0x80;
      header.writeUInt32BE(0, 2);
      header.writeUInt32BE(payload.length, 6);
    }
    header[0] = 0x81;
    const mask = randomBytes(4);
    const masked = Buffer.from(payload.map((byte, index) => byte ^ mask[index % 4]));
    this.socket.write(Buffer.concat([header, mask, masked]));
    return new Promise((resolve, reject) => this.pending.set(id, { resolve, reject }));
  }

  close() {
    this.socket.end();
  }
}

async function startChrome() {
  const userDataDir = path.join("C:\\tmp", "funeral-compass-design-chrome");
  await rm(userDataDir, { recursive: true, force: true });
  await mkdir(userDataDir, { recursive: true });
  const port = 9300 + Math.floor(Math.random() * 500);
  const child = spawn(chromePath, [
    "--headless=new",
    `--remote-debugging-port=${port}`,
    `--user-data-dir=${userDataDir}`,
    "--disable-gpu",
    "--no-first-run",
    "--no-default-browser-check",
    "about:blank",
  ], { stdio: "ignore", windowsHide: true });
  const versionUrl = `http://127.0.0.1:${port}/json/version`;
  const start = Date.now();
  while (Date.now() - start < 15000) {
    try {
      const version = JSON.parse(await requestText(versionUrl));
      return { child, port, browserWs: version.webSocketDebuggerUrl };
    } catch {
      await wait(300);
    }
  }
  throw new Error("Timed out starting Chrome");
}

async function newPage(port) {
  const targets = JSON.parse(await requestText(`http://127.0.0.1:${port}/json/list`));
  const target = targets.find((item) => item.type === "page") ?? targets[0];
  if (!target?.webSocketDebuggerUrl) throw new Error("No debuggable Chrome page target found");
  const client = await CdpClient.connect(target.webSocketDebuggerUrl);
  await client.send("Page.enable");
  await client.send("Runtime.enable");
  await client.send("Emulation.setDeviceMetricsOverride", {
    width: 390,
    height: 844,
    deviceScaleFactor: 3,
    mobile: true,
    screenWidth: 390,
    screenHeight: 844,
  });
  await client.send("Emulation.setUserAgentOverride", {
    userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/120.0.0.0 Mobile/15E148 Safari/604.1",
  });
  return client;
}

async function navigate(client, url) {
  await client.send("Page.navigate", { url });
  await wait(1100);
}

async function setStorageAndReload(client, step) {
  const payload = JSON.stringify({ step, state: baseState }).replace(/\\/g, "\\\\").replace(/`/g, "\\`");
  await client.send("Runtime.evaluate", {
    expression: `localStorage.setItem(${JSON.stringify(storageKey)}, \`${payload}\`);`,
    awaitPromise: true,
  });
  await client.send("Page.reload", { ignoreCache: true });
  await wait(1400);
  await client.send("Runtime.evaluate", {
    expression: "document.fonts && document.fonts.ready",
    awaitPromise: true,
  }).catch(() => {});
  await wait(450);
}

async function screenshot(client, filePath) {
  const result = await client.send("Page.captureScreenshot", {
    format: "png",
    fromSurface: true,
    captureBeyondViewport: false,
  });
  await writeFile(filePath, Buffer.from(result.data, "base64"));
}

function htmlEscape(value) {
  return value.replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]);
}

async function buildPresentation(shots) {
  const sections = themes.map((theme) => {
    const themeShots = shots.filter((shot) => shot.themeId === theme.id);
    return `
      <section class="theme-page">
        <div class="theme-copy">
          <p class="eyebrow">Funeral Compass Design</p>
          <h1>${htmlEscape(theme.name)}</h1>
          <p>${htmlEscape(theme.note)}</p>
        </div>
        <div class="phones">
          ${themeShots.map((shot) => `
            <figure>
              <div class="phone">
                <div class="speaker"></div>
              <img src="${shot.file.replaceAll("\\", "/")}" alt="${htmlEscape(theme.name)} ${htmlEscape(shot.positionName)}">
              </div>
              <figcaption>${htmlEscape(shot.positionName)}</figcaption>
            </figure>
          `).join("")}
        </div>
      </section>`;
  }).join("\n");

  const html = `<!doctype html>
<html lang="de">
<head>
  <meta charset="utf-8">
  <title>Funeral Compass Designpraesentation</title>
  <style>
    @page { size: A4 landscape; margin: 10mm; }
    * { box-sizing: border-box; }
    body {
      margin: 0;
      background: #f4f1ea;
      color: #1d1d1b;
      font-family: Arial, sans-serif;
    }
    .theme-page {
      page-break-after: always;
      min-height: 188mm;
      display: grid;
      grid-template-columns: 58mm 1fr;
      gap: 9mm;
      align-items: center;
      padding: 4mm;
    }
    .theme-copy {
      align-self: stretch;
      border-right: 1px solid rgba(0,0,0,.16);
      padding: 8mm 7mm 8mm 0;
      display: flex;
      flex-direction: column;
      justify-content: center;
    }
    .eyebrow {
      margin: 0 0 9mm;
      font-size: 8pt;
      text-transform: uppercase;
      letter-spacing: .12em;
      color: #7a7369;
    }
    h1 {
      margin: 0;
      font-size: 26pt;
      line-height: 1.03;
    }
    p {
      font-size: 10.5pt;
      line-height: 1.55;
      color: #5e584f;
    }
    .phones {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 5mm;
      align-items: start;
    }
    figure {
      margin: 0;
    }
    .phone {
      position: relative;
      width: 100%;
      padding: 28px 8px 8px;
      border-radius: 24px;
      background: #111;
      box-shadow: 0 12px 28px rgba(0,0,0,.18);
      overflow: hidden;
    }
    .speaker {
      position: absolute;
      z-index: 2;
      top: 9px;
      left: 50%;
      width: 28%;
      height: 9px;
      transform: translateX(-50%);
      border-radius: 999px;
      background: #050505;
    }
    .phone img {
      width: 100%;
      height: auto;
      aspect-ratio: 390 / 844;
      object-fit: contain;
      border-radius: 18px;
      display: block;
      background: white;
    }
    figcaption {
      margin-top: 2mm;
      text-align: center;
      font-size: 8pt;
      font-weight: 700;
      color: #4b4741;
    }
    .cover {
      min-height: 188mm;
      display: flex;
      flex-direction: column;
      justify-content: center;
      page-break-after: always;
      padding: 15mm;
      background:
        radial-gradient(circle at 75% 15%, rgba(74, 143, 159, .22), transparent 48mm),
        radial-gradient(circle at 15% 85%, rgba(190, 139, 57, .18), transparent 42mm),
        #f4f1ea;
    }
    .cover h1 {
      max-width: 180mm;
      font-size: 46pt;
    }
    .cover p {
      max-width: 135mm;
      font-size: 14pt;
    }
  </style>
</head>
<body>
  <section class="cover">
    <p class="eyebrow">Mobile Screenshots</p>
    <h1>Funeral Compass Designpraesentation</h1>
    <p>Uebersicht der aktuellen Theme-Varianten im schmalen Chrome-Mobile-Viewport mit mehreren Positionen im Wizard.</p>
  </section>
  ${sections}
</body>
</html>`;
  await writeFile(htmlPath, html, "utf8");
}

async function printPdf(client) {
  await client.send("Emulation.clearDeviceMetricsOverride").catch(() => {});
  await client.send("Page.navigate", { url: pathToFileURL(htmlPath).href });
  await wait(1200);
  const result = await client.send("Page.printToPDF", {
    printBackground: true,
    preferCSSPageSize: true,
  });
  await writeFile(pdfPath, Buffer.from(result.data, "base64"));
}

async function main() {
  await mkdir(screenshotsDir, { recursive: true });
  const originalDesign = await readFile(designFile, "utf8");
  const vite = await startVite();
  const chrome = await startChrome();
  const client = await newPage(chrome.port);
  const shots = [];

  try {
    for (const theme of themes) {
      await writeFile(designFile, `@import "./designs/${theme.file}";\n`, "utf8");
      await wait(750);
      await navigate(client, appUrl);
      for (const position of positions) {
        await setStorageAndReload(client, position.step);
        const filename = `${theme.id}-${position.id}.png`;
        const file = path.join(screenshotsDir, filename);
        await screenshot(client, file);
        shots.push({ themeId: theme.id, positionName: position.name, file });
      }
    }

    await buildPresentation(shots.map((shot) => ({ ...shot, file: path.join("screenshots", path.basename(shot.file)) })));
    await printPdf(client);
  } finally {
    await writeFile(designFile, originalDesign, "utf8");
    client.close();
    chrome.child.kill();
    if (vite) vite.kill();
  }

  console.log(pdfPath);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
