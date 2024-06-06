import axios from "axios";
import express from "express";
import shortid from "shortid"
const app = express();

let a = 0;
let b = 0;
let c = 0;
let d = 0;

app.use("/", async (req, res) => {
  let result = "";
  for (let i = 0; i < 10; i++) {
    await axios.post("http://localhost:3000/fast-response",{
        message:`This is request with id:${shortid.generate()}`
    }).then((res) => {
      console.log(res?.data);
      console.log(res.data[res?.data.length - 1]);
      if (res.data[res?.data.length - 1] == 1) {
        a++;
      } else if (res.data[res.data.length - 1] == 2) {
        b++;
      } else if (res.data[res.data.length - 1] == 3) {
        c++;
      } else if (res.data[res.data.length - 1] == 4) {
        d++;
      }
    });

    await axios.post("http://localhost:3000/slow-response").then((res) => {
      console.log(res?.data);
      console.log(res.data[res?.data.length - 1]);
      if (res.data[res?.data.length - 1] == 1) {
        a++;
      } else if (res.data[res.data.length - 1] == 2) {
        b++;
      } else if (res.data[res.data.length - 1] == 3) {
        c++;
      } else if (res.data[res.data.length - 1] == 4) {
        d++;
      }
    });

    await axios.post("http://localhost:3000/very-slow").then((res) => {
      console.log(res?.data);
      console.log(res.data[res?.data.length - 1]);
      if (res.data[res?.data.length - 1] == 1) {
        a++;
      } else if (res.data[res.data.length - 1] == 2) {
        b++;
      } else if (res.data[res.data.length - 1] == 3) {
        c++;
      } else if (res.data[res.data.length - 1] == 4) {
        d++;
      }
    });
  }

  res.send(`a is ${a} b is ${b} c is ${c} d is ${d}`);
});

app.listen(4000, () => {
  console.log("teste listening on 4000");
});


