// For Showing and Hiding Alerts
export const SET_ALERT = "SET_ALERT";
export const REMOVE_ALERT = "REMOVE_ALERT";

// For User Authentication
export const REGISTER_SUCCESS = "REGISTER_SUCCESS";
export const REGISTER_FAIL = "REGISTER_FAIL";
export const USER_LOADED = "USER_LOADED";
export const AUTH_ERROR = "AUTH_ERROR";
export const LOGIN_SUCCESS = "LOGIN_SUCESS";
export const LOGIN_FAIL = "LOGIN_FAIL";
export const LOGOUT = "LOGOUT";
export const RESTORE_TOKEN = "RESTORE_TOKEN";

// For Showing Loading Screen
export const SHOW_LOADING = "SHOW_LOADING";
export const SHOW_SETUP_LOADING = "SHOW_SETUP_LOADING";

// For Show Edit Device Modal
export const SHOW_MODAL = "SHOW_MODAL";
export const HIDE_MODAL = "HIDE_MODAL";

// Load Raspberry Pi's
export const GET_PIS_AND_DEVICES = "GET_PIS_AND_DEVICES";

// Select a Raspberry Pidevices
export const SELECT_PI = "SELECT_PI";

// Add a Raspi to Connected Pis List
export const CONNECT_PI = "CONNECT_PI";
export const DISCONNECT_PI = "DISCONNECT_PI";

// Devices Screen Actions
export const DevicesScreensActions = {
  selectPi: "devices:selectPi",
  loadDeviceTypes: "devices:loadDeviceTypes",
  addDevice: "devices:addDevice",
  toggleDevice: "devices:toggleStatus",
  saveDeviceStatus: "devices:saveDeviceStatus",
  createRoomsView: "devices:createRoomsView",
  deleteDevice: "devices:deleteDevice",
};

// SERVER NETWORK ERROR
export const NETWORK_ERROR = "NETWORK_ERROR";

// Profile Update
export const PROFILE_UPDATED = "profile:updated";
