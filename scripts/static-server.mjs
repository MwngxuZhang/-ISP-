import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { extname, join, normalize } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));
const port = Number(process.env.PORT || 4173);
const mime = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".md": "text/markdown; charset=utf-8"
};

const server = createServer(async (request, response) => {
  try {
    const url = new URL(request.url || "/", `http://${request.headers.host}`);
    const requestedPath = url.pathname === "/" ? "/index.html" : url.pathname;
    const filePath = normalize(join(root, requestedPath));
    if (!filePath.startsWith(normalize(root))) {
      response.writeHead(403);
      response.end("Forbidden");
      return;
    }
    const body = await readFile(filePath);
    response.writeHead(200, { "Content-Type": mime[extname(filePath)] || "application/octet-stream" });
    response.end(body);
  } catch {
    response.writeHead(404);
    response.end("Not found");
  }
});

server.listen(port, "127.0.0.1", () => {
  console.log(`PixelPipe ISP Lab running at http://127.0.0.1:${port}`);
});
