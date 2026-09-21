import { createReadStream, existsSync } from "node:fs";
import { stat } from "node:fs/promises";
import { createServer } from "node:http";
import { extname, join, normalize, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(fileURLToPath(new URL("../dist", import.meta.url)));
const host = process.env.HOST || "127.0.0.1";
const port = Number(process.env.PORT || 4321);

const types = new Map([
  [".html", "text/html; charset=utf-8"],
  [".css", "text/css; charset=utf-8"],
  [".js", "text/javascript; charset=utf-8"],
  [".json", "application/json; charset=utf-8"],
  [".png", "image/png"],
  [".jpg", "image/jpeg"],
  [".jpeg", "image/jpeg"],
  [".svg", "image/svg+xml"],
  [".ico", "image/x-icon"],
]);

function resolveRequest(url = "/") {
  const cleanUrl = decodeURIComponent(url.split("?")[0] || "/");
  const relativePath = cleanUrl === "/" ? "index.html" : cleanUrl.replace(/^\/+/, "");
  const candidate = normalize(join(root, relativePath));
  if (!candidate.startsWith(root)) return join(root, "404.html");
  if (existsSync(candidate)) return candidate;
  if (existsSync(`${candidate}.html`)) return `${candidate}.html`;
  return join(root, "404.html");
}

const server = createServer(async (request, response) => {
  const filePath = resolveRequest(request.url);

  try {
    const fileStat = await stat(filePath);
    response.writeHead(filePath.endsWith("404.html") && request.url !== "/404" ? 404 : 200, {
      "content-length": fileStat.size,
      "content-type": types.get(extname(filePath)) || "application/octet-stream",
    });
    createReadStream(filePath).pipe(response);
  } catch {
    response.writeHead(500, { "content-type": "text/plain; charset=utf-8" });
    response.end("No se pudo servir el prototipo local.");
  }
});

server.listen(port, host, () => {
  console.log(`Semillita prototipo: http://${host}:${port}/`);
});
