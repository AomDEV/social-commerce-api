import { IFacebookPostback } from "@/common/interfaces/facebook.interface";
import { Injectable } from "@nestjs/common";
import { FacebookWebhookEvent } from "@/common/types/facebook.type";
import { EActionPayload } from "@/common/types/payload.type"
import { CartUsecase } from "@/order/usecase/cart.usecase";
import { getConfirmQuickReply } from "@/facebook/template/quick-replies.template";

@Injectable()
export default class ConfirmOrderPostback implements IFacebookPostback {
    payload: EActionPayload = EActionPayload.CONFIRM_ORDER;

    constructor(
        private readonly cartUsecase: CartUsecase,
    ) {}

    async handle(recipientId: string, event: FacebookWebhookEvent): Promise<any> {
        const cart = await this.cartUsecase.getCartInfo(recipientId);
        if(!cart) return { text: "❌ ไม่พบสินค้าในตะกร้าของคุณ" };
        return {
            text: "🛒 ยืนยันการสั่งซื้อ",
            quick_replies: getConfirmQuickReply(
                EActionPayload.CREATE_ORDER,
                EActionPayload.NOTHING
            )
        };
    };
}