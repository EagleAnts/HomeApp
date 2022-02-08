import { api } from "./api";

export const onSubmit = async ({ type, data }: submitDetails) => {
  console.log(type, data);
  //   const res = await axios.post({});
};

type submitDetails = {
  type: string;
  data: {};
};
