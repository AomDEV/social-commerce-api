import { IFacebookPostback } from "@/common/interfaces/facebook.interface";
import { Injectable } from "@nestjs/common";
import { FacebookWebhookEvent } from "@/common/types/facebook.type";
import { EActionPayload } from "@/common/types/payload.type"

@Injectable()
export default class WelcomePostback implements IFacebookPostback {
    payload: EActionPayload = EActionPayload.WELCOME;

    constructor() {}

    async handle(recipientId: string, event: FacebookWebhookEvent): Promise<any> {
        return {
            text: "👋 สวัสดีครับ ยินดีต้อนรับเข้าสู่ร้านขายของออนไลน์ต้นแบบ",
        };
    };
}