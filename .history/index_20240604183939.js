import * as http from "http";
import * as url from "url";
import * as serverConfig from "./config.json" assert { type: "json" };

let servers = serverConfig.default.servers;

const handler = (req, res, port) => {
  const parsedUrl = url.parse(req.url, true);
  switch (parsedUrl.pathname) {
    case "/":
      res.writeHead(200, { "Content-type": "text/plain" });
      res.write(`Hello , this is from ${port} and route 1`);
      res.end();
      break;
    case "/route-two":
      res.writeHead(200, { "Content-type": "text/plain" });
      res.write(`Hello , this is from ${port} and route two`);
      res.end();
      break;
    default:
      res.writeHead(404, { "Content-type": "text/plain" });
      res.end();
      break;
  }
};

const sleepNow = (delay) =>
  new Promise((resolve) => setTimeout(resolve, delay));

const createServer = (host, port) => {
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

          for (let i = 0; i < 10000; i++) {
            console.log(i);
          }

          res.end();
          break;

        case "/very-slow":
          res.writeHead(200, { "Content-type": "text/plain" });
          res.write(`Hello , this is from very slow route and ${port}  `);

          for (let i = 0; i < 100000; i++) {
            console.log(i);
          }

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

servers.forEach((server) => createServer(server.host, server.port));

// inside create server function
//  http
// .createServer((req, res) => {
//   res.writeHead(200);
//   res.end(`server response from port ${port}`);
// })
// .listen(port, host, () => {
//   console.log(`Server running on http://${host}:${port}`);
// });
