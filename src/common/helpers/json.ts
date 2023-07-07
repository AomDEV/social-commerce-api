export function isClass(obj: any) {
	const isCtorClass = obj.constructor
		&& obj.constructor.toString().substring(0, 5) === 'class'
	if(obj.prototype === undefined) return isCtorClass
	const isPrototypeCtorClass = obj.prototype.constructor 
		&& obj.prototype.constructor.toString
		&& obj.prototype.constructor.toString().substring(0, 5) === 'class'
	return isCtorClass || isPrototypeCtorClass
}

export default function JSONParser(obj: any) {
	if (typeof obj !== 'object') return obj;

	for (const key in obj) {
		if (typeof obj[key] === 'bigint') {
			const strInt = obj[key].toString();
			obj[key] = isNaN(parseInt(strInt)) ? strInt : parseInt(strInt).toString();
		} else if (isClass(obj)) {
			obj[key] = undefined;
		} else if (typeof obj[key] === 'object') {
			obj[key] = JSONParser(obj[key]);
		}
	}

	return obj;
}

export function objectToBase64(data: any) {
	return Buffer.from(JSON.stringify(JSONParser(data))).toString("base64");
}
export function base64ToObject(hash: string) {
	try {
		return JSON.parse(Buffer.from(hash, "base64").toString("utf-8"));
	} catch {
		return {};
	}
}