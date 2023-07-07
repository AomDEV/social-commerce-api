import { Module } from "@nestjs/common";
import { ShopeeController } from "./shopee.controller";
import { OAuthUsecase } from "./usecase/oauth.usecase";

@Module({
    imports: [],
    controllers: [ShopeeController],
    providers: [
        OAuthUsecase
    ],
})
export class ShopeeModule { }