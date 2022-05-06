import "dotenv/config";

export default {
  extra: {
    serverUrl: process.env.SERVER_URL,
    serverAddress: `http://${process.env.SERVER_URL}:${process.env.SERVER_PORT}`,
    apiAddress: `http://${process.env.SERVER_URL}:${process.env.SERVER_PORT}/api`,
  },
};
