import CrtypoES from "crypto-es";
import { getAesPassword } from "./generateAES";

export async function aesDecryption(data: {}) {
  const aesPassword = await getAesPassword();
  if (aesPassword) {
    return JSON.parse(
      CrtypoES.AES.decrypt(data, aesPassword).toString(CrtypoES.enc.Utf8)
    );
  }
}
