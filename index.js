const http = require("http");
const { insertar, consultar, editar, eliminar } = require('./consultas');
const fs = require('fs');
const url = require('url');

const port = 3000;

const server = http.createServer(async (req, res) => {

    if (req.url == "/" && req.method === "GET") {
        try {
            res.setHeader('content-type', 'text/html;charset=utf8')
            const html = fs.readFileSync('index.html', 'utf8')
            res.statusCode = 200;
            res.end(html);
        } catch (error) {
            showError(error, res);
        };

    } else if ((req.url == "/cancion" && req.method == "POST")) {
        try {
            let body = "";
            req.on('data', (chunk) => {
                body += chunk;
            });
            req.on("end", async () => {
                const cancion = (JSON.parse(body));
                console.log(cancion)
                const result = await insertar(cancion);
                res.statusCode = 201;
                res.end(JSON.stringify(result));
            });
        } catch (error) {
            showError(error, res);
        };

    } else if (req.url == "/canciones" && req.method === "GET") {
        try {
            const registros = await consultar();
            res.statusCode = 200;
            res.end(JSON.stringify(registros));
        } catch (error) {
            showError(error, res);
        };

    } else if (req.url == "/cancion" && req.method == "PUT") {
        try {
            let body = "";
            req.on("data", (chunk) => {
                body += chunk;
            });
            req.on("end", async () => {
                console.log('body', body)
                const datos = Object.values(JSON.parse(body));
                console.log('datos', datos)
                const respuesta = await editar(datos);
                res.statusCode = 201;
                res.end(JSON.stringify(respuesta));
            });
        } catch (error) {
            showError(error, res);
        };

    } else if (req.url.startsWith("/cancion?") && req.method == "DELETE") {
        try {
            const { id } = url.parse(req.url, true).query;
            const respuesta = await eliminar([id]);
            res.statusCode = 200;
            res.end(JSON.stringify(respuesta));
        } catch (error) {
            showError(error, res);
        };

    } else if (req.url == '/main.js') {
        fs.readFile('./main.js', (err, data) => {
            if (err) { throw err; }
            res.writeHead(200, { 'Content-Type': 'text/javascript' });
            res.write(data);
            res.end()
        });

    } else if (req.url == "/estilos.css" && req.method === "GET") {
        res.setHeader('content-type', 'text/css;charset=utf8')
        const estilo = fs.readFileSync('estilos.css', 'utf8')
        res.statusCode = 200;
        res.end(estilo);

    } else {
        res.statusCode = 404;
        const respuesta = 'Recurso no encontrado.';
        console.log(respuesta);
        res.end(respuesta);
    };
});

server.listen(port, () => console.log('Conectado al puerto:', port));

const showError = (error, res) => {
    console.log(error.message);
    console.log(error.code);
    res.statusCode = 500;
    res.end(JSON.stringify(error));
};