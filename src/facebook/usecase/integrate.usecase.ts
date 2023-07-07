import { FB } from "@/common/helpers/axios";
import { ForbiddenException, Injectable } from "@nestjs/common";
import { InstallDTO } from "../dto/install.dto";

@Injectable()
export class IntegrateUsecase {
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
        return {
            access_token: access_token,
            user_info: userInfoResponse.data,
            pages: pagesResponse.data
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
        const access_token = process.env.FACEBOOK_PAGE_ACCESS_TOKEN;
        const params = { access_token };
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
            access_token: access_token,
        };
        const subscribeResponse = await FB({useVersion: false}).post(`/${pageId}/subscribed_apps?${new URLSearchParams(subscribeParams)}`);
        return {
            profile: profileResponse.data,
            install: installResponse.data,
            subscribe: subscribeResponse.data,
        };
    }
}