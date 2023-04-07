const axios = require('axios')
const express = require("express");
const path = require("path");

const app = express();

app.use(express.json());
app.use("/static", express.static(path.resolve(__dirname, "static")));

const backendHost = 'http://127.0.0.1';
const backendPort = '8080';

app.post("/api/:operation", (req, res) => {
  axios.post(
    backendHost + ':' +  backendPort + '/api/' + req.params['operation'],
    req.body
  ).then(response => {
    res.json(response.data);
  }).catch(error => {
    console.log("Error: " + error);
  });
});

app.get("/", (req, res) => {
  res.sendFile(path.resolve("index.html"));
});
app.listen(process.env.PORT || 3000, () => console.log("Server running..."));
