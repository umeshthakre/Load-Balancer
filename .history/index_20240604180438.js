import * as http from "http";
import * as url from "url";
import * as serverConfig from "./config.json" assert { type: "json" };

let servers = serverConfig.default.servers;

const createServer = (host, port) => {
  http
    .createServer((req, res) => {
      res.writeHead(200);
      res.end(`server response from port ${port}`);
    })
    .listen(port, host, () => {
      console.log(`Server running on http://${host}:${port}`);
    });
};

servers.forEach((server) => createServer(server.host, server.port));

const handler = (req, res,port) => {
  const parsedUrl = url.parse(req.url, true);

  switch (parsedUrl.pathname) {
    case '/':
      res.writeHead(200,{'Content-type':'text/plain'});
      res.write(`Hello , this is from ${port}`)
      break;
  
    default:
      break;
  }
};
