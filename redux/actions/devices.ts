import { DeviceListType } from "../reducers/dashboardReducer";
import { DevicesScreensActions } from "./actionTypes";

export type piSelect = {
  piName: string;
  piID: string;
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

export const addDevice = (details: {
  piID: string;
  device: DeviceListType;
}) => ({
  type: DevicesScreensActions.addDevice,
  payload: details,
});

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

export const saveDeviceStatus = (device: { _id: string; status: boolean }) => ({
  type: DevicesScreensActions.saveDeviceStatus,
  payload: device,
});

export const toggleStatus = (deviceID: string) => ({
  type: DevicesScreensActions.toggleDevice,
  payload: deviceID,
});

export const createRoomsView = (deviceList: {
  [area: string]: Array<DeviceListType>;
}) => ({
  type: DevicesScreensActions.createRoomsView,
  payload: deviceList,
});
