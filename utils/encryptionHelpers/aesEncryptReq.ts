import CrtypoES from "crypto-es";
import { getAesPassword } from "./generateAES";

export async function aesEncryption(data: {}) {
  const aesPassword = await getAesPassword();
  if (aesPassword)
    return CrtypoES.AES.encrypt(JSON.stringify(data), aesPassword).toString();
}
