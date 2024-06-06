import * as http from "http";
import * as serverConfig from "./config.json" assert { type: "json" };
import httpProxy from "http-proxy";
// creating a proxy server as a load balancer to route requests to different servers
const proxy = httpProxy.createProxyServer({});


// initialising servers
const servers = serverConfig.default.servers.map((server) => ({
  ...server,
  connections: 0,
}));


// round robin algorithm
let current = 0;
const roundRobin = (servers, req, res) => {
  // initialising current server index
  
  // selecting a server from server array using current index.
  const target = servers[current];
  // increasing count of server and modulus by length of server array to get next server.
  current = (current + 1) % servers.length;

  proxy.web(req, res, { target: `http://${target.host}:${target.port}` });
};

const leastConnections = (servers, req, res) => {
  servers = servers.sort((a, b) => a.connections - b.connections);

  const target = servers[0];

  target.connections++;

  console.log(target);

  proxy.web(req, res, { target: `http://${target.host}:${target.port}` });

  res.on("finish", () => {
    target.connections--;
  });
};

const weightedRoundRobin = (servers, req, res) => {
  servers = servers.sort((a, b) => b.weight - a.weight);
  const target = servers[0];

  target.weight = target.weight + Math.floor(Math.random() * 10);

  servers.map((s, i) => {
    console.log(`${i} ` + s.weight);
  });

  proxy.web(req, res, { target: `http://${target.host}:${target.port}` });

  res.on("finish", () => {
    target.weight = target.weight - Math.floor(Math.random() * 10);
  });
};

const IPHashing = (servers, req, res) => {
  let randomIP = generateRandomIP();

  let targetServerIndex =
    randomIP
      .split("")
      .map((i) => i.charCodeAt(0))
      .reduce((a, b) => a + b, 0) % 4;

  let targetServer = servers[targetServerIndex];

  proxy.web(req, res, {
    target: `http://${targetServer.host}:${targetServer.port}`,
  });
};

const generateRandomIP = () => {
  const ip =
    Math.floor(Math.random() * 255) +
    1 +
    "." +
    Math.floor(Math.random() * 255) +
    "." +
    Math.floor(Math.random() * 255) +
    "." +
    Math.floor(Math.random() * 255);

  return ip;
};

const loadBalancingAlgorithm = "IPHashing";

const server = http.createServer((req, res) => {
  if (loadBalancingAlgorithm === "roundRobin") {
    roundRobin(servers, req, res);
  } else if (loadBalancingAlgorithm === "leastConnection") {
    leastConnections(servers, req, res);
  } else if (loadBalancingAlgorithm === "weightedRoundRobin") {
    weightedRoundRobin(servers, req, res);
  } else if (loadBalancingAlgorithm === "IPHashing") {
    IPHashing(servers, req, res);
  } else {
    res.writeHead(500);
    res.end("Load balancing algorithm is not supported");
  }
});

server.listen(3000, () => {
  console.log("load balancer running on port 3000");
});
