const { createLogger, transports, format } = require("winston");

const logger = createLogger({
  transports: [
    new transports.Console(),
    new transports.File({
      level: "warn",
      filename: "./src/logs/logsWarnings.log",
    }),
    new transports.File({
      level: "error",
      filename: "./src/logs/logsErrors.log",
    }),
  ],

  format: format.combine(
    format.json(),
    format.timestamp(),
    format.metadata(),
    format.prettyPrint()
  ),
});

module.exports = logger;
