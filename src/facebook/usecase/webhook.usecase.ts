import { BadRequestException, ForbiddenException, Injectable } from "@nestjs/common";
import { POSTBACKS } from "../postback";
import { IFacebookPostback } from "@/common/interfaces/facebook.interface";
import { ModuleRef } from "@nestjs/core";
import { FacebookService } from "../facebook.service";
import { base64ToObject } from "@/common/helpers/json";
import { PrismaService } from "@/common/service/prisma.service";
import { decryptAES } from "@/common/helpers/hash";

@Injectable()
export class WebhookUsecase {
    constructor(
        private readonly moduleRef: ModuleRef,
        private readonly facebookService: FacebookService,
        private readonly prismaService: PrismaService
    ) {}
    get(
        query: {
            verifyToken: string;
            challenge: string;
        }
    ) {
        if (process.env.FACEBOOK_WEBHOOK_TOKEN !== query.verifyToken) throw new ForbiddenException();
        return query.challenge;
    }

    async post(body: any) {
        for (const entry of body.entry) {
            for (const messaging of entry.messaging) {
                const { postback, message, sender, recipient } = messaging;
                const { quick_reply } = message ?? {};
                const { id: recipientId } = sender;
                const { id: pageId } = recipient;
                const accessToken = await this.facebookService.loadAccessToken(pageId);
                if (!accessToken) return { message: `Page ${pageId} not found`, pageId };
                if (postback || quick_reply?.payload) {
                    const { payload } = postback || quick_reply;
                    const hasMetadata = String(payload).includes("|");
                    const payloadExploded = String(payload).split("|");
                    const payloadHeader = payloadExploded.shift();
                    const instance: IFacebookPostback = hasMetadata ? POSTBACKS[payloadHeader] : POSTBACKS[payload];
                    if(!instance) throw new BadRequestException("Invalid payload");
                    const module: IFacebookPostback = this.moduleRef.get(instance as any);
                    if(hasMetadata) messaging.metadata = base64ToObject(payloadExploded.pop());
                    const reply = await module.handle(recipientId, messaging);
                    if(reply && typeof reply !== "undefined") {
                        if(typeof reply === "object" && Object.keys(reply).length <= 0) continue;
                        await this.facebookService.typingOn(recipientId);
                        const sent = await this.facebookService.sendMessage(recipientId, reply);
                        if(sent?.error) throw new ForbiddenException(sent.error?.message);
                        continue;
                    }
                    return { reply };
                }
                if (message) {
                    continue;
                    const { text, mid } = message;
                    // ** Fallback
                    await this.facebookService.typingOn(recipientId);
                    await this.facebookService.sendMessage(recipientId, `REPLIED: ${text ?? "Unknow"}`);
                }
            }
        }

        return {
            timestamp: new Date(),
            token: process.env.FACEBOOK_WEBHOOK_TOKEN,
            body: body
        }
    }
}