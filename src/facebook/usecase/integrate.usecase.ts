import { FB } from "@/common/helpers/axios";
import { ForbiddenException, Injectable } from "@nestjs/common";
import { InstallDTO } from "../dto/install.dto";
import { PrismaService } from "@/common/service/prisma.service";
import { decryptAES, encryptAES } from "@/common/helpers/hash";

@Injectable()
export class IntegrateUsecase {
    constructor (
        private readonly prismaService: PrismaService
    ) {}

    async oauthCallback(code: string) {
        const basicToken = Buffer.from([process.env.FACEBOOK_APP_ID, process.env.FACEBOOK_APP_SECRET].join(':')).toString('base64');
        const accessTokenResponse = await FB({
            useVersion: false,
            headers: {
                Authorization: `Basic ${basicToken}`
            }
        }).post('/oauth/access_token', {
            grant_type: 'authorization_code',
            client_id: process.env.FACEBOOK_APP_ID,
            redirect_uri: process.env.FACEBOOK_OAUTH_RETURN_URI,
            code: code
        }).catch(e => e.response);
        if(accessTokenResponse.data.error) throw new ForbiddenException(accessTokenResponse.data.error.message);
        const { access_token } = accessTokenResponse.data;
        const userInfoResponse = await FB().get('/me', {
            params: { access_token }
        }).catch(e => e.response);
        if(userInfoResponse.data.error) throw new ForbiddenException(userInfoResponse.data.error.message);
        const { id } = userInfoResponse.data;
        const pagesResponse = await FB({
            useVersion: false
        }).get(`/${id}/accounts`, {
            params: { access_token }
        }).catch(e => e.response);
        const data: {
            access_token: string;
            id: string;
            name: string
        }[] = pagesResponse?.data?.data ?? [];
        // create page info in database
        const createdPagesWhere = {
            page_id: {
                in: data.map(x => x.id)
            }
        };
        let createdPages = await this.prismaService.pageToken.findMany({
            where: createdPagesWhere,
            select: {
                id: true
            }
        });
        const createdPageIds = createdPages.map(x => x.id.toString());
        const newPages = data.filter(x => !createdPageIds.includes(x.id));
        const created = await this.prismaService.pageToken.createMany({
            data: newPages.map(x => ({
                page_id: x.id,
                name: x.name,
                access_token: encryptAES(x.access_token, process.env.SECRET_KEY),
            }))
        });
        if(newPages.length !== created.count) throw new ForbiddenException("Cannot create page info");

        const afterCreatedPages = await this.prismaService.pageToken.findMany({
            where: createdPagesWhere,
            select: {
                name: true,
                page_id: true,
                access_token: true
            }
        });
        return {
            access_token: access_token,
            user_info: userInfoResponse.data,
            pages: afterCreatedPages.map(page => ({
                ...page,
                access_token: decryptAES(page.access_token, process.env.SECRET_KEY)
            }))
        };
    }

    async oauthExecutor() {
        const appId = process.env.FACEBOOK_APP_ID;
        const params = {
            response_type: 'code',
            client_id: appId,
            redirect_uri: process.env.FACEBOOK_OAUTH_RETURN_URI,
            scope: ['pages_show_list', 'pages_read_engagement', 'pages_manage_engagement', 'pages_messaging', 'pages_messaging_subscriptions'].join(',')
        };
        const queryString = new URLSearchParams(params);
        return {
            parameters: params,
            redirectUri: [process.env.FACEBOOK_OAUTH_URI, queryString].join("?"),
        };
    }

    async install(body: InstallDTO) {
        const getPageInfo = await this.prismaService.pageToken.findFirst({
            where: {
                page_id: body.page_id
            },
            select: {
                access_token: true,
                name: true,
            }
        });
        if (!getPageInfo) throw new ForbiddenException("Page not found");
        const accessToken = decryptAES(getPageInfo.access_token, process.env.SECRET_KEY);

        const params = { access_token: accessToken };
        const queryString = new URLSearchParams(params);
        const profileResponse = await FB().get(`/me`, { params }).catch(e => e.response);
        const pageId = profileResponse.data?.id ?? null;
        if(!pageId) throw new ForbiddenException("Invalid page access token");

        const installResponse = await FB().post(`/${body.page_id}/messenger_profile?${queryString}`, {
            get_started: body.get_started,
            greeting: body.greeting.map(x => ({
                locale: x.locale.replace('-', '_'),
                text: x.text
            })),
            ice_breakers: body.ice_breakers,
            persistent_menu: body.persistent_menu.map(x => ({
                locale: x.locale.replace('-', '_'),
                call_to_actions: x.call_to_actions,
            })),
        }).catch(e => e.response);

        const subscribeParams = {
            subscribed_fields: ['messages', 'messaging_postbacks'].join(","),
            access_token: accessToken,
        };
        const subscribeResponse = await FB({useVersion: false}).post(`/${pageId}/subscribed_apps?${new URLSearchParams(subscribeParams)}`);
        return {
            profile: profileResponse.data,
            install: installResponse.data,
            subscribe: subscribeResponse.data,
        };
    }
}