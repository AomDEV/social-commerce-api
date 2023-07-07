import { IFacebookPostback } from "@/common/interfaces/facebook.interface";
import { Injectable } from "@nestjs/common";
import { FacebookWebhookEvent } from "@/common/types/facebook.type";
import { EActionPayload } from "@/common/types/payload.type"

@Injectable()
export default class NothingPostback implements IFacebookPostback {
    payload: EActionPayload = EActionPayload.NOTHING;

    constructor() {}

    async handle(recipientId: string, event: FacebookWebhookEvent): Promise<any> {
        return {};
    };
}