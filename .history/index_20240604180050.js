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

const handler = (req,res)=>{

}

