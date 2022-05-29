import "dotenv/config";

// Local Configs
export default {
  extra: {
    serverUrl: process.env.SERVER_URL,
    serverAddress: `http://${process.env.SERVER_URL}:${process.env.SERVER_PORT}`,
    apiAddress: `http://${process.env.SERVER_URL}:${process.env.SERVER_PORT}/api`,
  },
};

// Remote Configs
// export default {
//   extra: {
//     serverUrl: process.env.SERVER_URL,
//     serverAddress: `${process.env.SERVER_URL}`,
//     apiAddress: `${process.env.SERVER_URL}/api`,
//   },
// };
