import produce from "immer";
import {
  CONNECT_PI,
  DevicesScreensActions,
  DISCONNECT_PI,
  GET_PIS_AND_DEVICES,
  SELECT_PI,
  SHOW_SETUP_LOADING,
} from "../actions/actionTypes";

export type DeviceListType = {
  _id: string;
  area: string;
  deviceType: {
    _id: string;
    description: string;
    icon: string;
    type: string;
  };
  gpio: string;
  name: string;
  status: boolean;
};

export type RaspiList = {
  piID: string;
  networkID: string;
  piUsername: string;
  piName: string;
  netDetails: string;
  deviceList: Array<DeviceListType>;
  apiKey?: string;
};

export type State = {
  raspiList: Array<RaspiList> | null;
  rpiSelected: { piID: string; piName: string } | null;
  connectedPis: Array<{
    piID: string;
    piName: string;
    totalDevices: number;
  }> | null;
  setupLoading?: boolean;
};

const initialState: State = {
  raspiList: null,
  rpiSelected: null,
  connectedPis: [],
  setupLoading: false,
};

export default (state = initialState, action: { type: string; payload: any }) =>
  produce(state, (draft) => {
    const { payload, type } = action;
    switch (type) {
      case GET_PIS_AND_DEVICES:
        draft.raspiList = payload;
        break;
      case SELECT_PI:
        draft.rpiSelected = payload;
        break;
      case CONNECT_PI:
        if (!draft.connectedPis?.find((el) => el.piID === payload.piID)) {
          draft.connectedPis?.push(payload);
        }
        break;
      case DISCONNECT_PI:
        draft.connectedPis = draft.connectedPis?.filter(
          (el) => el.piID !== payload.piID
        )!;
        break;

      case DevicesScreensActions.addDevice:
        draft.raspiList
          ?.filter((el) => el.piID === payload.piID)[0]
          .deviceList.push(payload.device);
        break;

      case DevicesScreensActions.deleteDevice:
        let pi = draft.raspiList?.find((el) => el.piID === payload.piID);
        if (pi) {
          pi.deviceList = pi.deviceList.filter(
            (el) => el._id !== payload.deviceID
          );
        }
        break;

      case SHOW_SETUP_LOADING:
        draft.setupLoading = payload;
        break;
      default:
        break;
    }
  });
