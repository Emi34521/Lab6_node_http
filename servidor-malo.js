import http from "http"
import fs from "fs/promises"
import path from "path"

//cambié el puerto porque me generaba algunos errores gracias a otros proyectos que tengo.
const PORT = 8280 //utilicé este porque estaba disponible.

//Primero que nada añadí un try- catch para recibir todos los errores en la terminal. 
try {
const server = http.createServer(async (req, res) => {
  if (req.url === "/") {
    res.writeHead(200, { "Content-Type": "text/plain" })
    res.end("Servidor activo")
    return
  }
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
  //Cuarto, cree un archivo llamado "datos.json" para que este no generara errores al no poder encontrarlo. 
  //este archivo al inicio se encuentra vacío. 
  if (req.url === "/api/student") {
    const filePath = path.join(process.cwd(), "datos.json")
    const texto = fs.readFile(filePath, "utf-8")
    res.writeHead(200, { "Content-Type": "application/json" })
    res.end(JSON.stringify(texto))
    return
  }
  if (req.url === "/saludo") {
    res.writeHead(200, { "Content-Type": "text/plain" })
    res.end("¡Hola, bienvenido. Video especial: https://www.youtube.com/watch?v=3BFTio5296w")
    return
  }

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
  res.writeHead(404, { "Content-Type": "text/plain" })
  res.end(`Ruta no encontrada: ${req.url}`)
})
//Segundo, cerré esta función para que únicamente haga la parte de crear el server, antes juntaba esto con la parte del listener 
//Tercero, cerré este listen para que funcionara adecuadamente, además, cambié el mensaje para que indique el puerto correcto. 
server.listen(PORT, () => {
  console.log("Servidor corriendo en http://localhost:8280")
})
} catch (error) {
  
}