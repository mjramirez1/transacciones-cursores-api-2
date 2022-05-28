const http = require("http")
const url = require('url')
const { insertar, consultar, editar, eliminar, consultarNombre } = require("./consultas")
const fs = require('fs')

http
    .createServer(async (req, res) => {
        if (req.url == "/" && req.method === "GET") {
            res.setHeader("content-type", "text/html")
            const html = fs.readFileSync("index.html", "utf8")
            res.end(html)
        }

        if ((req.url == "/ejercicios" && req.method === "POST")) {
            let body = "";
            req.on("data", (chunk) => {
                body += chunk
            })
            req.on("end", async () => {
                // Paso 2
                const bodyObject = JSON.parse(body)
                const datos = [bodyObject.nombre, bodyObject.series, bodyObject.repeticiones, bodyObject.descanso]
                // Paso 3
                const respuesta = await insertar(datos)
                
                // Paso 4
                if (respuesta) {
                    res.writeHead(201, { 'Content-Type': 'application/json' })
                    res.end(JSON.stringify(respuesta));
    
                } else {
                    res.writeHead(400, { 'Content-Type': 'application/json' })
                    res.end(JSON.stringify({
                        message: `El ejercicio '${bodyObject.nombre}' ya existe`
                    }));
                }

            })
        }

        if (req.url == "/ejercicios" && req.method === "GET") {
            // Paso 2
            const registros = await consultar()
            // Paso 3
            res.writeHead(200, { 'Content-Type': 'application/json' })
            res.end(JSON.stringify(registros))
        }


        if (req.url == "/ejercicios" && req.method == "PUT") {
            let body = "";
            req.on("data", (chunk) => {
                body += chunk;
            });
            req.on("end", async () => {
                const bodyObject = JSON.parse(body)
                const datos = [bodyObject.nombre, bodyObject.series, bodyObject.repeticiones, bodyObject.descanso]
                const respuesta = await editar(datos);
                res.end(JSON.stringify(respuesta));
            });
        }

        if (req.url.startsWith("/ejercicios?") && req.method == "DELETE") {
            // Paso 3
            const { nombre } = url.parse(req.url, true).query;
            // Paso 4
            const respuesta = await eliminar(nombre);
            res.end(JSON.stringify(respuesta));
        }

        if (req.url.startsWith("/ejercicios?") && req.method == "GET") {
            // Paso 3
            const { nombre } = url.parse(req.url, true).query;
            // Paso 4
            const respuesta = await consultarNombre(nombre);
            console.log(respuesta)
            if (respuesta) {
                res.writeHead(200, { 'Content-Type': 'application/json' })
                res.end(JSON.stringify(respuesta));

            } else {
                res.writeHead(404, { 'Content-Type': 'application/json' })
                res.end(JSON.stringify({
                    message:'Not found'
                }));
            }

        }
    })


    .listen(3000)