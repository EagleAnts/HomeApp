import { combineReducers } from "redux";
import { enableMapSet } from "immer";

import alert from "./alertReducer";
import auth from "./authReducer";
import loadingStatus from "./showLoadingReducer";
import Devices from "./devicesReducer";
import Dashboard from "./dashboardReducer";

enableMapSet();

export default combineReducers({
  alert,
  auth,
  loadingStatus,
  Devices,
  Dashboard,
});
