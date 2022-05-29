import { io, Socket } from "socket.io-client";
import { setAlert } from "../redux/actions/alert";
import { connectPi, disconnectPi } from "../redux/actions/dashboard";
import { setStatus } from "../redux/actions/devices";

type extraHeaders = Partial<{
  token: string;
  userID: string;
  userName: string;
  email: string;
}>;

export async function initClientSocket(
  ENDPOINT: string,
  extraHeaders?: extraHeaders
) {
  return new Promise<{ socket: Socket | null; status: number } | null>(
    (resolve, reject) => {
      try {
        console.log("Initializing Socket..");
        const socket = io(ENDPOINT, {
          extraHeaders,
        });

        socket.on("connect", () => {
          console.log(
            `Connected to Server Endpoint ${ENDPOINT} with ID :  ${socket.id}`
          );
          resolve({ socket: socket, status: 200 });
        });

        socket?.on("connect_error", (data) => {
          console.log("Connection Error : ", data);
          reject({ socket: null, status: 401 });
        });

        socket?.on("disconnect", () => {
          console.log("Disconnected from Server");
          // reject(100);
        });
      } catch (err) {
        reject({ socket: null, status: 100 });
        // console.log(err);
        console.error(err);
      }
    }
  );
}

export const addEventHandlers = (dispatch: Function, RaspiSocket: Socket) => {
  RaspiSocket?.on("recieve:toggleDevice", (data) => {
    console.log(data);
    dispatch(
      setStatus({
        deviceID: data.content.deviceID,
        status: data.content.status,
      })
    );
  });
  RaspiSocket?.on("raspberrypi:online", (res) => {
    dispatch(connectPi(res.data));
    dispatch(setAlert(res.msg, "success"));
  });

  RaspiSocket?.on("raspberrypi:offline", (res) => {
    dispatch(disconnectPi({ piID: res.piID }));
    dispatch(setAlert(res.msg, "error"));
  });
};

//   emitTo(
//     parentEvent: string,
//     data: { toRoom: string; from: string; content: {}; event: string }
//   ) {
//     this.socket?.emit(parentEvent, data);
//   }
// }

// export const updateSocketContext = (socket: Socket | null = null) => socket;
// export const updatePiDetailsContext = (piDetails = {}) => ({ piDetails });
