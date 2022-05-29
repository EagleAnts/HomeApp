import uuid from "react-native-uuid";
import { SET_ALERT, REMOVE_ALERT } from "./actionTypes";

export type AlertType = "error" | "warning" | "info" | "success";
let alertsList: Array<string | number[]> = [];

export const setAlert =
  (msg: string, alertType: AlertType, timeout = 4000) =>
  (dispatch: Function) => {
    const id = uuid.v4();
    let interval = setInterval(() => {
      if (alertsList.length === 0) {
        alertsList.push(id);
        dispatch({
          type: SET_ALERT,
          payload: { msg, alertType, id },
        });
        setTimeout(() => {
          alertsList = alertsList.filter((el) => el !== id);
          dispatch({ type: REMOVE_ALERT, payload: id });
        }, timeout);
        clearInterval(interval);
      }
    }, 1000);
  };
