import { register, login } from "../redux/actions/auth";
import { showLoadingIndicator } from "../redux/actions/showLoading";

export const onSubmit = async ({
  type,
  dispatch,
  data,
}: {
  type: string;
  dispatch: Function;
  data: {};
}) => {
  // console.log(data);
  dispatch(showLoadingIndicator(true));

  if (type === "signup") {
    await dispatch(register(data));
  } else {
    await dispatch(login(data));
  }
};
