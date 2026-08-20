const http = require("http");
const fs = require("fs");
const path = require("path");

const workspaceRoot = path.resolve(__dirname, "../..");
const port = Number(process.argv[2] || 8879);
const mime = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".cjs": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
  ".mp4": "video/mp4",
  ".md": "text/markdown; charset=utf-8",
  ".srt": "text/plain; charset=utf-8",
};

http.createServer((request, response) => {
  const requestPath = decodeURIComponent(new URL(request.url, "http://127.0.0.1").pathname);
  let filePath = path.resolve(workspaceRoot, `.${requestPath}`);
  if (!filePath.startsWith(workspaceRoot)) {
    response.writeHead(403).end("Forbidden");
    return;
  }
  if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) filePath = path.join(filePath, "index.html");
  if (!fs.existsSync(filePath) || !fs.statSync(filePath).isFile()) {
    response.writeHead(404).end("Not found");
    return;
  }

  const stat = fs.statSync(filePath);
  const type = mime[path.extname(filePath).toLowerCase()] || "application/octet-stream";
  const range = request.headers.range;
  if (range) {
    const match = /^bytes=(\d*)-(\d*)$/.exec(range);
    const start = match && match[1] ? Number(match[1]) : 0;
    const end = match && match[2] ? Math.min(Number(match[2]), stat.size - 1) : stat.size - 1;
    if (!match || start > end || start >= stat.size) {
      response.writeHead(416, { "Content-Range": `bytes */${stat.size}` }).end();
      return;
    }
    response.writeHead(206, {
      "Accept-Ranges": "bytes",
      "Content-Range": `bytes ${start}-${end}/${stat.size}`,
      "Content-Length": end - start + 1,
      "Content-Type": type,
    });
    fs.createReadStream(filePath, { start, end }).pipe(response);
    return;
  }

  response.writeHead(200, {
    "Accept-Ranges": "bytes",
    "Content-Length": stat.size,
    "Content-Type": type,
  });
  fs.createReadStream(filePath).pipe(response);
}).listen(port, "127.0.0.1", () => {
  console.log(`SRT Whiteboard research web: http://127.0.0.1:${port}/demos/srt-whiteboard-animation/`);
});
