import { IFacebookPostback } from "@/common/interfaces/facebook.interface";
import { Injectable } from "@nestjs/common";
import { FacebookWebhookEvent } from "@/common/types/facebook.type";
import { EActionPayload } from "@/common/types/payload.type";
import { CartUsecase } from "@/order/usecase/cart.usecase";
import { getCartQuickReply } from "../template/quick-replies.template";
import { CURRENCY_SHORT } from "@/common/constants/currency";

@Injectable()
export default class ViewCartPostback implements IFacebookPostback {
    payload: EActionPayload = EActionPayload.VIEW_CART;

    constructor(
        private readonly cartUsecase: CartUsecase,
    ) {}

    async handle(recipientId: string, event: FacebookWebhookEvent): Promise<any> {
        const cart = await this.cartUsecase.getCartInfo(recipientId);
        if(!cart) return { text: "❌ ไม่พบสินค้าในตะกร้า" };
        const text = [];
        text.push(`🛒 ตะกร้าสินค้าของคุณ`);
        text.push(cart.products.map(product => (`📌 ${product.product.title} x${product.quantity} ชิ้น`)).join("\n"));
        const total = cart.products.reduce((acc, product) => {
            return acc + (product.product.price.toNumber() - product.discount) * product.quantity;
        }, 0);
        text.push(`ยอดรวมทั้งสิ้น ${total.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})} ${CURRENCY_SHORT}`);
        return {
            text: text.join("\n"),
            quick_replies: getCartQuickReply()
        };
    };
}