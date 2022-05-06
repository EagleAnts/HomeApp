import { namespace } from "d3";
import React, { createContext, useCallback, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import Constants from "expo-constants";
import { useAppSelector } from "../hooks/reduxHooks";
import { SplashScreen } from "../components/Loading";
const ENDPOINT = `http://${Constants.manifest?.extra?.serverUrl}:5000`;

export let RaspiSocket: Socket | null = null;
export let ApiSocket: Socket | null = null;

type socketType = Socket &
  Partial<{
    userID: string;
  }>;

type extraHeaders = Partial<{
  token: string;
  userID: string;
  userName: string;
}>;

// export class ClientSocket {
//   socket: socketType | null;
//   ENDPOINT: string;

//   constructor(namespace: string) {
//     console.log("Creating a New Client...");
//     this.socket = null;
//     this.ENDPOINT = ENDPOINT + `/${namespace}`;
//   }

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
          console.log("Connected to Server with ID : ", socket.id);
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

//   emitTo(
//     parentEvent: string,
//     data: { toRoom: string; from: string; content: {}; event: string }
//   ) {
//     this.socket?.emit(parentEvent, data);
//   }
// }

export const ClientSocketContext = createContext<{
  connected: boolean;
  setConnected?: (arg: 0) => void;
}>({ connected: false });

// export const updateSocketContext = (socket: Socket | null = null) => socket;
// export const updatePiDetailsContext = (piDetails = {}) => ({ piDetails });

export const ClientSocketProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const user = useAppSelector((state) => state.auth.user);

  const [connected, setConnected] = useState(false);

  useEffect(() => {
    async function initializeSocketProvider() {
      return new Promise<{
        status: number;
        sockets: { raspiSocket: Socket | null; apiSocket: Socket | null };
        msg: string;
      }>(async (resolve, reject) => {
        const rpiRes = await initClientSocket(ENDPOINT + "/raspberrypi", {
          userID: user?.id,
          userName: user?.name,
        });

        const apiRes = await initClientSocket(ENDPOINT + "/api", {
          userID: user?.id,
          userName: user?.name,
        });

        if (rpiRes?.status === 200 && apiRes?.status === 200) {
          resolve({
            status: 200,
            sockets: {
              raspiSocket: rpiRes.socket,
              apiSocket: apiRes.socket,
            },
            msg: "Both Sockets Connected ",
          });
        } else {
          reject({ status: 100, msg: "Socket Connection Error" });
        }
      });
    }

    initializeSocketProvider().then((res) => {
      if (res.status === 200) {
        RaspiSocket = res.sockets.raspiSocket;
        ApiSocket = res.sockets.apiSocket;
        // setTimeout(() => {
        setConnected(true);
        // }, 5000);
        console.log(res.msg);
      } else console.error(res);
    });

    return () => {
      setContext(false);
      RaspiSocket?.disconnect();
      ApiSocket?.disconnect();
    };
  }, []);

  const setContext = useCallback(
    (update: boolean) => {
      setConnected(update);
    },
    [connected, setConnected]
  );

  const getContext = useCallback(
    () => ({
      connected,
      setContext,
    }),
    [connected, setConnected, setContext]
  );

  return (
    <ClientSocketContext.Provider value={getContext()}>
      {children}
    </ClientSocketContext.Provider>
  );
};
