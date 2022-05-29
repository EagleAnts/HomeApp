import { combineReducers } from "redux";
import { enableMapSet } from "immer";

import { RESET_APP } from "../actions/actionTypes";
import alert from "./alertReducer";
import auth from "./authReducer";
import loadingStatus from "./showLoadingReducer";
import Devices from "./devicesReducer";
import Dashboard from "./dashboardReducer";

enableMapSet();

const appReducers = combineReducers({
  alert,
  auth,
  loadingStatus,
  Devices,
  Dashboard,
});

export default (state: any, action: any) => {
  if (action.type === RESET_APP) {
    state = undefined;
  }
  return appReducers(state, action);
};
