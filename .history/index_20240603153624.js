import express from "express";

const app = new Array(10);
let i = 0;
let port = 4000;
const apps = (port) => {

  app[i] = express();

  app[i].listen(port, () => {
    console.log(`server running on ${port}`);
  });
  port++;
  i++;
};
for(let i = 0;i<app.length;i++){
    apps();
}

