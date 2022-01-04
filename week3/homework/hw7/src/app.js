const express = require("express");
const path = require("path");
const ipfsApi = require("../public/javascript/ipfsApi.js");
const app = express();
const publicPath = path.join(__dirname, "../public");

app.use(express.static(publicPath, { extensions: ["html"] }));
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: false, limit: "50mb" }));

app.get("", (req, res) => {
  res.sendFile(publicPath + "/frontPage.html");
});

app.listen(3000, () => {
  console.log(`Running express app at http://127.0.0.1:3000`);
});

app.post("/addData", (req, res) => {
  ipfsApi
    .ipfsAdd(req.body.data)
    .then((response) => {
      res.send(response);
    })
    .catch((e) => {
      res.status(500, {
        error: e,
      });
    });
});

app.post("/getData", (req, res) => {
  ipfsApi
    .ipfsGet(req.body.data)
    .then((response) => {
      res.send(response);
    })
    .catch((e) => {
      res.status(500, {
        error: e,
      });
    });
});

app.post("/getImage", (req, res) => {
  ipfsApi
    .ipfsGetImage(req.body.data)
    .then((response) => {
      res.send(response);
    })
    .catch((e) => {
      res.status(500, {
        error: e,
      });
    });
});

app.post("/addFile", (req, res) => {
  ipfsApi
    .addFile(req.body.data)
    .then((response) => {
      res.send(response);
    })
    .catch((e) => {
      res.status(500, {
        error: e,
      });
    });
});
