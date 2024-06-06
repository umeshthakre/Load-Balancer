import * as http from "http";
import * as serverConfig from "./config.json" assert { type: "json" };
import httpProxy from "http-proxy";
import {
  IPHashing,
  leastConnections,
  weightedRoundRobin,
} from "./loadBalancingAlgorithms";
// creating a proxy server as a load balancer to route requests to different servers
const proxy = httpProxy.createProxyServer({});

// initialising servers
const servers = serverConfig.default.servers.map((server) => ({
  ...server,
  connections: 0,
}));

// round robin algorithm

// initialising current server index

let current = 0;
const roundRobin = (servers, req, res) => {
  // selecting a server from server array using current index.
  const target = servers[current];
  // increasing count of server and modulus by length of server array to get next server.
  current = (current + 1) % servers.length;
  // sending request to targeted server using proxy server.
  proxy.web(req, res, { target: `http://${target.host}:${target.port}` });
};

// specifying load balancing algorithm
// OPTIONS [roundRobin,leastConnection weightedRoundRobin,IPHashing]
const loadBalancingAlgorithm = "IPHashing";
// creating a http server.
const server = http.createServer((req, res) => {
  // switching load balancing algorithms.
  if (loadBalancingAlgorithm === "roundRobin") {
    roundRobin(servers, req, res);
  } else if (loadBalancingAlgorithm === "leastConnection") {
    leastConnections(servers, req, res);
  } else if (loadBalancingAlgorithm === "weightedRoundRobin") {
    weightedRoundRobin(servers, req, res);
  } else if (loadBalancingAlgorithm === "IPHashing") {
    IPHashing(servers, req, res);
  } else {
    // error handling for not mentioned load balancing algorithms.
    res.writeHead(500);
    res.end("Load balancing algorithm is not supported");
  }
});
// starting load balancing server on port 3000.
server.listen(3000, () => {
  console.log("load balancer running on port 3000");
});
