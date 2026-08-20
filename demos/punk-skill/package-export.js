(function () {
  "use strict";

  const encoder = new TextEncoder();
  const crcTable = new Uint32Array(256);
  for (let index = 0; index < 256; index += 1) {
    let value = index;
    for (let bit = 0; bit < 8; bit += 1) value = (value & 1) ? (0xedb88320 ^ (value >>> 1)) : (value >>> 1);
    crcTable[index] = value >>> 0;
  }

  function asBytes(value) {
    if (value instanceof Uint8Array) return value;
    if (value instanceof ArrayBuffer) return new Uint8Array(value);
    return encoder.encode(String(value));
  }

  function crc32(bytes) {
    let value = 0xffffffff;
    for (const byte of bytes) value = crcTable[(value ^ byte) & 0xff] ^ (value >>> 8);
    return (value ^ 0xffffffff) >>> 0;
  }

  function dosDateTime(date) {
    const year = Math.max(1980, date.getFullYear());
    return {
      time: ((date.getHours() & 31) << 11) | ((date.getMinutes() & 63) << 5) | ((Math.floor(date.getSeconds() / 2)) & 31),
      date: (((year - 1980) & 127) << 9) | (((date.getMonth() + 1) & 15) << 5) | (date.getDate() & 31),
    };
  }

  function createZip(entries) {
    const localParts = [];
    const centralParts = [];
    const stamp = dosDateTime(new Date());
    let offset = 0;

    entries.forEach((entry) => {
      const name = encoder.encode(entry.path.replace(/\\/g, "/"));
      const data = asBytes(entry.bytes);
      const checksum = crc32(data);

      const local = new Uint8Array(30 + name.length);
      const localView = new DataView(local.buffer);
      localView.setUint32(0, 0x04034b50, true);
      localView.setUint16(4, 20, true);
      localView.setUint16(6, 0x0800, true);
      localView.setUint16(8, 0, true);
      localView.setUint16(10, stamp.time, true);
      localView.setUint16(12, stamp.date, true);
      localView.setUint32(14, checksum, true);
      localView.setUint32(18, data.length, true);
      localView.setUint32(22, data.length, true);
      localView.setUint16(26, name.length, true);
      localView.setUint16(28, 0, true);
      local.set(name, 30);
      localParts.push(local, data);

      const central = new Uint8Array(46 + name.length);
      const centralView = new DataView(central.buffer);
      centralView.setUint32(0, 0x02014b50, true);
      centralView.setUint16(4, 20, true);
      centralView.setUint16(6, 20, true);
      centralView.setUint16(8, 0x0800, true);
      centralView.setUint16(10, 0, true);
      centralView.setUint16(12, stamp.time, true);
      centralView.setUint16(14, stamp.date, true);
      centralView.setUint32(16, checksum, true);
      centralView.setUint32(20, data.length, true);
      centralView.setUint32(24, data.length, true);
      centralView.setUint16(28, name.length, true);
      centralView.setUint16(30, 0, true);
      centralView.setUint16(32, 0, true);
      centralView.setUint16(34, 0, true);
      centralView.setUint16(36, 0, true);
      centralView.setUint32(38, 0, true);
      centralView.setUint32(42, offset, true);
      central.set(name, 46);
      centralParts.push(central);
      offset += local.length + data.length;
    });

    const centralSize = centralParts.reduce((total, part) => total + part.length, 0);
    const end = new Uint8Array(22);
    const endView = new DataView(end.buffer);
    endView.setUint32(0, 0x06054b50, true);
    endView.setUint16(4, 0, true);
    endView.setUint16(6, 0, true);
    endView.setUint16(8, entries.length, true);
    endView.setUint16(10, entries.length, true);
    endView.setUint32(12, centralSize, true);
    endView.setUint32(16, offset, true);
    endView.setUint16(20, 0, true);
    return new Blob([...localParts, ...centralParts, end], { type: "application/zip" });
  }

  async function sha256(bytes) {
    const digest = await crypto.subtle.digest("SHA-256", asBytes(bytes));
    return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, "0")).join("");
  }

  function loadImage(url) {
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.onload = () => resolve(image);
      image.onerror = () => reject(new Error("底图加载失败，无法导出封面。"));
      image.src = url;
    });
  }

  function wrappedLines(context, text, maxWidth) {
    const lines = [];
    let current = "";
    for (const character of Array.from(text)) {
      const candidate = current + character;
      if (current && context.measureText(candidate).width > maxWidth) {
        lines.push(current);
        current = character;
      } else current = candidate;
    }
    if (current) lines.push(current);
    return lines;
  }

  function fitTitle(context, title, maxWidth, maxLines) {
    for (let size = 86; size >= 48; size -= 2) {
      context.font = `900 ${size}px system-ui, "Microsoft YaHei", sans-serif`;
      const lines = wrappedLines(context, title, maxWidth);
      if (lines.length <= maxLines) return { size, lines };
    }
    context.font = '900 48px system-ui, "Microsoft YaHei", sans-serif';
    return { size: 48, lines: wrappedLines(context, title, maxWidth).slice(0, maxLines) };
  }

  async function buildCoverPng(options) {
    const image = await loadImage(options.imageUrl);
    const canvas = document.createElement("canvas");
    canvas.width = 900;
    canvas.height = 1200;
    const context = canvas.getContext("2d");
    if (!context) throw new Error("当前浏览器不支持 Canvas 2D 导出。" );

    const scale = Math.max(canvas.width / image.naturalWidth, canvas.height / image.naturalHeight);
    const drawWidth = image.naturalWidth * scale;
    const drawHeight = image.naturalHeight * scale;
    context.drawImage(image, (canvas.width - drawWidth) / 2, (canvas.height - drawHeight) / 2, drawWidth, drawHeight);

    const gradient = context.createLinearGradient(0, 280, 0, canvas.height);
    gradient.addColorStop(0, "rgba(6, 7, 6, 0.03)");
    gradient.addColorStop(0.58, "rgba(6, 7, 6, 0.28)");
    gradient.addColorStop(1, "rgba(6, 7, 6, 0.92)");
    context.fillStyle = gradient;
    context.fillRect(0, 0, canvas.width, canvas.height);

    context.fillStyle = "#d8ff45";
    context.font = '800 22px ui-monospace, "Microsoft YaHei", monospace';
    context.fillText(String(options.kicker || "PUNK PUBLISH / DRAFT").toUpperCase(), 76, 790);

    const fitted = fitTitle(context, options.title, 748, 3);
    context.font = `900 ${fitted.size}px system-ui, "Microsoft YaHei", sans-serif`;
    context.fillStyle = "#fffaf0";
    const lineHeight = fitted.size * 1.02;
    fitted.lines.forEach((line, index) => context.fillText(line, 76, 865 + index * lineHeight));

    const summaryY = Math.min(1120, 895 + fitted.lines.length * lineHeight);
    context.font = '500 27px system-ui, "Microsoft YaHei", sans-serif';
    context.fillStyle = "rgba(255, 250, 240, 0.9)";
    wrappedLines(context, options.summary, 720).slice(0, 2).forEach((line, index) => context.fillText(line, 78, summaryY + index * 38));

    return new Promise((resolve, reject) => {
      canvas.toBlob(async (blob) => {
        if (!blob) return reject(new Error("浏览器未能编码 PNG。"));
        resolve(new Uint8Array(await blob.arrayBuffer()));
      }, "image/png");
    });
  }

  function extensionFor(url, contentType) {
    const fromUrl = url.split("?")[0].split(".").pop().toLowerCase();
    if (["png", "jpg", "jpeg", "webp"].includes(fromUrl)) return fromUrl === "jpeg" ? "jpg" : fromUrl;
    if (contentType.includes("png")) return "png";
    if (contentType.includes("jpeg")) return "jpg";
    return "webp";
  }

  async function exportPackage(options) {
    options.onStatus?.("working", "正在合成 PNG、计算哈希并写入 ZIP…");
    const coverBytes = await buildCoverPng(options);
    const artworkResponse = await fetch(options.imageUrl);
    if (!artworkResponse.ok) throw new Error(`底图读取失败：HTTP ${artworkResponse.status}`);
    const artworkBytes = new Uint8Array(await artworkResponse.arrayBuffer());
    const artworkExt = extensionFor(options.imageUrl, artworkResponse.headers.get("content-type") || "");
    const root = options.slug;
    const text = (value) => encoder.encode(`${String(value).trim()}\n`);
    const files = [
      { path: `${root}/copy/title.md`, bytes: text(options.title), role: "copy-title" },
      { path: `${root}/copy/post.md`, bytes: text(options.post), role: "copy-body" },
      { path: `${root}/copy/summary.md`, bytes: text(options.summary), role: "copy-summary" },
      { path: `${root}/copy/cta.md`, bytes: text(options.cta), role: "copy-cta" },
      { path: `${root}/copy/hashtags.md`, bytes: text(options.hashtags), role: "copy-hashtags" },
      { path: `${root}/copy/alt-text.md`, bytes: text(options.altText), role: "accessibility-alt" },
      { path: `${root}/prompts/cover.md`, bytes: text(`# Agent invocation brief\n\n${options.command}\n\n> This browser export stores the invocation brief. A real Agent run should replace it with the compiled provider prompt.`), role: "agent-invocation-brief" },
      { path: `${root}/visual/artwork.${artworkExt}`, bytes: artworkBytes, role: "research-demo-artwork" },
      { path: `${root}/visual/cover.png`, bytes: coverBytes, role: "deterministic-cover" },
      { path: `${root}/visual/cover-copy.json`, bytes: text(JSON.stringify({ title: options.title, subtitle: options.summary, kicker: options.kicker, ratio: options.ratio, style_id: options.styleId, rendering: "canvas-deterministic-typography" }, null, 2)), role: "cover-copy" },
    ];

    const fileRecords = await Promise.all(files.map(async (file) => ({
      path: file.path.slice(root.length + 1),
      role: file.role,
      bytes: file.bytes.length,
      sha256: await sha256(file.bytes),
    })));
    const manifest = {
      schema_version: "punk-publish/2",
      status: "draft-not-published",
      slug: options.slug,
      preset: options.presetId,
      platform: options.platform,
      ratio: options.ratio,
      style_id: options.styleId,
      generated_at: new Date().toISOString(),
      export_environment: "browser-static-demo",
      artwork_provenance: "research-pre-generated-demo-asset",
      quality: options.quality,
      files: fileRecords,
      manifest_integrity: "The manifest does not hash itself; every other ZIP entry is hashed from its exported bytes.",
    };
    const manifestBytes = text(JSON.stringify(manifest, null, 2));
    files.push({ path: `${root}/manifest.json`, bytes: manifestBytes, role: "manifest" });
    const zip = createZip(files);
    const url = URL.createObjectURL(zip);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `${options.slug}-punk-publish.zip`;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 10000);
    window.__PUNK_LAST_EXPORT = { filename: anchor.download, bytes: zip.size, entries: files.map((file) => file.path), manifest };
    options.onStatus?.("success", `已导出 ${files.length} 个真实文件，ZIP ${(zip.size / 1024).toFixed(1)} KB。`);
    return window.__PUNK_LAST_EXPORT;
  }

  window.PunkPackageExport = { buildCoverPng, createZip, exportPackage };
})();
