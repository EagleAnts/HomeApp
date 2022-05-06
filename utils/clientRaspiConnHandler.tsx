import { io, Socket } from "socket.io-client";

export async function connectToPi(ENDPOINT: string, email: string) {
  return new Promise<{ socket: Socket | null; status: number }>(
    (resolve, reject) => {
      try {
        console.log("Initializing Socket");

        const socket = io(ENDPOINT, { auth: { "x-user-email": email } });
        socket.on("connect", () => {
          console.log("Connected to Raspberry Pi with ID : ", socket?.id);
          resolve({ socket, status: 200 });
        });

        // this.socket.onAny((event, args) => {
        //   console.log(event, ...args);
        // });

        socket?.on("disconnect", () => {
          console.log("Disconnected from Raspberry Pi");
        });

        socket?.on("connect_error", (data) => {
          console.log("Connection Error");
          if (!data.message.includes("502")) {
            socket?.close();
            reject({ socket: null, status: 100 });
          } else reject(JSON.parse(data.message));
        });
      } catch (err) {
        // console.log(err);
        // console.error(err);
        reject({ socket: null, status: 100 });
      }
    }
  );
}
