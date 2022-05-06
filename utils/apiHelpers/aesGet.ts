import { api } from "./api";
import { aesDecryption } from "../encryptionHelpers/aesDecryptRes";

const aesGet = async (route: string) => {
  const res = await api.get(route);
  console.log("Got Response From Server : ", res.data);
  const decryptedData = await aesDecryption(res.data);
  console.log("Decrypted Data :", decryptedData);
  return { data: decryptedData };
};

export default aesGet;
