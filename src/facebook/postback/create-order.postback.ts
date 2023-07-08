import { IFacebookPostback } from "@/common/interfaces/facebook.interface";
import { Injectable } from "@nestjs/common";
import { FacebookService } from "@/facebook/facebook.service";
import { FacebookWebhookEvent } from "@/common/types/facebook.type";
import { EActionPayload } from "@/common/types/payload.type";
import { CartUsecase } from "@/order/usecase/cart.usecase";
import { getReceiptTemplate } from "../template/receipt.template";

@Injectable()
export default class CreateOrderPostback implements IFacebookPostback {
    payload: EActionPayload = EActionPayload.CREATE_ORDER;

    constructor(
        private readonly cartUsecase: CartUsecase,
        private readonly facebookService: FacebookService
    ) {}

    async handle(recipientId: string, event: FacebookWebhookEvent): Promise<any> {
        const cart = await this.cartUsecase.getCartInfo(recipientId);
        if(!cart) return { text: "❌ ไม่พบสินค้าในตะกร้าของคุณ" };
        const order = await this.cartUsecase.checkout({
            sessionId: recipientId,
            buyer: recipientId,
            fb_page_id: event?.recipient?.id ?? null,
        }).catch(e => {
            console.log(e);
            return null;
        });
        if(!order) return { text: "❌ ไม่สามารถสั่งซื้อสินค้าได้" };
        const recipient = await this.facebookService.getRecipientProfile(recipientId);
        return {
            attachment: {
                type: "template",
                payload: getReceiptTemplate(cart, {recipient, order})
            }
        }
    };
}