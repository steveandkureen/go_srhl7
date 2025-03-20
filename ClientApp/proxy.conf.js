const { env } = require("process");

// const target = env.ASPNETCORE_HTTPS_PORT ? `https://localhost:${env.ASPNETCORE_HTTPS_PORT}` :
//   env.ASPNETCORE_URLS ? env.ASPNETCORE_URLS.split(';')[0] : 'http://localhost:56100';

const target = `http://localhost:3000`;

const PROXY_CONFIG = [
  {
    context: [
      "/api",
      // "/weatherforecast",
      // "/client",
      // "/connection",
      // "/receive",
      // "/publickey",
      // "/connectionnotifications",
      // "/message",
      // "/listenmessage",
      // '/segmentdetials'
    ],
    target: target,
    secure: false,
    headers: {
      Connection: "Keep-Alive",
    },
  },
];

module.exports = PROXY_CONFIG;
