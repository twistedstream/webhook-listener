require("dotenv").config();
const util = require("node:util");
const express = require("express");
const logger = require("morgan");
const http = require("http");
const { json } = require("body-parser");

const { requiresApiAuth } = require("./utils/auth");
const package = require("./package.json");

const app = express();

// other global middlewares

app.use(
  logger(`[:date[iso]] ":method :url" :status - :req[content-length] bytes`)
);

// endpoints
app.post("/api/v1/webhook", requiresApiAuth(), json(), async (req, res) => {
  console.log(
    util.inspect(req.body, {
      showHidden: false,
      compact: false,
      depth: null,
      colors: true,
    })
  );

  res.status(202).send("ok");
});

// catch 404 and forward to error handler
app.use(function (_req, _res, next) {
  const err = new Error("Not Found");
  err.status = 404;

  next(err);
});

// error handler
app.use(function (err, _req, res, _next) {
  const { message, status = 500 } = err;
  const description = status >= 500 ? "Something unexpected happened" : message;
  const details = process.env.NODE_ENV !== "production" ? err.stack : "";

  if (status >= 500) {
    console.error("ERROR:", err);
  }
  res.status(status);

  return res.json({
    status,
    message: description,
    details,
  });
});

// start the server
const server = http.createServer(app);

const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(
    `${package.description} (v${package.version}), listening on port ${port}`
  );
});
