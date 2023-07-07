import { Body, Controller, Get, Param, Post, Query } from "@nestjs/common";
import { ApiBody, ApiParam, ApiTags } from "@nestjs/swagger";
import { WebhookUsecase } from "./usecase/webhook.usecase";
import { IntegrateUsecase } from "./usecase/integrate.usecase";
import { InstallDTO } from "./dto/install.dto";

@Controller('facebook')
export class FacebookController {
    constructor (
        private readonly webhookUsecase: WebhookUsecase,
        private readonly integrateUsecase: IntegrateUsecase
    ) {}

    @Get()
    @ApiTags('Health-Check')
    index() {
        return { timestamp: new Date() };
    }

    @Get('webhook')
    @ApiTags('Webhook')
    getWebhook(
        @Query('hub.challenge') challenge: string,
        @Query('hub.verify_token') verifyToken: string,
    ) {
        return this.webhookUsecase.get({challenge, verifyToken});
    }

    @Post('webhook')
    @ApiTags('Webhook')
    @ApiBody({
        type: Object,
        description: "Webhook Parameters"
    })
    postWebhook(
        @Body() body,
    ) {
        return this.webhookUsecase.post(body);
    }

    @Get('oauth')
    @ApiTags('Integrate')
    oauthCallback(
        @Query('code') code: string,
    ) {
        return this.integrateUsecase.oauthCallback(code);
    }

    @Post('oauth')
    @ApiTags('Integrate')
    oauthExecutor() {
        return this.integrateUsecase.oauthExecutor();
    }

    @Post('install')
    @ApiTags('Integrate')
    install(
        @Body() body: InstallDTO
    ) {
        return this.integrateUsecase.install(body);
    }
}