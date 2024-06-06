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
// least connections algorithm.
const leastConnections = (servers, req, res) => {
  // sorting servers in ascending order on the basis of connections.
  servers = servers.sort((a, b) => a.connections - b.connections);
// selecting target server with least number of connections from servers
  const target = servers[0];
  // increasing connection count of selected server
  target.connections++;

  console.log(target);
// sending request to targeted server using proxy server.
  proxy.web(req, res, { target: `http://${target.host}:${target.port}` });
  // after response is finished decrease the count of connections of targeted server.
  res.on("finish", () => {
    target.connections--;
  });
};
// weighted Round robin
const weightedRoundRobin = (servers, req, res) => {
  // sorting servers in descending order by weight assigned to each server.
  servers = servers.sort((a, b) => b.weight - a.weight);
  // selecting server from sorted servers array
  const target = servers[0];
  // adding random weight to targeted server weight
  // so weight changes dynamically.
  // which allows different servers to have different weight
  //  which in turn allows different requests get routed to different servers.
  target.weight = target.weight + Math.floor(Math.random() * 10);

// sending request to targeted server using proxy server.
  proxy.web(req, res, { target: `http://${target.host}:${target.port}` });
// after response is finished decrease the weight of targeted server.
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
