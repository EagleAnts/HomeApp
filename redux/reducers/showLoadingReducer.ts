import { SHOW_LOADING } from "../actions/actionTypes";
import produce from "immer";

const initialState = { loading: false };

export default (state = initialState, action: any) =>
  produce(state, (draft) => {
    const { type, payload } = action;
    switch (type) {
      case SHOW_LOADING:
        draft.loading = payload;
        break;
      default:
        break;
    }
  });
