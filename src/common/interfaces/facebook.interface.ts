import { FacebookWebhookEvent } from "@/common/types/facebook.type";
import { EActionPayload } from "@/common/types/payload.type";

export interface IFacebookPostback {
    payload: EActionPayload;
    handle(recipientId: string, event?: FacebookWebhookEvent, metadata?: any): Promise<any>;
}