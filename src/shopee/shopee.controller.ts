import { OAuthUsecase } from "@/shopee/usecase/oauth.usecase";
import { Controller, Get } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";

@Controller('shopee')
export class ShopeeController {
    constructor(
        private readonly oauthUsecase: OAuthUsecase
    ) {}

    @Get()
    @ApiTags('Health-Check')
    index() {
        return { timestamp: new Date() };
    }

    @Get('oauth')
    @ApiTags('Authentication')
    authentication() {
        return this.oauthUsecase.buildRedirectUrl();
    }
}