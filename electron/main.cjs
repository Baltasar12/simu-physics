const { app, BrowserWindow, net, protocol, session } = require("electron");
const { createHash } = require("node:crypto");
const { readFile, stat } = require("node:fs/promises");
const path = require("node:path");
const { pathToFileURL } = require("node:url");

const SCHEME = "app";
const ORIGIN = "app://laboratorio";

function isLocalURL(rawUrl) {
  try {
    const url = new URL(rawUrl);
    return (
      url.protocol === `${SCHEME}:` &&
      url.hostname === "laboratorio" &&
      url.port === "" &&
      url.username === "" &&
      url.password === ""
    );
  } catch {
    return false;
  }
}

protocol.registerSchemesAsPrivileged([
  { scheme: SCHEME, privileges: { standard: true, secure: true, supportFetchAPI: true } },
]);

const resourceRoot = app.isPackaged
  ? path.join(process.resourcesPath, "web")
  : path.resolve(__dirname, "..", "out");

const contentTypes = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".txt": "text/x-component; charset=utf-8",
  ".ico": "image/x-icon",
  ".png": "image/png",
  ".webp": "image/webp",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
};

function contentSecurityPolicy(html) {
  const hashes = [...html.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script\s*>/gi)]
    .map((match) => match[1])
    .filter(Boolean)
    .map((source) => `'sha256-${createHash("sha256").update(source).digest("base64")}'`);

  return [
    "default-src 'none'",
    `script-src 'self' ${hashes.join(" ")}`,
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data:",
    "font-src 'self' data:",
    "connect-src 'self'",
    "object-src 'none'",
    "base-uri 'none'",
    "form-action 'none'",
    "frame-src 'none'",
  ].join("; ");
}

function fileForRequest(rawUrl) {
  if (!isLocalURL(rawUrl)) return null;
  const url = new URL(rawUrl);

  let pathname;
  try {
    pathname = decodeURIComponent(url.pathname);
  } catch {
    return null;
  }

  if (pathname.includes("\\") || pathname.includes("\0")) return null;
  const parts = pathname.split("/").filter(Boolean);
  if (parts.some((part) => part === "." || part === ".." || part.includes(":")))
    return null;

  // Next 16 requests this page payload with dots, but exports it in a folder.
  const route = parts.join("/").replace(
    /(__next\.[^/]+)\.__PAGE__\.txt$/,
    "$1/__PAGE__.txt",
  );
  const relativeFile = route === "" ? "index.html" : route;
  const file = path.resolve(resourceRoot, relativeFile);
  const relative = path.relative(resourceRoot, file);
  if (!relative || relative.startsWith("..") || path.isAbsolute(relative))
    return null;
  return path.extname(file) ? file : `${file}.html`;
}

async function serveLocalResource(request) {
  const file = fileForRequest(request.url);
  if (!file) return new Response("Acceso denegado", { status: 403 });

  try {
    if (!(await stat(file)).isFile()) return new Response("No encontrado", { status: 404 });
    const type = contentTypes[path.extname(file)] ?? "application/octet-stream";

    if (path.extname(file) === ".html") {
      const html = await readFile(file, "utf8");
      return new Response(html, {
        headers: {
          "content-type": type,
          "content-security-policy": contentSecurityPolicy(html),
          "x-content-type-options": "nosniff",
        },
      });
    }

    const response = await net.fetch(pathToFileURL(file).toString());
    const headers = new Headers(response.headers);
    headers.set("content-type", type);
    headers.set("x-content-type-options", "nosniff");
    return new Response(response.body, { status: response.status, headers });
  } catch (error) {
    if (error.code === "ENOENT") return new Response("No encontrado", { status: 404 });
    console.error("No se pudo servir un recurso local:", error);
    return new Response("Error al cargar recurso", { status: 500 });
  }
}

function createWindow() {
  const window = new BrowserWindow({
    title: "Laboratorio Virtual de Electromagnetismo",
    width: 1280,
    height: 850,
    minWidth: 800,
    minHeight: 600,
    show: false,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: true,
    },
  });

  window.webContents.on("will-navigate", (event, destination) => {
    if (!isLocalURL(destination)) event.preventDefault();
  });
  window.webContents.setWindowOpenHandler(() => ({ action: "deny" }));
  window.once("ready-to-show", () => window.show());
  void window.loadURL(`${ORIGIN}/`);
}

app.whenReady().then(() => {
  protocol.handle(SCHEME, serveLocalResource);
  session.defaultSession.setPermissionRequestHandler((_contents, _permission, callback) =>
    callback(false),
  );
  session.defaultSession.setPermissionCheckHandler(() => false);
  createWindow();
});

app.on("window-all-closed", () => app.quit());
