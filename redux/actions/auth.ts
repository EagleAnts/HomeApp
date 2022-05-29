import { api } from "../../utils/apiHelpers/api";
import { RSAEncrpytedPost } from "../../utils/apiHelpers/RSAEncryptedPost";
import { AlertType, setAlert } from "./alert";
import * as actions from "./actionTypes";
import { showLoadingIndicator } from "./showLoading";
import {
  aesKeyGeneration,
  getAesPassword,
} from "../../utils/encryptionHelpers/generateAES";
import { aesDecryption } from "../../utils/encryptionHelpers/aesDecryptRes";
import { publicKeyEncryption } from "../../utils/encryptionHelpers/RSAEncryption";
import aesGet from "../../utils/apiHelpers/aesGet";

// Network Error
export const networkError = () => ({
  type: actions.NETWORK_ERROR,
  payload: null,
});

// Restore Token

// Load User

export const loadUser = () => async (dispatch: Function) => {
  try {
    const res = await aesGet("/user/login");
    console.log(res);
    dispatch({
      type: actions.USER_LOADED,
      payload: res.data,
    });
  } catch (err: any) {
    console.log(err.message);
    if (!err.response) {
      // dispatch({
      //   type: actions.USER_LOADED,
      //   payload: { name: "Paritosh Chauhan" },
      // });
      // dispatch({
      //   type: actions.USER_LOADED,
      //   payload: { name: "Null" },
      // });
      dispatch(setAlert("Can't Connect to Server Right Now", "info"));
    } else {
      const errors = err.response.data.errors;
      if (errors) {
        errors.forEach((error: { msg: string }) =>
          dispatch(setAlert(error.msg, "error"))
        );
      }
      dispatch({
        type: actions.AUTH_ERROR,
      });
    }
  }
};

// Register User

export const register = (formData: {}) => async (dispatch: Function) => {
  console.log("Register");
  try {
    const res = await RSAEncrpytedPost(formData, "/user/signup");
    dispatch(showLoadingIndicator(false));

    dispatch(setAlert(res?.data?.msg, "info"));
    dispatch({
      type: actions.REGISTER_SUCCESS,
      payload: res?.data,
    });
    // dispatch(loadUser());
  } catch (err: any) {
    dispatch(showLoadingIndicator(false));
    if (!err.response) {
      dispatch(setAlert("Can't Connect to Server Right Now", "info"));
    } else {
      const errors = err.response.data.errors;
      if (errors) {
        errors.forEach((error: { msg: string }) =>
          dispatch(setAlert(error.msg, "error"))
        );
      }
      dispatch({
        type: actions.REGISTER_FAIL,
      });
    }
  }
};

// Login User

export const login = (formData: {}) => async (dispatch: Function) => {
  console.log("Logging In");

  try {
    const aesKey = await aesKeyGeneration();
    const sendData = { data: formData, aesKey };
    const res = await RSAEncrpytedPost(sendData, "/user/login");
    const decryptedData = await aesDecryption(res?.data);
    const token = await publicKeyEncryption(decryptedData.token);
    dispatch(showLoadingIndicator(false));

    dispatch({ type: actions.LOGIN_SUCCESS, payload: token });

    dispatch(setAlert("Login Successfull", "success"));

    dispatch(loadUser());
  } catch (err: any) {
    dispatch(showLoadingIndicator(false));
    if (!err.response) {
      dispatch(setAlert("Can't Connect to Server Right Now", "info"));
    } else {
      const errors = err.response.data.errors;
      if (errors) {
        errors.forEach((error: { msg: string; type: AlertType }) =>
          dispatch(setAlert(error.msg, !error.type ? "error" : error.type))
        );
      }
    }
  }
};

// Logout User

export const logout = () => async (dispatch: Function) => {
  dispatch({ type: actions.LOGOUT });
  dispatch({ type: actions.RESET_APP });
};

// Update Profile

export const updateProfile = (username: string) => ({
  type: actions.PROFILE_UPDATED,
  payload: username,
});
