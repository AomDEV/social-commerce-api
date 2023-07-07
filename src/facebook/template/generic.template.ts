import { objectToBase64 } from "@/common/helpers/json";
import { EFacebookMenuItemType, FacebookAction, FacebookGenericElement } from "@/common/types/facebook.type"
import { EActionPayload } from "@/common/types/payload.type"
import { Product } from "@prisma/client";

export function getProductTemplate(sessionId: string, products: {id: bigint; product: Product}[]) {
    const buttons: (id: bigint, product: Product) => FacebookAction[] = (id: bigint, product: Product) => {
        const metadata = {
            sessionId,
            productId: id
        };;
        const templates = [
            {
                type: EFacebookMenuItemType.POSTBACK,
                payload: [EActionPayload.ADD_TO_CART, objectToBase64(metadata)].join("|"),
                title: `BUY ${product.price}฿`,
            }
        ];

        return templates;
    }
    const elements: FacebookGenericElement[] = products.map(product => ({
        title: product.product.title,
        image_url: product.product.image_uuid,
        subtitle: product.product.description,
        buttons: buttons(product.id, product.product)
    }));
    return {
        template_type: "generic",
        elements: elements,
    }
}