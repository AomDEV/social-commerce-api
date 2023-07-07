import { IFacebookPostback } from "@/common/interfaces/facebook.interface";
import { Injectable } from "@nestjs/common";
import { FacebookWebhookEvent } from "@/common/types/facebook.type";
import { EActionPayload } from "@/common/types/payload.type"
import { CartUsecase } from "@/order/usecase/cart.usecase";
import { clamp } from "@/common/helpers/number";
import { PrismaService } from "@/common/service/prisma.service";
import { getProductQuickReply } from "@/facebook/template/quick-replies.template";

@Injectable()
export default class AddToCartPostback implements IFacebookPostback {
    payload: EActionPayload = EActionPayload.ADD_TO_CART;

    constructor(
        private readonly prismaService: PrismaService,
        private readonly cartUsecase: CartUsecase,
    ) {}

    async handle(recipientId: string, event: FacebookWebhookEvent): Promise<any> {
        if(!event.metadata?.productId) return {
            text: "❌ ไม่พบสินค้าที่ต้องการ"
        }
        const normalize = clamp(event.metadata?.quantity ?? 1, 1, 100);
        await this.cartUsecase.addToCart(recipientId, event.metadata?.productId, normalize);
        const product = await this.prismaService.productPlatform.findUnique({
            where: {
                id: BigInt(event.metadata?.productId)
            },
            select: {
                product: true,
            },
        });
        return {
            text: `✅ เพิ่มสินค้า "${product.product.title}" จำนวน ${normalize} ชิ้นลงในตะกร้าแล้ว`,
            quick_replies: getProductQuickReply()
        };
    };
}