const express = require("express");
const path = require("path");
const ipfsAPI = require("../public/javascript/ipfsAPI");

const app = express();

const publicPath = path.join(__dirname, "../public");

app.get("", (req, res) => {
  res.sendFile(publicPath + "/frontPage.html");
});

app.listen(3000, () => {
  console.log(`Running express app at http://127.0.0.1:3000`);
});

app.post("/storeData", (req, res) => {
  ipfsAPI.ipfsStore(req.body.data).then((response) => {
    res.send(response);
  });
});

app.post("/getData", (req, res) => {
  ipfsAPI.ipfsGet(req.body.data).then((response) => {
    res.send(response);
  });
});
