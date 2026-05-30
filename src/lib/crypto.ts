import CryptoJS from 'crypto-js';

export const encryptAES = (data: any): string => {
  const keyStr = process.env.NEXT_PUBLIC_SECRET_KEY;
  if (!keyStr) return "";

  const key = CryptoJS.enc.Utf8.parse(keyStr);
  const stringData = typeof data === 'object' ? JSON.stringify(data) : String(data);

  const encrypted = CryptoJS.AES.encrypt(stringData, key, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7
  });

  return encrypted.ciphertext.toString(CryptoJS.enc.Hex);
};

export const decryptAES = async (hexString: string): Promise<any> => {
  try {

    const keyStr = process.env.SECRET_KEY;
    const key = CryptoJS.enc.Utf8.parse(String(keyStr));
    if (!key || !hexString) return "";

    const ciphertext = CryptoJS.enc.Hex.parse(hexString);
    const bytes = CryptoJS.AES.decrypt(
      { ciphertext: ciphertext } as any, 
      key, 
      {
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7
      }
    );
    const originalText = bytes.toString(CryptoJS.enc.Utf8); 
    return originalText ? JSON.parse(originalText) : null;
  } catch (error) {
    console.error("Gagal Dekripsi:", error);
    return null;
  }
};