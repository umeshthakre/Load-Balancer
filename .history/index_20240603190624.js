import * as http from "http";

import * as serverConfig from "./config.json" assert { type: "json" };

console.log(serverConfig.default)

let servers = serverConfig.servers;

const createServer = (host, port) => {
  http
    .createServer((req, res) => {
      res.writeHead(200);
      res.end(`server response from port`);
    })
    .listen(port, host, () => {
      console.log(`Server running on http://${host}:${port}`);
    });
};
console.log(servers)
servers.forEach((server)=> createServer(server.host,server.port))

