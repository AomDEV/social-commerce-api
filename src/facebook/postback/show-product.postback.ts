import { IFacebookPostback } from "@/common/interfaces/facebook.interface";
import { Injectable } from "@nestjs/common";
import { FacebookWebhookEvent } from "@/common/types/facebook.type";
import { getProductTemplate } from "../template/generic.template";
import { PrismaService } from "@/common/service/prisma.service";
import { EPlatform } from "@prisma/client";
import { EActionPayload } from "@/common/types/payload.type"
import { getProductQuickReply } from "@/facebook/template/quick-replies.template";

@Injectable()
export default class ShowProductPostback implements IFacebookPostback {
    payload: EActionPayload = EActionPayload.SHOW_PRODUCT;

    constructor(
        private readonly prismaService: PrismaService
    ) {}

    async handle(recipientId: string, event: FacebookWebhookEvent): Promise<any> {
        const products = await this.prismaService.productPlatform.findMany({
            where: {
                platform: EPlatform.FACEBOOK as EPlatform
            },
            include: {
                product: true
            }
        });
        const payload = getProductTemplate(recipientId, products.filter(x => x.quantity > 0).map(x => ({
            product: x.product,
            id: x.id,
        })));
        return {
            attachment: {
                type: "template",
                payload
            },
            quick_replies: getProductQuickReply(),
        };
    };
}