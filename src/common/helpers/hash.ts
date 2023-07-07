import * as bcrypt from 'bcrypt';
import CryptoJS from 'crypto-js';

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