require('dotenv').config();
const opentelemetry = require("@opentelemetry/sdk-node");
const { diag, DiagConsoleLogger, DiagLogLevel } = require('@opentelemetry/api');
const { OTLPTraceExporter } = require('@opentelemetry/exporter-trace-otlp-http');
//const { ExpressInstrumentation } = require('opentelemetry-instrumentation-express');
const { getNodeAutoInstrumentations } = require('@opentelemetry/auto-instrumentations-node');

diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.INFO);

const exporter = new OTLPTraceExporter({
 url: process.env.AGG_URL,
 headers: {"customerID":"Emitter 1"},
});
const sdk = new opentelemetry.NodeSDK({
 traceExporter: exporter,
 instrumentations: [getNodeAutoInstrumentations()]
});
sdk.start()
