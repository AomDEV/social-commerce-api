import { IFacebookPostback } from "@/common/interfaces/facebook.interface";
import { Injectable } from "@nestjs/common";
import { FacebookWebhookEvent } from "@/common/types/facebook.type";
import { EActionPayload } from "@/common/types/payload.type";
import { CartUsecase } from "@/order/usecase/cart.usecase";

@Injectable()
export default class CancelOrderPostback implements IFacebookPostback {
    payload: EActionPayload = EActionPayload.CANCEL_ORDER;

    constructor(
        private readonly cartUsecase: CartUsecase,
    ) {}

    async handle(recipientId: string, event: FacebookWebhookEvent): Promise<any> {
        return this.cartUsecase.cancelCart(recipientId).then(response => ({
            text: "🛒 ยกเลิกการสั่งซื้อเรียบร้อยแล้ว"
        })).catch(error => ({
            text: "❌ ไม่สามารถยกเลิกการสั่งซื้อได้"
        }));
    };
}