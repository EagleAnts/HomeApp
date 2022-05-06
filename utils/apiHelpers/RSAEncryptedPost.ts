import { api } from "./api";
import { publicKeyEncryption } from "../encryptionHelpers/RSAEncryption";

export async function RSAEncrpytedPost(data: {}, route: string) {
  const encryptedData = await publicKeyEncryption(data);
  const res = await api.post(route, { data: encryptedData });
  return res;
}
