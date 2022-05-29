import { DeviceListType } from "../reducers/dashboardReducer";
import { DevicesScreensActions } from "./actionTypes";

export type piSelect = {
  piName: string;
  piID: string;
  networkID: string;
};
export const selectRaspi = (rpiDetails: piSelect) => ({
  type: DevicesScreensActions.selectPi,
  payload: rpiDetails,
});

export type device_Type = Array<{
  _id: string;
  description: string;
  icon: string;
  type: string;
}>;

export const loadDeviceTypes = (deviceTypes: device_Type) => ({
  type: DevicesScreensActions.loadDeviceTypes,
  payload: deviceTypes,
});

export const addDevice =
  (details: { piID: string; device: DeviceListType }) =>
  (dispatch: Function) => {
    dispatch({
      type: DevicesScreensActions.addDevice,
      payload: details,
    });
    dispatch({
      type: DevicesScreensActions.addDeviceStatus,
      payload: { _id: details.device._id, status: details.device.status },
    });
  };

export const deleteDevice = ({
  piID,
  deviceID,
  roomName,
}: {
  piID: string;
  deviceID: string;
  roomName: string;
}) => ({
  type: DevicesScreensActions.deleteDevice,
  payload: { piID, deviceID, roomName },
});

export const saveDeviceStatus = (
  devicesArray: Array<{ _id: string; status: boolean }>
) => ({
  type: DevicesScreensActions.saveDeviceStatus,
  payload: devicesArray,
});

export const toggleStatus = (deviceID: string) => ({
  type: DevicesScreensActions.toggleDevice,
  payload: deviceID,
});

export const setStatus = (deviceStatus: {
  deviceID: string;
  status: boolean;
}) => ({
  type: DevicesScreensActions.setDeviceStatus,
  payload: deviceStatus,
});

export const createRoomsView = (deviceList: {
  [area: string]: Array<DeviceListType>;
}) => ({
  type: DevicesScreensActions.createRoomsView,
  payload: deviceList,
});
