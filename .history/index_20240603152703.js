import express from "express";

const app = new Array(10);

app.forEach((e)=>{
    let port = 3000;
    app[i] = express();

    app.listen(port,()=>{
        console.log(`server running on ${port}`)
    })
    port++;
})

