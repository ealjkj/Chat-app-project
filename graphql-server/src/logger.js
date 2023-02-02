const { createLogger, transports, format } = require("winston");

const logger = createLogger({
  transports: [
    new transports.Console(),
    new transports.File({
      level: "warn",
      filename: "./logs/logsWarnings.log",
    }),
    new transports.File({
      level: "error",
      filename: "./logs/logsErrors.log",
    }),
  ],

  format: format.combine(
    format.printf(({ message, level, meta }) => `${level}: ${message}`),
    format.colorize()
  ),
});

module.exports = logger;
