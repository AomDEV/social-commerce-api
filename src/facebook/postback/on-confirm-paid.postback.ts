import { IFacebookPostback } from "@/common/interfaces/facebook.interface";
import { ForbiddenException, Injectable } from "@nestjs/common";
import { FacebookService } from "../facebook.service";
import { FacebookWebhookEvent } from "@/common/types/facebook.type";
import { EActionPayload } from "@/common/types/payload.type";
import { getReceiptTemplate } from "@/facebook/template/receipt.template";
import { CartSession, OrderFullRelation } from "@/common/types/cart.type";
import { CartUsecase } from "@/order/usecase/cart.usecase";

@Injectable()
export default class OnOrderPaidPostback implements IFacebookPostback {
    payload: EActionPayload = EActionPayload.ON_ORDER_PAID;

    constructor(
        private readonly cartUsecase: CartUsecase,
        private readonly facebookService: FacebookService
    ) {}

    async handle(recipientId: string, event: FacebookWebhookEvent = {}, metadata?: OrderFullRelation): Promise<any> {
        const cart: CartSession = this.cartUsecase.orderToCart(metadata);
        if(!this.facebookService.hasAccessToken()) {
            const accessToken = await this.facebookService.loadAccessToken(metadata.fb_page_id);
            if(!accessToken) throw new ForbiddenException("Access token not found");
        };
        const recipient = await this.facebookService.getRecipientProfile(recipientId);
        const payload = getReceiptTemplate(cart, { recipient, order: metadata });
        const messages = await this.facebookService.sendMessage(metadata.buyer, [
            {
                text: `✅ คำสั่งซื้อ #${String(metadata.id).padStart(8, '0')} ได้รับการยืนยันแล้ว!`,
            },
            {
                attachment: {
                    type: "template",
                    payload,
                }
            }
        ]);
        return {metadata, messages};
    };
}