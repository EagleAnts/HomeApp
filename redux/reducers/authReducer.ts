import {
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  LOGIN_FAIL,
  USER_LOADED,
  AUTH_ERROR,
  LOGIN_SUCCESS,
  LOGOUT,
  RESTORE_TOKEN,
  NETWORK_ERROR,
  PROFILE_UPDATED,
} from "../actions/actionTypes";

import { produce } from "immer";

type State = {
  token: any;
  isAuthenticated: boolean | null;
  isLoading: boolean;
  isSignout: boolean;
  isServerError: boolean;
  user: {
    id: string;
    name: string;
    email: string;
  } | null;
};

const initialState: State = {
  token: null,
  isAuthenticated: null,
  isLoading: true,
  isSignout: false,
  isServerError: false,
  user: null,
};

export default (state = initialState, action: any) =>
  produce(state, (draft) => {
    const { type, payload } = action;
    switch (type) {
      case PROFILE_UPDATED:
        if (draft.user) draft.user.name = payload;
        break;
      case USER_LOADED:
        draft.isAuthenticated = payload ? true : false;
        draft.isLoading = false;
        draft.user = payload;
        break;

      case LOGIN_SUCCESS:
        draft.token = payload;
        draft.isAuthenticated = true;
        draft.isLoading = true;
        break;

      case LOGOUT:
        draft.token = null;
        draft.isAuthenticated = false;
        draft.isSignout = true;
        draft.isLoading = false;
        draft.user = null;
        break;
      case RESTORE_TOKEN:
        draft.token = payload.token;
        draft.isAuthenticated = !draft.token ? false : true;
        draft.isLoading = draft.token ? true : false;
        break;

      case NETWORK_ERROR:
        draft.isServerError = true;
        draft.isLoading = false;
      // draft.isAuthenticated = null;
      // draft.token = null;
      default:
        break;
    }
  });
