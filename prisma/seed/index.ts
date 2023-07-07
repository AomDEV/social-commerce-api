import { prisma } from "./client";

// Seed JSON
import productJson from "./json/product.json";
import productPlatformJson from "./json/product_platform.json";
import { EPlatform } from "@prisma/client";

async function main() {
	const product = await prisma.product.createMany({ data: productJson });
	console.log(`Created ${product.count} product`);
	const productPlatform = await prisma.productPlatform.createMany({
		data: productPlatformJson.map((platform) => ({
			...platform,
			product_id: BigInt(platform.product_id),
			platform: platform.platform as EPlatform,
		}))
	});
	console.log(`Created ${productPlatform.count} product_platform`);
}
main().catch(e => {
	console.log(e);
	process.exit(1);
});