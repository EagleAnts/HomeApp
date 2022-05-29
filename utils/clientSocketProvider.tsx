import { createContext, useCallback, useEffect, useState } from "react";
import { Socket } from "socket.io-client";
import { useAppDispatch, useAppSelector } from "../hooks/reduxHooks";
import { addEventHandlers, initClientSocket } from "./socketHandler";
import Constants from "expo-constants";
import { connectPi } from "../redux/actions/dashboard";
import { setAlert } from "../redux/actions/alert";

// const ENDPOINT = `${Constants.manifest?.extra?.serverAddress}`;
const ENDPOINT = `http://${Constants.manifest?.extra?.serverUrl}:5000`;

export let RaspiSocket: Socket | null = null;
export let ApiSocket: Socket | null = null;

export const ClientSocketContext = createContext<{
  connected: boolean;
  setContext?: (arg0: boolean) => void;
}>({ connected: false });

export const ClientSocketProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const user = useAppSelector((state) => state.auth.user);
  const dispatch = useAppDispatch();

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
          email: user?.email,
        });

        const apiRes = await initClientSocket(ENDPOINT + "/api", {
          userID: user?.id,
          userName: user?.name,
          email: user?.email,
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

        addEventHandlers(dispatch, RaspiSocket!);

        // setTimeout(() => {
        setContext(true);
        // }, 5000);
        console.log(res.msg);
      } else console.error(res);
    });

    return () => {
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
    [connected, setContext]
  );

  return (
    <ClientSocketContext.Provider value={getContext()}>
      {children}
    </ClientSocketContext.Provider>
  );
};
