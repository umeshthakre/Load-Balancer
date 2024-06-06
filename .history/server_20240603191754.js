import * as http from "http";
import {roundRobin} from "../roundRobin"

import serverConfig from "./config.json" assert {type:"json"}

const servers = serverConfig.default.servers.map((server)=>({
    ...server
}))

const loadBalancingAlgorithm = 'roundRobin';

const server = http.createServer((req,res)=>{
    if(loadBalancingAlgorithm === 'roundRobin'){
        roundRobin(servers,req,res);
    }else{
        res.writeHead(500);
        res.end("Load balancing algorithm is not supported")

    }
})

server.listen(3000,()=>{
    console.log('load balancer running on port 3000')
})