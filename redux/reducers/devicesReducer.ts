import { DevicesScreensActions } from "../actions/actionTypes";
import produce from "immer";
import { device_Type, loadDeviceTypes, piSelect } from "../actions/devices";
import { DeviceListType } from "./dashboardReducer";

type DevicesState = {
  piSelected: piSelect | null;
  deviceTypes: device_Type | null;
  deviceStatus: Array<{ _id: string; status: boolean }> | null;
  roomsList: { [area: string]: Array<DeviceListType> } | null;
};

const initialState: DevicesState = {
  piSelected: null,
  deviceTypes: null,
  deviceStatus: null,
  roomsList: null,
};

export default (state = initialState, action: { type: string; payload: any }) =>
  produce(state, (draft) => {
    const { type, payload } = action;
    let device;
    switch (type) {
      case DevicesScreensActions.selectPi:
        draft.piSelected = payload;
        break;

      case DevicesScreensActions.createRoomsView:
        draft.roomsList = payload;
        break;

      case DevicesScreensActions.deleteDevice:
        if (draft.roomsList) {
          Object.values(draft.roomsList[payload.roomName]).filter(
            (el) => el._id !== payload.deviceID
          );
        }
        break;

      case DevicesScreensActions.loadDeviceTypes:
        draft.deviceTypes = payload;
        break;

      case DevicesScreensActions.addDeviceStatus:
        draft.deviceStatus?.push(payload);
        break;

      case DevicesScreensActions.saveDeviceStatus:
        if (!draft.deviceStatus) {
          draft.deviceStatus = payload;
        }
        break;

      case DevicesScreensActions.toggleDevice:
        device = draft.deviceStatus?.filter((el) => el._id === payload)[0];
        if (device) device.status = !device.status;
        break;

      case DevicesScreensActions.setDeviceStatus:
        device = draft.deviceStatus?.filter(
          (el) => el._id === payload.deviceID
        )[0];
        if (device) device.status = payload.status;
        break;

      default:
        break;
    }
  });
