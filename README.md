# Lab6_node_http
# Lab6 — HTTP Server with Node.js

A Node.js lab where a basic HTTP server built with the native `http` module is debugged, documented, and extended.

---

## Requirements

- Node.js v18 or higher
- No external dependencies required (native modules only)

---

## How to run

```bash
node servidor-malo.js
```

The server will be available at: `http://localhost:8280`

---

## Available routes

| Method | Route | Response type | Description |
|--------|-------|---------------|-------------|
| GET | `/` | `text/plain` | Confirms the server is running |
| GET | `/info` | `application/json` | Server info, course, and technology |
| GET | `/saludo` | `text/plain` | Custom welcome message |
| GET | `/api/student` | `application/json` | Contents of `datos.json` |
| GET | `/api/status` | `application/json` | Current server status and port |
| GET | `/*` | `text/plain` | 404 response showing the attempted route |

---

## Part 1 — Fixes to the original code

The file `servidor-malo.js` was delivered with several errors that prevented it from working correctly. Each one is documented below.

### Fix 1 — Missing `try/catch`

**Problem:** The server had no error handling. Any uncaught exception would silently crash the process with no output.

**Solution:** The entire block was wrapped in a `try/catch` with `console.error` in the catch to log errors to the terminal.

```js
try {
  const server = http.createServer(...)
  server.listen(PORT, ...)
} catch (error) {
  console.error("Error starting the server:", error)
}
```

---

### Fix 2 — `server.listen` incorrectly scoped

**Problem:** The closing of `http.createServer(...)` and the call to `server.listen(...)` were merged together, causing a syntax error.

**Solution:** They were properly separated by closing `createServer` before calling `listen`.

```js
// Before (incorrect)
const server = http.createServer(async (req, res) => {
  ...
  server.listen(PORT, () => { ... })
})

// After (correct)
const server = http.createServer(async (req, res) => {
  ...
})
server.listen(PORT, () => { ... })
```

---

### Fix 3 — Wrong `Content-Type` on `/info`

**Problem:** The header used `"application-json"` (hyphen) instead of `"application/json"` (forward slash), causing the client to not interpret the response as JSON.

**Solution:** The header value was corrected.

```js
// Before
res.writeHead(200, { "Content-Type": "application-json" })

// After
res.writeHead(200, { "Content-Type": "application/json" })
```

---

### Fix 4 — Missing `await` on `fs.readFile` in `/api/student`

**Problem:** `fs.readFile` returns a Promise, but `await` was not being used, so `texto` held a `Promise` object instead of the actual file contents.

**Solution:** `await` was added before the call.

```js
// Before
const texto = fs.readFile(filePath, "utf-8")

// After
const texto = await fs.readFile(filePath, "utf-8")
```

---

### Fix 5 — Missing `datos.json` file

**Problem:** The `/api/student` route tried to read `datos.json`, but the file did not exist, causing a runtime error.

**Solution:** The file `datos.json` was created at the root of the project (it can be empty or contain test data).

---

### Fix 6 — Hardcoded port in `listen` message

**Problem:** The server startup message always showed `8280` as a hardcoded string, even if the port constant were to change.

**Solution:** The `PORT` constant was used dynamically in the message.

```js
// Before
console.log("Servidor corriendo en http://localhost:8280")

// After
console.log(`Server running at http://localhost:${PORT}`)
```

---

## Part 2 — Modifications and new routes

### Change 1 — `/info` now responds with JSON

**Before:** It responded with a plain text string: `"Ruta de información"`.

**After:** It responds with a JSON object containing three properties.

```js
if (req.url === "/info") {
  const info = {
    mensaje: "Servidor funcionando correctamente",
    curso: "Desarrollo de Aplicaciones",
    tecnologia: "Node.js"
  }
  res.writeHead(200, { "Content-Type": "application/json" })
  res.end(JSON.stringify(info))
  return
}
```

**Expected response:**
```json
{
  "mensaje": "Servidor funcionando correctamente",
  "curso": "Desarrollo de Aplicaciones",
  "tecnologia": "Node.js"
}
```

---

### Change 2 — New `/saludo` route

A new route was added that responds with a plain text welcome message.

```js
if (req.url === "/saludo") {
  res.writeHead(200, { "Content-Type": "text/plain" })
  res.end("¡Hola, bienvenido! Video especial: https://www.youtube.com/watch?v=3BFTio5296w")
  return
}
```

**Expected response:**
```
¡Hola, bienvenido! Video especial: https://www.youtube.com/watch?v=3BFTio5296w
```

---

### Change 3 — New `/api/status` route

A new route was created that returns the current server status as JSON, using the `PORT` constant so the value is always accurate.

```js
if (req.url === "/api/status") {
  const status = {
    ok: true,
    status: "activo",
    puerto: PORT
  }
  res.writeHead(200, { "Content-Type": "application/json" })
  res.end(JSON.stringify(status))
  return
}
```

**Expected response:**
```json
{
  "ok": true,
  "status": "activo",
  "puerto": 8280
}
```

---

### Change 4 — 404 response now shows the attempted route

**Before:** It responded with status code `200` and a generic message regardless of the route visited.

**After:** It responds with HTTP status `404` and includes the route the user tried to visit.

```js
// Before
res.writeHead(200, { "Content-Type": "text/plain" })
res.end("Ruta no encontrada")

// After
res.writeHead(404, { "Content-Type": "text/plain" })
res.end(`Ruta no encontrada: ${req.url}`)
```

**Example response when visiting `/unknown-route`:**
```
Ruta no encontrada: /unknown-route
```

---

## Testing from the client

Each route can be tested directly in the browser, or using `curl` in the terminal:

```bash
curl http://localhost:8280/
curl http://localhost:8280/info
curl http://localhost:8280/saludo
curl http://localhost:8280/api/student
curl http://localhost:8280/api/status
curl http://localhost:8280/unknown-route
```