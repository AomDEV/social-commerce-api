import { FB } from "@/common/helpers/axios";
import { IPlatform } from "@/common/interfaces/platform.interface";
import { EActionPayload } from "@/common/types/payload.type";
import { ForbiddenException, Injectable } from "@nestjs/common";
import { IFacebookPostback } from "@/common/interfaces/facebook.interface";
import { POSTBACKS } from "./postback";
import { ModuleRef } from "@nestjs/core";

@Injectable()
export class FacebookService implements IPlatform {
    private accessToken: string = process.env.FACEBOOK_PAGE_ACCESS_TOKEN;
    constructor(
        private readonly moduleRef: ModuleRef
    ) {}

    setAccessToken(accessToken: string) {
        this.accessToken = accessToken;
    }

    private getURL(path: string) {
        const params = {
            access_token: this.accessToken
        };
        const queryString = new URLSearchParams(params);
        return `${path}?${queryString}`;
    }

    private async reply(recipientId: string, params: {[key: string]: any}) {
        return FB().post(this.getURL('/me/messages'), {
            recipient: {
                id: recipientId
            },
            ...params,
        }).catch(e => e.response);
    }

    async getRecipientProfile(recipientId: string) {
        return FB().get(this.getURL(recipientId)).catch(e => e.response).then(r => r.data);
    }

    async typingOn(recipientId: string) {
        return this.reply(recipientId, {
            sender_action: "typing_on",
        });
    }

    async sendMessage(recipientId: string, message: string);
    async sendMessage(recipientId: string, message: object);
    async sendMessage(recipientId: string, message: any) {
        const isArray = Array.isArray(message);
        if(!isArray) message = [message];
        const responses = [];
        for (const msg of message) {
            const response = await this.reply(recipientId, {
                message: typeof msg === "string" ? { text: msg } : msg,
            });
            responses.push(response);
        }
        if(!isArray) return responses[0].data;
        return responses.map(r => r.data);
    }

    async notify<T>(recipient: string, payload: EActionPayload, metadata: T): Promise<T> {
        const postback = POSTBACKS[payload];
        if(!postback) throw new ForbiddenException(`Postback ${payload} not found`);
        const instance: IFacebookPostback = this.moduleRef.get(postback as any);
        return instance.handle(recipient, {}, metadata);
    }
}