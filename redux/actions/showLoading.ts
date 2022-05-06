import { SHOW_LOADING, SHOW_SETUP_LOADING } from "./actionTypes";

export const showLoadingIndicator = (status: boolean) => ({
  type: SHOW_LOADING,
  payload: status,
});
