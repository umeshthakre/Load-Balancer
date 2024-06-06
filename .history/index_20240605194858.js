import * as http from "http";
import * as url from "url";
import * as serverConfig from "./config.json" assert { type: "json" };

let servers = serverConfig.default.servers;

const createServer = (host, port, timeout) => {
  http
    .createServer((req, res) => {
      const parsedUrl = url.parse(req.url, true);
      switch (parsedUrl.pathname) {
        case "/fast-response":
          res.writeHead(200, { "Content-type": "text/plain" });
          res.write(`Hello , this is from fast route and ${port}`);
          res.end();
          break;
        case "/slow-response":
          res.writeHead(200, { "Content-type": "text/plain" });
          res.write(`Hello , this is from slow route and ${port}`);

          // for (let i = 0; i < 10000; i++) {
          //   console.log(i);
          // }

          res.end();
          break;

        case "/very-slow":
          res.writeHead(200, { "Content-type": "text/plain" });
          res.write(`Hello , this is from very slow route and ${port}  `);

          // for (let i = 0; i < 10; i++) {
          //   console.log(i);
          // }

          res.end();
          break;

        default:
          res.writeHead(404, { "Content-type": "text/plain" });
          res.end();
          break;
      }
    })
    .listen(port, host, () => {
      console.log(`Server running on http://${host}:${port}`);
    });
};

servers.forEach((server) =>
  createServer(server.host, server.port, server.timeout)
);
