mport * as http from 'http';

const createServer = (host,port) =>{
  http.createServer((req,res)=>{
    res.writeHead(200)
    res.end(`server response from port`)
  }).listen((port,host)=>{
    console.log(`Server running on http://${host}:${port}`)
  })
}

createServer('localhost',3000)
