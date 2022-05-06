import { createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import { composeWithDevTools } from "@redux-devtools/extension";
import rootReducer from "./redux/reducers/index";
import { setAuthToken } from "./utils/setAuthToken";
import { LOGOUT } from "./redux/actions/actionTypes";
import { api } from "./utils/apiHelpers/api";
import { networkError } from "./redux/actions/auth";

const composeEnhancers = composeWithDevTools({
  trace: true,
  traceLimit: 25,
  // Specify name here, actionsBlacklist, actionsCreators and other options if needed
});

export const store = createStore(
  rootReducer,
  composeEnhancers(applyMiddleware(thunk))
);

let currentState = store.getState();

export const unsubscribe = store.subscribe(() => {
  let previousState = currentState;
  currentState = store.getState();
  if (previousState.auth.token !== currentState.auth.token) {
    const token = currentState.auth.token;
    setAuthToken(token);
  }
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (!err.res) {
      console.log("Network Error");
      store.dispatch(networkError());
    }

    console.log("Api Interceptor", err);

    if (err.response.status === 401) {
      store.dispatch({ type: LOGOUT });
    }
    return Promise.reject(err);
  }
);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
