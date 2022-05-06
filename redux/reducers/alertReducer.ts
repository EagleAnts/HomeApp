import { SET_ALERT, REMOVE_ALERT } from "../actions/actionTypes";
import { produce } from "immer";
import { Alert } from "../../components/Snackbar";

type State = Array<Alert>;

const initialState: State = [];

export default (state = initialState, action: { type: any; payload: any }) =>
  produce(state, (draft) => {
    const { type, payload } = action;
    switch (type) {
      case SET_ALERT:
        draft.push(payload);
        break;
      case REMOVE_ALERT:
        return draft.filter((alert) => alert.id !== payload);
      default:
        break;
    }
  });
