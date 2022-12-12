const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  app.use(
    createProxyMiddleware("/graphql", {
      target: "http://localhost:7000/graphql",
      changeOrigin: true,
      pathRewrite: (path) => path.replace(/^\/graphql/, ""),
    })
  );

  app.use(
    createProxyMiddleware("/graphqlSubs", {
      target: "ws://localhost:7000/graphql",
      changeOrigin: true,
      ws: true,
      pathRewrite: (path) => path.replace(/^\/graphqlSubs/, ""),
    })
  );
};
