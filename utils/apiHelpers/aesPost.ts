import { api } from "./api";
import { aesEncryption } from "../encryptionHelpers/aesEncryptReq";
import { aesDecryption } from "../encryptionHelpers/aesDecryptRes";

const encryptedPost = async (
  data: {},
  route: string,
  gotResponse: boolean = false
) => {
  const encryptedData = await aesEncryption(data);
  const res = await api.post(route, encryptedData);

  if (gotResponse) {
    const decryptedData = await aesDecryption(res.data);
    return decryptedData;
  }

  return res;
};
export default encryptedPost;
