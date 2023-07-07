import { IFacebookPostback } from "@/common/interfaces/facebook.interface";
import { Injectable } from "@nestjs/common";
import { FacebookWebhookEvent } from "@/common/types/facebook.type";
import { EActionPayload } from "@/common/types/payload.type"

@Injectable()
export default class TestPostback implements IFacebookPostback {
    payload: EActionPayload = EActionPayload._TEST;

    constructor() {}

    async handle(recipientId: string, event: FacebookWebhookEvent): Promise<any> {
        return {};
    };
}