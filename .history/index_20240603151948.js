import express from "express";

const app = new Array(10);

function createServer(host, port) {
  let port = 3000;
  for (let i = 0; i < app.length; i++) {
    app[i] = express();

    app[i].listen(port, () => {
      console.log(`server running on  ${port}`);
    });
    port++;
  }
}
