// least connections algorithm.
export const leastConnections = (servers, req, res) => {
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
const IPHashing = (servers, req, res) => {
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