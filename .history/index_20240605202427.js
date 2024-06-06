import * as http from "http";
import * as url from "url";
import * as serverConfig from "./config.json" assert { type: "json" };
// getting servers from config files
let servers = serverConfig.default.servers;
// create server function used to initilise functions and declare routes
const createServer = (host, port, timeout) => {
  http
    .createServer((req, res) => {
      // parsing url from req.url
      const parsedUrl = url.parse(req.url, true);
      // routing requests based on routes
      switch (parsedUrl.pathname) {
        // fast response route used to emulate a fast response from server
        case "/fast-response":
          res.writeHead(200, { "Content-type": "text/plain" });
          res.write(`Hello , this is from fast route and ${port}`);
          res.end();
          break;
          // slow route used to emulate a slow response from server
        case "/slow-response":
          res.writeHead(200, { "Content-type": "text/plain" });
          res.write(`Hello , this is from slow route and ${port}`);
          res.end();
          break;
        // very slow route used to emulate a very slow response from server
        case "/very-slow":
          res.writeHead(200, { "Content-type": "text/plain" });
          res.write(`Hello , this is from very slow route and ${port}  `);

          res.end();
          break;
        // default route
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
