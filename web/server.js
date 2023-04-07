const axios = require('axios')
const express = require("express");
const path = require("path");
const Sentry = require('@sentry/node');

const app = express();

const backendHost = 'http://localhost';
const backendPort = '8080';

Sentry.init({
  dsn: "https://b061be1418e54bffae22016e8a80d999@o4504974326169600.ingest.sentry.io/4504974338228224",
  integrations: [
    // enable HTTP calls tracing
    new Sentry.Integrations.Http({ tracing: true }),
    // enable Express.js middleware tracing
    new Tracing.Integrations.Express({ app }),
    // Automatically instrument Node.js libraries and frameworks
    ...Sentry.autoDiscoverNodePerformanceMonitoringIntegrations(),
  ],

  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for performance monitoring.
  // We recommend adjusting this value in production
  tracesSampleRate: 1.0,
});

// RequestHandler creates a separate execution context using domains, so that every
// transaction/span/breadcrumb is attached to its own Hub instance
app.use(Sentry.Handlers.requestHandler());
// TracingHandler creates a trace for every incoming request
app.use(Sentry.Handlers.tracingHandler());

app.use(express.json());
app.use("/static", express.static(path.resolve(__dirname, "static")));

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
