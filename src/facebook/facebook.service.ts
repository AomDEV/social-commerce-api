import { FB } from "@/common/helpers/axios";
import { IPlatform } from "@/common/interfaces/platform.interface";
import { EActionPayload } from "@/common/types/payload.type";
import { ForbiddenException, Injectable } from "@nestjs/common";
import { IFacebookPostback } from "@/common/interfaces/facebook.interface";
import { POSTBACKS } from "./postback";
import { ModuleRef } from "@nestjs/core";
import { PrismaService } from "@/common/service/prisma.service";
import { decryptAES } from "@/common/helpers/hash";

@Injectable()
export class FacebookService implements IPlatform {
    private accessToken: string = "";
    constructor(
        private readonly moduleRef: ModuleRef,
        private readonly prismaService: PrismaService
    ) {}

    hasAccessToken() {
        return this.accessToken.length > 0;
    }
    setAccessToken(accessToken: string) {
        this.accessToken = accessToken;
        return this.accessToken;
    }
    async loadAccessToken(pageId: string) {
        const getPageInfo = await this.prismaService.pageToken.findFirst({
            where: {
                page_id: pageId
            },
            select: {
                access_token: true,
            }
        });
        if (!getPageInfo) return null;
        const accessToken = decryptAES(getPageInfo.access_token, process.env.SECRET_KEY);
        return this.setAccessToken(accessToken);
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