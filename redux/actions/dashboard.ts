import { Socket } from "socket.io-client";
import aesGet from "../../utils/apiHelpers/aesGet";
import { State as PiListType } from "../reducers/dashboardReducer";
import * as actions from "./actionTypes";
import { setAlert } from "./alert";
import { saveDeviceStatus } from "./devices";

export const getRaspberryPisAndDevices =
  (ApiSocket: Socket | null) => async (dispatch: Function) => {
    try {
      ApiSocket?.emit(
        "api:getPisAndDevices",
        null,
        (data: PiListType["raspiList"]) => {
          console.log(data);
          if (data) {
            const [devicesList] = data.map((el) => el.deviceList);
            devicesList.forEach((device) => {
              dispatch(
                saveDeviceStatus({ _id: device._id, status: device.status })
              );
            });
          }

          dispatch({
            type: actions.GET_PIS_AND_DEVICES,
            payload: data,
          });
        }
      );
    } catch (err: any) {
      console.log(err.message);
      if (!err.response) {
        dispatch(setAlert("Can't Connect to Server Right Now", "info"));
      } else {
        const errors = err.response.data.errors;
        if (errors) {
          errors.forEach((error: { msg: string }) =>
            dispatch(setAlert(error.msg, "error"))
          );
        }
      }
    }
  };

export const selectRaspi = (details: { piName: string; piID: string }) => ({
  type: actions.SELECT_PI,
  payload: details,
});

export const connectPi = (details: { piID: string; piName: string }) => ({
  type: actions.CONNECT_PI,
  payload: details,
});

export const disconnectPi = (details: { piID: string }) => ({
  type: actions.DISCONNECT_PI,
  payload: details,
});

export const showSetupLoading = (status: boolean) => ({
  type: actions.SHOW_SETUP_LOADING,
  payload: status,
});
