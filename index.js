require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.urlencoded({ extended: true }));

app.use("/public", express.static(`${process.cwd()}/public`));

app.get("/", function (req, res) {
  res.sendFile(process.cwd() + "/views/index.html");
});

// Your first API endpoint
app.get("/api/hello", function (req, res) {
  res.json({ greeting: "hello API" });
});

const urls = [];

app.post("/api/shorturl", (req, res) => {
  const url = req.body.url;
  const urlIndex = urls.indexOf(url);
  const validHTTPS = url.includes("https://");
  const validHTTP = url.includes("http://");

  if (!validHTTPS && !validHTTP) {
    return res.json({
      error: "invalid url",
    });
  }

  if (urlIndex < 0) {
    urls.push(url);

    return res.json({
      original_url: url,
      short_url: urls.indexOf(url),
    });
  }

  return res.json({
    original_url: url,
    short_url: urls.indexOf(url),
  });
});

app.get("/api/shorturl/:shorturl", (req, res) => {
  const shorturl = parseInt(req.params.shorturl);
  const url = urls[shorturl];

  if (!url) {
    res.json({
      error: "No short URL found for the given input",
    });
  }

  return res.redirect(url);
});

app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});
