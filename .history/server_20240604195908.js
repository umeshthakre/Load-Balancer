import * as http from "http";
import * as serverConfig from "./config.json" assert { type: "json" };
import httpProxy from "http-proxy";

const proxy = httpProxy.createProxyServer({});

let current = 0;

const servers = serverConfig.default.servers.map((server) => ({
    ...server,
    connections: 0,
  }));

const roundRobin = (servers, req, res) => {
  const target = servers[current];

  console.log(target);
  current = (current + 1) % servers.length;

  proxy.web(req, res, { target: `http://${target.host}:${target.port}` });
};


const lowestConnections = (servers,req,res)=>{
    servers = servers.sort((a,b)=> a.connections - b.connections);

    const target = servers[0];

    target.connections++;

    console.log(target)

    proxy.web(req,res,{target:`http://${target.host}:${target.port}`})

    res.on("finish",()=>{
        target.connections--;
    })

}

const loadBalancingAlgorithm = "leastConnection";

const server = http.createServer((req, res) => {
  if (loadBalancingAlgorithm === "roundRobin") {
    roundRobin(servers, req, res);
  }else if(loadBalancingAlgorithm === "leastConnection"){
    lowestConnections(servers,req,res)
  }
   else {
    res.writeHead(500);
    res.end("Load balancing algorithm is not supported");
  }
});

server.listen(3000, () => {
  console.log("load balancer running on port 3000");
});
