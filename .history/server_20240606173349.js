import * as http from "http";
import * as serverConfig from "./config.json" assert { type: "json" };
import httpProxy from "http-proxy";

// creating a proxy server as a load balancer to route requests to different servers
const proxy = httpProxy.createProxyServer({});

// initialising servers
const servers = serverConfig.default.servers.map((server) => ({
  ...server,
}));


// function to generate randomIP
export const generateRandomIP = () => {

  const ip =
  // using floor function from math to generate a random number 
    Math.floor(Math.random() * 255) +
    1 +
    "." +
    Math.floor(Math.random() * 255) +
    "." +
    Math.floor(Math.random() * 255) +
    "." +
    Math.floor(Math.random() * 255);

// return ip address.
  return ip;
};

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
export const leastConnections = (servers, req, res) => {
  // sorting servers in ascending order on the basis of connections.
  servers = servers.sort((a, b) => a.connections - b.connections);
  // selecting target server with least number of connections from servers
  const target = servers[0];
  // increasing connection count of selected server
  // randomising the connection numbers
  target.connections++

  console.log(target);
  // sending request to targeted server using proxy server.
  proxy.web(req, res, { target: `http://${target.host}:${target.port}` });
  // after response is finished decrease the count of connections of targeted server.
  res.on("finish", () => {

    target.connections--;
    // target.connections = Math.floor(Math.random() * 10)
  });
};

// weighted Round robin
export const weightedRoundRobin = (servers, req, res) => {
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

// IP Hashing Algorithm
export const IPHashing = (servers, req, res) => {
  // generate random ip address.
  let randomIP = generateRandomIP();
  // getting server index from ip address
  let targetServerIndex =
    // random IP
    randomIP
      // spliting string into charachters
      .split("")
      // mapping charachters to Unicode values
      .map((i) => i.charCodeAt(0))
      // reducing array to a single number
      // modulus by 4 to get a value between 0-3 which maps to server index -
      //-  values in the servers array.
      .reduce((a, b) => a + b, 0) % 4;
  // selecting a targeted array from servers array.
  let targetServer = servers[targetServerIndex];

  // setting the targeted server.
  proxy.web(req, res, {
    target: `http://${targetServer.host}:${targetServer.port}`,
  });
};

// specifying load balancing algorithm
// OPTIONS [roundRobin,leastConnection weightedRoundRobin,IPHashing]
const loadBalancingAlgorithm = "leastConnection";
// creating a http server.
const server = http.createServer((req, res) => {
  // capturing the request.
  console.log(`loging request body ${req?.body}`);

  // switching load balancing algorithms.
  if (loadBalancingAlgorithm === "roundRobin") {
    // logging the request
    console.log(`loging request body ${req?.body}`);
    roundRobin(servers, req, res);
  } else if (loadBalancingAlgorithm === "leastConnection") {
    // logging the request
    console.log(`loging request body ${req?.body}`);
    leastConnections(servers, req, res);
  } else if (loadBalancingAlgorithm === "weightedRoundRobin") {
    // logging the request
    console.log(`loging request body ${req?.body}`);
    weightedRoundRobin(servers, req, res);
  } else if (loadBalancingAlgorithm === "IPHashing") {
    // logging the request
    console.log(`loging request body ${req?.body}`);
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
