import * as bcrypt from 'bcrypt';
import CryptoJS from 'crypto-js';

/**
* Encrypt a derived hd private key with a given pin and return it in Base64 form
* @param text The text to encrypt
* @param key The secret key
**/
export function encryptAES(text: string, key: string) {
    return CryptoJS.AES.encrypt(text, key).toString();
};

/**
* Decrypt an encrypted message
* @param encryptedBase64 encrypted data in base64 format
* @param key The secret key
* @return The decrypted content
**/
export function decryptAES(encryptedBase64: string, key: string) {
    const decrypted = CryptoJS.AES.decrypt(encryptedBase64, key);
    if (decrypted) {
		try {
			const str = decrypted.toString(CryptoJS.enc.Utf8);
			if (str.length > 0) return str;
			return null;
		} catch (e) {
			return null;
		}
    }
    return null;
};

export async function passwordHash(
	plainText: string,
	saltOrRounds = 10,
): Promise<string> {
	const password = plainText;
	const hash = await bcrypt.hash(password, saltOrRounds);
	return hash;
}

export function compareHash(plainText: string, hash: string): Promise<boolean> {
	return bcrypt.compare(plainText, hash);
}

export function createSignature(data: string, secret: string): string {
	const key = CryptoJS.enc.Utf8.parse(secret);
	const message = CryptoJS.enc.Utf8.parse(data);
	const hmac = CryptoJS.enc.Hex.stringify(CryptoJS.HmacSHA256(message, key));
	return hmac;
}
export function verifySignature(
	signature: string,
	data: string,
	secret: string,
): boolean {
	return createSignature(data, secret) === signature;
}